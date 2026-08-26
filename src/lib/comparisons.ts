import fs from "node:fs";
import path from "node:path";
import fm from "front-matter";

export type ComparisonFrontmatter = {
  title: string;
  /** Optional short <title> for SERPs. Falls back to `title` (the on-page H1),
   *  which is often longer than the ~60 chars Google renders. */
  seoTitle?: string;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  /** "Strada", "Sonant AI", "Hiring a CSR". */
  competitor: string;
  /** Search intent: "Strada alternatives", "cost of hiring a CSR insurance agency". */
  primaryKeyword: string;
  /** 1-sentence positioning for card + hero + OG. */
  tagline: string;
  readTime: number;
  /**
   * The kind of comparison target — affects how we render the header
   * ("Product vs product" vs "Service vs alternative").
   */
  comparisonType: "product" | "service" | "decision";
};

export type Comparison = ComparisonFrontmatter & {
  body: string;
};

const COMPARISONS_DIR = path.join(process.cwd(), "content", "comparisons");

function readMarkdown<T>(
  filePath: string
): { attributes: T; body: string } {
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = fm<T>(raw);
  return { attributes: parsed.attributes, body: parsed.body };
}

export function listComparisons(): Comparison[] {
  if (!fs.existsSync(COMPARISONS_DIR)) return [];
  const files = fs
    .readdirSync(COMPARISONS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  return files
    .map((fileName) => {
      const filePath = path.join(COMPARISONS_DIR, fileName);
      const { attributes, body } = readMarkdown<ComparisonFrontmatter>(filePath);
      return { ...attributes, body };
    })
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getComparison(slug: string): Comparison | undefined {
  return listComparisons().find((c) => c.slug === slug);
}

/**
 * Display label for the competitor pill/eyebrow. Neutral two-vendor pages
 * ("Sonant AI vs. Liberate") already carry "vs." in the field; only
 * single-name competitors get the prefix. Every renderer must use this —
 * inlining `vs. ${competitor}` double-prefixes neutral pages.
 */
export function competitorLabel(competitor: string): string {
  return competitor.includes("vs.") ? competitor : `vs. ${competitor}`;
}
