import Image from "next/image";

import { Marker } from "@/components/layout/section-heading";
import type { AnswerBlock, AnswerSegment } from "@/lib/types";

/** 渲染一个片段：普通文本 / 主色胶囊 / 链接 / 插图 */
function Segment({ segment }: { segment: AnswerSegment }) {
  switch (segment.type) {
    case "highlight":
      return <Marker>{segment.value}</Marker>;
    case "link":
      return (
        <a href={segment.href} target="_blank" rel="noreferrer" className="underline">
          {segment.value}
        </a>
      );
    case "image":
      return (
        <Image
          src={segment.src}
          alt={segment.alt}
          width={240}
          height={160}
          className="my-2 inline-block w-60 rounded-lg"
        />
      );
    default:
      return <>{segment.value}</>;
  }
}

/** FAQ 答案：支持多个段落，段落内可混排文本 / 高亮 / 链接 / 图片 */
export function FaqAnswer({ blocks }: { blocks: AnswerBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <p key={index}>
          {block.segments.map((segment, segIndex) => (
            <Segment key={segIndex} segment={segment} />
          ))}
        </p>
      ))}
    </div>
  );
}
