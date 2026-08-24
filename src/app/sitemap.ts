import type { MetadataRoute } from "next";
import { listCourses } from "@/lib/courses";
import { listResources } from "@/lib/resources";
import { listCaseStudies } from "@/lib/case-studies";
import { listComparisons } from "@/lib/comparisons";
import { listGlossaryTerms } from "@/lib/glossary";
import { listIntegrations } from "@/lib/integrations";
import { team } from "@/lib/team";

const SITE_URL = "https://renewalengineai.com";

// Date of the last hand-edit to the static marketing pages. Bump deliberately
// when the copy on those pages actually changes.
const STATIC_PAGES_UPDATED = new Date("2026-04-23");

// `lastmod` must be derived from content, never from `new Date()` at build
// time: a timestamp that moves on every deploy tells Google the whole site
// changed on every deploy, and it responds by distrusting the signal entirely.
function latest(dates: (string | undefined)[], fallback: Date): Date {
  const parsed = dates
    .filter((d): d is string => Boolean(d))
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()));
  if (parsed.length === 0) return fallback;
  return new Date(Math.max(...parsed.map((d) => d.getTime())));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const resources = listResources();
  const caseStudies = listCaseStudies();
  const comparisons = listComparisons();
  const courses = listCourses();
  const glossary = listGlossaryTerms();
  const integrations = listIntegrations();

  const resourcesUpdated = latest(
    resources.flatMap((r) => [r.updatedAt, r.publishedAt]),
    STATIC_PAGES_UPDATED
  );
  const caseStudiesUpdated = latest(
    caseStudies.flatMap((c) => [c.updatedAt, c.publishedAt]),
    STATIC_PAGES_UPDATED
  );
  const comparisonsUpdated = latest(
    comparisons.flatMap((c) => [c.updatedAt, c.publishedAt]),
    STATIC_PAGES_UPDATED
  );
  const coursesUpdated = latest(
    courses.map((c) => c.updatedAt),
    STATIC_PAGES_UPDATED
  );
  const glossaryUpdated = latest(
    glossary.map((t) => t.updatedAt),
    STATIC_PAGES_UPDATED
  );
  const integrationsUpdated = latest(
    integrations.flatMap((i) => [i.updatedAt, i.publishedAt]),
    STATIC_PAGES_UPDATED
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/how-it-works`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/for-independent-agencies`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/resources`, lastModified: resourcesUpdated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/case-studies`, lastModified: caseStudiesUpdated, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/compare`, lastModified: comparisonsUpdated, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/integrations`, lastModified: integrationsUpdated, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/glossary`, lastModified: glossaryUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/guides/5-ai-automations`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    // Lead-magnet landing pages: indexable (robots index:true) and therefore
    // belong in the sitemap. Their /thank-you and /read counterparts are
    // noindex and are deliberately excluded.
    { url: `${SITE_URL}/free-guide`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/future-of-insurance`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/team`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/courses`, lastModified: coursesUpdated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/mastermind`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/team-licenses`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: STATIC_PAGES_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  ];

  const resourceRoutes: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `${SITE_URL}/resources/${r.slug}`,
    lastModified: new Date(r.updatedAt ?? r.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((c) => ({
    url: `${SITE_URL}/case-studies/${c.slug}`,
    lastModified: new Date(c.updatedAt ?? c.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const comparisonRoutes: MetadataRoute.Sitemap = comparisons.map((c) => ({
    url: `${SITE_URL}/compare/${c.slug}`,
    lastModified: new Date(c.updatedAt ?? c.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const integrationRoutes: MetadataRoute.Sitemap = integrations.map((i) => ({
    url: `${SITE_URL}/integrations/${i.slug}`,
    lastModified: new Date(i.updatedAt ?? i.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const glossaryRoutes: MetadataRoute.Sitemap = glossary.map((t) => ({
    url: `${SITE_URL}/glossary/${t.slug}`,
    lastModified: new Date(t.updatedAt),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const courseRoutes: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${SITE_URL}/courses/${c.slug}`,
    lastModified: latest([c.updatedAt], STATIC_PAGES_UPDATED),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Only include free preview lessons. Paywalled lessons are noindex.
  const previewLessonRoutes: MetadataRoute.Sitemap = courses.flatMap((c) =>
    c.modules.flatMap((m) =>
      m.lessons
        .filter((l) => l.preview)
        .map((l) => ({
          url: `${SITE_URL}/courses/${c.slug}/${m.moduleSlug}/${l.lessonSlug}`,
          lastModified: latest([c.updatedAt], STATIC_PAGES_UPDATED),
          changeFrequency: "monthly" as const,
          priority: 0.5,
        }))
    )
  );

  const teamRoutes: MetadataRoute.Sitemap = team.map((m) => ({
    url: `${SITE_URL}/team/${m.slug}`,
    lastModified: STATIC_PAGES_UPDATED,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...resourceRoutes,
    ...caseStudyRoutes,
    ...comparisonRoutes,
    ...integrationRoutes,
    ...glossaryRoutes,
    ...courseRoutes,
    ...teamRoutes,
    ...previewLessonRoutes,
  ];
}
