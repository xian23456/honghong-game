import { Button } from "@/components/ui/button";
import { externalLinks } from "@/lib/data/site";

/** Header 右侧操作区：登录 + 升级 Pro */
export function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
        Log in
      </Button>
      <Button size="sm" asChild>
        <a href={externalLinks.clipdropPricing} target="_blank" rel="noreferrer">
          Try Pro
        </a>
      </Button>
    </div>
  );
}
