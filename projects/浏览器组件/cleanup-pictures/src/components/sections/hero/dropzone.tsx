"use client";

import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

import { cn } from "@/lib/utils";

const ACCEPTED = "image/png,image/jpeg,image/webp,image/avif";

type DropzoneProps = {
  onFile: (file: File) => void;
  className?: string;
  children?: React.ReactNode;
};

/**
 * 可复用的图片拖放 / 点击上传区域。
 * 只负责「拿到 File」并回调出去，不做任何业务处理。
 */
export function Dropzone({ onFile, className, children }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) onFile(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        "group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-black/25 bg-white/70 px-6 py-12 text-center transition-colors",
        "hover:border-black/50 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
        dragging && "border-black bg-primary/40",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-primary transition-transform group-hover:scale-110">
        <ImagePlus className="size-6 text-black" />
      </span>

      {children ?? (
        <>
          <span className="text-lg font-bold">
            Drop your image here, or click to upload
          </span>
          <span className="text-sm text-black/60">
            PNG, JPG, WEBP — you can also paste from clipboard (⌘/Ctrl + V)
          </span>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}

export { ACCEPTED };
