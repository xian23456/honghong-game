import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { externalLinks } from "@/lib/data/site";

/** API 区块：示意图 + 一句话介绍 + 文档入口 */
export function ApiSection() {
  return (
    <Section id="api">
      <div className="flex w-full max-w-4xl flex-col items-center space-y-12">
        <SectionHeading>API</SectionHeading>

        <div className="w-full overflow-hidden rounded-xl">
          <Image
            src="/usecases/api.jpg"
            alt="API Usecase"
            width={1200}
            height={700}
            className="h-auto w-full"
          />
        </div>

        <p className="text-xl">
          Use cleanup&apos;s high-quality &amp; high availability inpainting API
          in your product today.
        </p>

        <Button size="lg" className="rounded-xl px-10" asChild>
          <a href={externalLinks.apiDocs} target="_blank" rel="noreferrer">
            API documentation
          </a>
        </Button>
      </div>
    </Section>
  );
}
