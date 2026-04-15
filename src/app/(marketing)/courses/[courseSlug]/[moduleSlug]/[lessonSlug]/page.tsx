import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { LessonBody } from "@/components/courses/LessonBody";
import { getLesson, listCourses } from "@/lib/courses";

type Params = {
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
};

export function generateStaticParams() {
  const params: Params[] = [];
  for (const course of listCourses()) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        params.push({
          courseSlug: course.slug,
          moduleSlug: mod.moduleSlug,
          lessonSlug: lesson.lessonSlug,
        });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { courseSlug, moduleSlug, lessonSlug } = await params;
  const result = getLesson(courseSlug, moduleSlug, lessonSlug);
  if (!result) return { title: "Lesson not found" };
  return {
    title: `${result.lesson.title} | ${result.course.title} | RenewalEngineAI`,
    description: `Module ${result.module.number}: ${result.module.title}`,
    alternates: {
      canonical: `https://renewalengineai.com/courses/${courseSlug}/${moduleSlug}/${lessonSlug}`,
    },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { courseSlug, moduleSlug, lessonSlug } = await params;
  const result = getLesson(courseSlug, moduleSlug, lessonSlug);
  if (!result) notFound();

  const { course, module: mod, lesson } = result;

  // Build flat lesson list for prev/next navigation across the whole course.
  const flat = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({
      moduleSlug: m.moduleSlug,
      lessonSlug: l.lessonSlug,
      title: l.title,
    }))
  );
  const idx = flat.findIndex(
    (l) => l.moduleSlug === moduleSlug && l.lessonSlug === lessonSlug
  );
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  return (
    <BookingProvider>
      <div className="min-h-screen bg-black">
        <Header />
        <main className="bg-black text-white min-h-screen pt-32 pb-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <Link
              href={`/courses/${course.slug}`}
              className="inline-block text-blue-500 font-semibold mb-8 hover:text-blue-400"
            >
              ← {course.title}
            </Link>

            <div className="mb-10">
              <p className="text-sm text-neutral-500 font-semibold uppercase tracking-wider mb-3">
                Module {mod.number} · {mod.title} · {lesson.duration} min read
              </p>
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                {lesson.title}
              </h1>
            </div>

            <article>
              <LessonBody body={lesson.body} />
            </article>

            <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row gap-4 justify-between">
              {prev ? (
                <Link
                  href={`/courses/${course.slug}/${prev.moduleSlug}/${prev.lessonSlug}`}
                  className="text-neutral-400 hover:text-white"
                >
                  <span className="text-sm text-neutral-500">← Previous</span>
                  <br />
                  <span className="text-white font-semibold">{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  href={`/courses/${course.slug}/${next.moduleSlug}/${next.lessonSlug}`}
                  className="text-neutral-400 hover:text-white text-right sm:text-right"
                >
                  <span className="text-sm text-neutral-500">Next →</span>
                  <br />
                  <span className="text-white font-semibold">{next.title}</span>
                </Link>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
