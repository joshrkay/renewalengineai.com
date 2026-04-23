import { getComparison, listComparisons } from "@/lib/comparisons";
import { OG_SIZE, renderOgCard } from "@/lib/og-image";

export const alt = "RenewalEngineAI comparison";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return listComparisons().map((c) => ({ slug: c.slug }));
}

export default async function ComparisonOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const comparison = getComparison(params.slug);
  if (!comparison) {
    return renderOgCard({
      eyebrow: "Compare",
      title: "RenewalEngineAI",
      subtitle: "AI automation for independent insurance agencies.",
    });
  }

  return renderOgCard({
    eyebrow: `vs. ${comparison.competitor}`,
    title: comparison.title,
    subtitle: comparison.tagline,
    badges: [
      { label: `${comparison.readTime} min read`, tone: "emerald" },
      { label: `vs. ${comparison.competitor}`, tone: "blue" },
    ],
  });
}
