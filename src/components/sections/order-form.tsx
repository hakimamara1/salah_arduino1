"use client";

import * as React from "react";
import { useActionState } from "react";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
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
import { PriceTag } from "@/components/price-tag";
import { WILAYAS } from "@/lib/wilayas";
import { pixel } from "@/lib/meta/pixel";
import { generateEventId } from "@/lib/meta/events";
import type { VariantId } from "@/lib/content";
import type { OrderActionState } from "@/types/order";

const initialState: OrderActionState = { status: "idle" };

export function OrderForm({
  id,
  title,
  variant,
}: {
  id: string;
  title: string;
  variant: VariantId;
}) {
  const [state, formAction, pending] = useActionState(submitOrder, initialState);
  // Stable id shared between the browser Lead pixel and the server CAPI Lead.
  const eventIdRef = React.useRef<string>(generateEventId());

  React.useEffect(() => {
    if (state.status === "success") {
      pixel.lead(eventIdRef.current);
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <section id={id} className="scroll-mt-20 bg-secondary py-10">
        <div className="container max-w-md">
          <div className="rounded-2xl border border-brand/30 bg-brand-light p-8 text-center">
            <CheckCircle2 className="mx-auto size-14 text-brand" />
            <h2 className="mt-4 text-2xl font-extrabold text-ink">
              تم استلام طلبك!
            </h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {state.message}
            </p>
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

            <div className="space-y-1.5">
              <Label htmlFor={`${id}-wilaya`}>الولاية</Label>
              <Select name="wilaya">
                <SelectTrigger
                  id={`${id}-wilaya`}
                  aria-invalid={Boolean(state.errors?.wilaya)}
                >
                  <SelectValue placeholder="اختر الولاية" />
                </SelectTrigger>
                <SelectContent>
                  {WILAYAS.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.wilaya && (
                <p className="text-sm text-destructive">{state.errors.wilaya}</p>
              )}
            </div>

            <Field
              label="العنوان"
              name="address"
              autoComplete="street-address"
              placeholder="البلدية، الحي، أقرب نقطة دالة"
              error={state.errors?.address}
            />

            <div className="rounded-xl bg-secondary p-3">
              <PriceTag center />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="animate-spin" /> جارٍ الإرسال…
                </>
              ) : (
                <>✅ أكّد طلبي</>
              )}
            </Button>

            {state.status === "error" && !state.errors && (
              <p className="text-center text-sm text-destructive">
                {state.message}
              </p>
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
