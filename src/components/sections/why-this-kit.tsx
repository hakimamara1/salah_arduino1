import { Check, X } from "lucide-react";
import { COMPARISON } from "@/lib/content";

export function WhyThisKit() {
  return (
    <section className="container py-12">
      <h2 className="section-title">لماذا هذه العدة؟</h2>

      <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
          <h3 className="mb-3 text-center font-bold text-destructive">
            {COMPARISON.others.title}
          </h3>
          <ul className="space-y-2.5">
            {COMPARISON.others.points.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <X className="size-4 shrink-0 text-destructive" strokeWidth={3} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-brand bg-brand-light p-5 shadow-brand-soft">
          <h3 className="mb-3 text-center font-bold text-brand-dark">
            {COMPARISON.ours.title}
          </h3>
          <ul className="space-y-2.5">
            {COMPARISON.ours.points.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-ink">
                <Check className="size-4 shrink-0 text-brand" strokeWidth={3} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
