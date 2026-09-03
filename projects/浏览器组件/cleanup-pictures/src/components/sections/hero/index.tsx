"use client";

import { Section } from "@/components/layout/section";
import { HeroDropzone } from "@/components/sections/hero/hero-dropzone";
import { HeroHeading } from "@/components/sections/hero/hero-heading";
import { HeroHint } from "@/components/sections/hero/hero-hint";

type HeroProps = {
  onFile: (file: File) => void;
};

/**
 * Hero：主色背景 + 大标题 + 上传区。
 * 原站整个页面都是放置目标，这里由 HomePage 统一接管，本组件只放显式上传入口。
 */
export function Hero({ onFile }: HeroProps) {
  return (
    <Section tone="primary" className="pt-16">
      <HeroHeading />
      <HeroHint />
      <HeroDropzone onFile={onFile} />
    </Section>
  );
}
