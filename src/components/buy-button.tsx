"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { pixel } from "@/lib/meta/pixel";

/**
 * Any primary "order now" CTA. Scrolls to the order form and fires the
 * InitiateCheckout pixel event (once per page-view burst is fine — Meta
 * handles frequency).
 */
export function BuyButton({
  children,
  target = "order-top",
  ...props
}: ButtonProps & { target?: string }) {
  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      pixel.initiateCheckout();
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Focus the first field for faster completion.
        const firstInput = el.querySelector<HTMLInputElement>("input, select");
        window.setTimeout(() => firstInput?.focus({ preventScroll: true }), 600);
      }
      props.onClick?.(e);
    },
    [target, props],
  );

  return (
    <Button {...props} onClick={onClick}>
      {children}
    </Button>
  );
}
