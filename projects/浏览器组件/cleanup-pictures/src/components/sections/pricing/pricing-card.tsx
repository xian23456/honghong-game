import { Badge } from "@/components/ui/badge";
import { PricingCta } from "@/components/sections/pricing/pricing-cta";
import { PricingFeatures } from "@/components/sections/pricing/pricing-features";
import { PricingPrice } from "@/components/sections/pricing/pricing-price";
import type { PricingPlan } from "@/lib/types";
import { cn } from "@/lib/utils";

/** 单个套餐卡片 */
export function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={cn(
        "flex w-56 flex-col items-center px-1 py-3",
        plan.highlighted && "-mt-2 w-64 rounded-xl bg-gray-200 px-1 py-3",
      )}
    >
      <Badge variant={plan.price === "0" || plan.id === "api" ? "default" : "primary"}>
        {plan.name}
      </Badge>

      <PricingPrice price={plan.price} suffix={plan.priceSuffix} />
      <PricingFeatures plan={plan} />
      <PricingCta plan={plan} />
    </div>
  );
}
