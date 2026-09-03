import { TestimonialAuthor } from "@/components/sections/testimonial/testimonial-author";
import { TestimonialQuote } from "@/components/sections/testimonial/testimonial-quote";
import type { Testimonial } from "@/lib/types";

/** 单条客户评价卡片 */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex w-full max-w-7xl flex-col-reverse items-center justify-evenly gap-8 rounded-3xl text-left md:flex-row">
      <TestimonialAuthor testimonial={testimonial} />
      <TestimonialQuote testimonial={testimonial} />
    </div>
  );
}
