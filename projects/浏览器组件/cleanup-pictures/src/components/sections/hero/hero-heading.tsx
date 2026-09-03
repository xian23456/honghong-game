import { Highlight, SectionHeading } from "@/components/layout/section-heading";

/** Hero 主标题 */
export function HeroHeading() {
  return (
    <SectionHeading className="max-w-4xl">
      Retouch images in seconds
      <br />
      with <Highlight className="text-primary">incredible quality</Highlight>
    </SectionHeading>
  );
}
