# Implementation Roadmap — RenewalEngineAI SEO Plan

**Prepared:** 2026-08-18/19. Sized for one person (Josh, solo/DIY). Every phase below assumes no hired writer, no link-building budget, no paid ads — see [SEO-STRATEGY.md](./SEO-STRATEGY.md) §0.

---

## Phase 0 — Already done this session (2026-08-18/19)

- ✅ Sitemap identified (`https://renewalengineai.com/sitemap.xml`) and submitted to Google Search Console for the `sc-domain:renewalengineai.com` property — status: **Success**, 26 pages discovered.
- ✅ PR #25 reviewed (clean merge, type-check clean, production build clean, 132/132 tests pass, auth/entitlements fix is sound) and merged to `main`.
- 🔴 Production deploy from that merge **still failed** — different, more fundamental cause than PR #25 fixed. See Phase 1, item 1.

## Phase 1 — Foundation (do these before any content work; nothing else in this plan matters until they're done)

1. **Unblock the Vercel Storage/deploy issue (blocking, needs Josh).** Root cause is not billing (ruled out via a clean sibling project on the same team) — check the `renewalengineai-com` project's **Storage tab** for a disconnected/expired/removed Postgres/KV/Blob resource, and **Settings → Environment Variables** for a `DATABASE_URL`/`POSTGRES_URL` pointing at something that no longer exists. Once fixed, trigger a redeploy of `main` (or push any small commit) and confirm `renewalengineai.com/pricing` returns 200 instead of 404 — that's the fastest live signal the new build actually promoted (it 404s on the stale April 28 build, ships in the May 16 commit already on `main`).
2. **Set the 2 missing GitHub Actions secrets (blocking the content engine, needs Josh, values never shared with me):**
   ```
   gh secret set ANTHROPIC_API_KEY --repo joshrkay/renewalengineai.com
   gh secret set TAVILY_API_KEY --repo joshrkay/renewalengineai.com
   ```
   Then test manually: `gh workflow run weekly-content.yml --repo joshrkay/renewalengineai.com`. (`GH_PAT`, listed in the old `docs/metrics/weekly-log.md` checklist, is not actually required by the current script — `GITHUB_TOKEN` is auto-provided by Actions.)
3. **Confirm the 12-article backlog actually ships** once 1 and 2 are resolved — check `/resources/[slug]` for each of the 12 topics listed in [CONTENT-CALENDAR.md](./CONTENT-CALENDAR.md) §1 returns 200, and that they appear in the live `/sitemap.xml`.
4. **Re-verify the homepage lead-capture endpoint.** `POST /api/mastermind/invite` returned 500 when tested against the currently-live (stale) build — but the route exists and looks correct on the merged `main` branch, so this may resolve itself once the new build is live. Re-test after Phase 1.1 lands; don't debug the old build further.
5. **Fix `/llms.txt`** (currently 404s despite a commit claiming it was added) — low priority relative to 1–4, but cheap once the deploy pipeline works again.

## Phase 2 — Expansion (weeks 2–8 after Phase 1 clears)

1. **Merge the two research/strategy documents from PR #22** (`docs/competitor-research-2026-04.md`, `docs/gtm-marketing-playbook-2026-04.md`) on their own, separate from the rest of that PR's code changes (Retention Leak Audit component, Stripe/schema work — those need their own review and aren't part of this plan's scope). Pure-documentation merges carry no deploy risk.
2. **Decide what (if anything) to salvage from PR #24's tactical findings**, independent of its superseded self-serve-trial premise: per-article `FAQPage`/review schema on course lessons, and AI-referral tracking (GA4/Humblytics don't currently distinguish `chatgpt.com`/`perplexity.ai`/AI-crawler traffic — can't measure GEO ROI without it). Both are small, standalone, and don't require the trial path.
3. **Ship the 3 `/integrations/*` landing pages** (Applied Epic, HawkSoft, EZLynx) — [CONTENT-CALENDAR.md](./CONTENT-CALENDAR.md) §2.1.
4. **Publish `renewalengineai-vs-gohighlevel`** and **`sonant-vs-liberate`** — [CONTENT-CALENDAR.md](./CONTENT-CALENDAR.md) §2.2–2.3.
5. **Send the vendor one-pagers to Sonant and Strada** (2 vendors, not 5 — [COMPETITOR-ANALYSIS.md](./COMPETITOR-ANALYSIS.md) §4). These are nearly free to produce — they reuse positioning already written on the live `/compare` pages.
6. **Apply to the Catalyit implementation-partner listing.** Single highest-leverage distribution move identified in the original competitor research; Sonant is already listed there.

## Phase 3 — Scale (months 3–6)

1. **Land the third named case study** (real customer, not composite) — coordinate timing with whichever agency is furthest into a successful Managed Ops engagement by then.
2. **Build the `/glossary`** as one batched project (15–25 entries) rather than a drip — [CONTENT-CALENDAR.md](./CONTENT-CALENDAR.md) §2.4.
3. **Revisit vendor partnership outreach** based on Phase 2 response — expand to Liberate/Better Agency/Momentum only if the first two produced signal.
4. **First full month of real GSC data available** — recalibrate the KPI targets in [SEO-STRATEGY.md](./SEO-STRATEGY.md) §8 against actual numbers instead of estimates.

## Phase 4 — Authority (months 6–12)

1. Fourth and fifth named case studies.
2. Reassess whether a performance-guarantee Managed Ops tier (from the original PR #22 research) is worth the refund-exposure risk, now with real retention data from live customers instead of a hypothesis.
3. Founder distribution (LinkedIn, podcast guest spots) — only once the content foundation above is live and generating something worth talking about; doing this before Phase 1–2 land would be promoting a broken funnel.

## Explicit non-goals (carried from decisions made this session)

- No self-serve SaaS trial or the two-path conversion architecture built around it.
- No proprietary voice SKU, no prompt-library "product," no dashboard positioned as software — stay the vendor-agnostic integrator ([COMPETITOR-ANALYSIS.md](./COMPETITOR-ANALYSIS.md) §5).
- No paid ad spend, no hired writer, no link-building budget — everything above is scoped to fit inside founder time alone.
- No new content topics added to the backlog until the current 12-article batch is confirmed live — see [CONTENT-CALENDAR.md](./CONTENT-CALENDAR.md) §1.
