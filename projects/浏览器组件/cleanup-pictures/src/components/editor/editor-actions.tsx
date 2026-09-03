"use client";

import { type RefObject } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { downloadDataUrl } from "@/lib/utils";

import type { ImageEditorApi } from "@/hooks/use-image-editor";

type EditorActionsProps = {
  api: ImageEditorApi;
  baseRef: RefObject<HTMLCanvasElement | null>;
  maskRef: RefObject<HTMLCanvasElement | null>;
};

/** 右侧主操作：擦除 / 下载 */
export function EditorActions({ api, baseRef, maskRef }: EditorActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {api.resultUrl ? (
        <Button
          variant="outline"
          onClick={() => downloadDataUrl(api.resultUrl!, `${api.fileName}-cleaned.png`)}
        >
          Download
        </Button>
      ) : null}

      <Button
        variant="primary"
        disabled={api.processing || !api.canUndo}
        onClick={() => api.runCleanup(baseRef.current, maskRef.current)}
      >
        {api.processing ? (
          <>
            <Spinner className="size-4" />
            Processing…
          </>
        ) : (
          "Erase"
        )}
      </Button>
    </div>
  );
}
