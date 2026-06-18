import { Reveal } from "@/components/reveal";
import { LEARNING_PATH } from "@/lib/content";

const arabicNumerals = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨"];

export function LearningPath() {
  return (
    <section className="bg-secondary py-12">
      <div className="container max-w-xl">
        <h2 className="section-title">مسار التعلّم</h2>
        <p className="mt-2 text-center text-muted-foreground">
          من أول مصباح تضيئه… إلى عقلية مهندس تدوم.
        </p>

        <ol className="relative mt-8 space-y-5 border-s-2 border-brand/30 ps-6">
          {LEARNING_PATH.map((step, i) => (
            <Reveal as="li" key={step} delay={i * 60} className="relative">
              <span className="absolute -start-[2.1rem] flex size-7 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                {arabicNumerals[i]}
              </span>
              <span className="text-base font-bold text-ink">{step}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
