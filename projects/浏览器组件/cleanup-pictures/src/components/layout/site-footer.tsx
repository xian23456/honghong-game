import { Logo } from "@/components/layout/logo";
import { FooterBadges } from "@/components/layout/footer-badges";
import { FooterMeta } from "@/components/layout/footer-meta";
import { externalLinks } from "@/lib/data/site";

/** 全站页脚：黑色背景 + Logo + 说明 + 徽章 */
export function SiteFooter() {
  return (
    <footer className="flex flex-col items-center gap-8 bg-black p-4 pt-12 text-center text-white">
      <a href={externalLinks.clipdrop} target="_blank" rel="noreferrer">
        <Logo tone="white" asLink={false} className="h-24" />
      </a>

      <FooterMeta />
      <FooterBadges />
    </footer>
  );
}
