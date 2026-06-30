import { Star, Quote } from "lucide-react";
import { PARENT_TESTIMONIAL } from "@/lib/content";

type TestimonialData = { quote: string; name: string; location: string };

export function ParentTestimonial({
  data = PARENT_TESTIMONIAL,
}: {
  data?: TestimonialData;
} = {}) {
  const t = data;
  return (
    <section className="container py-12">
      <figure className="mx-auto max-w-xl rounded-2xl border border-border bg-white p-6 text-right shadow-card">
        <Quote className="size-8 text-brand/30" />
        <div className="mt-2 flex justify-end gap-0.5 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-4 fill-current" />
          ))}
        </div>
        <blockquote className="mt-3 text-lg leading-8 text-ink">
          «{t.quote}»
        </blockquote>
        <figcaption className="mt-4 flex items-center justify-end gap-3">
          <span className="text-sm">
            <span className="font-bold text-ink">{t.name}</span>
            <span className="block text-xs text-muted-foreground">
              {t.location}
            </span>
          </span>
          <span
            aria-hidden
            className="flex size-10 items-center justify-center rounded-full bg-brand-light font-bold text-brand"
          >
            {t.name.charAt(0)}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
