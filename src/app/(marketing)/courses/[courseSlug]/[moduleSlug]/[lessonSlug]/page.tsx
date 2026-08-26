import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { LessonBody } from "@/components/courses/LessonBody";
import { LessonPaywall } from "@/components/courses/LessonPaywall";
import { getLesson } from "@/lib/courses";
import { getCourseAccess } from "@/lib/entitlements";

// The lesson page depends on the signed-in session for paywall checks, so
// it can't be prerendered. Force dynamic rendering so access checks run on
// every request.
export const dynamic = "force-dynamic";

type Params = {
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { courseSlug, moduleSlug, lessonSlug } = await params;
  const result = getLesson(courseSlug, moduleSlug, lessonSlug);
  if (!result) return { title: "Lesson not found", robots: { index: false } };
  // Paywalled lessons are noindex to avoid thin-content / cloaking signals.
  // Free preview lessons are indexable.
  const indexable = Boolean(result.lesson.preview);
  return {
    // The root layout already appends " | RenewalEngineAI", so adding the
    // course name here produced a three-part title ~80 chars long. Keep the
    // course name only when the whole thing still fits Google's ~60-char render.
    title: (() => {
      const withCourse = `${result.lesson.title} | ${result.course.title}`;
      return withCourse.length + " | RenewalEngineAI".length <= 60
        ? withCourse
        : result.lesson.title;
    })(),
    description: `${result.lesson.title} — Module ${result.module.number} (${result.module.title}) of ${result.course.title}, a ${result.lesson.duration}-minute lesson for independent insurance agency owners.`,
    alternates: {
      canonical: `https://renewalengineai.com/courses/${courseSlug}/${moduleSlug}/${lessonSlug}`,
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
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

  // Gate everything that isn't explicitly marked as a free teaser. Access
  // is strictly per-course — service-tier buyers do not unlock courses.
  const access = lesson.preview ? null : await getCourseAccess(course.slug);

  // Build flat lesson list for prev/next navigation across the whole course.
  const flat = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({
      moduleSlug: m.moduleSlug,
      lessonSlug: l.lessonSlug,
      title: l.title,
      preview: Boolean(l.preview),
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
                {lesson.preview && (
                  <span className="ml-3 inline-block bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full align-middle">
                    Free preview
                  </span>
                )}
              </p>
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                {lesson.title}
              </h1>
            </div>

            {access && !access.allowed && access.reason === "error" ? (
              // Infrastructure failure (auth or DB), not a missing
              // entitlement — never show a purchase button here, or a
              // paying customer mid-outage could buy the course twice.
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 md:p-12 my-10">
                <h2 className="text-2xl font-black mb-3">
                  We couldn&apos;t check your access just now
                </h2>
                <p className="text-neutral-300 max-w-2xl">
                  Something went wrong on our side while verifying your
                  enrollment. Please refresh in a minute. If this keeps
                  happening, email{" "}
                  <a
                    href="mailto:hello@renewalengineai.com"
                    className="text-blue-500 hover:text-blue-400 underline underline-offset-4"
                  >
                    hello@renewalengineai.com
                  </a>{" "}
                  and we&apos;ll sort it out. If you already own this course,
                  your access is safe.
                </p>
              </div>
            ) : access && !access.allowed ? (
              <LessonPaywall
                courseTitle={course.title}
                coursePrice={course.price}
                courseHref={`/courses/${course.slug}`}
                returnHref={`/courses/${course.slug}/${mod.moduleSlug}/${lesson.lessonSlug}`}
                reason={
                  access.reason === "unauthenticated"
                    ? "unauthenticated"
                    : "not_entitled"
                }
              />
            ) : (
              <article>
                <LessonBody body={lesson.body} />
              </article>
            )}

            {lesson.preview && (
              // Free-preview readers arrive from search with no other CTA on
              // the page — without this block the only path to a price is
              // clicking "Next" into the paywall.
              <div className="mt-16 bg-gradient-to-br from-blue-600/15 to-black border border-blue-600/40 rounded-2xl p-8">
                <p className="text-sm text-blue-400 font-bold uppercase tracking-wider mb-2">
                  Free preview lesson
                </p>
                <h2 className="text-2xl font-black mb-3">
                  This is 1 of {flat.length} lessons in {course.title}
                </h2>
                <p className="text-neutral-300 mb-6 max-w-xl">
                  The full course includes every template, prompt, and worked
                  diagram from the curriculum, with lifetime updates and a
                  30-day money-back guarantee.
                </p>
                <Link
                  href={`/courses/${course.slug}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-8 py-3 transition-colors"
                >
                  See the full curriculum &amp; enroll →
                </Link>
              </div>
            )}

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
