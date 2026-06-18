import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { PRODUCT } from "@/lib/content";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-tajawal",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
const title = "عدة الأردوينو التعليمية — تعلّم وابنِ ٢٢ مشروعاً";
const description =
  "عدة أردوينو متكاملة للمبتدئين: لوحة، مكوّنات كاملة، وكتاب دليل خطوة بخطوة. ابنِ ٢٢ مشروعاً حقيقياً. توصيل لكل الولايات والدفع عند الاستلام.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s · ${PRODUCT.brand}`,
  },
  description,
  applicationName: PRODUCT.brand,
  keywords: [
    "أردوينو",
    "Arduino",
    "تعلم الإلكترونيات",
    "مشاريع أردوينو",
    "عدة أردوينو",
    "الجزائر",
    "STEM",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    url: siteUrl,
    siteName: PRODUCT.brand,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#0e8f8f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="font-sans">
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
