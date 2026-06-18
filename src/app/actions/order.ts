"use server";

import { headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import { sendCapiEvent } from "@/lib/meta/capi";
import { normalizeVariant } from "@/lib/content";
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
  const phoneRaw = clean(formData.get("phone"));
  const phone = phoneRaw.replace(/[\s-]/g, "");
  const wilaya = clean(formData.get("wilaya"));
  const address = clean(formData.get("address"));
  const landing_variant = normalizeVariant(clean(formData.get("landing_variant")));
  // Same id the client used for its pixel Lead event → CAPI dedup.
  const eventId = clean(formData.get("event_id")) || crypto.randomUUID();

  const errors: OrderActionState["errors"] = {};
  if (full_name.length < 3) errors.full_name = "أدخل الاسم الكامل.";
  if (!PHONE_RE.test(phone)) errors.phone = "أدخل رقم هاتف جزائري صحيح.";
  if (!wilaya) errors.wilaya = "اختر الولاية.";
  if (address.length < 5) errors.address = "أدخل عنواناً واضحاً.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "يرجى تصحيح الحقول.", errors };
  }

  const order: OrderInsert = { full_name, phone, wilaya, address, landing_variant };

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

    // Fire the server-side Lead (CAPI) with the shared eventId. Non-blocking
    // failure: tracking must never break the order.
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
      customData: { landing_variant },
    });

    return {
      status: "success",
      message: "تم استلام طلبك! سنتصل بك قريباً لتأكيد التوصيل.",
      orderId: data.id,
    };
  } catch (err) {
    console.error("[submitOrder] unexpected error", err);
    return {
      status: "error",
      message: "حدث خطأ غير متوقّع. حاول مرة أخرى.",
    };
  }
}
