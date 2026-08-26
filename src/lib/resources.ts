import fs from "node:fs";
import path from "node:path";
import fm from "front-matter";
import { stripLeadingH1 } from "@/lib/markdown";

export type ResourceFrontmatter = {
  title: string;
  /** Optional short <title> for SERPs. Falls back to `title` (the on-page H1),
   *  which is often longer than the ~60 chars Google renders. */
  seoTitle?: string;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  primaryKeyword: string;
  readTime: number;
  related?: string[];
};

export type Resource = ResourceFrontmatter & {
  body: string;
};

const RESOURCES_DIR = path.join(process.cwd(), "content", "resources");

function readMarkdown<T>(
  filePath: string
): { attributes: T; body: string } {
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = fm<T>(raw);
  return { attributes: parsed.attributes, body: stripLeadingH1(parsed.body) };
}

export function listResources(): Resource[] {
  if (!fs.existsSync(RESOURCES_DIR)) return [];
  const files = fs
    .readdirSync(RESOURCES_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  const resources = files
    .map((fileName) => {
      const filePath = path.join(RESOURCES_DIR, fileName);
      const { attributes, body } = readMarkdown<ResourceFrontmatter>(filePath);
      return { ...attributes, body };
    })
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return resources;
}

export function getResource(slug: string): Resource | undefined {
  return listResources().find((r) => r.slug === slug);
}
