import type { MetadataRoute } from "next";

const SITE_URL = "https://renewalengineai.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /login and /set-password are deliberately NOT disallowed. They carry
        // `noindex` in their route metadata, and a crawler has to be able to
        // fetch a page to see that directive — disallowing them here would
        // leave already-known auth URLs sitting in the index as "Indexed,
        // though blocked by robots.txt" with no way for Google to drop them.
        // Crawl-blocking and noindex are mutually exclusive; noindex is the
        // one that actually removes a URL.
        //
        // /dashboard/ stays disallowed: it is auth-gated and middleware
        // redirects anonymous requests to /login, so there is no indexable
        // content behind it and blocking preserves crawl budget.
        disallow: ["/api/", "/dashboard/"],
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
      // Additional AI crawlers active in 2026
      { userAgent: "DuckAssistBot", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "Meta-ExternalFetcher", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "YouBot", allow: "/" },
      { userAgent: "TurnitinBot", allow: "/" },
      { userAgent: "facebookexternalhit", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
