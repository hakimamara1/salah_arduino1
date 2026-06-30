import { Check, X } from "lucide-react";
import { STAKES, TURNAROUND } from "@/lib/content";

/**
 * Variant E problem→solution pair: what's at risk (stakes) immediately
 * followed by the turnaround the kit delivers.
 */
export function StakesTurnaround() {
  return (
    <>
      <section className="bg-destructive/5 py-12">
        <div className="container max-w-xl">
          <h2 className="text-center text-xl font-extrabold text-destructive sm:text-2xl">
            {STAKES.heading}
          </h2>
          <ul className="mt-6 space-y-3">
            {STAKES.points.map((p) => (
              <li
                key={p}
                className="flex items-center gap-3 text-base text-ink/80"
              >
                <X className="size-5 shrink-0 text-destructive" strokeWidth={3} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-brand-light py-12">
        <div className="container max-w-xl">
          <h2 className="text-center text-xl font-extrabold text-brand-dark sm:text-2xl">
            {TURNAROUND.heading}
          </h2>
          <ul className="mt-6 space-y-3">
            {TURNAROUND.points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-base text-ink">
                <Check className="size-5 shrink-0 text-brand" strokeWidth={3} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
