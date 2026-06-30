import { AnnouncementBar } from "@/components/sections/announcement-bar";
import { SiteHeader } from "@/components/sections/site-header";
import { Hero } from "@/components/sections/hero";
import { OrderForm } from "@/components/sections/order-form";
import { Showcase } from "@/components/sections/showcase";
import { WhatsIncluded } from "@/components/sections/whats-included";
import { WhyThisKit } from "@/components/sections/why-this-kit";
import { LearningPath } from "@/components/sections/learning-path";
import { WhatYouLearn } from "@/components/sections/what-you-learn";
import { Testimonials } from "@/components/sections/testimonials";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { SiteFooter } from "@/components/sections/site-footer";
import { StickyCta } from "@/components/sections/sticky-cta";
import { WhatsAppButton } from "@/components/sections/whatsapp-button";
import { ViewContentTracker } from "@/components/analytics/view-content";
import { StructuredData } from "@/components/structured-data";
// Parent-focused (variant D) sections
import { WhyChildNeedsIt } from "@/components/sections/parent/why-child-needs-it";
import { BeforeAfter } from "@/components/sections/parent/before-after";
import { NoTeacher } from "@/components/sections/parent/no-teacher";
import { ParentTestimonial } from "@/components/sections/parent/parent-testimonial";
import { GiftFraming } from "@/components/sections/parent/gift-framing";
// Future-focused (variant E) sections
import { StakesTurnaround } from "@/components/sections/future/stakes-turnaround";
import { FuturePath } from "@/components/sections/future/future-path";
import { Reassurance } from "@/components/sections/future/reassurance";
import {
  getVariant,
  normalizeVariant,
  PARENT_FAQ,
  FUTURE_TESTIMONIAL,
} from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  const variantId = normalizeVariant(v);
  const variant = getVariant(variantId);

  return (
    <>
      <StructuredData url={siteUrl} />
      <ViewContentTracker />

      {variant.announcement && <AnnouncementBar text={variant.announcement} />}
      <SiteHeader variant={variant} />

      <main>
        <Hero variant={variant} />

        {/* Primary order form — right after the hero */}
        <OrderForm
          id="order-top"
          title={variant.orderFormTitle}
          variant={variantId}
        />

        {variantId === "D" ? (
          <>
            <WhyChildNeedsIt />
            <BeforeAfter />
            <Showcase
              title="ماذا سيبني طفلك؟"
              subtitle="٢٢ مشروعاً حقيقياً يصنعه بيديه — من إشارة المرور إلى الذراع الآلية."
            />
            <NoTeacher />
            <ParentTestimonial />
            <GiftFraming />
            <FaqSection title="أسئلة الأهل" items={PARENT_FAQ} />
          </>
        ) : variantId === "E" ? (
          <>
            <StakesTurnaround />
            <FuturePath />
            <ParentTestimonial data={FUTURE_TESTIMONIAL} />
            <Reassurance />
            <FaqSection title="أسئلة الأهل" items={PARENT_FAQ} />
          </>
        ) : (
          <>
            <Showcase />
            <WhatsIncluded />
            <WhyThisKit />
            <LearningPath />
            <WhatYouLearn />
            {/* <Testimonials /> */}
            <FaqSection />
          </>
        )}

        {/* Repeated order form near the bottom */}
        <OrderForm id="order-bottom" title="جاهز للطلب؟" variant={variantId} />

        <FinalCta variant={variant} />
      </main>

      <SiteFooter />

      <StickyCta label={variant.stickyCta} />
      <WhatsAppButton />
    </>
  );
}
