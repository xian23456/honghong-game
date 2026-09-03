import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/data/site";

type LogoProps = {
  /** black = 浅色背景用；white = 深色背景（footer）用 */
  tone?: "black" | "white";
  className?: string;
  href?: string;
  /** false 时渲染成普通 div，方便外层自己包 <a> */
  asLink?: boolean;
};

/**
 * 站点文字 Logo。
 * 原站用的是 svg 字标，白色版本给 footer，黑色版本给 header。
 */
export function Logo({
  tone = "black",
  className,
  href = "/",
  asLink = true,
}: LogoProps) {
  const Wrapper = asLink ? Link : "div";
  const wrapperProps = asLink ? { href } : {};

  if (asLink) {
    return (
      <Link
        href={href}
        aria-label={siteConfig.name}
        className={cn("inline-flex shrink-0 items-center", className)}
      >
        <Image
          src={tone === "white" ? "/logo-white.svg" : "/logo.svg"}
          alt={siteConfig.name}
          width={423}
          height={104}
          priority
          className="h-8 w-auto md:h-10"
        />
      </Link>
    );
  }

  return (
    <div
      aria-label={siteConfig.name}
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      <Image
        src={tone === "white" ? "/logo-white.svg" : "/logo.svg"}
        alt={siteConfig.name}
        width={423}
        height={104}
        priority
        className="h-8 w-auto md:h-10"
      />
    </div>
  );
}
