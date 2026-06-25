"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DASH_COOKIE, verifyPassword } from "@/lib/auth/dashboard";

export type LoginState = { error?: string };

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!process.env.DASHBOARD_PASSWORD) {
    return { error: "DASHBOARD_PASSWORD is not set on the server." };
  }

  const token = await verifyPassword(password);
  if (!token) {
    return { error: "Incorrect password." };
  }

  const store = await cookies();
  store.set(DASH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/dashboard",
    maxAge: MAX_AGE,
  });

  redirect("/dashboard");
}

export async function logout() {
  const store = await cookies();
  store.delete({ name: DASH_COOKIE, path: "/dashboard" });
  redirect("/dashboard/login");
}
