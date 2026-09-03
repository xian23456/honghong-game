"use client";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import type { ImageEditorApi } from "@/hooks/use-image-editor";

/** 编辑器顶部条：Logo + 新建图片 */
export function EditorTopbar({ api }: { api: ImageEditorApi }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/10 bg-white/90 px-4 py-3 backdrop-blur">
      <Logo href="#" />
      <div className="flex items-center gap-2">
        {api.usedLocalFallback ? (
          <span className="hidden text-xs text-black/50 sm:inline">Demo result</span>
        ) : null}
        <Button variant="ghost" size="sm" onClick={api.reset}>
          New image
        </Button>
      </div>
    </header>
  );
}
