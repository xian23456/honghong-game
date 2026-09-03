import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  /** bg-primary / bg-muted / 透明，对应原站的 block 配色 */
  tone?: "default" | "primary" | "muted" | "dark";
  className?: string;
  children: React.ReactNode;
};

const toneClass: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "bg-background",
  primary: "bg-primary",
  muted: "bg-muted",
  dark: "bg-black text-white",
};

/**
 * 页面区块容器。
 * 对应原站的 .homepage-block：上下大留白、内容水平居中。
 */
export function Section({ id, tone = "default", className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "flex w-full scroll-mt-24 flex-col items-center px-2 py-12 text-center md:px-4 md:py-28",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}
