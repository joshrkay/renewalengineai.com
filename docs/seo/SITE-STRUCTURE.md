# Site Structure — renewalengineai.com

Snapshot as of 2026-08-18. Source of truth for URLs is `src/app/sitemap.ts` — update that file first, this doc second.

## Current architecture (26 indexed URLs)

```
/                                          Home (hero, pricing, FAQ schema)
├── /how-it-works                         Service pillar page
├── /for-independent-agencies             Audience pillar page
├── /team, /team/josh-kay                 About / founder E-E-A-T
├── /pricing (anchor: /#pricing)          Audit $1,500 · Build & Launch $6,000 · Managed Ops $2,500/mo
│
├── /resources                            Blog/resource hub
│   ├── /resources/ai-renewal-automation-playbook
│   ├── /resources/instant-lead-response-under-60-seconds
│   └── /resources/ams-ai-integration-guide
│
├── /case-studies                         Proof hub
│   ├── /case-studies/ridgeline-commercial-insurance
│   └── /case-studies/pacific-agency-group-personal-lines
│
├── /compare                              Comparison hub
│   ├── /compare/renewalengineai-vs-strada
│   ├── /compare/renewalengineai-vs-sonant-ai
│   └── /compare/renewalengineai-vs-hiring-csr
│
├── /courses                              DIY education funnel (separate monetization track)
│   ├── /courses/ai-agency-ops-bootcamp ($797) + 1 published lesson
│   ├── /courses/ai-for-agent-retention ($397) + 1 published lesson
│   ├── /mastermind ($97–197/mo membership)
│   └── /team-licenses (custom, 3–50 seats)
│
├── /integrations                         AMS hub (added 2026-08-24)
│   ├── /integrations/applied-epic
│   ├── /integrations/hawksoft
│   └── /integrations/ezlynx
│
├── /glossary                             27 defined terms (added 2026-08-24)
│   └── /glossary/[slug]                  DefinedTerm entries
│
├── /guides/5-ai-automations              Lead magnet landing page
├── /free-guide                           Lead magnet landing page (same asset, different framing)
├── /future-of-insurance                  Ebook landing page
└── /privacy, /terms
```

Note on the two lead-magnet pages: `/guides/5-ai-automations` and `/free-guide` promote the same asset with different copy and different H1s. Both are explicitly `index: true` and both are now in the sitemap. If Google starts reporting one as a duplicate of the other, canonicalise `/free-guide` to `/guides/5-ai-automations` rather than removing it — it is the paid-traffic landing page.

Two funnels share one domain: **done-for-you service** (Audit → Build & Launch → Managed Ops) and **DIY education** (Bootcamp/Retention courses → Mastermind → Team Licenses). Both need to be reachable from organic content — see [CONTENT-CALENDAR.md](./CONTENT-CALENDAR.md) for how individual articles route to one or the other based on reader intent ("at capacity, want it done" vs. "want to learn it myself").

## Gaps vs. a mature site in this niche

| Gap | Why it matters | Priority |
|---|---|---|
| Only 3 published resource articles; 12 more sit in `content/resources/_backlog.json` with `status: pending` | Thin content footprint for a niche this specific — see [IMPLEMENTATION-ROADMAP.md](./IMPLEMENTATION-ROADMAP.md) Phase 1, the content engine that should be publishing these is broken | Critical |
| ~~No dedicated `/integrations/*` pages~~ | **Closed 2026-08-24.** `/integrations` hub plus `/integrations/applied-epic`, `/integrations/hawksoft`, `/integrations/ezlynx`, each with `SoftwareApplication` entity markup so answer engines can resolve "does X work with Applied Epic". | Done |
| Only 2 case studies | Case studies are the highest-trust asset for a $6k+ service purchase; thin proof is a bigger risk than thin blog content | High |
| ~~No `/glossary` hub~~ | **Closed 2026-08-24.** 27 terms under `/glossary`, split across Agency Operations, Lines of Business, Metrics, Growth, and AI & Automation. Each entry opens with a self-contained one-sentence definition and carries `DefinedTerm` markup inside a site-wide `DefinedTermSet`. A FAQ hub beyond the homepage `FAQPage` schema is still open. | Partly done |
| Only 1 comparison page per named competitor, none for adjacent categories (GoHighLevel/generic CRM automation, hiring an agency/consultancy) | `renewalengineai-vs-hiring-csr` already covers the "build it yourself" alternative; a GoHighLevel-style DIY-CRM comparison is still missing | Medium |
| Course content (27 lessons) has only 2 individual lesson URLs in the sitemap | **Verified 2026-08-24: intentional.** Exactly 2 lessons carry `preview: true`; `sitemap.ts` filters on that flag and paywalled lessons render `noindex`. The open question is commercial, not technical — 25 lessons of substantive content are invisible to search, and promoting a few more to preview is the cheapest way to grow the indexable footprint. | Low — decision pending |
| No location or "near me" pages | Correctly out of scope — this is a national remote service, not brick-and-mortar. Don't add location pages; would violate the sitemap skill's programmatic-SEO quality gates for no real reason. | N/A |

## Internal linking notes

- `/compare/*` pages already link back to `/how-it-works` and the relevant `/resources/*` guide — good pattern, replicate for every new comparison page.
- `/resources/*` articles should each get a contextual link to the matching `/compare/*` page and to either `/courses` (DIY reader) or `/#pricing` (done-for-you reader) — audit current 3 published articles for this before writing new ones.
- Case studies aren't currently linked from `/resources/*` articles — add "see this in practice" links from at least the 3 published guides to `/case-studies/*`.
