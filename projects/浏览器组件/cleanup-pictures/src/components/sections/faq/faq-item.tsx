"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaqAnswer } from "@/components/sections/faq/faq-answer";
import type { FaqItem } from "@/lib/types";

/** FAQ 单条问答 */
export function FaqEntry({ item, value }: { item: FaqItem; value: string }) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>{item.question}</AccordionTrigger>
      <AccordionContent>
        <FaqAnswer blocks={item.answer} />
      </AccordionContent>
    </AccordionItem>
  );
}
