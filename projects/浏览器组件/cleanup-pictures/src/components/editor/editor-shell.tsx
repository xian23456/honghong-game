"use client";

import { useRef } from "react";

import { EditorCanvas } from "@/components/editor/editor-canvas";
import { EditorActions } from "@/components/editor/editor-actions";
import { BrushSizeControl } from "@/components/editor/brush-size-control";
import { EditorHistoryControls } from "@/components/editor/editor-history-controls";
import { EditorTopbar } from "@/components/editor/editor-topbar";
import { Separator } from "@/components/ui/separator";
import type { ImageEditorApi } from "@/hooks/use-image-editor";

/** 图片编辑器主界面 */
export function EditorShell({ api }: { api: ImageEditorApi }) {
  const baseRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLCanvasElement>(null);

  if (!api.image) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <EditorTopbar api={api} />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-[200px] flex-1">
              <BrushSizeControl api={api} />
            </div>
            <Separator
              orientation="vertical"
              className="hidden h-8 sm:block"
            />
            <EditorHistoryControls api={api} />
          </div>

          <EditorActions api={api} baseRef={baseRef} maskRef={maskRef} />
        </div>

        {api.error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {api.error}
          </p>
        ) : null}

        <EditorCanvas
          image={api.image}
          api={api}
          baseRef={baseRef}
          maskRef={maskRef}
        />

        {api.usedLocalFallback ? (
          <p className="text-center text-xs text-black/50">
            演示效果：未接入后端 AI，目前用的是本地兜底算法（结果会比较糊）；在服务器配置
            CLIPDROP_API_KEY 后即可调用真实 inpainting 接口。
          </p>
        ) : null}
      </div>
    </div>
  );
}
