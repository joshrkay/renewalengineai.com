import { getCourse, listCourses } from "@/lib/courses";
import { OG_SIZE, renderOgCard } from "@/lib/og-image";

export const alt = "RenewalEngineAI course";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return listCourses().map((c) => ({ courseSlug: c.slug }));
}

export default async function CourseOgImage({
  params,
}: {
  params: { courseSlug: string };
}) {
  const course = getCourse(params.courseSlug);
  if (!course) {
    return renderOgCard({
      eyebrow: "Course",
      title: "RenewalEngineAI courses",
      subtitle: "AI training for independent insurance agents.",
    });
  }

  const totalLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  );

  return renderOgCard({
    eyebrow: "Self-paced AI course",
    title: course.title,
    subtitle: course.tagline,
    stats: [
      { value: `$${course.price.toLocaleString("en-US")}`, label: "One-time" },
      { value: `${totalLessons}`, label: "Lessons" },
      { value: `${course.duration}h`, label: "Content" },
    ],
  });
}
