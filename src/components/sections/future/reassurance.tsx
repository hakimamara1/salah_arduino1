import { ShieldCheck } from "lucide-react";
import { REASSURANCE } from "@/lib/content";

export function Reassurance() {
  return (
    <section className="container pb-4 pt-2">
      <div className="mx-auto flex max-w-2xl items-start gap-4 rounded-2xl bg-brand-light px-6 py-6 text-right">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand">
          <ShieldCheck className="size-6" />
        </span>
        <div>
          <h2 className="text-lg font-extrabold text-brand-dark">
            {REASSURANCE.title}
          </h2>
          <p className="mt-1 leading-7 text-brand-dark/80">{REASSURANCE.text}</p>
        </div>
      </div>
    </section>
  );
}
