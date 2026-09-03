export type UseCaseKey =
  | "photo"
  | "agency"
  | "realestate"
  | "ecomm"
  | "watermark"
  | "api";

export type UseCase = {
  key: UseCaseKey;
  label: string;
  /** 对比图（before / after），API 只有一张 */
  before?: string;
  after?: string;
  /** 描述文案，一个元素 = 一个段落 */
  paragraphs: string[];
  /** 段落末尾的可选行内链接（API 那条用到） */
  link?: { label: string; href: string; suffix?: string };
};

export type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  /** 段落数组 */
  quote: string[];
  /** 需要在引用中高亮的片段 */
  highlight?: string;
};

export type BrandLogo = {
  name: string;
  src: string;
  href: string;
  /** logo 高度（px），保持原站参差不齐的视觉节奏 */
  height: number;
};

export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  priceSuffix?: string;
  features: { label: string; muted?: boolean; href?: string }[];
  cta?: { label: string; href?: string; variant: "dark" | "ghost" };
  highlighted?: boolean;
};

export type FaqItem = {
  question: string;
  /** 段落数组，支持简单的 <a> 链接语法（用 {link} 占位在组件里处理） */
  answer: AnswerBlock[];
};

export type AnswerBlock = {
  /** 纯文本段落，或 rich 片段数组 */
  segments: AnswerSegment[];
};

export type AnswerSegment =
  | { type: "text"; value: string }
  | { type: "highlight"; value: string }
  | { type: "link"; value: string; href: string }
  | { type: "image"; src: string; alt: string };

export type NavLink = {
  label: string;
  href: string;
};
