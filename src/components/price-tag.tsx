import { PRODUCT } from "@/lib/content";
import { formatDZD } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PriceTag({
  className,
  size = "default",
  center = false,
}: {
  className?: string;
  size?: "default" | "lg";
  center?: boolean;
}) {
  const discount = Math.round(
    (1 - PRODUCT.price / PRODUCT.compareAtPrice) * 100,
  );
  return (
    <div
      className={cn(
        "flex items-baseline gap-3",
        center ? "justify-center" : "justify-end",
        className,
      )}
    >
      <span className="text-sm text-muted-foreground line-through">
        {formatDZD(PRODUCT.compareAtPrice)}
      </span>
      <span
        className={cn(
          "font-extrabold text-ink",
          size === "lg" ? "text-4xl sm:text-5xl" : "text-3xl",
        )}
      >
        {new Intl.NumberFormat("en-US").format(PRODUCT.price)}
        <span className="ms-1 text-base font-bold">دج</span>
      </span>
      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">
        −{discount}%
      </span>
    </div>
  );
}
