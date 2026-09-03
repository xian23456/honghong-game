import Image from "next/image";

import { cn } from "@/lib/utils";

type UseCaseImagesProps = {
  before?: string;
  after?: string;
  label: string;
};

/** Use-case 的对比图：before / after 两张并排（只有一张时单独居中展示） */
export function UseCaseImages({ before, after, label }: UseCaseImagesProps) {
  if (!before) return null;

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-5xl gap-4",
        after ? "flex-row" : "justify-center",
      )}
    >
      <div className="max-w-full flex-1 overflow-hidden rounded-md">
        <Image
          src={before}
          alt={`${label} usecase before`}
          width={800}
          height={600}
          className="h-auto w-full object-cover"
        />
      </div>

      {after ? (
        <div className="max-w-full flex-1 overflow-hidden rounded-md">
          <Image
            src={after}
            alt={`${label} usecase after`}
            width={800}
            height={600}
            className="h-auto w-full object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
