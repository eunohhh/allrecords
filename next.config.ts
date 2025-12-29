import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "htjzfdsizwacysfiwjcd.supabase.co",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    dangerouslyAllowSVG: true,
    // loader: "custom",
    // loaderFile: "./loader.ts",
    qualities: [40, 50, 60, 75],
  },
};

export default nextConfig;
