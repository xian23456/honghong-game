import type { Testimonial } from "@/lib/types";

/** 引用文字，其中一句用主色高亮 */
export function TestimonialQuote({ testimonial }: { testimonial: Testimonial }) {
  const { quote, highlight } = testimonial;

  return (
    <blockquote className="max-w-lg space-y-6 text-xl leading-relaxed">
      {quote.map((paragraph, index) => {
        // 命中 highlight 的段落里，把高亮句单独包一层主色背景
        if (highlight && paragraph.includes(highlight)) {
          const [before, after] = paragraph.split(highlight);
          return (
            <p key={index}>
              {before}
              <span className="bg-primary">{highlight}</span>
              {after}
            </p>
          );
        }
        return <p key={index}>{paragraph}</p>;
      })}
    </blockquote>
  );
}
