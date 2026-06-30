import "server-only";

import { createServiceClient } from "@/lib/supabase/server";
import type { Commune, DeliveryType, WilayaFee } from "@/lib/shipping";
import { shippingPriceFor } from "@/lib/shipping";

/**
 * All serviceable wilayas joined with their delivery fees, ordered by code.
 * Small (≤58 rows) — loaded into the checkout so price updates are instant.
 */
export async function getWilayasWithFees(): Promise<WilayaFee[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("wilayas")
    .select(
      "code, name_ar, is_active, shipping_fees(home_price, stopdesk_price, is_active)",
    )
    .eq("is_active", true)
    .order("code", { ascending: true });

  if (error) {
    console.error("[getWilayasWithFees] failed", error);
    return [];
  }

  return (data ?? [])
    .map((w) => {
      const fee = Array.isArray(w.shipping_fees)
        ? w.shipping_fees[0]
        : w.shipping_fees;
      return {
        code: w.code,
        name: `${w.code} - ${w.name_ar}`,
        homePrice: fee?.home_price ?? 0,
        stopdeskPrice: fee?.stopdesk_price ?? 0,
        isActive: (fee?.is_active ?? true) && w.is_active,
      } satisfies WilayaFee;
    })
    .filter((w) => w.isActive);
}

export type AdminFeeRow = {
  code: string;
  name: string;
  homePrice: number;
  stopdeskPrice: number;
  isActive: boolean;
};

/** Every wilaya + its fee row (incl. disabled) for the admin shipping page. */
export async function listAllFees(): Promise<AdminFeeRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("wilayas")
    .select("code, name_ar, shipping_fees(home_price, stopdesk_price, is_active)")
    .order("code", { ascending: true });

  if (error) {
    console.error("[listAllFees] failed", error);
    return [];
  }
  return (data ?? []).map((w) => {
    const fee = Array.isArray(w.shipping_fees) ? w.shipping_fees[0] : w.shipping_fees;
    return {
      code: w.code,
      name: `${w.code} - ${w.name_ar}`,
      homePrice: fee?.home_price ?? 0,
      stopdeskPrice: fee?.stopdesk_price ?? 0,
      isActive: fee?.is_active ?? false,
    };
  });
}

/** Communes of a wilaya (for the dependent dropdown). */
export async function getCommunes(wilayaCode: string): Promise<Commune[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("communes")
    .select("id, name_ar")
    .eq("wilaya_code", wilayaCode)
    .eq("is_active", true)
    .order("name_ar", { ascending: true });

  if (error) {
    console.error("[getCommunes] failed", error);
    return [];
  }
  return (data ?? []).map((c) => ({ id: c.id, name: c.name_ar }));
}

/**
 * Authoritative shipping price computed server-side from the DB — never trust
 * the client-sent amount. Returns null if the wilaya isn't serviceable.
 */
export async function resolveShippingPrice(
  wilayaCode: string,
  type: DeliveryType,
): Promise<number | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("shipping_fees")
    .select("home_price, stopdesk_price, is_active")
    .eq("wilaya_code", wilayaCode)
    .maybeSingle();

  if (error || !data || !data.is_active) return null;
  return shippingPriceFor(
    { homePrice: data.home_price, stopdeskPrice: data.stopdesk_price },
    type,
  );
}
