"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight scroll-reveal: adds a fade-up animation when the element enters
 * the viewport. Uses a single IntersectionObserver, no animation library.
 * Falls back to visible immediately if IO is unavailable or reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      style={shown ? { animationDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-opacity",
        shown ? "animate-fade-up" : "opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
