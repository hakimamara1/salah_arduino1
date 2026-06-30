"use client";

import * as React from "react";
import { BuyButton } from "@/components/buy-button";
import { PRODUCT } from "@/lib/content";
import { formatDZD } from "@/lib/utils";

/**
 * Sticky mobile purchase bar. Shows after the user scrolls past the hero and
 * hides on the success state. Mobile-only (md:hidden) since desktop keeps CTAs
 * inline.
 */
export function StickyCta({ label }: { label: string }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="shrink-0 leading-tight">
          <span className="block text-xs text-muted-foreground line-through">
            {formatDZD(PRODUCT.compareAtPrice)}
          </span>
          <span className="block text-base font-extrabold text-ink">
            {formatDZD(PRODUCT.price)}
          </span>
        </div>
        <BuyButton className="flex-1">🛒 {label}</BuyButton>
      </div>
    </div>
  );
}
