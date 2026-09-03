import type { PricingPlan } from "@/lib/types";
import { externalLinks } from "@/lib/data/site";

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "0",
    features: [
      { label: "Unlimited images" },
      { label: "Resolution limited to 720p" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "3",
    priceSuffix: "starting from",
    features: [
      { label: "Unlimited images" },
      { label: "Unlimited resolution" },
      { label: "High quality refiner" },
    ],
    cta: { label: "Try Free", variant: "dark" },
  },
  {
    id: "clipdrop-pro",
    name: "ClipDrop Pro",
    price: "11",
    priceSuffix: "starting from",
    highlighted: true,
    features: [
      { label: "Cleanup" },
      { label: "Remove background" },
      { label: "Replace background" },
      { label: "Uncrop" },
      { label: "Generative fill" },
      { label: "A lot of other tools", muted: true },
    ],
    cta: { label: "Try Free", variant: "dark", href: externalLinks.clipdropPricing },
  },
  {
    id: "api",
    name: "API",
    price: "Usage-based pricing",
    features: [{ label: "API documentation", href: "https://clipdrop.co/apis/docs/cleanup?utm_campaign=cleanup_pictures" }],
  },
];
