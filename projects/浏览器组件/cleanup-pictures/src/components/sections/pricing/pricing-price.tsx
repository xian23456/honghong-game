import { cn } from "@/lib/utils";

type PricingPriceProps = {
  price: string;
  suffix?: string;
};

/** 大号价格。数字型价格前面带一个缩小的 $ 符号 */
export function PricingPrice({ price, suffix }: PricingPriceProps) {
  const isNumeric = /^\d+$/.test(price);

  if (!isNumeric) {
    return (
      <p className="flex h-[148px] items-center px-4 text-center text-2xl font-extrabold leading-snug md:h-[236px] md:text-4xl">
        {price}
      </p>
    );
  }

  return (
    <p className="relative text-center text-[4rem] font-extrabold leading-none md:text-[10rem]">
      <span className="absolute -left-6 -top-1 text-[0.3em] md:-left-12 md:-top-6">
        $
      </span>
      {price}
      {suffix ? (
        <span className="absolute -right-4 top-2 w-24 text-left text-[0.09em] font-semibold leading-tight text-black/70 md:-right-16 md:top-4 md:w-32 md:text-[0.08em]">
          {suffix}
        </span>
      ) : null}
    </p>
  );
}
