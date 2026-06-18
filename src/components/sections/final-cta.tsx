import { BuyButton } from "@/components/buy-button";
import { cn } from "@/lib/utils";
import type { VariantContent } from "@/lib/content";

export function FinalCta({ variant }: { variant: VariantContent }) {
  const { finalCta } = variant;
  const dark = finalCta.dark;
  return (
    <section
      className={cn(
        "px-4 py-14 text-center",
        dark ? "bg-ink text-white" : "bg-brand text-white",
      )}
    >
      <div className="container max-w-xl">
        <h2 className="text-2xl font-extrabold sm:text-3xl">{finalCta.title}</h2>
        <p className={cn("mt-3 text-base", dark ? "text-white/70" : "text-white/90")}>
          {finalCta.subtitle}
        </p>
        <BuyButton variant="light" size="lg" className="mt-6">
          {finalCta.cta}
        </BuyButton>
      </div>
    </section>
  );
}
