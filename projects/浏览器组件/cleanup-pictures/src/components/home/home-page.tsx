"use client";

import { useEffect } from "react";

import { EditorShell } from "@/components/editor/editor-shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ApiSection } from "@/components/sections/api";
import { BeforeAfterSection } from "@/components/sections/before-after";
import { FaqSection } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { LogosSection } from "@/components/sections/logos";
import { PricingSection } from "@/components/sections/pricing";
import { RemoveBackgroundSection } from "@/components/sections/remove-background";
import { TestimonialSection } from "@/components/sections/testimonial";
import { UseCasesSection } from "@/components/sections/use-cases";
import { useImageEditor } from "@/hooks/use-image-editor";

/**
 * 首页编排：
 * - 没有图片时展示完整营销页；
 * - 一旦拖入 / 选择 / 粘贴图片，整页切换为编辑器（对应原站 .editor .homepage {display:none}）；
 * - 整页都是拖放目标，并支持 Ctrl/⌘ + V 粘贴图片。
 */
export function HomePage() {
  const api = useImageEditor();

  useEffect(() => {
    const onDragOver = (event: DragEvent) => event.preventDefault();

    const onDrop = (event: DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer?.files?.[0];
      if (file && file.type.startsWith("image/")) api.loadFile(file);
    };

    const onPaste = (event: ClipboardEvent) => {
      const item = Array.from(event.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith("image/"),
      );
      if (!item) return;
      const file = item.getAsFile();
      if (file) api.loadFile(file);
    };

    window.addEventListener("dragover", onDragOver);
    window.addEventListener("drop", onDrop);
    window.addEventListener("paste", onPaste);

    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("paste", onPaste);
    };
  }, [api]);

  if (api.image) {
    return <EditorShell api={api} />;
  }

  return (
    <>
      <SiteHeader />
      <main className="homepage flex flex-col">
        <Hero onFile={api.loadFile} />
        <BeforeAfterSection />
        <UseCasesSection />
        <TestimonialSection />
        <LogosSection />
        <PricingSection />
        <ApiSection />
        <FaqSection />
        <RemoveBackgroundSection />
      </main>
      <SiteFooter />
    </>
  );
}
