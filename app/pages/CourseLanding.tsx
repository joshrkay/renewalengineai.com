import { Link, useParams, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getCourse } from "../lib/courses";
import { markdownComponents } from "./markdownComponents";

export default function CourseLanding() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  if (!courseSlug) return <Navigate to="/courses" replace />;

  const course = getCourse(courseSlug);
  if (!course) return <Navigate to="/courses" replace />;

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const priceLabel = course.priceHigh
    ? `$${course.price} – $${course.priceHigh}`
    : course.price
      ? `$${course.price}`
      : "Contact us";

  return (
    <main className="bg-black text-white min-h-screen pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <Link
          to="/courses"
          className="inline-block text-blue-500 font-semibold mb-8 hover:text-blue-400"
        >
          ← All courses
        </Link>

        <div className="mb-12">
          <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-4">
            Self-paced DIY course
          </p>
          <h1 className="text-5xl md:text-6xl font-black mb-6">{course.title}</h1>
          {course.tagline && (
            <p className="text-xl text-neutral-300 mb-8 max-w-3xl">{course.tagline}</p>
          )}
          <div className="flex flex-wrap gap-6 items-center">
            <span className="text-3xl font-black text-white">{priceLabel}</span>
            <span className="text-neutral-400">
              {course.modules.length} modules · {totalLessons} lessons
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <section className="mb-12">
              <ReactMarkdown components={markdownComponents}>{course.body}</ReactMarkdown>
            </section>

            <section>
              <h2 className="text-3xl font-black mb-6">Curriculum</h2>
              <div className="space-y-6">
                {course.modules.map((mod) => (
                  <div
                    key={mod.moduleSlug}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
                  >
                    <h3 className="text-xl font-bold mb-4">
                      <span className="text-blue-500">Module {mod.number}:</span> {mod.title}
                    </h3>
                    <ul className="space-y-2">
                      {mod.lessons.map((lesson) => (
                        <li key={lesson.lessonSlug}>
                          <Link
                            to={`/courses/${course.slug}/${mod.moduleSlug}/${lesson.lessonSlug}`}
                            className="flex items-center justify-between text-neutral-300 hover:text-white py-2 border-b border-neutral-800 last:border-b-0"
                          >
                            <span>
                              <span className="text-neutral-500 mr-3">{lesson.order}.</span>
                              {lesson.title}
                            </span>
                            <span className="text-xs text-neutral-500 ml-4 shrink-0">
                              {lesson.duration} min
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sticky top-28">
              <h3 className="text-lg font-bold mb-4">Ready to start?</h3>
              <p className="text-neutral-400 text-sm mb-6">
                Lifetime access, all templates, and a 30-day money-back guarantee.
              </p>
              <a
                href={`/checkout.html?plan=${course.slug}`}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-6 py-3 text-center transition-colors"
              >
                Enroll for {priceLabel}
              </a>
              <a
                href="/book.html"
                className="block w-full mt-3 border border-neutral-700 hover:border-blue-600 text-white font-semibold rounded-full px-6 py-3 text-center transition-colors"
              >
                Ask a question
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
