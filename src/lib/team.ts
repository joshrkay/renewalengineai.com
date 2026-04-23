/**
 * Canonical team/author data for schema.org Person markup and /team/[slug] pages.
 *
 * This is the single source of truth for author bylines on articles,
 * course `instructor` references in Course schema, and `reviewedBy` on
 * Article JSON-LD. Adding `sameAs` URLs to LinkedIn / X / etc. is the
 * single highest-leverage E-E-A-T signal we can ship.
 */

export type TeamMember = {
  slug: string;
  name: string;
  jobTitle: string;
  /** One or two sentences for list pages and schema description. */
  shortBio: string;
  /** Multi-paragraph markdown body for the /team/[slug] page. */
  longBio: string;
  /** LinkedIn, X, GitHub, Crunchbase, licensing-body lookups, etc. */
  sameAs: string[];
  /** Topics the author is credibly expert in — schema:knowsAbout. */
  knowsAbout: string[];
  email?: string;
};

export const team: TeamMember[] = [
  {
    slug: "josh-kay",
    name: "Josh Kay",
    jobTitle: "Founder",
    shortBio:
      "Founder of RenewalEngineAI. Builds done-for-you AI automation for independent insurance agencies — renewal campaigns, instant lead response, and AMS integration.",
    longBio: `Josh founded RenewalEngineAI to close the gap between the AI tooling insurance agency owners read about and the AI systems actually running inside their books.

He spends most of his time inside Applied Epic, HawkSoft, and EZLynx agencies — auditing renewal workflows, building outreach automations, and tuning the classifiers that decide which clients get a text, an email, or a producer call. The service is deliberately done-for-you: agencies pay for outcomes, not for another CRM they have to learn.

Before RenewalEngineAI, Josh built AI-powered workflow systems for operations-heavy teams and shipped ML-driven retention tools at scale. He writes most of the content on this site, reviews everything the weekly content engine drafts, and personally runs the audit engagements.

If you want to talk about AI in your agency, the fastest way is [booking the free audit call](/#pricing).`,
    sameAs: [
      "https://www.linkedin.com/in/joshrkay",
      "https://www.linkedin.com/company/renewalengineai",
    ],
    knowsAbout: [
      "AI automation for insurance agencies",
      "Insurance renewal retention",
      "Applied Epic",
      "HawkSoft CMS",
      "EZLynx",
      "Agency operations",
      "Lead response automation",
      "Prompt engineering for insurance workflows",
    ],
    email: "hello@renewalengineai.com",
  },
];

export function getTeamMember(slug: string): TeamMember | undefined {
  return team.find((t) => t.slug === slug);
}

/**
 * Canonical Person @id referenced from Article, Course, and Organization
 * schemas so entity resolution stitches everything to the same node.
 */
export function personJsonLdId(slug: string): string {
  return `https://renewalengineai.com/team/${slug}#Person`;
}

export function personJsonLd(member: TeamMember) {
  return {
    "@type": "Person",
    "@id": personJsonLdId(member.slug),
    name: member.name,
    url: `https://renewalengineai.com/team/${member.slug}`,
    jobTitle: member.jobTitle,
    description: member.shortBio,
    knowsAbout: member.knowsAbout,
    sameAs: member.sameAs,
    worksFor: {
      "@type": "Organization",
      "@id": "https://renewalengineai.com#Organization",
      name: "RenewalEngineAI",
    },
    ...(member.email ? { email: `mailto:${member.email}` } : {}),
  };
}
