import { ProductImage } from "@/components/product-image";
import { Reveal } from "@/components/reveal";
import { INCLUDED_ITEMS } from "@/lib/content";
import { resolveImage } from "@/lib/resolve-image";
import { Plus } from "lucide-react";

export function WhatsIncluded() {
  return (
    <section className="bg-secondary py-12">
      <div className="container">
        <h2 className="section-title">ما الذي تتضمنه العدة؟</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">
          كل المكوّنات في علبة واحدة — جاهزة للبدء فوراً.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {INCLUDED_ITEMS.map((item, i) => (
            <Reveal key={item.name} delay={i * 50}>
              <div className="rounded-2xl border border-border bg-white p-3 text-center shadow-sm">
                <ProductImage
                  src={resolveImage(item.image)}
                  alt={item.name}
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="aspect-square rounded-xl"
                />
                <p className="mt-2 text-sm font-bold text-ink">{item.name}</p>
              </div>
            </Reveal>
          ))}

        </div>
        <div className="flex items-center justify-center gap-2 mt-8 text-center text-brand font-bold"> <Plus />  اكثر من 10 مكونات أخرى يتضمنها الصندوق
        </div>
      </div>
    </section>
  );
}
