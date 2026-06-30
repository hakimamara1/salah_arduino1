import Image from "next/image";
import { ArrowUp, ArrowDown, Trash2, Eye, EyeOff, Check } from "lucide-react";
import {
  deleteHeroImage,
  reorderHeroImage,
  toggleHeroImage,
  setHeroAlt,
} from "@/app/dashboard/hero/actions";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { heroPublicUrl, type HeroImageRow } from "@/lib/queries/hero-images";

const iconBtn =
  "inline-flex size-8 items-center justify-center rounded-lg border border-border bg-white text-ink transition-colors hover:bg-muted disabled:opacity-40";

export function HeroImageRowItem({
  row,
  isFirst,
  isLast,
}: {
  row: HeroImageRow;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border">
        <Image
          src={heroPublicUrl(row.storage_path)}
          alt={row.alt || "hero image"}
          fill
          sizes="64px"
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          {row.is_active ? (
            <Badge variant="brand">Active</Badge>
          ) : (
            <Badge variant="muted">Hidden</Badge>
          )}
        </div>
        <form action={setHeroAlt} className="flex items-center gap-2">
          <input type="hidden" name="id" value={row.id} />
          <Input
            name="alt"
            defaultValue={row.alt}
            placeholder="Alt text…"
            className="h-9"
          />
          <button type="submit" className={iconBtn} aria-label="Save alt text">
            <Check className="size-4" />
          </button>
        </form>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <form action={reorderHeroImage}>
          <input type="hidden" name="id" value={row.id} />
          <input type="hidden" name="dir" value="up" />
          <button type="submit" className={iconBtn} aria-label="Move up" disabled={isFirst}>
            <ArrowUp className="size-4" />
          </button>
        </form>
        <form action={reorderHeroImage}>
          <input type="hidden" name="id" value={row.id} />
          <input type="hidden" name="dir" value="down" />
          <button type="submit" className={iconBtn} aria-label="Move down" disabled={isLast}>
            <ArrowDown className="size-4" />
          </button>
        </form>
        <form action={toggleHeroImage}>
          <input type="hidden" name="id" value={row.id} />
          <input type="hidden" name="next" value={(!row.is_active).toString()} />
          <button
            type="submit"
            className={iconBtn}
            aria-label={row.is_active ? "Hide" : "Show"}
          >
            {row.is_active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </form>
        <form action={deleteHeroImage}>
          <input type="hidden" name="id" value={row.id} />
          <button
            type="submit"
            className={`${iconBtn} text-destructive hover:bg-destructive/10`}
            aria-label="Delete"
          >
            <Trash2 className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
