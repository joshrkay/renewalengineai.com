# Implementation Roadmap — RenewalEngineAI SEO Plan

**Prepared:** 2026-08-18/19. **Refreshed:** 2026-08-26 — Phase 1 largely cleared by the deploy fix; phases renumbered against what is actually left.
Sized for one person (Josh, solo/DIY). No hired writer, no link-building budget, no paid ads — see [SEO-STRATEGY.md](./SEO-STRATEGY.md) §0.

---

## Phase 0 — Done

**2026-08-18/19**
- ✅ Sitemap submitted to GSC for `sc-domain:renewalengineai.com` — status Success, 26 pages.
- ✅ PR #25 reviewed and merged.

**2026-08-26 — the deploy outage ended**
- ✅ **Root-caused the four-month deploy failure.** Not billing (investigated and wrongly reported as such first), not the code, not the framework preset, not `nodeVersion`, not the git integration. The Vercel project's internal state was corrupt.
- ✅ **Migrated to a new Vercel project** (`renewalengineai-com-v2`) from the identical repo/commit/settings and moved the domain. Built READY in ~90s — first success since 2026-04-28.
- ✅ **74 URLs live**, up from 26: 12 resource articles, 28 glossary URLs, integrations hub, 2 new comparison pages.
- ✅ PR #28 merged: `/about` → `/team` 308 (was a 404 in the GSC report), `/pricing` 308 permanent, doubled brand suffix fixed on `/free-guide` and `/future-of-insurance`, `/free-guide` canonicalised to `/guides/5-ai-automations`, `package-lock.json` repaired (only 3 of rollup's 26 platform binaries were recorded, so clean `npm ci` failed).
- ✅ `/llms.txt` fixed (Phase 1 item 5 from the prior plan). `/favicon.ico` and a real 404 page landed via PRs #26/#27.

---

## Phase 1 — Finish the unblock (days, not weeks)

These are all small, and three of them are consequences of the migration rather than SEO work. Nothing in Phase 2 depends on them except item 2.

1. **Add the Stripe env vars to `renewalengineai-com-v2`** (needs Josh — secrets): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`. `/api/stripe/checkout` throws without them. Only these 3 of the old project's 19 vars matter — the 16 `SUPABASE_*`/`POSTGRES_*` ones are referenced nowhere in the code. Re-point the Stripe webhook if its URL changed.
2. **Get Search Console access, then resubmit the sitemap and request indexing** (needs Josh). The property sits on `joshrkay@gmail.com`; the practical unblock is **Settings → Users and permissions → Add user → `jkay@vector48.ai` → Full**, which keeps ownership unchanged. Google is still working from the 26-URL sitemap that lists `/about` and `privacy.html`. This is acceleration, not correction — Google will recrawl `/sitemap.xml` unprompted — but it is the difference between weeks and months on 48 new URLs.
3. **Fix the content engine, both halves together** (needs Josh for the secrets):
   ```
   gh secret set ANTHROPIC_API_KEY --repo joshrkay/renewalengineai.com
   gh secret set TAVILY_API_KEY   --repo joshrkay/renewalengineai.com
   ```
   *and* reconcile the status flags — `_backlog.json` marks all 12 items `drafted` while the runner looks for `pending`. The 2026-08-24 run reports success but its log says `no pending topics in backlog — nothing to do`; it never touched an API key. The three runs before it died on `Error: TAVILY_API_KEY is not set`. **Don't trust a green run until one produces an actual article.** Mark the 12 shipped items `published` while you're in the file.
4. **Delete the old `renewalengineai-com` Vercel project** once the new one has ~a week of clean deploys. Leaving both risks someone redeploying or re-pointing DNS at the dead one.
5. **Re-test `POST /api/mastermind/invite`.** It 500'd against the stale build; the route now exists and returns 405 to GET, so it's wired. Untested against real input.

## Phase 2 — Make the new footprint earn (weeks 1–8)

Everything here is new work, unlike Phase 1. Ordered by leverage.

1. **Audit internal linking across all 15 resource articles.** Twelve of them have never been checked against a live site. Each should link to (a) the matching `/compare/*` page and (b) either `/courses` or `/#pricing` by reader intent. Add "see this in practice" links from the strongest guides into `/case-studies/*`, which nothing currently links to.
2. **Link the glossary in.** 28 URLs went live at once with almost nothing pointing at them — the most orphaned section on the site. Contextual `/resources/*` → `/glossary/[term]` links are cheap and the fastest route to getting them crawled.
3. **Wire AI-referral tracking.** GA4/Humblytics don't distinguish `chatgpt.com`/`perplexity.ai`/`gemini` referrers or AI-crawler hits. Until this exists, no GEO decision is falsifiable. Largest remaining technical gap.
4. **Decide the course-preview question.** 25 of 27 lessons are `noindex` behind the paywall. Promoting 3–5 to `preview: true` is the cheapest available increase in indexable footprint. Commercial call — the tradeoff is giving away course content for search visibility.
5. **Send the vendor one-pagers to Sonant and Strada** (2 vendors, not 5 — [COMPETITOR-ANALYSIS.md](./COMPETITOR-ANALYSIS.md) §4). Nearly free: they reuse positioning already live on `/compare`. Stronger now that those pages actually resolve for anyone who checks.
6. **Apply to the Catalyit implementation-partner listing.** Highest-leverage distribution move identified in the original research; Sonant is already listed.
7. **Merge the two research/strategy docs from PR #22** (`docs/competitor-research-2026-04.md`, `docs/gtm-marketing-playbook-2026-04.md`) on their own, separate from that PR's code changes. Pure-documentation merges carry no deploy risk.

## Phase 3 — Proof and calibration (months 3–6)

1. **Land the third named case study** — real customer, not composite. The only structural gap left from the original priority list, and the one that needs a person rather than a page. Coordinate with whichever agency is furthest into a successful Managed Ops engagement.
2. **First full month of real GSC data** — recalibrate [SEO-STRATEGY.md](./SEO-STRATEGY.md) §8 against actual numbers. The current targets were set against a baseline of 1 indexed page and are estimates, not forecasts.
3. **Per-article `FAQPage`/review schema on course lessons** (home has it, lessons don't).
4. **Revisit vendor outreach** based on Phase 2 response — expand to Liberate/Better Agency/Momentum only if the first two produced signal.

## Phase 4 — Authority (months 6–12)

1. Fourth and fifth named case studies.
2. Reassess a performance-guarantee Managed Ops tier (from PR #22 research) with real retention data instead of a hypothesis.
3. Founder distribution (LinkedIn, podcast guest spots) — now unblocked in a way it wasn't: the content foundation is finally live and worth pointing at.

## Explicit non-goals

- No self-serve SaaS trial or the two-path conversion architecture around it.
- No proprietary voice SKU, no prompt-library "product," no dashboard positioned as software — stay the vendor-agnostic integrator ([COMPETITOR-ANALYSIS.md](./COMPETITOR-ANALYSIS.md) §5).
- No paid ad spend, no hired writer, no link-building budget.
- **No new content topics until the engine is proven** (Phase 1.3) — the old rule was "not until the backlog ships," which is now satisfied. The replacement rule: don't feed a pipeline that can't run.

## A note on expectations

The four-month outage is fixed, but its cost isn't yet visible. Google has seen 1 of these 74 URLs. The 23 "Discovered – currently not indexed" entries are a crawl-budget symptom of a young, low-authority domain — they clear slowly and only partly, and no on-page work forces them. Expect the indexed count to climb over weeks, not days, and expect it to plateau below the published count. That is normal, not a regression.
