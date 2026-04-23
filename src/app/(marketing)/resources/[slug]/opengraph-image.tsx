import { getResource, listResources } from "@/lib/resources";
import { OG_SIZE, renderOgCard } from "@/lib/og-image";

export const alt = "RenewalEngineAI resource article";
export const size = OG_SIZE;
export const contentType = "image/png";

// Pre-render OG images alongside the page at build time so the
// image URL (used in Article JSON-LD) is stable and cacheable.
export function generateStaticParams() {
  return listResources().map((r) => ({ slug: r.slug }));
}

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
