"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/data/site";
import { cn } from "@/lib/utils";

/** 移动端折叠导航 */
export function HeaderMobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      <div
        className={cn(
          "absolute left-0 right-0 top-full origin-top border-b border-black/10 bg-white/95 px-4 pb-4 shadow-lg backdrop-blur",
          open ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col py-2" aria-label="Mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
