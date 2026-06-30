import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { logout } from "@/app/dashboard/actions";
import { updateFee } from "@/app/dashboard/shipping/actions";
import { listAllFees } from "@/lib/queries/shipping";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRODUCT } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ShippingPage() {
  const fees = await listAllFees();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-ink">{PRODUCT.brand}</h1>
            <p className="text-xs text-muted-foreground">Shipping prices</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">
                <ArrowRight className="size-4" /> Orders
              </Link>
            </Button>
            <form action={logout}>
              <Button variant="outline" size="sm" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-4 px-4 py-6">
        <div>
          <h2 className="text-base font-bold text-ink">Delivery prices per wilaya</h2>
          <p className="text-sm text-muted-foreground">
            Set Domicile (home) and Stop Desk prices in DA. Untick “Serviceable”
            to hide a wilaya from checkout. Changes apply immediately.
          </p>
        </div>

        {/* Header row (desktop) */}
        <div className="hidden grid-cols-[1fr_7rem_7rem_6rem_4rem] gap-3 px-3 text-xs font-semibold uppercase text-muted-foreground sm:grid">
          <span>Wilaya</span>
          <span>Home (DA)</span>
          <span>Stop Desk (DA)</span>
          <span>Serviceable</span>
          <span></span>
        </div>

        <div className="space-y-2">
          {fees.map((f) => (
            <form
              key={f.code}
              action={updateFee}
              className="grid grid-cols-2 items-center gap-3 rounded-xl border border-border bg-white p-3 sm:grid-cols-[1fr_7rem_7rem_6rem_4rem]"
            >
              <input type="hidden" name="wilaya_code" value={f.code} />
              <span className="col-span-2 text-sm font-bold text-ink sm:col-span-1">
                {f.name}
              </span>
              <Input
                name="home_price"
                type="number"
                min={0}
                step={50}
                defaultValue={f.homePrice}
                className="h-10"
                aria-label={`Home price ${f.name}`}
              />
              <Input
                name="stopdesk_price"
                type="number"
                min={0}
                step={50}
                defaultValue={f.stopdeskPrice}
                className="h-10"
                aria-label={`Stop desk price ${f.name}`}
              />
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={f.isActive}
                  className="size-4 accent-[#0e8f8f]"
                />
                <span className="sm:hidden">Serviceable</span>
              </label>
              <Button type="submit" size="sm" variant="outline" aria-label="Save">
                <Check className="size-4" /> Save
              </Button>
            </form>
          ))}
        </div>
      </main>
    </>
  );
}
