import { getCaseStudy } from "@/lib/case-studies";
import { OG_SIZE, renderOgCard } from "@/lib/og-image";

export const alt = "RenewalEngineAI case study";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function CaseStudyOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const caseStudy = getCaseStudy(params.slug);
  if (!caseStudy) {
    return renderOgCard({
      eyebrow: "Case study",
      title: "RenewalEngineAI",
      subtitle: "AI automation for independent insurance agencies.",
    });
  }

  return renderOgCard({
    eyebrow: `Case study · ${caseStudy.lineOfBusiness}`,
    title: caseStudy.title,
    subtitle: `${caseStudy.ams} · ${caseStudy.bookSizeLabel} book · ${caseStudy.policyCount}+ policies`,
    stats: caseStudy.headlineResults.slice(0, 3),
  });
}
