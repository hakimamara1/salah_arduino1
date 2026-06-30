import { ShieldCheck, Brain, GraduationCap, Sparkles } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { PARENT_BENEFITS } from "@/lib/content";

const icons = [ShieldCheck, Brain, GraduationCap, Sparkles];

export function WhyChildNeedsIt() {
  return (
    <section className="bg-secondary py-12">
      <div className="container max-w-2xl">
        <h2 className="section-title">لماذا يجب أن تقتنيها لطفلك؟</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">
          أكثر من لعبة — استثمار في عقل طفلك ومستقبله.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {PARENT_BENEFITS.map((benefit, i) => {
            const Icon = icons[i % icons.length]!;
            return (
              <Reveal key={benefit.title} delay={i * 70}>
                <div className="flex h-full items-start gap-3 rounded-2xl border border-border bg-white p-4 text-right shadow-sm">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <Icon className="size-6" />
                  </span>
                  <div>
                    <h3 className="font-bold text-ink">{benefit.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
