import { Spinner } from "@/components/ui/spinner";

/** 处理中的全屏遮罩 */
export function ProcessingOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/70 backdrop-blur-sm">
      <Spinner className="size-8" />
      <p className="text-sm font-semibold text-black/70">
        Reconstructing what was behind…(正在重建被遮住的内容)
      </p>
    </div>
  );
}
