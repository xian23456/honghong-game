import type { NavLink } from "@/lib/types";

export const siteConfig = {
  name: "Cleanup.pictures",
  tagline: "Remove objects, people, text and defects from any picture for free",
  description:
    "Remove unwanted objects from photos, people, text, and defects from any picture for free. It's extremely easy in just a few clicks with our creative editing tool.",
  copyright: "©2022 Init ML",
  madeBy: "Init ML",
} as const;

export const navLinks: NavLink[] = [
  { label: "Use-cases", href: "#usecases" },
  { label: "Pricing", href: "#pricing" },
  { label: "API", href: "#api" },
  { label: "FAQ", href: "#faq" },
];

export const footerLinks: NavLink[] = [
  { label: "Terms & Services", href: "https://clipdrop.co/terms" },
  { label: "Privacy Policy", href: "https://clipdrop.co/privacy" },
];

export const externalLinks = {
  clipdrop: "https://clipdrop.co?utm_campaign=cleanup_pictures",
  apiDocs: "https://clipdrop.co/apis/docs/cleanup?utm_campaign=cleanup_pictures",
  clipdropPricing:
    "https://clipdrop.co/pricing?openSubscriptionModal=true&defaultPlan=year&cancelUrl=https://cleanup.pictures/&successUrl=https://cleanup.pictures/",
  removeBackground: "https://clipdrop.co/remove-background?utm_campaign=cleanup_pictures",
} as const;
