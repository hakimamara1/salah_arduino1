import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";
import { logout } from "@/app/dashboard/actions";
import { listHeroImages, type HeroImageRow } from "@/lib/queries/hero-images";
import { UploadForm } from "@/app/dashboard/hero/_components/upload-form";
import { HeroImageRowItem } from "@/app/dashboard/hero/_components/hero-image-row";
import { Button } from "@/components/ui/button";
import { PRODUCT, VARIANTS, VARIANT_IDS } from "@/lib/content";

export const dynamic = "force-dynamic";

const GROUPS: { key: string; label: string }[] = [
  { key: "ALL", label: "Default (all variants)" },
  ...VARIANT_IDS.map((id) => ({ key: id, label: `${id} · ${VARIANTS[id].name}` })),
];

export default async function HeroImagesPage() {
  const all = await listHeroImages();
  const byVariant = new Map<string, HeroImageRow[]>();
  for (const row of all) {
    const list = byVariant.get(row.variant) ?? [];
    list.push(row);
    byVariant.set(row.variant, list);
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-ink">{PRODUCT.brand}</h1>
            <p className="text-xs text-muted-foreground">Hero images</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">
                <ArrowRight className="size-4" /> Orders
              </Link>
            </Button>
            <form action={logout}>
              <Button variant="outline" size="sm" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-6">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-ink">Upload a hero image</h2>
          <p className="text-sm text-muted-foreground">
            Images show as a carousel in the hero. Pick a variant, or “Default”
            to use it for every variant that has no images of its own.
          </p>
          <UploadForm />
        </section>

        <section className="space-y-6">
          {GROUPS.map((group) => {
            const rows = byVariant.get(group.key) ?? [];
            return (
              <div key={group.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-ink">{group.label}</h3>
                  <span className="text-xs text-muted-foreground">
                    {rows.length} image{rows.length === 1 ? "" : "s"}
                  </span>
                </div>
                {rows.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-white px-4 py-6 text-sm text-muted-foreground">
                    <ImageIcon className="size-4" />
                    No images — uses the default set or the built-in placeholder.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {rows.map((row, i) => (
                      <HeroImageRowItem
                        key={row.id}
                        row={row}
                        isFirst={i === 0}
                        isLast={i === rows.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}
