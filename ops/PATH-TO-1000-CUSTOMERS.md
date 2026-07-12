# Path to 1,000 Paying Customers — Plan of Record (2026-07-12)

Owner: Josh. Prepared as the quantitative bridge between the funnel work on
PR #25 and the year-end goal. Supersedes ARR_SPRINT.md's customer-count
assumptions (that doc models ~230 customers for $1M ARR; the 1,000-customer
goal is a different shape of business and this doc says so plainly).

## The honest starting point

- Confirmed paying customers today: **0** (execution board, verified).
- Production has served the April 25 build since May 6 (deploy pipeline
  broken; fixed on PR #25, blocked on the Vercel account issue).
- Days remaining in the year: **172**.
- Required average net new customers/day from a standing start: **~5.8**.

## What can and cannot carry 1,000 customers

The current offer mix, sorted by unit economics and onboarding load:

| Offer | Price | Onboarding load | Plausible ceiling by Dec 31 |
|---|---|---|---|
| Audit ($1,500 one-time) | High-touch, 5 days each | Capacity-bound: even 2/week = ~50 |
| Build & Launch ($6,000) | 2-3 weeks each | ~15-25 |
| Managed Ops ($2,500/mo) | Ongoing service | ~10-20 |
| Courses ($397 / $797) | **Zero-touch, self-serve** | Traffic-bound, not capacity-bound |
| Mastermind ($97-197/mo) | Low-touch community | Traffic-bound |

Conclusion the math forces: **the services business cannot produce 1,000
customers this year at any realistic effort level** (it can produce
excellent revenue — that's the ARR_SPRINT thesis — but not count).
A 1,000-customer outcome runs through the self-serve products: courses,
mastermind, and (if pursued) a low-priced software tier on the renewals
dashboard that already exists in the codebase.

## The funnel arithmetic for the self-serve path

Working backward from ~950 self-serve customers in ~5.5 months, using
the course pages' current shape (visitor → course page → checkout):

- At a 1.0% visitor→customer rate (typical for well-targeted content →
  $397 course): needs **~95,000 targeted visitors**, ~17k/month.
- At 0.5%: ~190,000 visitors. At 2.0% (email-nurtured): ~48,000.

Current traffic baseline is unknown (GA4 data not accessible from this
session) but is realistically in the hundreds-to-low-thousands per month.
**The gap is traffic and email list, not funnel mechanics** — the
mechanics are now fixed and tested on PR #25.

What the 12-article cluster contributes: SEO compounding is 3-6 months to
meaningful volume, so organic alone cannot close a 172-day gap. It must be
paired with paid/outbound distribution and the lead-magnet → email → course
nurture path (all of which now work end-to-end in code).

## The three decisions only Josh can make (in priority order)

1. **Unblock and merge (this week).** Vercel provisioning fix + AUTH_SECRET
   + CRON_SECRET + merge PR #25. Nothing else on this page matters first.
2. **Decide the 1,000-customer vehicle (this month).** Options, not
   mutually exclusive:
   a. Push courses as the volume product (exists today, zero marginal cost);
   b. Ship a $49-99/mo self-serve tier of the renewals dashboard (product
      exists; needs a signup flow + pricing decision — a build I can do
      once authorized);
   c. Re-scope the goal to revenue rather than count (the ARR_SPRINT
      framing), which the services motion CAN hit.
3. **Fund distribution (immediately after merge).** Publish the social
   bundle, stand up the email nurture on the repaired lead magnet, and
   decide a paid-traffic test budget against the course funnel. Organic
   alone will not close a 172-day window.

## What the next agent session should do, in order, once unblocked

1. Verify production end-to-end (deploy READY; lead magnet POST; Stripe
   checkout for audit + both courses; login + lesson paywall; GA events).
2. Wire funnel measurement: confirm GA4 events flow (lead_submit,
   begin_checkout, purchase) and stand up a weekly scorecard from real data.
3. Execute distribution: publish social batch 1, connect the lead-magnet
   list to a course nurture sequence.
4. If decision 2b is taken: build self-serve signup + subscription tier on
   the existing dashboard (schema, webhook, and checkout infra all exist).

## Scoreboard (update weekly, real data only)

| Week | Visitors | Leads | Course sales | Audits | Total paying customers |
|---|---|---|---|---|---|
| 2026-07-12 | unknown (site stale) | 0 verified | 0 verified | 0 verified | **0** |

No row gets written without artifact proof. That rule is why this document
can be trusted; keep it that way.
