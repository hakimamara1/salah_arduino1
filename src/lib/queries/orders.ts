import "server-only";

import { createServiceClient } from "@/lib/supabase/server";
import { PRODUCT, VARIANT_IDS, type VariantId } from "@/lib/content";
import type { OrderRow } from "@/types/order";

export type OrderFilters = {
  search?: string;
  wilaya?: string;
  variant?: string;
  page?: number;
  pageSize?: number;
};

export const DEFAULT_PAGE_SIZE = 25;

/** Escape PostgREST `or` filter special chars in user search input. */
function sanitize(term: string): string {
  return term.replace(/[%,()]/g, " ").trim();
}

/**
 * Paginated, filtered order list (most recent first). Returns rows + total
 * matching count. When `pageSize` is 0, returns ALL matching rows (used by CSV
 * export).
 */
export async function getOrders(filters: OrderFilters = {}): Promise<{
  rows: OrderRow[];
  total: number;
}> {
  const supabase = createServiceClient();
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const page = Math.max(1, filters.page ?? 1);

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.wilaya) query = query.eq("wilaya", filters.wilaya);
  if (filters.variant) query = query.eq("landing_variant", filters.variant);
  if (filters.search) {
    const term = sanitize(filters.search);
    if (term) {
      query = query.or(`full_name.ilike.%${term}%,phone.ilike.%${term}%`);
    }
  }

  if (pageSize > 0) {
    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);
  }

  const { data, error, count } = await query;
  if (error) {
    console.error("[getOrders] failed", error);
    throw new Error(error.message);
  }

  return { rows: (data ?? []) as OrderRow[], total: count ?? 0 };
}

export type OrderStats = {
  total: number;
  today: number;
  week: number;
  estRevenue: number;
  byVariant: Record<VariantId, number>;
};

function startOfTodayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function sevenDaysAgoISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString();
}

/** Summary metrics for the dashboard stat cards. */
export async function getOrderStats(): Promise<OrderStats> {
  const supabase = createServiceClient();

  const [totalRes, todayRes, weekRes, variantRes] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfTodayISO()),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgoISO()),
    supabase.from("orders").select("landing_variant"),
  ]);

  const byVariant = Object.fromEntries(
    VARIANT_IDS.map((id) => [id, 0]),
  ) as Record<VariantId, number>;

  for (const row of variantRes.data ?? []) {
    const v = row.landing_variant as VariantId;
    if (v in byVariant) byVariant[v] += 1;
  }

  const total = totalRes.count ?? 0;

  return {
    total,
    today: todayRes.count ?? 0,
    week: weekRes.count ?? 0,
    estRevenue: total * PRODUCT.price,
    byVariant,
  };
}
