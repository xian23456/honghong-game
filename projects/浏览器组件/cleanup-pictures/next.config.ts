import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // public/ 里放了 svg logo（站点字标、客户 logo），需要显式允许
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      { protocol: "https", hostname: "api.producthunt.com" },
      { protocol: "https", hostname: "fixthephoto.com" },
    ],
  },
};

export default nextConfig;
