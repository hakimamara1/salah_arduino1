"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/lib/queries/hero-images";

/**
 * Hero image carousel (embla). RTL-aware, touch/swipe, dots, arrows, and
 * autoplay that pauses on interaction and respects reduced-motion.
 *
 * `fill` => slides absolutely fill the parent (full-bleed hero, variant C).
 * Otherwise the carousel sizes itself (classic hero box).
 * The first slide gets next/image `priority` to protect LCP.
 */
export function HeroCarousel({
  slides,
  fill = false,
  sizes,
}: {
  slides: HeroSlide[];
  fill?: boolean;
  sizes: string;
}) {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const autoplay = React.useRef(
    Autoplay({ delay: 4500, stopOnInteraction: true }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: slides.length > 1, direction: "rtl", align: "start" },
    slides.length > 1 && !reduceMotion ? [autoplay.current] : [],
  );

  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const multiple = slides.length > 1;

  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        fill ? "h-full w-full" : "rounded-2xl border border-border shadow-card",
      )}
    >
      <div
        className={cn("overflow-hidden", fill ? "h-full" : "")}
        ref={emblaRef}
      >
        <div className={cn("flex", fill ? "h-full" : "")}>
          {slides.map((slide, i) => (
            <div
              key={slide.url}
              className={cn(
                "relative min-w-0 flex-[0_0_100%]",
                fill ? "h-full" : "aspect-[4/3]",
              )}
            >
              <Image
                src={slide.url}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes={sizes}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {multiple && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="السابق"
            className="absolute end-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow-sm backdrop-blur transition-opacity hover:bg-white"
          >
            <ChevronRight className="size-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="التالي"
            className="absolute start-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow-sm backdrop-blur transition-opacity hover:bg-white"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.url}
                type="button"
                aria-label={`اذهب إلى الصورة ${i + 1}`}
                aria-current={i === selected}
                onClick={() => emblaApi?.scrollTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === selected
                    ? "w-6 bg-white"
                    : "w-2 bg-white/60 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
