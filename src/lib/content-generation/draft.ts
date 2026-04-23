import Anthropic from "@anthropic-ai/sdk";
import fm from "front-matter";
import { buildSystemPrompt } from "./system-prompt";
import type { DraftedArticle, ResearchResult } from "./types";

const MODEL = "claude-sonnet-4-6";
// 16K is a safe non-streaming ceiling; a 2000-word article is ~3-4k output
// tokens, so this leaves headroom for adaptive thinking.
const MAX_TOKENS = 16000;

type ArticleFrontmatter = {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  category: string;
  primaryKeyword: string;
  readTime: number;
  related?: string[];
};

export async function draftArticle(
  research: ResearchResult
): Promise<DraftedArticle> {
  const { topic, findings } = research;

  const client = new Anthropic();

  const systemPrompt = buildSystemPrompt();

  const today = new Date().toISOString().slice(0, 10);

  // Volatile content lives in the user turn so it doesn't invalidate
  // the cached system prompt.
  const researchBlock =
    findings.length > 0
      ? findings
          .map(
            (f, i) =>
              `**${i + 1}. [${f.title}](${f.url})**\n${f.snippet}`
          )
          .join("\n\n")
      : "(no external research gathered; draft from house knowledge)";

  const userPrompt = `Draft an article for renewalengineai.com.

**Slug**: \`${topic.slug}\`
**Working title**: ${topic.title}
**Angle**: ${topic.description}
**Primary keyword**: ${topic.primaryKeyword}
**Category**: ${topic.category}
**Publish date**: ${today}

**Research (use as seed context — do not repeat verbatim or plagiarize):**

${researchBlock}

Follow the system prompt's structure, house voice, and output format rules exactly. Return only the markdown file contents, starting with the YAML frontmatter.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  // Log cache hit metrics — verifies caching is actually working across runs.
  // If cache_read stays at 0 across repeated runs, something in the system
  // prompt is changing between invocations (check listResources() ordering
  // or any date/random injected in buildSystemPrompt).
  const usage = response.usage;
  console.log(
    `[draft] model=${MODEL} cache_write=${usage.cache_creation_input_tokens} ` +
      `cache_read=${usage.cache_read_input_tokens} ` +
      `input=${usage.input_tokens} output=${usage.output_tokens}`
  );

  const textBlock = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text"
  );
  if (!textBlock) {
    throw new Error("draftArticle: no text block in response");
  }

  const rawMarkdown = stripFences(textBlock.text.trim());
  const parsed = fm<ArticleFrontmatter>(rawMarkdown);

  if (!parsed.attributes.title || !parsed.attributes.slug) {
    throw new Error(
      "draftArticle: frontmatter missing required fields (title/slug)"
    );
  }

  // Reconcile slug with the backlog slug — the model occasionally rewrites it.
  // We trust the backlog; if the model's slug differs, overwrite and keep
  // going rather than fail the whole run.
  if (parsed.attributes.slug !== topic.slug) {
    console.warn(
      `[draft] slug mismatch: model=${parsed.attributes.slug} ` +
        `backlog=${topic.slug} — using backlog slug`
    );
    parsed.attributes.slug = topic.slug;
  }

  const wordCount = countWords(parsed.body);

  return {
    slug: topic.slug,
    title: parsed.attributes.title,
    description: parsed.attributes.description,
    category: parsed.attributes.category,
    primaryKeyword: parsed.attributes.primaryKeyword,
    readTime: parsed.attributes.readTime ?? Math.max(1, Math.ceil(wordCount / 200)),
    publishedAt: parsed.attributes.publishedAt ?? today,
    body: parsed.body,
    rawMarkdown,
    sources: findings,
    wordCount,
  };
}

/** Strip accidental triple-backtick fences the model sometimes adds. */
function stripFences(text: string): string {
  const fenceMatch = text.match(/^```(?:markdown)?\n([\s\S]*?)\n```$/);
  return fenceMatch ? fenceMatch[1] : text;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}
