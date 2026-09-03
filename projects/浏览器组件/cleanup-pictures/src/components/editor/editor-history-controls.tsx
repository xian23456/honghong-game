"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BRUSH_STEP, type ImageEditorApi } from "@/hooks/use-image-editor";
import { cn } from "@/lib/utils";
import { Eraser, Redo2, Trash2, Undo2 } from "lucide-react";

/** 撤销 / 重做 / 清除涂抹 */
export function EditorHistoryControls({ api }: { api: ImageEditorApi }) {
  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Undo"
            disabled={!api.canUndo}
            onClick={api.undo}
          >
            <Undo2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Undo (Ctrl/⌘ + Z)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Redo"
            disabled={!api.canRedo}
            onClick={api.redo}
          >
            <Redo2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redo (Ctrl/⌘ + Shift + Z)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Clear mask"
            disabled={!api.canUndo}
            onClick={api.clearMask}
          >
            <Trash2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Clear all strokes</TooltipContent>
      </Tooltip>

      <Button
        variant={api.eraseMode ? "primary" : "outline"}
        size="icon"
        aria-label="Eraser"
        aria-pressed={api.eraseMode}
        className={cn(api.eraseMode && "ring-2 ring-black ring-offset-1")}
        onClick={() => api.setEraseMode((prev) => !prev)}
      >
        <Eraser className="size-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="ml-1"
        disabled={!api.canUndo}
        onClick={() => api.setBrushSize((size) => Math.max(0.004, size - BRUSH_STEP))}
      >
        −
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={!api.canUndo}
        onClick={() => api.setBrushSize((size) => Math.min(0.06, size + BRUSH_STEP))}
      >
        +
      </Button>
    </div>
  );
}
