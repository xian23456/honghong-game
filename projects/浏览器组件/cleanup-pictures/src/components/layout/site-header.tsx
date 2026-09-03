import { HeaderActions } from "@/components/layout/header-actions";
import { HeaderMobileMenu } from "@/components/layout/header-mobile-menu";
import { HeaderNav } from "@/components/layout/header-nav";
import { Logo } from "@/components/layout/logo";

/** 全站顶部导航：Logo + 锚点导航 + 登录/升级 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4">
        <Logo />

        <HeaderNav className="hidden md:flex" />

        <div className="flex items-center gap-1">
          <HeaderActions />
          <HeaderMobileMenu />
        </div>
      </div>
    </header>
  );
}
