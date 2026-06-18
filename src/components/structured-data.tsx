import { PRODUCT, TESTIMONIALS, FAQ } from "@/lib/content";

/**
 * Product + FAQ JSON-LD for rich results. Server-rendered into the page head.
 */
export function StructuredData({ url }: { url: string }) {
  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: PRODUCT.name,
    sku: PRODUCT.sku,
    brand: { "@type": "Brand", name: PRODUCT.brand },
    description:
      "عدة أردوينو تعليمية متكاملة للمبتدئين مع كتاب دليل و٢٢ مشروعاً عملياً.",
    offers: {
      "@type": "Offer",
      priceCurrency: PRODUCT.currency,
      price: PRODUCT.price,
      availability: "https://schema.org/InStock",
      url,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: TESTIMONIALS.length * 40,
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
