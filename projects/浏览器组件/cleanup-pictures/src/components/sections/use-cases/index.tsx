import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { UseCaseTabs } from "@/components/sections/use-cases/use-case-tabs";

/** Use-cases 区块：灰色背景 + 六个场景切换 */
export function UseCasesSection() {
  return (
    <Section id="usecases" tone="muted">
      <SectionHeading>Use-cases</SectionHeading>
      <UseCaseTabs />
    </Section>
  );
}
