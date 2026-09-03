import Image from "next/image";

import type { Testimonial } from "@/lib/types";

/** 客户头像 + 姓名 + 职位 */
export function TestimonialAuthor({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex flex-col pt-8 md:pt-0">
      <Image
        src={testimonial.avatar}
        alt={testimonial.name}
        width={180}
        height={180}
        className="size-32 rounded-full object-cover md:size-44"
      />
      <h3 className="pt-4 text-2xl font-extrabold">{testimonial.name}</h3>
      <p className="text-sm text-black/60">{testimonial.role}</p>
    </div>
  );
}
