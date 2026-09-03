import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { FaqEntry } from "@/components/sections/faq/faq-item";
import { Accordion } from "@/components/ui/accordion";
import { faqItems } from "@/lib/data/faq";

/** FAQ 区块：手风琴式问答列表 */
export function FaqSection() {
  return (
    <Section id="faq" tone="muted">
      <div className="flex w-full flex-col items-center">
        <SectionHeading>FAQ</SectionHeading>

        <Accordion
          type="single"
          collapsible
          className="mt-10 w-full max-w-[760px] text-left"
        >
          {faqItems.map((item, index) => (
            <FaqEntry key={item.question} item={item} value={`item-${index}`} />
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
