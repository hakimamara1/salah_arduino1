import { NextResponse, type NextRequest } from "next/server";
import { sendCapiEvent } from "@/lib/meta/capi";
import type { MetaEventName } from "@/lib/meta/events";

export const runtime = "nodejs";

const ALLOWED: MetaEventName[] = [
  "PageView",
  "ViewContent",
  "InitiateCheckout",
  "Lead",
];

/**
 * Optional server-side mirror for browser events. The client can POST
 * { event, eventId } here to also report via the Conversions API (deduped by
 * eventId). Lead is normally sent inside the order Server Action instead.
 */
export async function POST(req: NextRequest) {
  let body: { event?: string; eventId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const event = body.event as MetaEventName | undefined;
  if (!event || !ALLOWED.includes(event)) {
    return NextResponse.json({ ok: false, error: "invalid event" }, { status: 400 });
  }

  const ok = await sendCapiEvent({
    event,
    eventId: body.eventId ?? crypto.randomUUID(),
    eventSourceUrl: req.headers.get("referer") ?? undefined,
    userData: {
      clientUserAgent: req.headers.get("user-agent") ?? undefined,
      clientIpAddress:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
    },
  });

  return NextResponse.json({ ok });
}
