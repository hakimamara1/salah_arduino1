import { Cpu, CircuitBoard, Radio, PencilRuler } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { WHAT_YOU_LEARN } from "@/lib/content";

const icons = [Cpu, CircuitBoard, Radio, PencilRuler];

export function WhatYouLearn() {
  return (
    <section className="container py-12">
      <h2 className="section-title">ماذا ستتعلّم؟</h2>

      <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-4">
        {WHAT_YOU_LEARN.map((skill, i) => {
          const Icon = icons[i % icons.length]!;
          return (
            <Reveal key={skill} delay={i * 60}>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                  <Icon className="size-6" />
                </span>
                <span className="text-sm font-bold text-ink">{skill}</span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
