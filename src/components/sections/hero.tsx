import { Check } from "lucide-react";
import { BuyButton } from "@/components/buy-button";
import { ProductImage } from "@/components/product-image";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { PriceTag } from "@/components/price-tag";
import { Button } from "@/components/ui/button";
import {
  BENEFITS,
  HERO_IMAGE,
  PRODUCT,
  TRUST_BADGES,
  type VariantContent,
} from "@/lib/content";
import { getHeroImages, type HeroSlide } from "@/lib/queries/hero-images";
import { resolveImage } from "@/lib/resolve-image";
import { formatDZD } from "@/lib/utils";

export async function Hero({ variant }: { variant: VariantContent }) {
  const { hero } = variant;
  const slides = await getHeroImages(variant.id);

  if (hero.layout === "full") {
    return <FullBleedHero variant={variant} slides={slides} />;
  }

  return (
    <section className="container grid gap-8 py-8 sm:py-12 lg:grid-cols-2 lg:items-center lg:gap-12">
      <div className="order-1 lg:order-2">
        {slides.length > 0 ? (
          <HeroCarousel
            slides={slides}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <ProductImage
            src={resolveImage(HERO_IMAGE)}
            alt={hero.imageAlt}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[4/3] rounded-2xl border border-border shadow-card"
          />
        )}
      </div>

      <div className="order-2 lg:order-1">
        {hero.eyebrow && (
          <span className="inline-block rounded-full bg-brand-tint px-3 py-1 text-sm font-bold text-brand-dark">
            {hero.eyebrow}
          </span>
        )}
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          {hero.title}
        </h1>
        {hero.subtitle && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {hero.subtitle}
          </p>
        )}

        {hero.chips && (
          <div className="mt-4 flex flex-wrap gap-2">
            {hero.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-brand-tint px-3 py-1.5 text-sm font-bold text-brand-dark"
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2 text-base text-ink">
              <Check className="size-5 shrink-0 text-brand" strokeWidth={3} />
              {b}
            </li>
          ))}
        </ul>

        <PriceTag className="mt-6" />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <BuyButton size="lg" className="w-full sm:w-auto">
            {hero.primaryCta}
          </BuyButton>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <a href="#showcase">شاهد المشاريع</a>
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TRUST_BADGES.map((t) => (
            <div
              key={t.label}
              className="rounded-xl border border-border bg-white px-2 py-2.5 text-center text-xs font-medium text-muted-foreground"
            >
              <span className="me-1">{t.icon}</span>
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FullBleedHero({
  variant,
  slides,
}: {
  variant: VariantContent;
  slides: HeroSlide[];
}) {
  const { hero } = variant;
  return (
    <section className="relative">
      <div className="absolute inset-0">
        {slides.length > 0 ? (
          <HeroCarousel slides={slides} fill sizes="100vw" />
        ) : (
          <ProductImage
            src={resolveImage(HERO_IMAGE)}
            alt={hero.imageAlt}
            priority
            sizes="100vw"
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
      <div className="container relative flex min-h-[68vh] flex-col justify-end py-10">
        <h1 className="max-w-2xl text-3xl font-extrabold leading-tight text-white drop-shadow sm:text-5xl">
          {hero.title}
        </h1>
        {hero.subtitle && (
          <p className="mt-4 max-w-xl text-lg text-white/90 drop-shadow">
            {hero.subtitle}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <BuyButton size="lg">{hero.primaryCta}</BuyButton>
          <span className="rounded-xl bg-white px-5 py-3 text-lg font-extrabold text-ink">
            {formatDZD(PRODUCT.price)}
          </span>
        </div>
      </div>
    </section>
  );
}
