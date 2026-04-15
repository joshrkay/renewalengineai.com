import { Link, useParams, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getLesson } from "../lib/courses";
import { markdownComponents } from "./markdownComponents";

export default function CourseLesson() {
  const { courseSlug, moduleSlug, lessonSlug } = useParams<{
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>();

  if (!courseSlug || !moduleSlug || !lessonSlug) {
    return <Navigate to="/courses" replace />;
  }

  const result = getLesson(courseSlug, moduleSlug, lessonSlug);
  if (!result) return <Navigate to={`/courses/${courseSlug}`} replace />;

  const { course, module: mod, lesson } = result;

  // Find previous and next lesson across the whole course.
  const flat = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ moduleSlug: m.moduleSlug, lessonSlug: l.lessonSlug, title: l.title }))
  );
  const idx = flat.findIndex(
    (l) => l.moduleSlug === moduleSlug && l.lessonSlug === lessonSlug
  );
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  return (
    <main className="bg-black text-white min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <Link
          to={`/courses/${course.slug}`}
          className="inline-block text-blue-500 font-semibold mb-8 hover:text-blue-400"
        >
          ← {course.title}
        </Link>

        <div className="mb-10">
          <p className="text-sm text-neutral-500 font-semibold uppercase tracking-wider mb-3">
            Module {mod.number} · {mod.title} · {lesson.duration} min read
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{lesson.title}</h1>
        </div>

        <article>
          <ReactMarkdown components={markdownComponents}>{lesson.body}</ReactMarkdown>
        </article>

        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row gap-4 justify-between">
          {prev ? (
            <Link
              to={`/courses/${course.slug}/${prev.moduleSlug}/${prev.lessonSlug}`}
              className="text-neutral-400 hover:text-white"
            >
              ← <span className="text-sm text-neutral-500">Previous</span>
              <br />
              <span className="text-white font-semibold">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={`/courses/${course.slug}/${next.moduleSlug}/${next.lessonSlug}`}
              className="text-neutral-400 hover:text-white text-right sm:text-right"
            >
              <span className="text-sm text-neutral-500">Next</span> →<br />
              <span className="text-white font-semibold">{next.title}</span>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
