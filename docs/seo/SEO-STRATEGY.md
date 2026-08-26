# SEO Strategy — RenewalEngineAI

**Prepared:** 2026-08-18/19. **Refreshed:** 2026-08-26 (deploy pipeline unblocked — §2 rewritten, §4 closed out, §8 rebaselined).
**Owner:** Josh Kay (solo founder, DIY execution — no content/link-building budget beyond founder time).
**Supersedes:** the self-serve-trial conversion architecture in the unmerged `docs/GROWTH-PLAN.md` draft (PR #24) — deprioritized, see §0.

See also: [SITE-STRUCTURE.md](./SITE-STRUCTURE.md) (current architecture + gaps), [COMPETITOR-ANALYSIS.md](./COMPETITOR-ANALYSIS.md), [CONTENT-CALENDAR.md](./CONTENT-CALENDAR.md), [IMPLEMENTATION-ROADMAP.md](./IMPLEMENTATION-ROADMAP.md).

---

## 0. Where this plan starts from (confirmed decisions)

1. **Business model stays done-for-you only.** Audit ($1,500) → Build & Launch ($6,000) → Managed Ops ($2,500/mo). No self-serve SaaS trial — the two-path architecture in the unmerged growth-plan draft is not being built. Content and CTAs should route to booking, not a signup flow that doesn't exist.
2. **Two funnels share one domain and both matter:** the done-for-you service, and the DIY education line (AI Agency Ops Bootcamp $797, AI for Agent Retention $397, Mastermind, Team Licenses). Content should route each reader to whichever funnel fits their stated intent ("at capacity, want it handled" → service; "want to learn it myself" → courses).
3. **Competitor stance is dual:** compete for search visibility via `/compare` pages against Strada and Sonant AI, **and** separately pursue vendor-referral partnerships with the same and adjacent vendors as a distribution channel. Not in tension as long as comparison content stays fit-based ("who this suits") rather than adversarial — see [COMPETITOR-ANALYSIS.md](./COMPETITOR-ANALYSIS.md) §4.
4. **Execution capacity is one person.** Every recommendation below is sized for that — no items assume a writer, an agency, or a paid-ads budget.

---

## 1. Business snapshot

RenewalEngineAI (founded 2025-12-01) builds and runs AI automation — renewal campaigns, instant lead response, quote follow-up — for independent P&C insurance agencies on Applied Epic, HawkSoft, or EZLynx. Zero organic traffic history: the domain property was connected to Search Console on 2026-08-18 and, as of this refresh, **still shows 1 indexed URL** — because everything below was invisible to Google until 2026-08-26. Treat all 3/6/12-month KPI targets in §8 as first estimates, not calibrated forecasts.

## 2. Starting condition — RESOLVED 2026-08-26

> **Historical.** This section described the plan's central blocker. It is fixed. Kept because the diagnosis explains why the KPI baseline is what it is, and because the failure mode is worth recognising if it recurs.

From **2026-05-03 to 2026-08-26 the site did not deploy.** Every Vercel deployment failed with `BUILD_FAILED — "Resource provisioning failed"` in under a second, before a build container existed — no logs, no build events. Last good deploy was `6c92a724` (2026-04-28). Production served the 2026-04-23 build for four months while ~39 commits, a 12-article content backlog, the glossary, and the integrations hub sat merged on `main` and unseen.

**Cause: the Vercel project's internal state was corrupt.** Ruled out along the way, each verified rather than assumed: the code (clean `npm ci` + `next build` passes, 107 pages), the framework preset, `nodeVersion` (`24.x` *is* valid — probe the API with an invalid value to enumerate allowed ones), the git integration (deployments were created fine), and account-level blocks (`blocked: null`, `softBlock: null`).

**Billing was investigated and was NOT the cause.** The team showed a subscription cancelled 2026-03-06 with empty `entitlements`, which looked causal and was reported as such — wrongly. Hobby is a free tier; a downgrade never blocks deploys. The earlier version of this document reached the correct conclusion first, by noting a sibling project on the same team deploying cleanly.

**Fix:** created a new Vercel project (`renewalengineai-com-v2`) from the identical repo, commit and settings, and moved the domain. It built and went READY in ~90 seconds — the first successful build since April. The old `renewalengineai-com` project is dead weight and should be deleted once the new one has run clean for a week.

**Consequence for this plan:** the content and technical work it prescribed was already written and merged; it just needed to reach production. It has. §4 below is now closed out almost entirely — not by new work, but by four months of finished work becoming visible in one deploy.

## 3. Goals (both funnels, ranked)

1. **Qualified audit bookings from organic/AI search** for independent P&C agencies on Epic/HawkSoft/EZLynx — the primary revenue path.
2. **Course and Mastermind traffic/sales from the same content** — a reader not ready for a $1,500 audit is often ready for a $397–797 course; route accordingly rather than losing them.
3. **Category ownership of the evaluation-phase SERP** ("Sonant vs Liberate," "how to evaluate an AI vendor for a P&C agency," "AMS AI integration") — serves both funnels and the partnership motion simultaneously.

## 4. Target information architecture — priorities shipped

All four priority additions from the 2026-08-18 plan are **live as of 2026-08-26**:

| Priority (2026-08-18) | Status | Live URLs |
|---|---|---|
| `/integrations/{applied-epic,hawksoft,ezlynx}` | ✅ Live | 4 (hub + 3) |
| `/glossary` | ✅ Live | **28** (hub + 27 terms) |
| DIY-CRM comparison | ✅ Live | `renewalengineai-vs-gohighlevel`, plus `sonant-vs-liberate` |
| 3 more named case studies | ❌ **Still open** | 2 composite, 0 named |

**The one structural gap left is proof, not pages.** Case-study depth matters more for a $6k+ purchase than blog volume, and it is now the only §4 item outstanding. It is also the only one that can't be solved by writing — it needs a real customer willing to be named.

Secondary gap, decision pending: **25 of 27 course lessons are `noindex`** behind the paywall. That's intentional and correct as a paywall decision, but it means a large body of substantive content is invisible to search. Promoting 3–5 more lessons to `preview: true` is the cheapest available increase in indexable footprint. Commercial call, not a technical one.

## 5. Technical foundation

Strong, and now actually serving:

- Schema coverage is good: `Organization`/`Person`/`WebSite`/`Service` graph, per-page `FAQPage`/`Article`/`Course`/`BreadcrumbList`, `DefinedTerm`/`DefinedTermSet` across the glossary, `SoftwareApplication` on integrations pages. Keep current as new page types ship.
- `robots.txt` allowlists every major AI crawler (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) — ahead of most competitors on this specific point.
- Dynamic `sitemap.ts`/`robots.ts` pattern is sound. **Sitemap is now 74 URLs, up from 26.**
- ~~`/llms.txt` 404s~~ — **fixed**, serves 200. `/favicon.ico` and a real 404 page also landed.
- Legacy `.html` URLs 308 correctly; `/about` now 308s to `/team` instead of 404ing.

Gaps to close:
- **No AI-referral tracking.** GA4/Humblytics don't parse `chatgpt.com`/`perplexity.ai`/`gemini` referrers or distinguish AI-crawler hits from human traffic — the GEO investment is currently unmeasurable. Unchanged since 2026-08-18 and now the largest technical gap.
- **Stripe env vars are missing on the new Vercel project** (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`). `/api/stripe/checkout` will throw until set. Introduced by the migration.
- **`DATABASE_URL`, `AUTH_SECRET`, `ENCRYPTION_KEY`, `RESEND_API_KEY`, `CRON_SECRET` are missing from *both* the old and new projects** — so every Prisma-backed route (dashboard, renewals, next-auth) has been broken in production independently of the deploy issue. Pre-existing, not a migration regression, and worth deciding whether those routes are meant to work at all.
- Course lesson pages lack per-article `FAQPage`/review schema (home has it, lessons don't).

## 6. Content strategy

Full plan in [CONTENT-CALENDAR.md](./CONTENT-CALENDAR.md). The 12-article backlog is **live** — that's 15 resource articles total, up from 3.

**The content engine is still broken, and its last run was a false pass.** The 2026-08-24 run reports success, but the log reads `no pending topics in backlog — nothing to do`; it exited before touching an API key. The three runs before it failed with `Error: TAVILY_API_KEY is not set`. Both `ANTHROPIC_API_KEY` and `TAVILY_API_KEY` are unset on the repo (`gh secret list` returns nothing). There is also a **status-flag mismatch**: `_backlog.json` marks all 12 items `drafted`, while the runner looks for `pending`. So the engine will do nothing until a topic is marked `pending`, and will then fail immediately for want of a key. Fix both together or neither, and don't trust a green run until one produces an actual article.

New topics after that should skew toward the §4 gap (proof/case studies) and the course-preview decision rather than more generic retention posts — that category is now well covered at 15 articles.

## 7. GEO / AI-search readiness

Ahead of the visible competitive set on crawler access and schema, and the glossary at 28 URLs is exactly the passage shape answer engines cite — short, self-contained, no surrounding context needed. That asset went live 2026-08-26 and has never been crawled.

The gap remains **measurement** (§5). Without AI-referral tracking there is no way to tell whether any of this is working, which makes the next GEO decision unfalsifiable.

## 8. KPI targets

Rebaselined 2026-08-26. The prior baseline (26 indexed pages) described a stale build. Note the split between *published* and *indexed*: 74 URLs are live, but Google has only ever seen the old 26-URL sitemap and reports **1 indexed**. The gap between those two numbers is the single best progress signal over the next 90 days.

| Metric | Baseline (2026-08-26) | 3 Month | 6 Month | 12 Month |
|---|---|---|---|---|
| URLs published (sitemap) | **74** | 78+ (3rd case study, extra preview lessons) | 85+ | 100+ |
| URLs indexed (GSC) | **1** | 50+ | 70+ | 90+ of published |
| Organic clicks/mo (GSC) | ~0 | First measurable traffic | Steady MoM growth | Primary lead source alongside referral partnerships |
| Audit bookings from organic | 0 tracked | Attribution wired up, first attributed booking | 2–3/mo attributed | 5+/mo attributed |
| Course/Mastermind traffic from content | Not tracked | Attribution wired up | Measurable cross-funnel routing | Meaningful secondary revenue signal |
| Named case studies live | 2 (composite) | 3 (at least 1 real, named) | 5 named | 5+ named, refreshed |
| Vendor referral partnerships active | 0 | Outreach sent to 2–3 vendors | 1 formal agreement | 1–2 active, producing referrals |

**Caveat on the indexed-pages targets:** they assume Google recrawls and accepts the new sitemap at a normal rate for a young domain. The 23 URLs currently sitting in "Discovered – currently not indexed" are a crawl-budget symptom of low domain authority, not a defect — they will clear slowly and partly, and no amount of on-page work forces them. If 3-month indexed lands nearer 25 than 50, that is disappointing but not evidence anything is broken.

## 9. Success criteria

- ~~Deploy pipeline unblocked~~ — **met 2026-08-26.** Remaining condition: it stays unblocked. Confirm the new project has deployed clean for a week before deleting the old one.
- Content engine actually publishing weekly without manual intervention — **not met**, and the last green run was a no-op. A real article generated end-to-end is the only proof that counts.
- At least one KPI in §8 has real (non-zero, non-estimated) data behind it within 60 days.
- Indexed-page count moving materially off 1 — the clearest single indicator that the four-month outage is behind us.
- No new content work started while a known gap sits unfilled. The gap is now proof (case studies), not volume.
