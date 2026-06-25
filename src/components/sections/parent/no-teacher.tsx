import { ProductImage } from "@/components/product-image";
import { resolveImage } from "@/lib/resolve-image";
import { NO_TEACHER } from "@/lib/content";

export function NoTeacher() {
  return (
    <section className="bg-secondary py-12">
      <div className="container">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-2xl border border-border bg-white p-6 text-center shadow-sm sm:flex-row sm:text-right">
          <ProductImage
            src={resolveImage("/images/item-book.jpg")}
            alt="كتاب دليل المبتدئين"
            sizes="160px"
            className="aspect-[3/4] w-28 shrink-0 rounded-xl border border-border"
          />
          <div>
            <h2 className="text-xl font-extrabold text-ink">
              {NO_TEACHER.title}
            </h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              {NO_TEACHER.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
