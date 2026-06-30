import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders Dashboard",
  robots: { index: false, follow: false },
};

/**
 * Admin shell: forces LTR + a system font (overriding the storefront's RTL
 * Tajawal body) and keeps the dashboard out of search indexes.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      dir="ltr"
      className="min-h-screen bg-secondary text-ink [font-family:system-ui,-apple-system,Segoe_UI,Roboto,sans-serif]"
    >
      {children}
    </div>
  );
}
