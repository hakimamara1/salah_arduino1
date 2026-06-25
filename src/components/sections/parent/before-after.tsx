import { ArrowLeft } from "lucide-react";
import { BEFORE_AFTER } from "@/lib/content";

export function BeforeAfter() {
  const { before, after } = BEFORE_AFTER;
  return (
    <section className="container py-12">
      <h2 className="section-title">الفرق الذي ستلاحظه</h2>
      <div className="mx-auto mt-8 flex max-w-2xl items-stretch gap-3">
        <div className="flex-1 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-center">
          <span className="text-sm font-bold text-destructive">
            {before.label}
          </span>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {before.text}
          </p>
        </div>

        <div className="flex items-center">
          <span className="flex size-9 items-center justify-center rounded-full bg-brand text-white">
            <ArrowLeft className="size-5" />
          </span>
        </div>

        <div className="flex-1 rounded-2xl border-2 border-brand bg-brand-light p-5 text-center shadow-brand-soft">
          <span className="text-sm font-bold text-brand-dark">
            {after.label}
          </span>
          <p className="mt-3 text-base font-semibold leading-7 text-ink">
            {after.text}
          </p>
        </div>
      </div>
    </section>
  );
}
