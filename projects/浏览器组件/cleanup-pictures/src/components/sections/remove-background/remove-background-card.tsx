import Image from "next/image";

import { Button } from "@/components/ui/button";
import { externalLinks } from "@/lib/data/site";

/** 抠图小图标（取自原站 inline svg） */
function ScissorsIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 48 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2941 6C7.92255 6 6 7.92255 6 10.2941C6 12.6657 7.92255 14.5883 10.2941 14.5883C11.4366 14.5883 12.4748 14.1421 13.2441 13.4146C13.2712 13.3853 13.2989 13.3564 13.3274 13.328C13.3559 13.2995 13.3848 13.2717 13.4142 13.2446C14.142 12.4752 14.5883 11.4368 14.5883 10.2941C14.5883 7.92255 12.6657 6 10.2941 6ZM19.3798 15.1378C20.151 13.6942 20.5883 12.0452 20.5883 10.2941C20.5883 4.60884 15.9794 0 10.2941 0C4.60884 0 0 4.60884 0 10.2941C0 15.9794 4.60884 20.5883 10.2941 20.5883C12.0449 20.5883 13.6935 20.1512 15.137 19.3803L20.6395 24.8827L15.1374 30.3848C13.6939 29.6137 12.0451 29.1765 10.2941 29.1765C4.60884 29.1765 0 33.7854 0 39.4707C0 45.1559 4.60884 49.7648 10.2941 49.7648C15.9794 49.7648 20.5883 45.1559 20.5883 39.4707C20.5883 37.7197 20.1511 36.0709 19.3801 34.6274L26.9651 27.0424C26.9781 27.0299 26.991 27.0172 27.0038 27.0044C27.0166 26.9916 27.0292 26.9787 27.0417 26.9657L46.4548 7.5527C47.6263 6.38112 47.6263 4.48163 46.4548 3.31006C45.2832 2.13848 43.3837 2.13848 42.2121 3.31006L24.8821 20.6401L19.3798 15.1378ZM13.2393 36.3456C13.2679 36.3767 13.2972 36.4073 13.3274 36.4375C13.3575 36.4676 13.3881 36.497 13.4192 36.5256C14.144 37.2944 14.5883 38.3306 14.5883 39.4707C14.5883 41.8422 12.6657 43.7648 10.2941 43.7648C7.92255 43.7648 6 41.8422 6 39.4707C6 37.0991 7.92255 35.1765 10.2941 35.1765C11.4342 35.1765 12.4704 35.6208 13.2393 36.3456ZM28.7645 28.7928C29.935 27.6201 31.8345 27.6184 33.0071 28.7889L46.4526 42.2101C47.6253 43.3806 47.627 45.2801 46.4565 46.4528C45.286 47.6254 43.3865 47.6271 42.2138 46.4566L28.7683 33.0354C27.5957 31.8649 27.594 29.9654 28.7645 28.7928Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** 底部「顺便试试抠图」的推广卡片 */
export function RemoveBackgroundCard() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Image
        src="/demo-remove-background.jpg"
        alt="Remove Background Free"
        width={224}
        height={224}
        className="size-56 rounded-xl object-cover"
      />

      <div className="flex items-center justify-center gap-2 text-2xl font-semibold text-black">
        <ScissorsIcon />
        <span>Remove Background</span>
      </div>

      <p className="max-w-[270px] text-center text-sm font-normal text-black/70">
        Remove the background of any image for free with incredible accuracy and
        ultra high-resolutions. Download your image with a transparent or white
        background.
      </p>

      <Button className="rounded-lg px-6 py-3" asChild>
        <a href={externalLinks.removeBackground} target="_blank" rel="noreferrer">
          Remove background
        </a>
      </Button>
    </div>
  );
}
