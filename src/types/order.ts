import type { VariantId } from "@/lib/content";
import type { DeliveryType } from "@/lib/shipping";

/** Shape inserted into the Supabase `orders` table. */
export type OrderInsert = {
  full_name: string;
  phone: string;
  wilaya: string;
  wilaya_code: string;
  commune: string;
  address: string;
  delivery_type: DeliveryType;
  shipping_price: number;
  product_price: number;
  total: number;
  landing_variant: VariantId;
};

/** Row as returned from Supabase. */
export type OrderRow = OrderInsert & {
  id: string;
  created_at: string;
};

/** Fields the customer fills in (subset used for validation error keys). */
export type OrderFormField =
  | "full_name"
  | "phone"
  | "wilaya_code"
  | "commune"
  | "address"
  | "delivery_type";

/** Result returned by the `submitOrder` server action to the client form. */
export type OrderActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field-level validation errors, keyed by field name. */
  errors?: Partial<Record<OrderFormField, string>>;
  /** Set on success so the client can fire the Lead pixel event. */
  orderId?: string;
};
