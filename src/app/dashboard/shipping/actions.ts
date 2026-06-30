"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { requireDashboardAuth } from "@/lib/auth/require-dashboard";

/** Update one wilaya's delivery prices + serviceable flag. */
export async function updateFee(formData: FormData): Promise<void> {
  await requireDashboardAuth();

  const wilaya_code = String(formData.get("wilaya_code") ?? "");
  if (!/^\d{2}$/.test(wilaya_code)) return;

  const home = Math.max(0, Math.round(Number(formData.get("home_price")) || 0));
  const stop = Math.max(0, Math.round(Number(formData.get("stopdesk_price")) || 0));
  const is_active = String(formData.get("is_active") ?? "") === "on";

  const supabase = createServiceClient();
  await supabase.from("shipping_fees").upsert(
    {
      wilaya_code,
      home_price: home,
      stopdesk_price: stop,
      is_active,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "wilaya_code" },
  );

  revalidatePath("/dashboard/shipping");
  revalidatePath("/");
}
