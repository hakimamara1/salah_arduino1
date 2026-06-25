import { ProductImage } from "@/components/product-image";
import { Reveal } from "@/components/reveal";
import { PROJECTS, PRODUCT } from "@/lib/content";
import { resolveImage } from "@/lib/resolve-image";

const levelDots: Record<string, string> = {
  "سهل": "●",
  "متوسط": "●●",
  "متقدّم": "●●●",
};

export function Showcase({
  title = "ماذا ستبني؟",
  subtitle = "مشاريع حقيقية تتدرّج من السهل إلى المتقدّم — تتعلّم بالممارسة.",
}: {
  title?: string;
  subtitle?: string;
} = {}) {
  return (
    <section id="showcase" className="container scroll-mt-20 py-12">
      <h2 className="section-title">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">
        {subtitle}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        {PROJECTS.map((project, i) => (
          <Reveal key={project.title} delay={i * 60}>
            <article className="h-full overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-card">
              <ProductImage
                src={resolveImage(project.image)}
                alt={`مشروع ${project.title}`}
                sizes="(max-width: 768px) 50vw, 33vw"
                className="aspect-[4/3]"
              />
              <div className="p-3 text-right">
                <h3 className="text-sm font-bold text-ink">{project.title}</h3>
                <p className="mt-1 text-xs font-bold text-brand">
                  {levelDots[project.level]} {project.level}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {project.skills}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <p className="mt-6 text-center font-bold text-muted-foreground">
        + {PRODUCT.projectsCount - PROJECTS.length} مشروعاً آخر داخل الكتاب…
      </p>
    </section>
  );
}
