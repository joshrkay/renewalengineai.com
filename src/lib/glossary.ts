import fs from "node:fs";
import path from "node:path";
import fm from "front-matter";

export type GlossaryFrontmatter = {
  /** Display name of the term, e.g. "AMS (Agency Management System)". */
  term: string;
  slug: string;
  /**
   * A single self-contained sentence that answers the definitional query on
   * its own. Used for the meta description, the DefinedTerm schema, and the
   * index page — so it has to read correctly with no surrounding context.
   */
  shortDefinition: string;
  category: string;
  aliases?: string[];
  updatedAt: string;
  related?: string[];
};

export type GlossaryTerm = GlossaryFrontmatter & {
  body: string;
};

const GLOSSARY_DIR = path.join(process.cwd(), "content", "glossary");

export const GLOSSARY_CATEGORIES = [
  "Agency Operations",
  "Lines of Business",
  "Metrics",
  "Growth",
  "AI & Automation",
] as const;

export function listGlossaryTerms(): GlossaryTerm[] {
  if (!fs.existsSync(GLOSSARY_DIR)) return [];

  return fs
    .readdirSync(GLOSSARY_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((fileName) => {
      const raw = fs.readFileSync(path.join(GLOSSARY_DIR, fileName), "utf-8");
      const parsed = fm<GlossaryFrontmatter>(raw);
      return { ...parsed.attributes, body: parsed.body };
    })
    .sort((a, b) => a.term.localeCompare(b.term));
}

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return listGlossaryTerms().find((t) => t.slug === slug);
}

/** Terms grouped by category, in the fixed display order above. */
export function listGlossaryByCategory(): {
  category: string;
  terms: GlossaryTerm[];
}[] {
  const all = listGlossaryTerms();
  const known = GLOSSARY_CATEGORIES.map((category) => ({
    category: category as string,
    terms: all.filter((t) => t.category === category),
  }));
  // Anything using a category not in the list still needs to render.
  const extras = all.filter(
    (t) => !GLOSSARY_CATEGORIES.includes(t.category as never)
  );
  const extraCategories = [...new Set(extras.map((t) => t.category))].map(
    (category) => ({ category, terms: extras.filter((t) => t.category === category) })
  );
  return [...known, ...extraCategories].filter((g) => g.terms.length > 0);
}
