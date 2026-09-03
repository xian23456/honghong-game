"use client";

import { useEffect, useState } from "react";

/**
 * 整页拖放 + 粘贴上传。
 * 原站是「页面任意位置都能扔图片进去」，这里用 window 级监听复刻同样的手感。
 */
export function useGlobalFileDrop(onFile: (file: File) => void) {
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    let dragDepth = 0;

    const isImageDrag = (event: DragEvent) =>
      Array.from(event.dataTransfer?.types ?? []).includes("Files");

    const onDragEnter = (event: DragEvent) => {
      if (!isImageDrag(event)) return;
      dragDepth++;
      setDragging(true);
    };

    const onDragOver = (event: DragEvent) => {
      if (!isImageDrag(event)) return;
      event.preventDefault();
    };

    const onDragLeave = (event: DragEvent) => {
      if (!isImageDrag(event)) return;
      dragDepth = Math.max(0, dragDepth - 1);
      if (dragDepth === 0) setDragging(false);
    };

    const onDrop = (event: DragEvent) => {
      event.preventDefault();
      dragDepth = 0;
      setDragging(false);
      const file = event.dataTransfer?.files?.[0];
      if (file && file.type.startsWith("image/")) onFile(file);
    };

    const onPaste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.files ?? []).find((item) =>
        item.type.startsWith("image/"),
      );
      if (file) onFile(file);
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    window.addEventListener("paste", onPaste);

    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("paste", onPaste);
    };
  }, [onFile]);

  return dragging;
}
