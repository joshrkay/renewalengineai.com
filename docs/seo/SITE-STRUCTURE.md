# Site Structure — renewalengineai.com

Snapshot as of **2026-08-26** (first refresh since the site actually deployed). Source of truth for URLs is `src/app/sitemap.ts` — update that file first, this doc second.

**74 URLs live** (was 26 while production was stuck on the 2026-04-23 build — see [SEO-STRATEGY.md](./SEO-STRATEGY.md) §2). **1 indexed** in GSC; Google has not yet recrawled the new sitemap.

## Current architecture

```
/                                          Home (hero, pricing, FAQ schema)
├── /how-it-works                         Service pillar page
├── /for-independent-agencies             Audience pillar page
├── /team, /team/josh-kay                 About / founder E-E-A-T
├── /pricing                              → 308 /#pricing (no standalone page; legacy URL)
├── /about, /about.html                   → 308 /team (legacy static-site URLs)
│
├── /resources                            Blog/resource hub — 15 articles (was 3)
│   ├── ai-renewal-automation-playbook          ├── pii-compliance-ai-insurance-agencies
│   ├── instant-lead-response-under-60-seconds  ├── quote-follow-up-sequences-that-actually-bind
│   ├── ams-ai-integration-guide                ├── book-segmentation-for-ai-outreach
│   ├── ams-data-export-checklist               ├── evaluating-ai-vendors-insurance-agencies
│   ├── renewal-retention-math-for-p-and-c-...  ├── producer-workflows-post-ai
│   ├── lead-response-time-benchmarks-insurance ├── commercial-lines-ai-renewal-automation
│   ├── ai-tools-vs-hiring-a-csr                └── 30-60-90-day-ai-rollout-plan
│   └── cross-sell-triggers-for-independent-agencies
│
├── /case-studies                         Proof hub — 2 pages, both composite
│   ├── /case-studies/ridgeline-commercial-insurance
│   └── /case-studies/pacific-agency-group-personal-lines
│
├── /compare                              Comparison hub — 5 pages
│   ├── renewalengineai-vs-strada           ├── renewalengineai-vs-gohighlevel
│   ├── renewalengineai-vs-sonant-ai        └── sonant-vs-liberate  (neutral, third-party)
│   └── renewalengineai-vs-hiring-csr
│
├── /integrations                         AMS hub — SoftwareApplication markup
│   ├── /integrations/applied-epic  ├── /integrations/hawksoft  └── /integrations/ezlynx
│
├── /glossary                             27 terms + hub = 28 URLs, DefinedTerm/DefinedTermSet
│   └── /glossary/[slug]
│
├── /courses                              DIY education funnel (separate monetization track)
│   ├── /courses/ai-agency-ops-bootcamp ($797) + 1 preview lesson
│   ├── /courses/ai-for-agent-retention ($397) + 1 preview lesson
│   ├── /mastermind ($97–197/mo membership)
│   └── /team-licenses (custom, 3–50 seats)
│
├── /guides/5-ai-automations              Lead magnet — canonical target
├── /free-guide                           Lead magnet — canonical → /guides/5-ai-automations
├── /future-of-insurance                  Ebook landing page
├── /llms.txt, /favicon.ico, /robots.txt  All 200 (llms.txt was 404 until 2026-08-26)
└── /privacy, /terms
```

**Lead-magnet duplication — resolved.** `/guides/5-ai-automations` and `/free-guide` carried the same title and the same five automations. As the prior version of this doc predicted, `/free-guide` is now canonicalised to `/guides/5-ai-automations` (the guide carries the HowTo schema and is the page meant to rank). `/free-guide` stays live as the paid-traffic landing page. `/free-guide/thank-you` and `/future-of-insurance/read` remain correctly `noindex`.

Two funnels share one domain: **done-for-you service** (Audit → Build & Launch → Managed Ops) and **DIY education** (Bootcamp/Retention → Mastermind → Team Licenses). Both need to be reachable from organic content — see [CONTENT-CALENDAR.md](./CONTENT-CALENDAR.md).

## Gaps vs. a mature site in this niche

| Gap | Why it matters | Priority |
|---|---|---|
| ~~Only 3 published resource articles; 12 sit undeployed~~ | **Closed 2026-08-26.** All 15 live. The 12 shipped not by writing but by fixing the deploy. | Done |
| **Only 2 case studies, both composite** | Highest-trust asset for a $6k+ purchase. Now the **only** structural gap left from the original §4 priority list, and the one that can't be solved by writing — it needs a real customer willing to be named. | **High — top open item** |
| ~~No `/integrations/*` pages~~ | **Closed 2026-08-24, live 2026-08-26.** Hub + 3 AMS pages with `SoftwareApplication` markup so answer engines can resolve "does X work with Applied Epic". | Done |
| ~~No `/glossary` hub~~ | **Closed 2026-08-24, live 2026-08-26.** 27 terms, each opening with a self-contained one-sentence definition under `DefinedTerm`/`DefinedTermSet`. A FAQ hub beyond the homepage `FAQPage` is still open. | Mostly done |
| ~~No DIY-CRM comparison~~ | **Closed.** `renewalengineai-vs-gohighlevel` plus the neutral `sonant-vs-liberate` are live. | Done |
| 25 of 27 course lessons are `noindex` | Intentional and correct as a paywall decision — exactly 2 lessons carry `preview: true` and `sitemap.ts` filters on that flag. But it leaves a large body of substantive content invisible to search. Promoting 3–5 more to preview is the cheapest available increase in indexable footprint. | Medium — **commercial decision, not technical** |
| No AI-referral tracking | Can't measure whether the GEO work (glossary, crawler allowlist, comparison pages) produces anything. Makes the next GEO decision unfalsifiable. | Medium |
| No location or "near me" pages | Correctly out of scope — national remote service, not brick-and-mortar. Don't add them. | N/A |

## Internal linking notes

Now genuinely auditable for the first time — previously these checks ran against a stale build.

- `/compare/*` pages link back to `/how-it-works` and the relevant `/resources/*` guide — good pattern, replicate for every new comparison page.
- `/resources/*` articles should each link to the matching `/compare/*` page and to either `/courses` (DIY reader) or `/#pricing` (done-for-you reader). **Audit all 15 now**, not just the original 3 — the 12 newly-live articles have never been checked against a live site.
- Case studies still aren't linked from `/resources/*` articles — add "see this in practice" links from the most relevant guides.
- The glossary's 28 URLs are the newest and least-linked section. Contextual links from `/resources/*` into `/glossary/[term]` are cheap, natural, and the fastest way to get 28 orphan-ish pages crawled.

## Infrastructure note

The domain now serves from Vercel project **`renewalengineai-com-v2`**, not `renewalengineai-com`. The old project could not provision builds and should be deleted once the new one has a week of clean deploys. See [SEO-STRATEGY.md](./SEO-STRATEGY.md) §2.
