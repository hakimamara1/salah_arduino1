import { type NextRequest } from "next/server";
import { getOrders } from "@/lib/queries/orders";
import type { OrderRow } from "@/types/order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** RFC-4180 CSV cell escaping. */
function cell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

const HEADERS = [
  "id",
  "full_name",
  "phone",
  "wilaya",
  "address",
  "landing_variant",
  "created_at",
] as const;

/**
 * Streams the filtered orders as a CSV download. Protected by middleware
 * (same /dashboard guard). Mirrors the table's current filters.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const { rows } = await getOrders({
    search: sp.get("search") ?? undefined,
    wilaya: sp.get("wilaya") ?? undefined,
    variant: sp.get("variant") ?? undefined,
    pageSize: 0, // all matching rows
  });

  const lines = [
    HEADERS.join(","),
    ...rows.map((o: OrderRow) =>
      HEADERS.map((h) => cell(String(o[h] ?? ""))).join(","),
    ),
  ];
  // BOM so Excel reads Arabic (UTF-8) correctly.
  const csv = "﻿" + lines.join("\r\n");

  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
