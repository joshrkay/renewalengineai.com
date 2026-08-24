# Launch blockers & state of play — 2026-08-24

Written for future sessions and the weekly Monday review routine. Do not
re-derive any of this; verify it, then act on what changed.

## The two unblocks (both owner-only)

### 1. Vercel deploys — DOWN since 2026-04-28, account-level

Every deployment since 2026-07-12 (12+ consecutive, all branches, both
authors) fails with `BUILD_FAILED / "Resource provisioning failed"` in
~600ms with zero build-log events: the build container is never
provisioned. This is NOT a repository problem — `main` fails identically,
a redeploy was tried and failed, and commit `deda591`'s maxDuration/OG
theories were guesses at the wrong layer (the build never starts).
Project `renewalengineai-com` (team `cartboost`) reports `"live": false`.

Likely causes, in order: past-due invoice / failed payment method,
spending limit reached (pauses builds), build-execution limits exhausted,
project paused. Fix lives in the Vercel dashboard → team billing/limits.
Owner decision on 2026-08-24: owner handles this personally; sessions must
not unpause, redeploy, or modify billing.

**Consequence while down:** production serves the 2026-04-28 build. All
content merged since — PR #25 (12 pillar articles), #26 (Search Console
fixes, glossary, integrations), #27 (trust/quality overhaul, comparisons)
— is invisible to Google, AI answer engines, and buyers.

### 2. Lead email delivery — needs DNS + API key

`sendLeadMagnetDelivery()` (added in PR #27) emails leads their guide via
Resend, but two one-time setup steps remain:

1. `renewalengineai.com` is registered in the Resend account
   (ID `f3dd4d4b-a5fa-40b9-ba28-35148d3a4a76`) but unverified. Add at the
   DNS host, then run verification from the Resend dashboard:
   - TXT `resend._domainkey` → (DKIM value in the Resend dashboard)
   - MX `send` → `feedback-smtp.us-east-1.amazonses.com` (priority 10)
   - TXT `send` → `v=spf1 include:amazonses.com ~all`
2. Create an API key in the Resend dashboard and set `RESEND_API_KEY` in
   Vercel project env. Until then the send is a logged no-op (by design)
   and on-page delivery carries the funnel.

## Possible stranded leads (check before anything else)

The live 2026-04-28 build includes the /free-guide funnel writing to the
MastermindInvite table — but sendMastermindInviteNotification() no-ops
without RESEND_API_KEY, and the Resend account had no key and no verified
domain as of 2026-08-24. Leads submitted since late April were therefore
likely captured but never surfaced to anyone. Owner: pull DATABASE_URL
from Vercel env, open the table (npx prisma studio), and follow up with
every row. Sessions: no production DB credentials exist in the repo or
this environment — do not guess at them; ask the owner for a count.

Also noted: Vercel Web Analytics is NOT enabled on the project (API
returns not_found) and analytics is GA4-only — traffic claims can only be
verified from the owner's GA4 property.

## What is already done (do not redo)

- Search Console coverage fixes: merged (#26).
- Content-quality audit (6 surfaces, adversarially verified) and 100% of
  confirmed high+medium findings fixed: PR #27. Includes: no fabricated
  testimonials or invented data sources; AI-disclosure guidance corrected;
  Strada comparison rewritten to match reality; case-study math in
  commission terms; write-back claims conditioned; all CTAs coherent
  ("Book My Free Strategy Call" ≠ the $1,500 Renewal Audit); tables render
  in lessons; glossary internally linked; speakable targets the TL;DR.
- Content calendar (docs/seo/CONTENT-CALENDAR.md §2): every item that
  doesn't require a real customer is shipped — integrations ×3, glossary,
  vs-gohighlevel, sonant-vs-liberate. Per §3, do NOT add generic filler
  topics to the backlog; the next content unit is the third case study,
  which needs a real client.
- Weekly review routine: Mondays 13:00 UTC, fresh session, push+email
  notifications (trigger `trig_01LJa2SQzVsAtf93f68sQu4f`).

## Goal arithmetic (honest, as of 2026-08-24)

$10K MRR by November = 4 Managed Ops clients ($2,500/mo) or equivalent
mix. ~10 weeks out. Sequence: unblock deploy → content indexes → leads →
strategy calls → audits → Build & Launch → Managed Ops. Every week the
deploy stays down compresses the funnel window; it is the only item on
the critical path that costs nothing but a dashboard visit.
