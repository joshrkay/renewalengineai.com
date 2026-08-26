/**
 * Markdown body helpers shared by the content loaders.
 */

/**
 * Drop a leading top-level `# Heading` from a markdown body.
 *
 * Every resource article and course lesson opens with `# <title>`, but the
 * page templates already render that title in their own `<h1>`. Rendering the
 * body verbatim therefore emitted two `<h1>` elements with identical text on
 * 19 pages — a duplicate headline on screen and a broken document outline for
 * crawlers. Strip it at parse time so the template's `<h1>` is the only one.
 *
 * Only a heading that appears before any other content is removed, so a `#`
 * used legitimately further down a document is left alone.
 */
export function stripLeadingH1(body: string): string {
  const lines = body.split("\n");
  let i = 0;

  // Skip leading blank lines.
  while (i < lines.length && lines[i].trim() === "") i++;

  // Bail unless the first real line is an ATX h1 (`# `, not `## `).
  if (i >= lines.length || !/^#\s+\S/.test(lines[i])) return body;

  lines.splice(i, 1);

  // Collapse the blank line the heading left behind.
  while (i < lines.length && lines[i].trim() === "") lines.splice(i, 1);

  return lines.join("\n");
}
