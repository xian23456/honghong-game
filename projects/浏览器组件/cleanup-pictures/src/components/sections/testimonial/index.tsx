import { Section } from "@/components/layout/section";
import { Highlight, SectionHeading } from "@/components/layout/section-heading";
import { TestimonialCard } from "@/components/sections/testimonial/testimonial-card";
import { testimonials } from "@/lib/data/testimonial";

/** 客户评价区块 */
export function TestimonialSection() {
  return (
    <Section>
      <div className="flex w-full flex-col items-center space-y-12 sm:space-y-24">
        <SectionHeading>
          What <Highlight className="text-white">experts</Highlight> say about
          Cleanup
        </SectionHeading>

        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </div>
    </Section>
  );
}
