import { Button } from "@/components/ui/button";
import { externalLinks } from "@/lib/data/site";
import type { PricingPlan } from "@/lib/types";

/** 套餐 CTA 按钮。Pro 计划用黑色胶囊，其他沿用外链 */
export function PricingCta({ plan }: { plan: PricingPlan }) {
  if (!plan.cta) return null;

  if (plan.cta.href) {
    return (
      <div className="mt-6 flex justify-center">
        <Button asChild>
          <a href={plan.cta.href} target="_blank" rel="noreferrer">
            {plan.cta.label}
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Button
        id="cleanup-subscribe-button"
        className="mt-6"
        onClick={() => window.open(externalLinks.clipdropPricing, "_blank")}
      >
        {plan.cta.label}
      </Button>
    </div>
  );
}
