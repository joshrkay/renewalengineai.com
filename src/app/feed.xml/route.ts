import { NextResponse } from "next/server";
import { listResources } from "@/lib/resources";
import { listCaseStudies } from "@/lib/case-studies";

const SITE_URL = "https://renewalengineai.com";

export const dynamic = "force-static";
export const revalidate = 3600;

function escXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const resources = listResources().map((r) => ({
    title: r.title,
    description: r.description,
    link: `${SITE_URL}/resources/${r.slug}`,
    pubDate: r.updatedAt ?? r.publishedAt,
    category: r.category,
  }));

  const caseStudies = listCaseStudies().map((c) => ({
    title: c.title,
    description: c.description,
    link: `${SITE_URL}/case-studies/${c.slug}`,
    pubDate: c.updatedAt ?? c.publishedAt,
    category: c.lineOfBusiness,
  }));

  const items = [...resources, ...caseStudies].sort((a, b) =>
    a.pubDate < b.pubDate ? 1 : -1
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>RenewalEngineAI — Insurance Agency AI Automation</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>AI automation guides, case studies, and resources for independent insurance agencies running on Applied Epic, HawkSoft, or EZLynx.</description>
    <language>en-US</language>
    <managingEditor>hello@renewalengineai.com (Josh Kay)</managingEditor>
    <dc:creator>Josh Kay</dc:creator>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>1440</ttl>
${items
  .map(
    (item) => `    <item>
      <title>${escXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <description>${escXml(item.description)}</description>
      <category>${escXml(item.category)}</category>
      <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
      <dc:creator>Josh Kay</dc:creator>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
