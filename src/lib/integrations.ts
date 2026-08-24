import fs from "node:fs";
import path from "node:path";
import fm from "front-matter";

export type IntegrationFrontmatter = {
  title: string;
  slug: string;
  /** Display name of the AMS, e.g. "Applied Epic". */
  ams: string;
  vendor: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  primaryKeyword: string;
  readTime: number;
  /** Who this AMS profile typically describes — shown on the index page. */
  segment: string;
  dataAccess: string[];
  strengths: string[];
  frictions: string[];
  related?: string[];
};

export type Integration = IntegrationFrontmatter & {
  body: string;
};

const INTEGRATIONS_DIR = path.join(process.cwd(), "content", "integrations");

// Ordered by how commonly we see each platform in independent agencies rather
// than alphabetically, so the index page leads with the most likely match.
const DISPLAY_ORDER = ["applied-epic", "hawksoft", "ezlynx"];

export function listIntegrations(): Integration[] {
  if (!fs.existsSync(INTEGRATIONS_DIR)) return [];

  return fs
    .readdirSync(INTEGRATIONS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((fileName) => {
      const raw = fs.readFileSync(
        path.join(INTEGRATIONS_DIR, fileName),
        "utf-8"
      );
      const parsed = fm<IntegrationFrontmatter>(raw);
      return { ...parsed.attributes, body: parsed.body };
    })
    .sort((a, b) => {
      const ai = DISPLAY_ORDER.indexOf(a.slug);
      const bi = DISPLAY_ORDER.indexOf(b.slug);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
}

export function getIntegration(slug: string): Integration | undefined {
  return listIntegrations().find((i) => i.slug === slug);
}
