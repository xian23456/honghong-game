import Link from "next/link";

import { footerLinks, siteConfig } from "@/lib/data/site";

/** Footer 底部一行：版权 + 条款 / 隐私链接 */
export function FooterMeta() {
  return (
    <div className="pt-8 text-sm text-white/70">
      <p>
        <Link href="/" className="underline-offset-2 hover:underline">
          {siteConfig.name}
        </Link>
        &nbsp;is a web application that lets you cleanup photos with a quick &amp;
        simple interface.
      </p>
      <p className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        <span>{siteConfig.copyright}</span>
        {footerLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </p>
    </div>
  );
}
