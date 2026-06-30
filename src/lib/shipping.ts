/**
 * Shipping domain logic shared by the client checkout and the server action.
 * Two delivery types (Domicile / Stop Desk), price per wilaya, COD.
 */

export type DeliveryType = "home" | "stopdesk";

export const DELIVERY_TYPES: DeliveryType[] = ["home", "stopdesk"];

export const DELIVERY_LABELS: Record<
  DeliveryType,
  { ar: string; hint: string }
> = {
  home: { ar: "التوصيل إلى المنزل", hint: "Domicile" },
  stopdesk: { ar: "التوصيل إلى المكتب", hint: "Stop Desk" },
};

/** A wilaya plus its two delivery prices (joined wilayas + shipping_fees). */
export type WilayaFee = {
  code: string;
  name: string;
  homePrice: number;
  stopdeskPrice: number;
  isActive: boolean;
};

export type Commune = { id: number; name: string };

export function isDeliveryType(v: unknown): v is DeliveryType {
  return v === "home" || v === "stopdesk";
}

/** Shipping price for a wilaya + delivery type, or null if not resolvable. */
export function shippingPriceFor(
  fee: Pick<WilayaFee, "homePrice" | "stopdeskPrice"> | undefined | null,
  type: DeliveryType,
): number | null {
  if (!fee) return null;
  return type === "home" ? fee.homePrice : fee.stopdeskPrice;
}
