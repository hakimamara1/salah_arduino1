"use client";

import { PRODUCT } from "@/lib/content";

const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/**
 * Floating WhatsApp button. Positioned above the sticky mobile CTA bar so the
 * two never overlap.
 */
export function WhatsAppButton() {
  if (!NUMBER) return null;
  const message = encodeURIComponent(
    `مرحباً، أريد الاستفسار عن ${PRODUCT.name}.`,
  );
  const href = `https://wa.me/${NUMBER}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-24 end-4 z-50 flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform hover:scale-105 motion-safe:animate-float md:bottom-6"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-7 fill-current"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.04c-.24.68-1.4 1.3-1.93 1.38-.49.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.17-4.94-4.36-.15-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.26-.29.57-.36.76-.36l.55.01c.18 0 .41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.18 1.53 1.91 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.69-.81.87-1.08.18-.27.36-.23.61-.14.25.09 1.6.76 1.87.9.27.14.46.21.53.32.07.12.07.66-.17 1.34z" />
      </svg>
    </a>
  );
}
