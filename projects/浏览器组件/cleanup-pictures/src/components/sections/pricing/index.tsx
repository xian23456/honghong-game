import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { PricingCard } from "@/components/sections/pricing/pricing-card";
import { pricingPlans } from "@/lib/data/pricing";

/** Pricing 区块：四档套餐并排，移动端可横向滚动 */
export function PricingSection() {
  return (
    <Section id="pricing">
      <div className="flex w-full flex-col items-center space-y-12">
        <SectionHeading>Pricing</SectionHeading>

        <div className="w-full overflow-x-auto pb-4">
          <div className="mx-auto flex min-w-[52em] justify-evenly gap-4 px-4 text-left">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
