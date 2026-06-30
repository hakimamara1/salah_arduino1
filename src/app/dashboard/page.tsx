import Link from "next/link";
import { Download, LogOut, ImageIcon, Truck } from "lucide-react";
import { logout } from "@/app/dashboard/actions";
import { getOrders, getOrderStats, DEFAULT_PAGE_SIZE } from "@/lib/queries/orders";
import { StatCards } from "@/app/dashboard/_components/stat-cards";
import { OrdersFilters } from "@/app/dashboard/_components/orders-filters";
import { OrdersTable } from "@/app/dashboard/_components/orders-table";
import { Pagination } from "@/app/dashboard/_components/pagination";
import { Button } from "@/components/ui/button";
import { PRODUCT } from "@/lib/content";

export const dynamic = "force-dynamic";

type SearchParams = {
  search?: string;
  wilaya?: string;
  variant?: string;
  page?: string;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const [stats, { rows, total }] = await Promise.all([
    getOrderStats(),
    getOrders({
      search: sp.search,
      wilaya: sp.wilaya,
      variant: sp.variant,
      page,
    }),
  ]);

  const exportParams = new URLSearchParams();
  if (sp.search) exportParams.set("search", sp.search);
  if (sp.wilaya) exportParams.set("wilaya", sp.wilaya);
  if (sp.variant) exportParams.set("variant", sp.variant);
  const exportHref = `/dashboard/export${
    exportParams.toString() ? `?${exportParams.toString()}` : ""
  }`;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-ink">{PRODUCT.brand}</h1>
            <p className="text-xs text-muted-foreground">Orders dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/hero">
                <ImageIcon className="size-4" /> Hero images
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/shipping">
                <Truck className="size-4" /> Shipping
              </Link>
            </Button>
            <form action={logout}>
              <Button variant="outline" size="sm" type="submit">
                <LogOut className="size-4" /> Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <StatCards stats={stats} />

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-bold text-ink">
              Orders{" "}
              <span className="font-normal text-muted-foreground">
                ({total})
              </span>
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link href={exportHref}>
                <Download className="size-4" /> Export CSV
              </Link>
            </Button>
          </div>

          <OrdersFilters />
          <OrdersTable rows={rows} />
          <Pagination
            page={page}
            pageSize={DEFAULT_PAGE_SIZE}
            total={total}
            searchParams={sp}
          />
        </div>
      </main>
    </>
  );
}
