import Image from "next/image";

import type { BrandLogo } from "@/lib/types";

/** 单个客户 Logo */
export function LogoItem({ logo }: { logo: BrandLogo }) {
  return (
    <a
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-opacity hover:opacity-70"
    >
      <Image
        src={logo.src}
        alt={logo.name}
        width={200}
        height={logo.height}
        style={{ height: logo.height, width: "auto" }}
        className="w-auto object-contain"
      />
    </a>
  );
}
