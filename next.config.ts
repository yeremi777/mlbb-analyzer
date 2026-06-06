import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "akmweb.youngjoygame.com",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
