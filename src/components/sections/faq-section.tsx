import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ, type Faq } from "@/lib/content";

export function FaqSection({
  title = "الأسئلة الشائعة",
  items = FAQ,
}: {
  title?: string;
  items?: Faq[];
} = {}) {
  return (
    <section id="faq" className="container max-w-2xl scroll-mt-20 py-12">
      <h2 className="section-title">{title}</h2>
      <Accordion type="single" collapsible className="mt-8 space-y-3">
        {items.map((item, i) => (
          <AccordionItem key={item.q} value={`faq-${i}`}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
