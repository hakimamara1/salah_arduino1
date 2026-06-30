"use client";

/**
 * Thin client-side wrapper around the Meta Pixel `fbq` global.
 * Safe to call before the script has loaded (calls are queued by fbq) and
 * no-ops gracefully if no pixel id is configured.
 */
import {
  generateEventId,
  productContentPayload,
  type MetaEventName,
} from "@/lib/meta/events";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

export function track(
  event: MetaEventName,
  data?: Record<string, unknown>,
  eventId?: string,
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  const id = eventId ?? generateEventId();
  window.fbq("track", event, data ?? {}, { eventID: id });
}

export const pixel = {
  /** Fired automatically on mount — see <MetaPixel />. */
  pageView: () => track("PageView"),

  /** User has meaningfully seen the product. */
  viewContent: () => track("ViewContent", productContentPayload()),

  /** User started the order form / clicked a buy CTA. */
  initiateCheckout: () => track("InitiateCheckout", productContentPayload()),

  /**
   * Order submitted. Pass the same `eventId` that the server used for the CAPI
   * call so Meta deduplicates the two reports.
   */
  lead: (eventId?: string) =>
    track("Lead", productContentPayload(), eventId),
};
