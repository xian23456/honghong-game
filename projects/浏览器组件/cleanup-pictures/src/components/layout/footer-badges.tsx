import Image from "next/image";

const PH_BADGE =
  "https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=316605&theme=dark&period=weekly";
const PH_URL =
  "https://www.producthunt.com/posts/cleanup-pictures?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-cleanup-pictures";
const FIX_URL =
  "https://fixthephoto.com/free-apps-to-remove-unwanted-objects-from-photo.html";

/** Footer 里的第三方徽章（Product Hunt / FixThePhoto） */
export function FooterBadges() {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-8">
      <a href={PH_URL} target="_blank" rel="noreferrer">
        <Image
          src={PH_BADGE}
          alt="CleanUp.Pictures - Remove objects and defects from your pictures - 100% free | Product Hunt"
          width={250}
          height={54}
          unoptimized
          style={{ width: 250, height: 54 }}
        />
      </a>
      <a href={FIX_URL} target="_blank" rel="noreferrer">
        <Image src="/fix.svg" alt="Fix" width={80} height={80} unoptimized />
      </a>
    </div>
  );
}
