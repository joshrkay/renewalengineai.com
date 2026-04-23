import fs from "node:fs";
import path from "node:path";
import fm from "front-matter";

export type CaseStudyFrontmatter = {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  /** Pseudonymous agency name for composite/representative case studies. */
  agencyName: string;
  /** Region label, e.g. "Southwest US". */
  region: string;
  /** "Personal Lines" | "Commercial Lines" | "Mixed". */
  lineOfBusiness: string;
  /** Which AMS the agency runs on. */
  ams: "Applied Epic" | "HawkSoft" | "EZLynx" | "Other";
  /** Approximate book size in USD (displayed as "$2.5M book"). */
  bookSizeLabel: string;
  /** Approximate policy count. */
  policyCount: number;
  /** Engagement tier used. */
  engagement: "Audit" | "Audit + Build & Launch" | "Audit + Build + Managed Ops";
  /** 3 headline outcome metrics for the card and hero. */
  headlineResults: Array<{ value: string; label: string }>;
  /** True when the case is a composite drawn from multiple engagements. */
  composite: boolean;
  primaryKeyword: string;
};

export type CaseStudy = CaseStudyFrontmatter & {
  body: string;
};

const CASE_STUDIES_DIR = path.join(process.cwd(), "content", "case-studies");

function readMarkdown<T>(
  filePath: string
): { attributes: T; body: string } {
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = fm<T>(raw);
  return { attributes: parsed.attributes, body: parsed.body };
}

export function listCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(CASE_STUDIES_DIR)) return [];
  const files = fs
    .readdirSync(CASE_STUDIES_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  return files
    .map((fileName) => {
      const filePath = path.join(CASE_STUDIES_DIR, fileName);
      const { attributes, body } = readMarkdown<CaseStudyFrontmatter>(filePath);
      return { ...attributes, body };
    })
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return listCaseStudies().find((c) => c.slug === slug);
}
