import "server-only";

import { createHash } from "node:crypto";
import { productContentPayload, type MetaEventName } from "@/lib/meta/events";

/**
 * Meta Conversions API (server-side) — architecture-ready.
 *
 * Server events complement the browser pixel and survive ad-blockers / iOS
 * tracking limits. Each server event carries the SAME `eventId` as its pixel
 * counterpart so Meta deduplicates them.
 *
 * Wiring: set META_CAPI_ACCESS_TOKEN (+ NEXT_PUBLIC_META_PIXEL_ID). If the
 * token is absent, this no-ops so local/dev never crashes.
 */

const GRAPH_VERSION = "v21.0";

type UserData = {
  /** Raw (un-hashed) phone — will be normalized + SHA-256 hashed here. */
  phone?: string;
  /** Raw full name — split + hashed. */
  fullName?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  /** _fbp / _fbc cookies from the browser, when available. */
  fbp?: string;
  fbc?: string;
};

type SendEventArgs = {
  event: MetaEventName;
  eventId: string;
  eventSourceUrl?: string;
  userData?: UserData;
  customData?: Record<string, unknown>;
};

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function buildUserData(u: UserData = {}): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  if (u.phone) {
    // E.164-ish: strip non-digits before hashing.
    data.ph = [sha256(u.phone.replace(/\D/g, ""))];
  }
  if (u.fullName) {
    const parts = u.fullName.trim().split(/\s+/);
    if (parts[0]) data.fn = [sha256(parts[0])];
    if (parts.length > 1) data.ln = [sha256(parts[parts.length - 1]!)];
  }
  if (u.clientIpAddress) data.client_ip_address = u.clientIpAddress;
  if (u.clientUserAgent) data.client_user_agent = u.clientUserAgent;
  if (u.fbp) data.fbp = u.fbp;
  if (u.fbc) data.fbc = u.fbc;
  return data;
}

/**
 * Send a single server event to Meta. Returns true if accepted, false if
 * skipped (not configured) or failed — never throws, so callers (order flow)
 * are never blocked by tracking.
 */
export async function sendCapiEvent({
  event,
  eventId,
  eventSourceUrl,
  userData,
  customData,
}: SendEventArgs): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    // Not configured — architecture is in place, just inert.
    return false;
  }

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: event,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        ...(eventSourceUrl ? { event_source_url: eventSourceUrl } : {}),
        user_data: buildUserData(userData),
        custom_data: { ...productContentPayload(), ...customData },
      },
    ],
  };

  const testCode = process.env.META_CAPI_TEST_EVENT_CODE;
  if (testCode) payload.test_event_code = testCode;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      console.error("[Meta CAPI] non-OK response", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Meta CAPI] request failed", err);
    return false;
  }
}
