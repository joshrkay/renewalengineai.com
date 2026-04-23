import type { MetadataRoute } from "next";
import { listCourses } from "@/lib/courses";

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

  return [...staticRoutes, ...courseRoutes, ...previewLessonRoutes];
}
