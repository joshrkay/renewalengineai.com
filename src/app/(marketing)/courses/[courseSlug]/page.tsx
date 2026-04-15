import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { LessonBody } from "@/components/courses/LessonBody";
import { BookAuditButton } from "@/components/courses/BookAuditButton";
import { getCourse, listCourses, formatPrice } from "@/lib/courses";

export function generateStaticParams() {
  return listCourses().map((c) => ({ courseSlug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}): Promise<Metadata> {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) return { title: "Course not found" };
  return {
    title: `${course.title} | RenewalEngineAI`,
    description: course.tagline,
    alternates: {
      canonical: `https://renewalengineai.com/courses/${course.slug}`,
    },
  };
}

export default async function CourseLandingPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  const totalLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0
  );

  return (
    <BookingProvider>
      <div className="min-h-screen bg-black">
        <Header />
        <main className="bg-black text-white min-h-screen pt-32 pb-24">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <Link
              href="/courses"
              className="inline-block text-blue-500 font-semibold mb-8 hover:text-blue-400"
            >
              ← All courses
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
              <div className="lg:col-span-2">
                <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-4">
                  Self-paced DIY course
                </p>
                <h1 className="text-5xl md:text-6xl font-black mb-6">
                  {course.title}
                </h1>
                <p className="text-xl text-neutral-300 mb-8">{course.tagline}</p>
                <div className="flex items-center gap-6 text-neutral-400 text-sm">
                  <span>
                    <strong className="text-white">{course.modules.length}</strong> modules
                  </span>
                  <span>
                    <strong className="text-white">{totalLessons}</strong> lessons
                  </span>
                  <span>
                    <strong className="text-white">~{course.duration}</strong> hours
                  </span>
                </div>
              </div>

              <aside className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 h-fit">
                <p className="text-sm text-neutral-400 uppercase tracking-wider mb-2">
                  One-time payment
                </p>
                <p className="text-4xl font-black text-white mb-6">
                  {formatPrice(course.price)}
                </p>
                <BookAuditButton
                  label="Talk to us about enrolling"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-6 py-3 text-center transition-colors"
                />
                <p className="text-xs text-neutral-500 mt-4 text-center">
                  Enrollment opens Q2 2026. Book a call to get on the waitlist.
                </p>
              </aside>
            </div>

            <article className="mb-16 max-w-3xl">
              <LessonBody body={course.body} />
            </article>

            <div className="border-t border-neutral-800 pt-12">
              <h2 className="text-3xl md:text-4xl font-black mb-8">
                What you&apos;ll learn
              </h2>
              <div className="space-y-6">
                {course.modules.map((m) => (
                  <div
                    key={m.moduleSlug}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8"
                  >
                    <p className="text-blue-500 font-bold uppercase tracking-wider text-xs mb-2">
                      Module {m.number}
                    </p>
                    <h3 className="text-2xl font-black mb-6">{m.title}</h3>
                    <ul className="space-y-3">
                      {m.lessons.map((l) => (
                        <li key={l.lessonSlug}>
                          <Link
                            href={`/courses/${course.slug}/${m.moduleSlug}/${l.lessonSlug}`}
                            className="flex items-center justify-between text-neutral-300 hover:text-white py-2 border-b border-neutral-800 gap-4"
                          >
                            <span className="font-semibold flex items-center gap-2 min-w-0">
                              <span className="flex-shrink-0" aria-hidden="true">
                                {l.preview ? "🔓" : "🔒"}
                              </span>
                              <span className="truncate">
                                {l.order}. {l.title}
                              </span>
                              {l.preview && (
                                <span className="flex-shrink-0 bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                  Free
                                </span>
                              )}
                            </span>
                            <span className="text-sm text-neutral-500 flex-shrink-0">
                              {l.duration} min
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}
