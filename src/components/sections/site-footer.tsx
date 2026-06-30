import { PRODUCT } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white pb-24 pt-8 md:pb-8">
      <div className="container flex flex-col items-center gap-3 text-center">
        <span className="text-lg font-extrabold text-brand">{PRODUCT.brand}</span>
        <p className="max-w-md text-sm text-muted-foreground">
          عدة تعليمية متكاملة لتعلّم الأردوينو والإلكترونيات — توصيل لكل الولايات
          والدفع عند الاستلام.
        </p>
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <a href="#showcase" className="hover:text-brand">
            المشاريع
          </a>
          <a href="#faq" className="hover:text-brand">
            الأسئلة الشائعة
          </a>
          <a href="#order-top" className="hover:text-brand">
            اطلب الآن
          </a>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {PRODUCT.brand}. كل الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
