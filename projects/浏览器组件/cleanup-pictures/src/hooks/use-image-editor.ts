"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { inpaintLocally } from "@/lib/inpaint";

export type Point = { x: number; y: number };

/** 一次连续的涂抹。size 是相对于图片长边的比例，保证不同分辨率下手感一致 */
export type Stroke = {
  id: string;
  size: number;
  erase: boolean;
  points: Point[];
};

/** 笔刷半径占图片长边的比例 */
export const BRUSH_MIN = 0.004;
export const BRUSH_MAX = 0.06;
export const BRUSH_STEP = 0.002;

const MASK_COLOR = "#bdff01";

function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("结果图片加载失败"));
    img.src = url;
  });
}

/** 把遮罩层的 alpha 通道抽成 0/1 数组 */
function maskToBinary(canvas: HTMLCanvasElement): Uint8Array {
  const ctx = canvas.getContext("2d");
  if (!ctx) return new Uint8Array(canvas.width * canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const result = new Uint8Array(canvas.width * canvas.height);
  for (let i = 0; i < result.length; i++) {
    result[i] = data[i * 4 + 3] > 20 ? 1 : 0;
  }
  return result;
}

/**
 * 图片编辑器的全部状态与操作。
 * 只管数据，不管 DOM —— canvas 由调用方通过 ref 传进来。
 */
export function useImageEditor() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState("image");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [brushSize, setBrushSize] = useState(0.02);
  const [eraseMode, setEraseMode] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [usedLocalFallback, setUsedLocalFallback] = useState(false);

  const drawingRef = useRef(false);
  const activeStrokeRef = useRef<Stroke | null>(null);

  const loadFile = useCallback(async (file: File) => {
    setError(null);
    setResultUrl(null);
    setStrokes([]);
    setRedoStack([]);
    setUsedLocalFallback(false);

    const url = URL.createObjectURL(file);
    try {
      const img = await loadImageFromUrl(url);
      setImage(img);
      setFileName(file.name.replace(/\.[^.]+$/, "") || "image");
    } catch {
      setError("这张图片读不出来，换一张试试");
    } finally {
      URL.revokeObjectURL(url);
    }
  }, []);

  const beginStroke = useCallback(
    (point: Point) => {
      drawingRef.current = true;
      const stroke: Stroke = {
        id: `${Date.now()}-${Math.random()}`,
        size: brushSize,
        erase: eraseMode,
        points: [point],
      };
      activeStrokeRef.current = stroke;
      setStrokes((prev) => [...prev, stroke]);
      setRedoStack([]);
    },
    [brushSize, eraseMode],
  );

  const extendStroke = useCallback((point: Point) => {
    if (!drawingRef.current || !activeStrokeRef.current) return;
    const point2 = point;
    const stroke = activeStrokeRef.current;
    stroke.points.push(point2);
    // 触发一次重绘
    setStrokes((prev) => {
      const next = prev.slice();
      next[next.length - 1] = { ...stroke, points: stroke.points.slice() };
      return next;
    });
  }, []);

  const endStroke = useCallback(() => {
    drawingRef.current = false;
    activeStrokeRef.current = null;
  }, []);

  const undo = useCallback(() => {
    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setRedoStack((redo) => [...redo, last]);
      return prev.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setRedoStack((redo) => {
      if (redo.length === 0) return redo;
      const next = redo[redo.length - 1];
      setStrokes((prev) => [...prev, next]);
      return redo.slice(0, -1);
    });
  }, []);

  const clearMask = useCallback(() => {
    setStrokes([]);
    setRedoStack([]);
  }, []);

  const reset = useCallback(() => {
    setImage(null);
    setStrokes([]);
    setRedoStack([]);
    setResultUrl(null);
    setError(null);
    setUsedLocalFallback(false);
  }, []);

  const runCleanup = useCallback(
    async (baseCanvas: HTMLCanvasElement | null, maskCanvas: HTMLCanvasElement | null) => {
      if (!baseCanvas || !maskCanvas) return;

      const mask = maskToBinary(maskCanvas);
      const hasMask = mask.some((value) => value === 1);
      if (!hasMask) {
        setError("先用笔刷涂掉想删除的部分，再点擦除");
        return;
      }

      setProcessing(true);
      setError(null);

      try {
        const imageUrl = baseCanvas.toDataURL("image/png");
        const maskUrl = maskCanvas.toDataURL("image/png");

        let nextUrl: string;
        let fallback = false;

        const response = await fetch("/api/cleanup", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ image: imageUrl, mask: maskUrl }),
        });

        if (response.ok) {
          nextUrl = URL.createObjectURL(await response.blob());
        } else {
          fallback = true;
          const ctx = baseCanvas.getContext("2d");
          if (!ctx) throw new Error("无法读取画布内容");
          const source = ctx.getImageData(0, 0, baseCanvas.width, baseCanvas.height);
          const output = inpaintLocally(source, mask);
          const outCanvas = document.createElement("canvas");
          outCanvas.width = output.width;
          outCanvas.height = output.height;
          outCanvas.getContext("2d")?.putImageData(output, 0, 0);
          nextUrl = outCanvas.toDataURL("image/png");
        }

        const nextImage = await loadImageFromUrl(nextUrl);
        setImage(nextImage);
        setStrokes([]);
        setRedoStack([]);
        setResultUrl(nextUrl);
        setUsedLocalFallback(fallback);
      } catch {
        setError("处理失败，请重试或换一张更小的图片");
      } finally {
        setProcessing(false);
      }
    },
    [],
  );

  // 撤销/重做快捷键
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.key.toLowerCase() !== "z") return;
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  return {
    image,
    fileName,
    strokes,
    canUndo: strokes.length > 0,
    canRedo: redoStack.length > 0,
    brushSize,
    eraseMode,
    processing,
    error,
    resultUrl,
    usedLocalFallback,
    maskColor: MASK_COLOR,
    setBrushSize,
    setEraseMode,
    loadFile,
    beginStroke,
    extendStroke,
    endStroke,
    undo,
    redo,
    clearMask,
    runCleanup,
    reset,
  };
}

export type ImageEditorApi = ReturnType<typeof useImageEditor>;
