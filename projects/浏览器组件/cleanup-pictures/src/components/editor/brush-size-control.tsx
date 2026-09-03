"use client";

import { Slider } from "@/components/ui/slider";
import { BRUSH_MAX, BRUSH_MIN, type ImageEditorApi } from "@/hooks/use-image-editor";

/** 笔刷大小调节 */
export function BrushSizeControl({ api }: { api: ImageEditorApi }) {
  return (
    <div className="flex w-full items-center gap-3">
      <span className="whitespace-nowrap text-sm font-semibold">Brush</span>
      <Slider
        min={BRUSH_MIN}
        max={BRUSH_MAX}
        step={0.001}
        value={[api.brushSize]}
        onValueChange={([value]) => api.setBrushSize(value)}
        className="flex-1"
        aria-label="Brush size"
      />
      <span className="w-12 text-right text-xs tabular-nums text-black/60">
        {Math.round(api.brushSize * 1000)}px
      </span>
    </div>
  );
}
