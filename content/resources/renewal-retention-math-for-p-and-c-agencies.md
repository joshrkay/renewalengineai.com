---
title: "Renewal Retention Math: How to Calculate the True Cost of Every Lost Policy"
slug: "renewal-retention-math-for-p-and-c-agencies"
description: "The insurance renewal retention calculation every P&C agency should run: retention formulas, lost-policy cost, and LTV math with a Monday worksheet."
publishedAt: "2026-07-12"
category: "Retention"
primaryKeyword: "insurance renewal retention calculation"
readTime: 8
related:
  - "ai-renewal-automation-playbook"
  - "ams-data-export-checklist"
---

# Renewal Retention Math: How to Calculate the True Cost of Every Lost Policy

Ask an agency owner their retention rate and most will say "around 90%." Ask what a single lost policy costs them and the room goes quiet. That's the gap this article closes: the difference between knowing a percentage and knowing the dollar figure that percentage is quietly draining from your book.

The math matters because retention is the highest-impact number in the agency P&L. Industry benchmarks put personal lines retention around 85-90% and commercial lines around 90-95%, and brokers who value agencies for a living treat retention as the single biggest input to what your book is worth. A two-point swing changes both your income this year and your agency's sale price later.

Below are the four calculations we run in every renewal audit, with worked examples you can copy into a spreadsheet. None of them need more than the data in your AMS. (If you want the exact exports to pull first, use the [AMS data export checklist](/resources/ams-data-export-checklist).)

## Calculation 1: your real retention rate (two ways)

There are two honest ways to measure retention, and they answer different questions.

**Policy retention** measures operational performance:

> Policy retention = policies renewed ÷ policies up for renewal

Count only policies that reached their expiration date in the period. New business doesn't belong in either side of the fraction; including it is the most common way agencies flatter this number.

**Revenue retention** measures economic performance:

> Revenue retention = renewed commission ÷ commission up for renewal

Run both. If revenue retention is lower than policy retention, you're disproportionately losing your larger accounts, which is the worst version of the problem and usually means your best clients are being shopped while your small accounts auto-renew.

A note on cadence: measure rolling 12 months, not calendar-year-to-date. A rolling window catches seasonality (personal auto churns differently in January than July) and gives you a number you can compare month over month.

## Calculation 2: the true cost of one lost policy

The naive answer is "one year of commission." The real answer is the remaining lifetime of the relationship, because a policy that renews at 90% probability isn't one year of revenue, it's a stream.

The standard shortcut: expected client lifetime in years is 1 ÷ (1 − retention rate). At 90% retention that's 10 years. At 85% it's about 6.7 years. Three points of retention is three-plus years of expected lifetime.

So the cost of a lost policy is:

> Lost-policy cost = annual commission × expected remaining years

Worked example, personal lines:

| Input | Value |
|---|---|
| Average premium | $1,800 |
| Commission rate | 12% |
| Annual commission | $216 |
| Retention rate | 88% |
| Expected lifetime (1 ÷ 0.12) | ~8.3 years |
| **True cost of one lost policy** | **~$1,790** |

One lapsed auto policy is not a $216 problem. It's roughly an $1,800 problem, before you count the umbrella or home policy that follows it out the door, and before you count the referrals that client would have sent. Multi-line households make it worse: cross-sold clients retain better and carry more premium, so losing one is losing your stickiest revenue.

## Calculation 3: annual renewal leakage for your book

Now scale it. This is the number that reframes the staff meeting:

> Annual leakage = policies up for renewal × lapse rate × lost-policy cost

For a 2,000-policy book at 88% retention: 2,000 × 12% = 240 lost policies a year. At ~$1,790 each, that's roughly **$430,000 in lifetime value walking out annually**. Even if you only count first-year commission, it's $52,000 of income gone this year, every year.

Here's the same math at three retention levels for that book:

| Retention | Policies lost/year | First-year commission lost | Lifetime value lost |
|---|---|---|---|
| 85% | 300 | $64,800 | ~$432,000 (6.7-yr lifetime) |
| 88% | 240 | $51,840 | ~$430,000 (8.3-yr lifetime) |
| 92% | 160 | $34,560 | ~$432,000 (12.5-yr lifetime) |

Notice the lifetime column barely moves: as retention rises, you lose fewer policies but each one is worth more. What changes dramatically is the annual bleed and the compounding: the 92% book keeps 140 more clients per year than the 85% book, and each kept client keeps paying, referring, and cross-selling for a decade. That compounding is why proactive renewal outreach programs that lift retention 15-20% relative to silent renewals pay for themselves inside the first quarter.

## Calculation 4: what a retention point is worth to you

The last formula turns all of this into a decision tool:

> Value of one retention point = policies up for renewal × 1% × lost-policy cost

On the 2,000-policy example, one point of retention is 20 saved policies × ~$1,790, or about **$36,000 of lifetime value per point, per year**. That's the yardstick to hold against any retention investment: staffing, gifts, review cadences, or automation. A $6,000 build that moves retention one point pays back six times over in year one on lifetime basis; a program that moves it three points funds a producer.

This is also the honest way to size AI's role. Automated pre-renewal outreach doesn't save every policy; nothing does. What it changes is coverage: every policy gets touched 30-90 days before expiration instead of the 40-60% of the book a busy CSR team reaches manually. The lift comes from the silent majority that currently lapses without anyone noticing. (The mechanics of those sequences are in the [AI renewal automation playbook](/resources/ai-renewal-automation-playbook).)

## The four ways agencies get this math wrong

Before the worksheet, four measurement mistakes we see constantly in audits. Each one makes retention look better than it is, which is exactly why they persist.

**Counting new business in the retention rate.** If 240 policies lapse but you write 300 new ones, the book grew and the dashboard looks healthy. Growth is masking churn. You paid acquisition cost for those 300; you paid nothing to keep the 240 you lost. Keep the two motions in separate columns or you'll systematically underinvest in the cheaper one.

**Measuring clients instead of policies (or only policies instead of clients).** A household that drops its auto but keeps its home counts as "retained" at the client level while you lost half its premium. Track policy retention for operations and client retention for relationship health; the divergence between them is your monoline exposure showing.

**Ignoring mid-term cancellations.** A policy cancelled in month five never shows up in a renewal report, so renewal-only math misses it entirely. Add cancellations to the denominator for the rolling-12 version, or run a separate mid-term cancellation rate. Books with heavy new-business growth often have ugly mid-term numbers hiding under clean renewal numbers.

**Treating carrier non-renewals as your churn.** When a carrier exits a state or non-renews a class of business, those losses say nothing about your service. Tag them separately in the AMS reason codes. Mixing them in makes bad markets look like bad process, and cleaning them out makes your controllable churn, the part outreach can actually fix, visible for the first time.

None of these fixes require software. They require deciding, once, what the numbers mean, and writing it down so every producer computes them the same way.

## The Monday morning worksheet

Hand this to a producer or CSR lead and have the numbers by lunch:

1. **Pull the counts.** From your AMS: policies that reached expiration in the last 12 months, and how many renewed. (Applied Epic, HawkSoft, and EZLynx all report this; see the [export checklist](/resources/ams-data-export-checklist) for where.)
2. **Compute both retention rates.** Policy retention and revenue retention, rolling 12.
3. **Compute your lost-policy cost.** Average annual commission × 1 ÷ (1 − retention).
4. **Compute annual leakage.** Lost policies × lost-policy cost. Write the number somewhere visible.
5. **Compute your point value.** Renewal count × 1% × lost-policy cost.
6. **Segment the losses.** Split lapsed policies by line, carrier, and producer. Leaks cluster; find the cluster.
7. **Check touch coverage.** What share of lapsed policies had zero logged contact in the 90 days before expiration? That's your addressable pool.

Step 7 is the one that stings. In most books we audit, the majority of lapsed policies had no pre-renewal touch at all. Those weren't lost to price or a competitor's charm. They were lost to silence.

## Know the number, then fix it

Retention math doesn't retain anyone. But an owner who knows their point value makes different decisions than one who "feels pretty good about retention": they staff differently, they measure producers differently, and they stop treating renewal outreach as optional courtesy.

If you want the deeper version of this system, the [AI for Agent Retention course](/courses/ai-for-agent-retention) walks through the full lapse-cost model and the outreach sequences that move the number. And if you'd rather have us run the math on your actual book and hand you the 90-day plan, [book the renewal audit](/#pricing): five days, your data, your leak clusters, in dollars.

Your retention rate is a percentage. Your leakage is a salary. Do the math before your competitors do it for you.
