import { GIFT_FRAMING } from "@/lib/content";

export function GiftFraming() {
  return (
    <section className="container pb-4 pt-2">
      <div className="mx-auto max-w-2xl rounded-2xl bg-brand-light px-6 py-7 text-center">
        <h2 className="text-xl font-extrabold text-brand-dark">
          {GIFT_FRAMING.title}
        </h2>
        <p className="mt-2 leading-7 text-brand-dark/80">{GIFT_FRAMING.text}</p>
      </div>
    </section>
  );
}
