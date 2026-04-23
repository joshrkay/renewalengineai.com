import { getTeamMember, team } from "@/lib/team";
import { OG_SIZE, renderOgCard } from "@/lib/og-image";

export const alt = "RenewalEngineAI team member";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export default async function TeamOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const member = getTeamMember(params.slug);
  if (!member) {
    return renderOgCard({
      eyebrow: "Team",
      title: "RenewalEngineAI",
      subtitle: "The operators behind done-for-you AI for insurance agencies.",
    });
  }

  return renderOgCard({
    eyebrow: member.jobTitle,
    title: member.name,
    subtitle: member.shortBio,
    attribution: "RenewalEngineAI",
  });
}
