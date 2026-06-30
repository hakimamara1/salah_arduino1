"use client";

import Script from "next/script";
import * as React from "react";
import { META_PIXEL_ID, pixel } from "@/lib/meta/pixel";

/**
 * Injects the Meta Pixel base code and fires PageView once on mount.
 * Renders nothing (and loads no script) when no pixel id is configured.
 */
export function MetaPixel() {
  React.useEffect(() => {
    // fbq queues calls before the script finishes loading, so this is safe.
    pixel.pageView();
  }, []);

  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="lazyOnload">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
