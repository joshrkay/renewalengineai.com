import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        // Pricing lives in a section of the homepage, not a standalone route.
        // This is a permanent structural decision, so emit 308 rather than 307
        // — a temporary redirect tells Google to keep /pricing in the index and
        // re-crawl it indefinitely instead of consolidating signals onto "/".
        source: "/pricing",
        destination: "/#pricing",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
