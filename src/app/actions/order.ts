"use server";

import { headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import { sendCapiEvent } from "@/lib/meta/capi";
import { normalizeVariant, PRODUCT } from "@/lib/content";
import { isDeliveryType } from "@/lib/shipping";
import { resolveShippingPrice } from "@/lib/queries/shipping";
import type { OrderActionState, OrderInsert } from "@/types/order";

/** Algerian mobile: 10 digits starting 05/06/07, optionally +213 / 00213. */
const PHONE_RE = /^(?:(?:\+|00)213|0)(?:5|6|7)\d{8}$/;

function clean(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function submitOrder(
  _prev: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  const full_name = clean(formData.get("full_name"));
  const phone = clean(formData.get("phone")).replace(/[\s-]/g, "");
  const wilaya = clean(formData.get("wilaya")); // human label, e.g. "03 - الأغواط"
  const wilaya_code = clean(formData.get("wilaya_code"));
  const commune = clean(formData.get("commune"));
  const address = ""; // Default empty string to satisfy database schema and TypeScript interfaces
  const deliveryRaw = clean(formData.get("delivery_type"));
  const landing_variant = normalizeVariant(clean(formData.get("landing_variant")));
  // Same id the client used for its pixel Lead event → CAPI dedup.
  const eventId = clean(formData.get("event_id")) || crypto.randomUUID();

  const errors: OrderActionState["errors"] = {};
  if (full_name.length < 3) errors.full_name = "أدخل الاسم الكامل.";
  if (!PHONE_RE.test(phone)) errors.phone = "أدخل رقم هاتف جزائري صحيح.";
  if (!/^\d{2}$/.test(wilaya_code)) errors.wilaya_code = "اختر الولاية.";
  if (!commune) errors.commune = "اختر البلدية.";
  if (!isDeliveryType(deliveryRaw)) errors.delivery_type = "اختر نوع التوصيل.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "يرجى تصحيح الحقول.", errors };
  }

  const delivery_type = deliveryRaw as OrderInsert["delivery_type"];

  // Authoritative shipping price from the DB — ignore any client-sent amount.
  const shipping_price = await resolveShippingPrice(wilaya_code, delivery_type);
  if (shipping_price === null) {
    return {
      status: "error",
      message: "هذه الولاية غير متوفّرة للتوصيل حالياً.",
      errors: { wilaya_code: "غير متوفّرة للتوصيل." },
    };
  }

  const product_price = PRODUCT.price;
  const total = product_price + shipping_price;

  const order: OrderInsert = {
    full_name,
    phone,
    wilaya,
    wilaya_code,
    commune,
    address,
    delivery_type,
    shipping_price,
    product_price,
    total,
    landing_variant,
  };

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("orders")
      .insert(order)
      .select("id")
      .single();

    if (error) {
      console.error("[submitOrder] supabase insert failed", error);
      return {
        status: "error",
        message: "تعذّر إرسال الطلب. حاول مرة أخرى أو تواصل عبر واتساب.",
      };
    }

    // Fire the server-side Lead (CAPI). Non-blocking: tracking never breaks the order.
    const hdrs = await headers();
    await sendCapiEvent({
      event: "Lead",
      eventId,
      eventSourceUrl: hdrs.get("referer") ?? undefined,
      userData: {
        fullName: full_name,
        phone,
        clientUserAgent: hdrs.get("user-agent") ?? undefined,
        clientIpAddress:
          hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
      },
      customData: { landing_variant, value: total, currency: PRODUCT.currency },
    });

    return {
      status: "success",
      message: "تم استلام طلبك! سنتصل بك قريباً لتأكيد التوصيل.",
      orderId: data.id,
    };
  } catch (err) {
    console.error("[submitOrder] unexpected error", err);
    return { status: "error", message: "حدث خطأ غير متوقّع. حاول مرة أخرى." };
  }
}
