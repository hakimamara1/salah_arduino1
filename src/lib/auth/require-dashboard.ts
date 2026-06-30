import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DASH_COOKIE, verifyToken } from "@/lib/auth/dashboard";

/**
 * Guards a Server Action / Route Handler. Middleware already protects
 * /dashboard navigations, but actions re-verify defensively. Redirects to the
 * login page if the session cookie is missing or invalid.
 */
export async function requireDashboardAuth(): Promise<void> {
  const store = await cookies();
  const ok = await verifyToken(store.get(DASH_COOKIE)?.value);
  if (!ok) redirect("/dashboard/login");
}
