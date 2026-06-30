import { Star } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { FUTURE_PATH } from "@/lib/content";

const arabicNumerals = ["١", "٢", "٣", "٤", "٥"];

/**
 * Variant E aspirational timeline: from a child's first LED to an engineer's
 * mindset, with a starred finale.
 */
export function FuturePath() {
  return (
    <section className="container max-w-xl py-12">
      <h2 className="section-title">{FUTURE_PATH.heading}</h2>

      <ol className="relative mt-8 space-y-5 border-s-2 border-brand/30 ps-6">
        {FUTURE_PATH.steps.map((step, i) => (
          <Reveal as="li" key={step} delay={i * 70} className="relative">
            <span className="absolute -start-[2.1rem] flex size-7 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
              {arabicNumerals[i]}
            </span>
            <span className="text-base font-bold text-ink">{step}</span>
          </Reveal>
        ))}

        <Reveal as="li" delay={FUTURE_PATH.steps.length * 70} className="relative">
          <span className="absolute -start-[2.1rem] flex size-7 items-center justify-center rounded-full bg-ink text-white">
            <Star className="size-4 fill-current" />
          </span>
          <span className="text-base font-extrabold text-brand">
            {FUTURE_PATH.finale}
          </span>
        </Reveal>
      </ol>
    </section>
  );
}
