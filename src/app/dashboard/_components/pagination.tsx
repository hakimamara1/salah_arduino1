import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function buildHref(
  searchParams: Record<string, string | undefined>,
  page: number,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value) params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const qs = params.toString();
  return qs ? `/dashboard?${qs}` : "/dashboard";
}

export function Pagination({
  page,
  pageSize,
  total,
  searchParams,
}: {
  page: number;
  pageSize: number;
  total: number;
  searchParams: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) {
    return (
      <p className="text-sm text-muted-foreground">
        {total} order{total === 1 ? "" : "s"}
      </p>
    );
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const linkCls =
    "inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-white px-3 text-sm font-medium transition-colors hover:bg-muted";
  const disabledCls = "pointer-events-none opacity-40";

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-2">
        <Link
          href={buildHref(searchParams, page - 1)}
          className={cn(linkCls, page <= 1 && disabledCls)}
          aria-disabled={page <= 1}
        >
          <ChevronLeft className="size-4" /> Prev
        </Link>
        <span className="text-sm text-muted-foreground">
          {page} / {totalPages}
        </span>
        <Link
          href={buildHref(searchParams, page + 1)}
          className={cn(linkCls, page >= totalPages && disabledCls)}
          aria-disabled={page >= totalPages}
        >
          Next <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
