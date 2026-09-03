"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/data/site";

/** 顶部导航链接，滚动到锚点；当前区块高亮 */
export function HeaderNav({ className }: { className?: string }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const targets = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((el): el is Element => Boolean(el));

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0.05, 0.25, 0.5] },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={cn("items-center gap-1", className)} aria-label="Main">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors hover:bg-black/5",
            active === link.href ? "text-black" : "text-black/60",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
