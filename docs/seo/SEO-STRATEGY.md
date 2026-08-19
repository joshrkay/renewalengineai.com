# SEO Strategy — RenewalEngineAI

**Prepared:** 2026-08-18/19. **Owner:** Josh Kay (solo founder, DIY execution — no content/link-building budget beyond founder time).
**Supersedes:** the self-serve-trial conversion architecture in the unmerged `docs/GROWTH-PLAN.md` draft (PR #24) — deprioritized, see §0.

See also: [SITE-STRUCTURE.md](./SITE-STRUCTURE.md) (current architecture + gaps), [COMPETITOR-ANALYSIS.md](./COMPETITOR-ANALYSIS.md), [CONTENT-CALENDAR.md](./CONTENT-CALENDAR.md), [IMPLEMENTATION-ROADMAP.md](./IMPLEMENTATION-ROADMAP.md).

---

## 0. Where this plan starts from (confirmed decisions)

1. **Business model stays done-for-you only.** Audit ($1,500) → Build & Launch ($6,000) → Managed Ops ($2,500/mo). No self-serve SaaS trial — the two-path architecture in the unmerged growth-plan draft is not being built. Content and CTAs should route to booking, not a signup flow that doesn't exist.
2. **Two funnels share one domain and both matter:** the done-for-you service, and the DIY education line (AI Agency Ops Bootcamp $797, AI for Agent Retention $397, Mastermind, Team Licenses). Content should route each reader to whichever funnel fits their stated intent ("at capacity, want it handled" → service; "want to learn it myself" → courses).
3. **Competitor stance is dual:** compete for search visibility via `/compare` pages against Strada and Sonant AI (keep the current framing — real alternatives agencies choose between), **and** separately pursue vendor-referral partnerships with the same and adjacent vendors as a distribution channel. These are not in tension as long as comparison content stays fit-based ("who this suits") rather than adversarial ("why they're worse") — see [COMPETITOR-ANALYSIS.md](./COMPETITOR-ANALYSIS.md) §4.
4. **Execution capacity is one person.** Every recommendation below is sized for that — no items assume a writer, an agency, or a paid-ads budget.

---

## 1. Business snapshot

RenewalEngineAI (founded 2025-12-01) builds and runs AI automation — renewal campaigns, instant lead response, quote follow-up — for independent P&C insurance agencies on Applied Epic, HawkSoft, or EZLynx. Zero organic traffic history: the domain property was only just connected to Search Console and the sitemap only just submitted (2026-08-18), so there is no ranking baseline yet — treat all 3/6/12-month KPI targets below as first estimates, not calibrated forecasts.

## 2. The actual starting condition (read before trusting any prior plan)

This matters more than it would for a typical SEO engagement: **the site has not deployed successfully since 2026-04-28.** Every push since then — 30+ commits, three open PRs, a fully-drafted 12-article content backlog — has been sitting on `main` or on feature branches without reaching production, because of a Vercel-side deploy failure (see [IMPLEMENTATION-ROADMAP.md](./IMPLEMENTATION-ROADMAP.md) Phase 0). The live site has looked healthy this whole time only because Vercel keeps serving the last successful build instead of a broken one.

Practically: **almost none of the content, technical, or CRO work below is genuinely "to do" — most of it is already written and merged, just not live.** The highest-leverage action in this entire plan is unblocking the deploy pipeline, not producing new material. Do not start new content work in Phase 1 without first confirming the pipeline is unblocked — writing article #13 while 12 finished articles sit undeployed is the wrong order of operations.

Merging the PR #25 code fix did **not** unblock production: the resulting deploy still failed, with `BUILD_FAILED — "Resource provisioning failed"` in ~600ms, before the build container even starts. This pattern is identical across every failed deploy since April 25 regardless of what code changed, and a sibling Vercel project on the same team (`rivet-marketing`) has clean recent deploys — so it's not an account-wide billing issue, it's specific to this project. That error shape at that speed is Vercel's generic failure for a Marketplace integration (Postgres/KV/Blob) that can't be provisioned or bound, and this repo depends on Prisma/a database — most likely a disconnected, expired, or removed Storage resource. This needs to be checked directly in the Vercel dashboard (Storage tab; Settings → Environment Variables for `DATABASE_URL`/`POSTGRES_URL`) — not visible or fixable via the tools available to this plan.

## 3. Goals (both funnels, ranked)

1. **Qualified audit bookings from organic/AI search** for independent P&C agencies on Epic/HawkSoft/EZLynx — the primary revenue path.
2. **Course and Mastermind traffic/sales from the same content** — a reader not ready for a $1,500 audit is often ready for a $397–797 course; route accordingly rather than losing them.
3. **Category ownership of the evaluation-phase SERP** ("Sonant vs Liberate," "how to evaluate an AI vendor for a P&C agency," "AMS AI integration") — this serves both funnels and the partnership motion simultaneously, since vendors want to be found via a neutral integrator.

## 4. Target information architecture

No change to the top-level shape documented in [SITE-STRUCTURE.md](./SITE-STRUCTURE.md) — the gap is depth, not structure. Priority additions, in order:

1. `/integrations/applied-epic`, `/integrations/hawksoft`, `/integrations/ezlynx` — named-AMS landing pages splitting out what's currently buried inside one guide. High-intent: the buyer already has the AMS and is searching for what plugs into it.
2. 3 more named case studies (real, not composite) — see [IMPLEMENTATION-ROADMAP.md](./IMPLEMENTATION-ROADMAP.md) Phase 2. Case-study depth matters more for a $6k+ purchase than blog-post volume.
3. `/glossary` — cheap to produce, targets definitional queries, and is exactly the passage shape AI answer engines cite (short, self-contained, no context needed).
4. One DIY-CRM comparison (`renewalengineai-vs-gohighlevel` or similar) alongside the existing Strada/Sonant/hiring-a-CSR pages.

## 5. Technical foundation

Mostly already strong — don't rebuild what works:

- Schema coverage is good: `Organization`/`Person`/`WebSite`/`Service` graph, per-page `FAQPage`/`Article`/`Course`/`BreadcrumbList`. Keep it current as new page types ship.
- `robots.txt` already allowlists every major AI crawler (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) — ahead of most competitors on this specific point.
- Dynamic `sitemap.ts`/`robots.ts` pattern is sound; sitemap is now submitted to GSC (26 URLs, confirmed indexed 2026-08-18).

Gaps to close (see roadmap for sequencing):
- `/llms.txt` currently 404s despite a commit claiming it was added — low priority (Google ignores it; unclear how much weight other engines give it) but cheap to fix and consistent with the AI-crawler-friendly stance already taken elsewhere.
- No AI-referral tracking (GA4/Humblytics don't currently parse `chatgpt.com`/`perplexity.ai`/`gemini` referrers or distinguish AI-crawler hits from human traffic) — can't currently measure whether the GEO investment is working.
- Course lesson pages lack `FAQPage`/review schema at the per-article level (home has it, lessons don't).

## 6. Content strategy

Full plan in [CONTENT-CALENDAR.md](./CONTENT-CALENDAR.md). Summary: the automated weekly content engine (GitHub Actions, `content/resources/_backlog.json`) already produced all 12 originally-backlogged articles — they're written and merged, just not deployed. Once live, the backlog is empty. Before adding new topics, fix the two things that made the engine invisible for 4 months (missing GH secrets, and the fact nobody would have seen the output anyway given the deploy blocker) — see roadmap Phase 1.

New topics after the backlog clears should skew toward the gaps in §4 above (AMS-specific landing pages, glossary, one more comparison) rather than more generic retention/automation posts — those are now well covered.

## 7. GEO / AI-search readiness

Already ahead of the visible competitive set on crawler access (robots.txt allowlist) and schema. The gap is measurement (§5) and the neutral-comparison content that AI answer engines are most likely to cite when a user asks "should I use Sonant or RenewalEngineAI" — the existing `/compare` pages are well-suited for this if kept genuinely balanced (see [COMPETITOR-ANALYSIS.md](./COMPETITOR-ANALYSIS.md) §4 on why adversarial framing costs more than it gains).

## 8. KPI targets

Baseline is effectively zero (GSC only just connected, no ranking history). Treat these as directional, to be recalibrated after the first full month of real GSC data post-deploy-fix:

| Metric | Baseline (2026-08) | 3 Month | 6 Month | 12 Month |
|---|---|---|---|---|
| Indexed pages | 26 | 40+ (integrations, glossary, 3rd case study) | 50+ | 60+ |
| Organic clicks/mo (GSC) | ~0 (just connected) | First measurable traffic | Steady month-over-month growth | Primary lead source alongside referral partnerships |
| Audit bookings from organic | 0 tracked | Attribution wired up, first attributed booking | 2–3/mo attributed | 5+/mo attributed |
| Course/Mastermind traffic from content | Not tracked | Attribution wired up | Measurable cross-funnel routing | Meaningful secondary revenue signal |
| Named case studies live | 2 (composite) | 3 (at least 1 real, named) | 5 named | 5+ named, refreshed |
| Vendor referral partnerships active | 0 | Outreach sent to 2–3 vendors | 1 formal agreement | 1–2 active, producing referrals |

## 9. Success criteria

- Deploy pipeline unblocked and verified staying unblocked (a single fix that doesn't hold isn't success).
- Content engine actually publishing weekly without manual intervention.
- At least one KPI in §8 has real (non-zero, non-estimated) data behind it within 60 days.
- No new content work started while a content backlog already sits unpublished — this plan explicitly forbids re-litigating that mistake.
