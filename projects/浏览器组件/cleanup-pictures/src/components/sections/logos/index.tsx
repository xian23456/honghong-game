import { Section } from "@/components/layout/section";
import { Highlight, SectionHeading } from "@/components/layout/section-heading";
import { LogoItem } from "@/components/sections/logos/logo-item";
import { brandLogos } from "@/lib/data/logos";

/** 客户 Logo 墙 */
export function LogosSection() {
  return (
    <Section tone="primary">
      <SectionHeading>
        Powering the <Highlight>best creatives</Highlight>
      </SectionHeading>

      <div className="flex w-full flex-col items-center gap-8 mix-blend-multiply sm:mt-20 sm:flex-row sm:justify-evenly sm:gap-0">
        {brandLogos.map((logo) => (
          <LogoItem key={logo.name} logo={logo} />
        ))}
      </div>
    </Section>
  );
}
