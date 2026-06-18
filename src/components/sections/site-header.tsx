import { PRODUCT, type VariantContent } from "@/lib/content";

export function SiteHeader({ variant }: { variant: VariantContent }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="container flex h-14 items-center justify-between">
        <span className="text-lg font-extrabold text-brand">{PRODUCT.brand}</span>
        {variant.headerPill ? (
          <span className="rounded-full border border-brand px-3 py-1 text-xs font-bold text-brand">
            {variant.headerPill}
          </span>
        ) : (
          <span className="hidden text-sm font-bold text-muted-foreground sm:inline">
            💵 الدفع عند الاستلام
          </span>
        )}
      </div>
    </header>
  );
}
