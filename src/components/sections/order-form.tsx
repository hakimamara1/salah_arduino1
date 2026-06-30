"use client";

import * as React from "react";
import { useActionState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, Truck, Building2 } from "lucide-react";
import { submitOrder } from "@/app/actions/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pixel } from "@/lib/meta/pixel";
import { generateEventId } from "@/lib/meta/events";
import { PRODUCT, type VariantId } from "@/lib/content";
import { formatDZD, cn } from "@/lib/utils";
import {
  DELIVERY_LABELS,
  DELIVERY_TYPES,
  shippingPriceFor,
  type Commune,
  type DeliveryType,
  type WilayaFee,
} from "@/lib/shipping";
import type { OrderActionState } from "@/types/order";

const initialState: OrderActionState = { status: "idle" };

export function OrderForm({
  id,
  title,
  variant,
  wilayas,
}: {
  id: string;
  title: string;
  variant: VariantId;
  wilayas: WilayaFee[];
}) {
  const [state, formAction, pending] = useActionState(submitOrder, initialState);
  const eventIdRef = React.useRef<string>(generateEventId());

  const [wilayaCode, setWilayaCode] = React.useState("");
  const [commune, setCommune] = React.useState("");
  const [communes, setCommunes] = React.useState<Commune[]>([]);
  const [loadingCommunes, setLoadingCommunes] = React.useState(false);
  const [delivery, setDelivery] = React.useState<DeliveryType>("home");

  const selectedWilaya = wilayas.find((w) => w.code === wilayaCode);
  const shipping = shippingPriceFor(selectedWilaya, delivery);
  const total = PRODUCT.price + (shipping ?? 0);

  React.useEffect(() => {
    if (state.status === "success") pixel.lead(eventIdRef.current);
  }, [state.status]);

  // Load communes when the wilaya changes.
  async function onWilayaChange(code: string) {
    setWilayaCode(code);
    setCommune("");
    setCommunes([]);
    setLoadingCommunes(true);
    try {
      const res = await fetch(`/api/communes?wilaya=${code}`);
      const data = (await res.json()) as { communes: Commune[] };
      setCommunes(data.communes ?? []);
    } catch {
      setCommunes([]);
    } finally {
      setLoadingCommunes(false);
    }
  }

  if (state.status === "success") {
    return (
      <section id={id} className="scroll-mt-20 bg-secondary py-10">
        <div className="container max-w-md">
          <div className="rounded-2xl border border-brand/30 bg-brand-light p-8 text-center">
            <CheckCircle2 className="mx-auto size-14 text-brand" />
            <h2 className="mt-4 text-2xl font-extrabold text-ink">تم استلام طلبك!</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{state.message}</p>
            <p className="mt-4 text-sm font-bold text-brand-dark">
              رقم الطلب: {state.orderId?.slice(0, 8)}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="scroll-mt-20 bg-secondary py-10">
      <div className="container max-w-md">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <h2 className="text-xl font-extrabold text-ink">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ادفع عند الاستلام — بدون أي دفع مسبق.
          </p>

          <form action={formAction} className="mt-5 space-y-4" noValidate>
            <input type="hidden" name="landing_variant" value={variant} />
            <input type="hidden" name="event_id" value={eventIdRef.current} />
            <input type="hidden" name="wilaya_code" value={wilayaCode} />
            <input type="hidden" name="wilaya" value={selectedWilaya?.name ?? ""} />
            <input type="hidden" name="commune" value={commune} />
            <input type="hidden" name="delivery_type" value={delivery} />

            <Field
              label="الاسم الكامل"
              name="full_name"
              autoComplete="name"
              placeholder="مثال: محمد بن علي"
              error={state.errors?.full_name}
            />

            <Field
              label="رقم الهاتف"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder="07XXXXXXXX"
              error={state.errors?.phone}
            />

            {/* Wilaya */}
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-wilaya`}>الولاية</Label>
              <Select value={wilayaCode} onValueChange={onWilayaChange}>
                <SelectTrigger
                  id={`${id}-wilaya`}
                  aria-invalid={Boolean(state.errors?.wilaya_code)}
                >
                  <SelectValue placeholder="اختر الولاية" />
                </SelectTrigger>
                <SelectContent>
                  {wilayas.map((w) => (
                    <SelectItem key={w.code} value={w.code}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.wilaya_code && (
                <p className="text-sm text-destructive">{state.errors.wilaya_code}</p>
              )}
            </div>

            {/* Commune (depends on wilaya) */}
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-commune`}>البلدية</Label>
              <Select
                value={commune}
                onValueChange={setCommune}
                disabled={!wilayaCode || loadingCommunes}
              >
                <SelectTrigger
                  id={`${id}-commune`}
                  aria-invalid={Boolean(state.errors?.commune)}
                >
                  <SelectValue
                    placeholder={
                      !wilayaCode
                        ? "اختر الولاية أولاً"
                        : loadingCommunes
                          ? "جارٍ التحميل…"
                          : "اختر البلدية"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {communes.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.commune && (
                <p className="text-sm text-destructive">{state.errors.commune}</p>
              )}
            </div>

            {/* Delivery type */}
            <div className="space-y-1.5">
              <Label>نوع التوصيل</Label>
              <div className="grid gap-2">
                {DELIVERY_TYPES.map((t) => {
                  const price = shippingPriceFor(selectedWilaya, t);
                  const active = delivery === t;
                  const Icon = t === "home" ? Truck : Building2;
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setDelivery(t)}
                      aria-pressed={active}
                      className={cn(
                        "flex items-center justify-between rounded-xl border p-3 text-start transition-colors",
                        active
                          ? "border-brand bg-brand-light"
                          : "border-border bg-white hover:bg-secondary",
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "flex size-9 items-center justify-center rounded-lg",
                            active ? "bg-brand text-white" : "bg-secondary text-muted-foreground",
                          )}
                        >
                          <Icon className="size-5" />
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-ink">
                            {DELIVERY_LABELS[t].ar}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {DELIVERY_LABELS[t].hint}
                          </span>
                        </span>
                      </span>
                      <span className="text-sm font-extrabold text-ink">
                        {price === null ? "—" : formatDZD(price)}
                      </span>
                    </button>
                  );
                })}
              </div>
              {state.errors?.delivery_type && (
                <p className="text-sm text-destructive">{state.errors.delivery_type}</p>
              )}
            </div>

            <Field
              label="العنوان"
              name="address"
              autoComplete="street-address"
              placeholder="الحي، الشارع، أقرب نقطة دالة"
              error={state.errors?.address}
            />

            {/* Order summary */}
            <dl className="space-y-2 rounded-xl bg-secondary p-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">سعر المنتج</dt>
                <dd className="font-bold text-ink">
                  <span className="me-2 text-xs text-muted-foreground line-through">
                    {formatDZD(PRODUCT.compareAtPrice)}
                  </span>
                  {formatDZD(PRODUCT.price)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">سعر التوصيل</dt>
                <dd className="font-bold text-brand">
                  {shipping === null ? "—" : formatDZD(shipping)}
                </dd>
              </div>
              <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
                <dt className="font-bold text-ink">المجموع</dt>
                <dd className="text-lg font-extrabold text-ink">{formatDZD(total)}</dd>
              </div>
            </dl>

            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="animate-spin" /> جارٍ الإرسال…
                </>
              ) : (
                <>🛒 اشترِ الآن · {formatDZD(total)}</>
              )}
            </Button>

            {state.status === "error" && !state.errors && (
              <p className="text-center text-sm text-destructive">{state.message}</p>
            )}

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-brand" />
              بياناتك آمنة — تُستخدم فقط لتأكيد التوصيل.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  error,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
} & React.ComponentProps<typeof Input>) {
  const id = `field-${name}-${React.useId()}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
