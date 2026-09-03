"use client";

import { Dropzone } from "@/components/sections/hero/dropzone";

type HeroDropzoneProps = {
  onFile: (file: File) => void;
};

/** Hero 里的上传区 */
export function HeroDropzone({ onFile }: HeroDropzoneProps) {
  return (
    <Dropzone onFile={onFile} className="mt-8 w-full max-w-2xl">
      <span className="text-lg font-bold">
        Drop your image here, or click to upload
      </span>
      <span className="text-sm text-black/60">
        Free · No sign-up · Nothing uploaded to a server in demo mode
      </span>
    </Dropzone>
  );
}
