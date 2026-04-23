import type { MetadataRoute } from "next";
import { listCourses } from "@/lib/courses";
import { listResources } from "@/lib/resources";
import { team } from "@/lib/team";

const SITE_URL = "https://renewalengineai.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/for-independent-agencies`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/resources`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/courses`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/mastermind`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/team-licenses`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const resourceRoutes: MetadataRoute.Sitemap = listResources().map((r) => ({
    url: `${SITE_URL}/resources/${r.slug}`,
    lastModified: r.updatedAt ? new Date(r.updatedAt) : new Date(r.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const courses = listCourses();

  const courseRoutes: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${SITE_URL}/courses/${c.slug}`,
    lastModified: now,
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
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.5,
        }))
    )
  );

  const teamRoutes: MetadataRoute.Sitemap = team.map((m) => ({
    url: `${SITE_URL}/team/${m.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...resourceRoutes,
    ...courseRoutes,
    ...teamRoutes,
    ...previewLessonRoutes,
  ];
}
