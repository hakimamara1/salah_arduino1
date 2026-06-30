/**
 * Shared Meta event definitions used by BOTH the browser pixel and the
 * server-side Conversions API, so a single event is reported consistently
 * from both channels (deduplicated by `eventId`).
 */
import { PRODUCT } from "@/lib/content";

export type MetaEventName =
  | "PageView"
  | "ViewContent"
  | "InitiateCheckout"
  | "Lead";

/** Standard content payload for this single-product store. */
export function productContentPayload() {
  return {
    content_ids: [PRODUCT.sku],
    content_name: PRODUCT.name,
    content_type: "product",
    value: PRODUCT.price,
    currency: PRODUCT.currency,
  };
}

/** Generate a unique id used to deduplicate pixel + CAPI for the same event. */
export function generateEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
