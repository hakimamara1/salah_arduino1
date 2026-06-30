/**
 * Dashboard auth — single shared password, no extra service.
 *
 * A session cookie holds an HMAC token derived from DASHBOARD_PASSWORD, so it
 * can't be forged without the password and rotating the password invalidates
 * old sessions. Uses Web Crypto only (no `node:crypto`) so the same helpers run
 * in Edge middleware and in Node server actions.
 */

export const DASH_COOKIE = "dash_auth";
const MESSAGE = "arduino-dashboard-v1";

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** HMAC-SHA256(message) keyed by the given password, hex-encoded. */
async function hmac(password: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toHex(sig);
}

/** The token for the configured password, or null if no password is set. */
export async function expectedToken(): Promise<string | null> {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return null;
  return hmac(password, MESSAGE);
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** True if the submitted password matches DASHBOARD_PASSWORD. */
export async function verifyPassword(submitted: string): Promise<string | null> {
  const expected = await expectedToken();
  if (!expected) return null;
  const candidate = await hmac(submitted, MESSAGE);
  return safeEqual(candidate, expected) ? expected : null;
}

/** True if the cookie value is a valid session token. */
export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const expected = await expectedToken();
  if (!expected) return false;
  return safeEqual(token, expected);
}
