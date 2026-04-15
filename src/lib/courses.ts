import fs from "node:fs";
import path from "node:path";
import fm from "front-matter";

export type CourseFrontmatter = {
  title: string;
  slug: string;
  price: number;
  tagline: string;
  duration: number;
};

export type LessonFrontmatter = {
  title: string;
  module: number;
  order: number;
  duration: number;
};

export type Lesson = LessonFrontmatter & {
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  body: string;
};

export type Module = {
  moduleSlug: string;
  number: number;
  title: string;
  lessons: Lesson[];
};

export type Course = CourseFrontmatter & {
  body: string;
  modules: Module[];
};

const COURSES_DIR = path.join(process.cwd(), "content", "courses");

function readMarkdown<T>(filePath: string): { attributes: T; body: string } {
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = fm<T>(raw);
  return { attributes: parsed.attributes, body: parsed.body };
}

function titleize(slug: string): string {
  // Strip leading "module-N-" if present and title-case the rest.
  const withoutPrefix = slug.replace(/^module-\d+-/, "");
  return withoutPrefix
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function loadCourse(courseDirName: string): Course | undefined {
  const courseDir = path.join(COURSES_DIR, courseDirName);
  const courseFile = path.join(courseDir, "course.md");
  if (!fs.existsSync(courseFile)) return undefined;

  const { attributes, body } = readMarkdown<CourseFrontmatter>(courseFile);

  const moduleDirs = fs
    .readdirSync(courseDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("module-"))
    .map((d) => d.name)
    .sort();

  const modules: Module[] = moduleDirs.map((moduleSlug) => {
    const modulePath = path.join(courseDir, moduleSlug);
    const lessonFiles = fs
      .readdirSync(modulePath)
      .filter((f) => f.endsWith(".md"))
      .sort();

    const lessons: Lesson[] = lessonFiles.map((fileName) => {
      const { attributes: l, body: lessonBody } = readMarkdown<LessonFrontmatter>(
        path.join(modulePath, fileName)
      );
      return {
        ...l,
        courseSlug: attributes.slug,
        moduleSlug,
        lessonSlug: fileName.replace(/\.md$/, ""),
        body: lessonBody,
      };
    });

    lessons.sort((a, b) => a.order - b.order);

    const moduleNumber = lessons[0]?.module ?? 0;
    return {
      moduleSlug,
      number: moduleNumber,
      title: titleize(moduleSlug),
      lessons,
    };
  });

  modules.sort((a, b) => a.number - b.number);

  return { ...attributes, body, modules };
}

export function listCourses(): Course[] {
  if (!fs.existsSync(COURSES_DIR)) return [];
  const courseDirs = fs
    .readdirSync(COURSES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  return courseDirs
    .map((name) => loadCourse(name))
    .filter((c): c is Course => Boolean(c));
}

export function getCourse(slug: string): Course | undefined {
  return listCourses().find((c) => c.slug === slug);
}

export function getLesson(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
): { course: Course; module: Module; lesson: Lesson } | undefined {
  const course = getCourse(courseSlug);
  if (!course) return undefined;
  const mod = course.modules.find((m) => m.moduleSlug === moduleSlug);
  if (!mod) return undefined;
  const lesson = mod.lessons.find((l) => l.lessonSlug === lessonSlug);
  if (!lesson) return undefined;
  return { course, module: mod, lesson };
}

export function formatPrice(price: number): string {
  return `$${price.toLocaleString("en-US")}`;
}
