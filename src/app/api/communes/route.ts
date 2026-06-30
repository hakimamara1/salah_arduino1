import { NextResponse, type NextRequest } from "next/server";
import { getCommunes } from "@/lib/queries/shipping";

export const runtime = "nodejs";

/**
 * GET /api/communes?wilaya=03 → { communes: [{ id, name }] }
 * Public, read-only; cached at the edge for an hour (commune lists rarely change).
 */
export async function GET(req: NextRequest) {
  const wilaya = req.nextUrl.searchParams.get("wilaya")?.trim() ?? "";
  if (!/^\d{2}$/.test(wilaya)) {
    return NextResponse.json({ communes: [] }, { status: 400 });
  }

  const communes = await getCommunes(wilaya);
  return NextResponse.json(
    { communes },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
