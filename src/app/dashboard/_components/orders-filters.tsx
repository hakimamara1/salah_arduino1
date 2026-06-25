"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { WILAYAS } from "@/lib/wilayas";
import { VARIANTS, VARIANT_IDS } from "@/lib/content";

const ALL = "__all__";

export function OrdersFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [search, setSearch] = React.useState(params.get("search") ?? "");

  const update = React.useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      // Any filter change resets pagination.
      next.delete("page");
      router.replace(`${pathname}?${next.toString()}`);
    },
    [params, pathname, router],
  );

  // Debounce the free-text search.
  React.useEffect(() => {
    const current = params.get("search") ?? "";
    if (search === current) return;
    const t = setTimeout(() => update({ search: search || null }), 350);
    return () => clearTimeout(t);
  }, [search, params, update]);

  const wilaya = params.get("wilaya") ?? ALL;
  const variant = params.get("variant") ?? ALL;
  const hasFilters = Boolean(
    params.get("search") || params.get("wilaya") || params.get("variant"),
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or phone…"
          className="pl-9"
        />
      </div>

      <Select
        value={wilaya}
        onValueChange={(v) => update({ wilaya: v === ALL ? null : v })}
      >
        <SelectTrigger className="sm:w-52">
          <SelectValue placeholder="Wilaya" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All wilayas</SelectItem>
          {WILAYAS.map((w) => (
            <SelectItem key={w} value={w}>
              {w}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={variant}
        onValueChange={(v) => update({ variant: v === ALL ? null : v })}
      >
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Variant" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All variants</SelectItem>
          {VARIANT_IDS.map((id) => (
            <SelectItem key={id} value={id}>
              {id} · {VARIANTS[id].name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch("");
            router.replace(pathname);
          }}
        >
          <X className="size-4" /> Clear
        </Button>
      )}
    </div>
  );
}
