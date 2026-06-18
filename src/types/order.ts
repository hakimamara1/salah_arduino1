import type { VariantId } from "@/lib/content";

/** Shape inserted into the Supabase `orders` table. */
export type OrderInsert = {
  full_name: string;
  phone: string;
  wilaya: string;
  address: string;
  landing_variant: VariantId;
};

/** Row as returned from Supabase. */
export type OrderRow = OrderInsert & {
  id: string;
  created_at: string;
};

/** Result returned by the `submitOrder` server action to the client form. */
export type OrderActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field-level validation errors, keyed by field name. */
  errors?: Partial<Record<keyof OrderInsert, string>>;
  /** Set on success so the client can fire the Lead pixel event. */
  orderId?: string;
};
