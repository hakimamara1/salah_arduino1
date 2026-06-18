import { Star } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { TESTIMONIALS } from "@/lib/content";

export function Testimonials() {
  return (
    <section className="bg-secondary py-12">
      <div className="container">
        <h2 className="section-title">آراء العملاء</h2>
        <div className="mt-2 flex items-center justify-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-5 fill-current" />
          ))}
          <span className="ms-2 text-sm font-bold text-muted-foreground">
            ٤٫٩ / ٥ من مئات العملاء
          </span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 70}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-sm leading-7 text-ink">
                  «{t.quote}»
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex size-9 items-center justify-center rounded-full bg-brand-light font-bold text-brand"
                  >
                    {t.name.charAt(0)}
                  </span>
                  <span className="text-sm">
                    <span className="font-bold text-ink">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {t.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
