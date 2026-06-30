"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { requireDashboardAuth } from "@/lib/auth/require-dashboard";
import { HERO_BUCKET } from "@/lib/queries/hero-images";
import { normalizeVariant, VARIANT_IDS } from "@/lib/content";

export type HeroActionState = { error?: string; success?: string };

const MAX_BYTES = 5 * 1024 * 1024;
const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function refresh() {
  revalidatePath("/dashboard/hero");
  revalidatePath("/");
}

/** Accept 'ALL' or a real variant id. */
function cleanVariant(value: FormDataEntryValue | null): string {
  const v = String(value ?? "ALL");
  if (v === "ALL") return "ALL";
  return (VARIANT_IDS as readonly string[]).includes(v)
    ? normalizeVariant(v)
    : "ALL";
}

export async function uploadHeroImage(
  _prev: HeroActionState,
  formData: FormData,
): Promise<HeroActionState> {
  await requireDashboardAuth();

  const variant = cleanVariant(formData.get("variant"));
  const alt = String(formData.get("alt") ?? "").trim();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "اختر ملف صورة." };
  }
  if (!(file.type in MIME_EXT)) {
    return { error: "صيغة غير مدعومة. استخدم JPG أو PNG أو WebP أو AVIF." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "حجم الصورة يتجاوز ٥ ميغابايت." };
  }

  const supabase = createServiceClient();
  const ext = MIME_EXT[file.type];
  const path = `${variant}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(HERO_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) {
    console.error("[uploadHeroImage] storage", uploadError);
    return { error: "تعذّر رفع الصورة. حاول مرة أخرى." };
  }

  // Next sort_order = current max for this variant + 1.
  const { data: last } = await supabase
    .from("hero_images")
    .select("sort_order")
    .eq("variant", variant)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (last?.sort_order ?? -1) + 1;

  const { error: insertError } = await supabase
    .from("hero_images")
    .insert({ variant, storage_path: path, alt, sort_order });
  if (insertError) {
    console.error("[uploadHeroImage] insert", insertError);
    // Roll back the orphaned file.
    await supabase.storage.from(HERO_BUCKET).remove([path]);
    return { error: "تعذّر حفظ الصورة." };
  }

  refresh();
  return { success: "تم رفع الصورة." };
}

export async function deleteHeroImage(formData: FormData): Promise<void> {
  await requireDashboardAuth();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("hero_images")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("hero_images").delete().eq("id", id);
  if (data?.storage_path) {
    await supabase.storage.from(HERO_BUCKET).remove([data.storage_path]);
  }
  refresh();
}

export async function toggleHeroImage(formData: FormData): Promise<void> {
  await requireDashboardAuth();
  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("next") ?? "") === "true";
  if (!id) return;

  const supabase = createServiceClient();
  await supabase.from("hero_images").update({ is_active: next }).eq("id", id);
  refresh();
}

export async function setHeroAlt(formData: FormData): Promise<void> {
  await requireDashboardAuth();
  const id = String(formData.get("id") ?? "");
  const alt = String(formData.get("alt") ?? "").trim();
  if (!id) return;

  const supabase = createServiceClient();
  await supabase.from("hero_images").update({ alt }).eq("id", id);
  refresh();
}

/** Swap sort_order with the adjacent image in the same variant. */
export async function reorderHeroImage(formData: FormData): Promise<void> {
  await requireDashboardAuth();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "");
  if (!id || (dir !== "up" && dir !== "down")) return;

  const supabase = createServiceClient();
  const { data: current } = await supabase
    .from("hero_images")
    .select("id, variant, sort_order")
    .eq("id", id)
    .maybeSingle();
  if (!current) return;

  // "up" = move earlier (towards smaller sort_order): find nearest below.
  const base = supabase
    .from("hero_images")
    .select("id, sort_order")
    .eq("variant", current.variant);
  const query =
    dir === "up"
      ? base.lt("sort_order", current.sort_order).order("sort_order", {
          ascending: false,
        })
      : base.gt("sort_order", current.sort_order).order("sort_order", {
          ascending: true,
        });
  const { data: neighbor } = await query.limit(1).maybeSingle();
  if (!neighbor) return;

  await supabase
    .from("hero_images")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", current.id);
  await supabase
    .from("hero_images")
    .update({ sort_order: current.sort_order })
    .eq("id", neighbor.id);
  refresh();
}
