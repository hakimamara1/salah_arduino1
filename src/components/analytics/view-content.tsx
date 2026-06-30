"use client";

import * as React from "react";
import { pixel } from "@/lib/meta/pixel";

/**
 * Fires the Meta `ViewContent` event once, shortly after the landing page
 * becomes interactive (the user has meaningfully landed on the product page).
 * Renders nothing.
 */
export function ViewContentTracker() {
  React.useEffect(() => {
    const t = window.setTimeout(() => pixel.viewContent(), 1200);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
