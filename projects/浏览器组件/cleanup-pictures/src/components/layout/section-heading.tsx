import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** 支持传入 ReactNode 以便插入 <span className="highlight"> 胶囊高亮 */
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
};

/** 区块大标题，原站统一 text-4xl sm:text-6xl + font-alt */
export function SectionHeading({
  children,
  className,
  as: Tag = "h1",
}: SectionHeadingProps) {
  return (
    <Tag
      className={cn(
        "font-display text-4xl leading-tight sm:text-6xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** 正文里用的主色胶囊高亮（FAQ 里的 no size limit / free 等） */
export function Marker({ children }: { children: React.ReactNode }) {
  return <span className="marker">{children}</span>;
}

/** 标题里的黑色胶囊高亮 */
export function Highlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("highlight", className)}>{children}</span>;
}
