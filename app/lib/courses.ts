// Course content loader.
//
// Reads every markdown file under /content/courses/**/*.md at build time using
// Vite's import.meta.glob, parses frontmatter with a tiny regex-based reader,
// and exposes typed accessors for the pages.

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

export type CourseFrontmatter = {
  title: string;
  slug: string;
  price?: number;
  priceHigh?: number;
  tagline?: string;
  duration?: number;
};

export type Course = CourseFrontmatter & {
  body: string;
  modules: Module[];
};

// --- tiny YAML frontmatter parser (supports `key: value` pairs only) ---
function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const yaml = match[1];
  const body = match[2];
  const data: Record<string, string> = {};
  for (const line of yaml.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[m[1]] = value;
  }
  return { data, body };
}

function toNumber(v: string | undefined, fallback = 0): number {
  if (v === undefined) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// Humanize a slug like "module-1-foundation" -> "Foundation"
function moduleTitleFromSlug(slug: string): string {
  const withoutPrefix = slug.replace(/^module-\d+-/, '');
  return withoutPrefix
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Vite glob: eager + ?raw returns each markdown file as a string.
const rawFiles = import.meta.glob('/content/courses/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

type ParsedFile = {
  kind: 'course' | 'lesson';
  courseSlug: string;
  moduleSlug?: string;
  lessonSlug?: string;
  data: Record<string, string>;
  body: string;
};

function parsePath(path: string, raw: string): ParsedFile | null {
  // Paths come in like:
  //   /content/courses/ai-for-agent-retention/course.md
  //   /content/courses/ai-for-agent-retention/module-1-foundation/lesson-1-why-retention-matters.md
  const stripped = path.replace(/^\/content\/courses\//, '');
  const parts = stripped.split('/');
  const { data, body } = parseFrontmatter(raw);

  if (parts.length === 2 && parts[1] === 'course.md') {
    return {
      kind: 'course',
      courseSlug: parts[0],
      data,
      body,
    };
  }
  if (parts.length === 3 && parts[2].endsWith('.md')) {
    return {
      kind: 'lesson',
      courseSlug: parts[0],
      moduleSlug: parts[1],
      lessonSlug: parts[2].replace(/\.md$/, ''),
      data,
      body,
    };
  }
  return null;
}

// --- build the course tree ---
type CourseBuilder = {
  slug: string;
  course?: Course;
  modules: Map<string, Module>;
};

const builders = new Map<string, CourseBuilder>();

function ensureBuilder(slug: string): CourseBuilder {
  let b = builders.get(slug);
  if (!b) {
    b = { slug, modules: new Map() };
    builders.set(slug, b);
  }
  return b;
}

for (const [path, raw] of Object.entries(rawFiles)) {
  const parsed = parsePath(path, raw);
  if (!parsed) continue;

  const builder = ensureBuilder(parsed.courseSlug);

  if (parsed.kind === 'course') {
    builder.course = {
      title: parsed.data.title ?? parsed.courseSlug,
      slug: parsed.data.slug ?? parsed.courseSlug,
      price: parsed.data.price ? toNumber(parsed.data.price) : undefined,
      priceHigh: parsed.data.priceHigh ? toNumber(parsed.data.priceHigh) : undefined,
      tagline: parsed.data.tagline,
      duration: parsed.data.duration ? toNumber(parsed.data.duration) : undefined,
      body: parsed.body,
      modules: [],
    };
    continue;
  }

  // lesson
  const moduleSlug = parsed.moduleSlug!;
  let mod = builder.modules.get(moduleSlug);
  if (!mod) {
    const moduleNumber = toNumber(parsed.data.module, 0);
    mod = {
      moduleSlug,
      number: moduleNumber,
      title: moduleTitleFromSlug(moduleSlug),
      lessons: [],
    };
    builder.modules.set(moduleSlug, mod);
  }
  // If we encounter the module later with a numbered frontmatter, pick it up.
  if (mod.number === 0) {
    mod.number = toNumber(parsed.data.module, 0);
  }

  const lesson: Lesson = {
    courseSlug: parsed.courseSlug,
    moduleSlug,
    lessonSlug: parsed.lessonSlug!,
    title: parsed.data.title ?? parsed.lessonSlug!,
    module: toNumber(parsed.data.module, 0),
    order: toNumber(parsed.data.order, 0),
    duration: toNumber(parsed.data.duration, 0),
    body: parsed.body,
  };
  mod.lessons.push(lesson);
}

// Finalize: sort modules and lessons, attach to courses.
const courses: Course[] = [];
for (const builder of builders.values()) {
  if (!builder.course) continue;
  const mods = Array.from(builder.modules.values());
  mods.sort((a, b) => a.number - b.number);
  for (const mod of mods) {
    mod.lessons.sort((a, b) => a.order - b.order);
  }
  builder.course.modules = mods;
  courses.push(builder.course);
}
courses.sort((a, b) => a.title.localeCompare(b.title));

export function listCourses(): Course[] {
  return courses;
}

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
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
