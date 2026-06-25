# Arduino Shop — Landing Page

High-converting, mobile-first **Arabic / RTL** landing page for an Arduino
starter-kit, built for **cash-on-delivery** orders from **Facebook Ads** traffic
in Algeria.

Built with **Next.js 15 (App Router)**, **TypeScript (strict)**, **Tailwind CSS**,
and **shadcn/ui**. Leads are stored in **Supabase**; conversions are tracked with
the **Meta Pixel** and a **Conversions API**-ready architecture.

---

## ✨ Features

- **5 conversion-tested landing variants** (A–E) from the wireframe, switchable
  via `?v=A…E` for Facebook ad-set A/B testing. The chosen variant is saved with
  every order.
- Full wireframe section hierarchy: hero → order form → showcase → what's
  included → comparison → learning path → what-you'll-learn → testimonials → FAQ
  → second order form → final CTA.
- **Sticky mobile CTA** bar + **floating WhatsApp** button.
- **Meta Pixel**: `PageView`, `ViewContent`, `InitiateCheckout`, `Lead`.
- **Meta Conversions API** wired server-side (Lead fired from the Server Action),
  deduplicated with the browser pixel via a shared `eventId`.
- **Supabase** `orders` table via a typed **Server Action** with validation.
- SEO: semantic HTML, metadata, Open Graph (dynamic OG image), Product + FAQ
  JSON-LD, RTL `lang="ar"`.
- Performance: `next/font`, `next/image`, lazy scroll-reveal (no animation lib),
  `prefers-reduced-motion` support — tuned for **LCP < 2.5s**.

---

## 🚀 Getting started

```bash
cp .env.example .env.local   # fill in the values below
npm install
npm run dev                  # http://localhost:3000
```

Try a variant: `http://localhost:3000/?v=D`

### Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → API | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API | (reserved for client reads) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API | **Server-only** insert of orders |
| `NEXT_PUBLIC_META_PIXEL_ID` | Events Manager | Browser pixel id |
| `META_CAPI_ACCESS_TOKEN` | Events Manager | **Server-only** Conversions API |
| `META_CAPI_TEST_EVENT_CODE` | Events Manager | Optional, for Test Events only |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | — | Intl format, digits only (e.g. `2136…`) |
| `NEXT_PUBLIC_SITE_URL` | — | Canonical / OG base URL |
| `DASHBOARD_PASSWORD` | — | **Server-only** login password for `/dashboard` |

> Every integration is optional at runtime — with no env vars the page still
> renders and runs; pixel/CAPI/Supabase calls simply no-op or surface a friendly
> error. Set them before going live.

### Supabase

Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor to
create the `orders` table (`full_name`, `phone`, `wilaya`, `address`,
`landing_variant`, `created_at`) with RLS locked down — only the service role
writes.

---

## 🧱 Project structure

```
src/
  app/
    actions/order.ts        # Server Action: validate → Supabase insert → CAPI Lead
    api/meta-capi/route.ts  # Optional server mirror for browser events
    opengraph-image.tsx     # Dynamic OG PNG (next/og)
    layout.tsx  page.tsx  globals.css
  components/
    analytics/              # MetaPixel, ViewContentTracker
    sections/               # one component per wireframe section
    ui/                     # shadcn/ui primitives (button, input, select, …)
    buy-button.tsx  product-image.tsx  price-tag.tsx  reveal.tsx
  lib/
    content.ts              # all Arabic copy + the 5 variants
    wilayas.ts              # 58 Algerian wilayas
    meta/                   # pixel.ts (client), capi.ts (server), events.ts
    supabase/server.ts
  types/order.ts
supabase/schema.sql
```

---

## 📊 Tracking flow

1. **PageView** — on mount (`MetaPixel`).
2. **ViewContent** — shortly after load (`ViewContentTracker`).
3. **InitiateCheckout** — on any "order now" CTA (`BuyButton`).
4. **Lead** — on successful order: the client fires the pixel `Lead` and the
   Server Action fires the **CAPI `Lead`** with the *same* `eventId`, so Meta
   deduplicates the two reports.

---

## 🔐 Admin dashboard

A private, read-only orders dashboard lives at **`/dashboard`** (English LTR).

- **Login:** `/dashboard/login`, single shared password from `DASHBOARD_PASSWORD`.
  A middleware (`src/middleware.ts`) guards every `/dashboard` route via an
  httpOnly HMAC session cookie — no extra auth service.
- **Stats:** total orders, today, last 7 days, estimated revenue, top variant.
- **Table:** search (name/phone), filter by wilaya & variant, pagination,
  click-to-call + WhatsApp links per order.
- **Export:** `Export CSV` downloads the current filtered view (UTF-8 BOM so
  Excel renders Arabic correctly).

All reads run server-side through the service-role client, so customer PII never
reaches the browser unauthenticated. To swap the shared password for real
multi-user accounts later, replace `src/lib/auth/dashboard.ts` with Supabase
Auth — the queries and UI stay unchanged.

## ▲ Deploy to Vercel

1. Push this folder to a Git repo and import it in Vercel.
2. Add all environment variables (Project → Settings → Environment Variables).
3. Add your real image host to `next.config.mjs › images.remotePatterns` if you
   serve product photos from a CDN / Supabase Storage.
4. Deploy. Build command `next build`, output is auto-detected.

## 🖼️ Swapping in real product photos

Placeholders live in `public/images/*.svg` and render through `next/image`. Drop
real `.jpg`/`.webp` files in `public/images` and update the `src` props in
`hero.tsx`, `showcase.tsx`, and `whats-included.tsx` — raster images are then
auto-optimized (AVIF/WebP, responsive `srcset`). Keep `priority` on the hero
image for the best LCP.
# salah_shop
# salah_shop
# salah_arduino1
