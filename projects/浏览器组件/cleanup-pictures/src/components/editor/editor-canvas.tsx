"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import type { ImageEditorApi, Point } from "@/hooks/use-image-editor";
import { cn } from "@/lib/utils";

const MAX_DIM = 1600;

/** 单点涂抹：画一个圆 */
function paintDot(
  ctx: CanvasRenderingContext2D,
  point: Point,
  radius: number,
  style: string,
) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = style;
  ctx.fill();
}

function paintLine(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  radius: number,
  style: string,
) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.lineWidth = radius * 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = style;
  ctx.stroke();
}

type EditorCanvasProps = {
  image: HTMLImageElement;
  api: ImageEditorApi;
  baseRef: RefObject<HTMLCanvasElement | null>;
  maskRef: RefObject<HTMLCanvasElement | null>;
};

/**
 * 编辑器画布：底层画原图，上层画涂抹遮罩。
 * 两个 canvas 尺寸一致，依靠 CSS 缩放铺满容器。
 */
export function EditorCanvas({ image, api, baseRef, maskRef }: EditorCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<{
    x: number;
    y: number;
    size: number;
    visible: boolean;
  }>({ x: 0, y: 0, size: 0, visible: false });

  const width = Math.min(MAX_DIM, image.naturalWidth);
  const height = Math.round((width / image.naturalWidth) * image.naturalHeight);
  const maxDim = Math.max(width, height);
  const radius = api.brushSize * maxDim;

  // 图片变化时重画底层
  useEffect(() => {
    const canvas = baseRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }, [image, baseRef]);

  // 笔划变化时重画遮罩
  useEffect(() => {
    const canvas = maskRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const stroke of api.strokes) {
      const strokeRadius = stroke.size * maxDim;
      ctx.globalCompositeOperation = stroke.erase
        ? "destination-out"
        : "source-over";
      const color = stroke.erase
        ? "rgba(0,0,0,1)"
        : `${api.maskColor}99`; // 约 0.6 透明度

      if (stroke.points.length === 1) {
        paintDot(ctx, stroke.points[0], strokeRadius, color);
        continue;
      }
      for (let i = 1; i < stroke.points.length; i++) {
        paintLine(ctx, stroke.points[i - 1], stroke.points[i], strokeRadius, color);
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }, [api.strokes, api.maskColor, maxDim, maskRef]);

  const toCanvasPoint = (event: React.PointerEvent): Point => {
    const canvas = maskRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative flex max-h-[68vh] w-full items-center justify-center overflow-hidden rounded-lg bg-[repeating-conic-gradient(#e5e5e5_0deg_90deg,#fafafa_90deg_180deg)] [background-size:24px_24px]"
    >
      <div className="relative inline-block max-h-[68vh]">
        <canvas
          ref={baseRef}
          width={width}
          height={height}
          className="block max-h-[68vh] w-auto max-w-full select-none"
          style={{ pointerEvents: "none" }}
        />
        <canvas
          ref={maskRef}
          width={width}
          height={height}
          className={cn(
            "absolute inset-0 block max-h-[68vh] w-auto max-w-full touch-none",
            api.eraseMode ? "cursor-cell" : "cursor-crosshair",
          )}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            api.beginStroke(toCanvasPoint(event));
          }}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const cssRadius = radius * (rect.width / width);
            setCursor({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              size: cssRadius,
              visible: true,
            });
            api.extendStroke(toCanvasPoint(event));
          }}
          onPointerUp={(event) => {
            event.currentTarget.releasePointerCapture(event.pointerId);
            api.endStroke();
          }}
          onPointerLeave={() => setCursor((prev) => ({ ...prev, visible: false }))}
        />

        {/* 笔刷光标预览 */}
        {cursor.visible ? (
          <div
            className="pointer-events-none absolute rounded-full border border-black/70"
            style={{
              width: cursor.size * 2,
              height: cursor.size * 2,
              left: cursor.x,
              top: cursor.y,
              transform: "translate(-50%, -50%)",
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
