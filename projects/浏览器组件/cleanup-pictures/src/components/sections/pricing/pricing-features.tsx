import type { PricingPlan } from "@/lib/types";
import { cn } from "@/lib/utils";

/** 套餐功能列表 */
export function PricingFeatures({ plan }: { plan: PricingPlan }) {
  return (
    <ul className="mt-6 space-y-1 text-left text-sm marker:text-black/40 sm:list-inside sm:list-disc">
      {plan.features.map((feature) => (
        <li key={feature.label} className={cn(feature.muted && "opacity-50")}>
          {feature.href ? (
            <a href={feature.href} target="_blank" rel="noreferrer" className="underline">
              {feature.label}
            </a>
          ) : (
            feature.label
          )}
        </li>
      ))}
    </ul>
  );
}
