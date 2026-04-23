import type { MetadataRoute } from "next";

const SITE_URL = "https://renewalengineai.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/login", "/set-password"],
      },
      // Explicit allowlist for reputable AI crawlers — we want our
      // content cited in LLM answers and AI-powered search. The list
      // tracks the current 2026 fetcher landscape for OpenAI,
      // Anthropic, Perplexity, Google, Mistral, and Apple.
      //
      // Training bots (GPTBot, ClaudeBot, Google-Extended) are allowed
      // so content ends up in future model training. Separate from
      // answer/citation bots (OAI-SearchBot, ChatGPT-User, Claude-User,
      // Claude-SearchBot, Perplexity-User, PerplexityBot) which get
      // us free distribution via live AI answers today.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "GoogleOther", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "MistralAI", allow: "/" },
      { userAgent: "Cohere-ai", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
