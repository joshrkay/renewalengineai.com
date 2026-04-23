import type { BacklogItem, ResearchFinding, ResearchResult } from "./types";

type Provider = "tavily" | "claude-code" | "none";

type TavilyResponse = {
  results: Array<{ url: string; title: string; content: string; score: number }>;
};

/**
 * Web research for a topic. Used as seed material for the drafter.
 *
 * Two providers supported:
 * - "tavily"      — HTTPS call, requires TAVILY_API_KEY. For CI / cron.
 * - "claude-code" — no-op stub; the /loop harness is expected to populate
 *                   `process.env.CLAUDE_CODE_RESEARCH` with JSON findings
 *                   produced via the Claude Code WebSearch tool before
 *                   invoking the drafter. This keeps the API-facing core
 *                   unchanged across triggers.
 * - "none"        — skip research entirely; draft from the system prompt only.
 */
export async function researchTopic(
  topic: BacklogItem,
  provider: Provider
): Promise<ResearchResult> {
  if (provider === "none") {
    return { topic, findings: [] };
  }

  if (provider === "claude-code") {
    const raw = process.env.CLAUDE_CODE_RESEARCH;
    if (!raw) return { topic, findings: [] };
    try {
      const parsed = JSON.parse(raw) as ResearchFinding[];
      return { topic, findings: parsed };
    } catch {
      return { topic, findings: [] };
    }
  }

  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not set");
  }

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: `${topic.primaryKeyword} insurance agency 2026`,
      search_depth: "advanced",
      max_results: 6,
      include_answer: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`Tavily search failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as TavilyResponse;
  const findings: ResearchFinding[] = data.results.map((r) => ({
    url: r.url,
    title: r.title,
    snippet: r.content.slice(0, 600),
  }));

  return { topic, findings };
}
