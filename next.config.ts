import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Baseline hardening. Only HSTS was set before (Vercel supplies it); the
  // rest are absent, which the 2026-08-26 SEO audit flagged. CSP is
  // deliberately omitted here — it needs per-route work against the inline
  // JSON-LD and Humblytics, and a wrong one breaks the site silently.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
      {
        // The OG image route was showing up in Search Console as a crawled
        // page candidate. It is an asset, not a document.
        source: "/opengraph-image",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
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
      // The static-HTML site (pre-2026-04) shipped /about, and it is still
      // listed in the old sitemap Google crawls, so it shows up in Search
      // Console as one of the two "Not found (404)" URLs. The company story
      // now lives on /team, so point it there rather than leaving a 404.
      // The .html variants of the other legacy URLs (privacy/terms/
      // how-it-works) already 308 correctly via Vercel cleanUrls.
      {
        source: "/about",
        destination: "/team",
        permanent: true,
      },
      {
        source: "/about.html",
        destination: "/team",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
