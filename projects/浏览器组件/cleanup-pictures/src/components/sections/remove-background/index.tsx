import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { RemoveBackgroundCard } from "@/components/sections/remove-background/remove-background-card";

/** 底部推广：ClipDrop 的免费抠图 */
export function RemoveBackgroundSection() {
  return (
    <Section id="remove-background" tone="muted">
      <div className="flex w-full max-w-[760px] flex-col items-center">
        <SectionHeading className="text-3xl sm:text-5xl">
          Looking for the best background removal?
        </SectionHeading>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
          <RemoveBackgroundCard />
        </div>
      </div>
    </Section>
  );
}
