import { getResource } from "@/lib/resources";
import { OG_SIZE, renderOgCard } from "@/lib/og-image";

export const alt = "RenewalEngineAI resource article";
export const size = OG_SIZE;
export const contentType = "image/png";

// Render on demand (cached by Vercel's edge) rather than pre-rendering
// every slug at build time. Satori's Node runtime is memory-hungry;
// build-time generation of many images in parallel can exhaust the
// build container. Per-slug first-request cost is ~200ms, then cached.
export default async function ResourceOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const resource = getResource(params.slug);
  if (!resource) {
    return renderOgCard({
      eyebrow: "Resource",
      title: "RenewalEngineAI",
      subtitle: "AI automation for independent insurance agencies.",
    });
  }

  return renderOgCard({
    eyebrow: resource.category,
    title: resource.title,
    subtitle: resource.description,
    badges: [
      { label: `${resource.readTime} min read`, tone: "emerald" },
      { label: resource.category, tone: "blue" },
    ],
  });
}
