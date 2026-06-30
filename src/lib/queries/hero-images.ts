import "server-only";

import { createServiceClient } from "@/lib/supabase/server";
import type { VariantId } from "@/lib/content";
import type { Database } from "@/types/database.types";

export type HeroImageRow = Database["public"]["Tables"]["hero_images"]["Row"];

export const HERO_BUCKET = "hero-images";

/** Public URL for a storage path in the hero-images bucket. */
export function heroPublicUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/${HERO_BUCKET}/${storagePath}`;
}

export type HeroSlide = { url: string; alt: string };

/**
 * Active hero slides for a variant, ordered. Falls back to the shared 'ALL'
 * set when the variant has none; returns [] when neither exists (the hero then
 * shows its static placeholder).
 */
export async function getHeroImages(variant: VariantId): Promise<HeroSlide[]> {
  const supabase = createServiceClient();

  const fetchFor = async (v: string): Promise<HeroImageRow[]> => {
    const { data, error } = await supabase
      .from("hero_images")
      .select("*")
      .eq("variant", v)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      console.error("[getHeroImages] failed", error);
      return [];
    }
    return data ?? [];
  };

  // Per-variant images first; fall back to the shared 'ALL' set.
  let rows = await fetchFor(variant);
  if (rows.length === 0) {
    rows = await fetchFor("ALL");
  }

  return rows.map((r) => ({ url: heroPublicUrl(r.storage_path), alt: r.alt }));
}

/** All hero images (active + hidden) for the dashboard, grouped by variant. */
export async function listHeroImages(): Promise<HeroImageRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("hero_images")
    .select("*")
    .order("variant", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[listHeroImages] failed", error);
    throw new Error(error.message);
  }
  return data ?? [];
}
