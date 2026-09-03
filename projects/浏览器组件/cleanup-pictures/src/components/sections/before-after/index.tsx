import Image from "next/image";

/**
 * 首页 Hero 下面那张 before / after 对比图。
 * 原站直接放一张 700x731 的合成图，这里保持同样处理。
 */
export function BeforeAfterSection() {
  return (
    <div className="m-6 flex w-full justify-center p-2 md:m-14">
      <Image
        src="/before-after.jpg"
        alt="Cleanup example"
        width={700}
        height={731}
        priority
        className="h-auto w-full max-w-[700px] rounded-2xl"
      />
    </div>
  );
}
