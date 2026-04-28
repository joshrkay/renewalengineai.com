import Anthropic from "@anthropic-ai/sdk";
import type { DraftedArticle } from "./types";

// Haiku is fast and cheap for short-form copy — a LinkedIn post needs no
// extended thinking and the output budget is small.
const MODEL = "claude-haiku-4-5-20251001";

const SYSTEM_PROMPT = `You write LinkedIn posts for Josh Kay, founder of RenewalEngineAI — a done-for-you AI automation service for independent insurance agencies.

Voice rules (match exactly):
- Open with the hook immediately. No "Excited to share" or "I just published."
- Numeric when possible — lead with a stat if the article has one.
- First-person. Direct. Confident without being arrogant.
- No em-dashes. Use a regular hyphen or restructure.
- Banned words: "revolutionize", "game-changer", "unlock", "supercharge", "leverage" (as verb), "paradigm shift".
- 150-220 words. Short sentences. One idea per line.
- Line breaks after every 1-2 sentences — LinkedIn wraps at 3 lines, so white space matters.
- 3-5 lowercase hashtags at the very end, on their own line.
- End the body with a direct question or a one-line CTA before the hashtags.
- Include the article URL on its own line after the CTA, before the hashtags.
- No hollow filler sentences ("Happy to share this", "Let me know your thoughts in the comments").

Target audience: independent insurance agency owners and producers. Speak directly to their specific pain — renewal leakage, missed leads, AMS data sitting unused.`;

export async function draftLinkedInPost(
  article: DraftedArticle
): Promise<string> {
  const client = new Anthropic();

  // Pull the first 3 non-heading, non-empty paragraphs for context
  const openingParagraphs = article.body
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith(">"))
    .slice(0, 3)
    .join("\n");

  const userPrompt = `Write a LinkedIn post for this article.

Title: ${article.title}
Description: ${article.description}
Category: ${article.category}
Primary keyword: ${article.primaryKeyword}
URL: https://renewalengineai.com/resources/${article.slug}

Opening paragraphs:
${openingParagraphs}

Return only the post text. No commentary, no "Here is the post:" prefix.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text"
  );

  if (!textBlock) {
    return "(LinkedIn draft unavailable — no text block in response)";
  }

  return textBlock.text.trim();
}
