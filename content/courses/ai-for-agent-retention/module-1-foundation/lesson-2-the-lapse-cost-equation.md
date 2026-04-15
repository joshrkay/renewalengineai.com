---
title: The Lapse Cost Equation
module: 1
order: 2
duration: 15
---

# The Lapse Cost Equation

In the last lesson you wrote down a rough number for what lapse is costing your agency. It is probably bigger than you expected and smaller than reality. In this lesson we tighten that number up and turn it from a guilt trip into a decision-making tool.

By the end of this lesson you will have three things: a defensible annual lapse cost, a segmented view of where that cost concentrates, and a budget ceiling for the retention tools you are going to deploy in the next three modules.

## The formula

Annual lapse cost equals policy count times average annual commission per policy times your annual lapse rate. That is the simple version and it gets you in the ballpark.

Here is a worked example. Imagine an agency with 800 policies, an average annual commission of $144 per policy, and a 15 percent lapse rate. That agency is losing 800 × $144 × 0.15 = **$17,280** in recurring revenue every single year. Not once. Every year. Until somebody plugs the hole.

The formula gives you a directional answer in under a minute. It also hides three assumptions that are almost always wrong. Let us fix them.

## Fix #1: your commission is not flat

Most agencies have at least three tiers of commission revenue: personal auto (low), personal home/umbrella (medium), and commercial (high). If your average commission is $144 but your top 20 percent of accounts earn $600 of commission each, lapsing one big account equals lapsing 15 small ones. Averaging hides this entirely.

The fix: run the formula twice. Once for your personal lines book and once for your commercial book, using each book's own average commission and own lapse rate. Commercial typically has a lower lapse rate (8 to 12 percent) but a much higher dollar impact per lapse.

## Fix #2: lapse is not static across the year

Lapses spike in two windows: the 45 days before and after a rate increase, and the 30 days after a major life event (move, divorce, new job). If you run the formula on a flat 15 percent, you miss the fact that 40 percent of your lapses happen in maybe 90 days of the calendar year. That concentration is actually good news — it means your retention system does not need to be "always on." It needs to be loud at the right moments.

The fix: when you get to Module 2, your trigger-based sequences will be built around those high-risk windows specifically.

## Fix #3: lifetime value, not first-year commission

This is the one that changes agency strategy forever once you see it.

A policy that lapses this year was not worth $144. It was worth the full present value of every future year that client would have stayed, plus the cross-sells, plus the referrals. Real lifetime value on a retained personal lines client is typically 2 to 4x the first-year commission. On a retained commercial client it can be 5 to 10x because of cross-sell depth and account stickiness.

Multiply your lapse cost by a conservative 2.5x LTV multiplier. In our 800-policy example, that $17,280 bleed becomes a $43,200 compounded loss. That is the real number. That is the number that should make you angry.

## Build the real equation

Here is the formula we will use for the rest of the course:

```
Annual lapse cost (real) =
  (Personal lines policies × avg PL commission × PL lapse rate × 2.5)
  +
  (Commercial policies × avg CL commission × CL lapse rate × 3.5)
```

Worked example for our 800-policy agency, assuming 700 PL and 100 CL:

- **Personal lines:** 700 × $120 × 0.15 × 2.5 = $31,500
- **Commercial:** 100 × $600 × 0.10 × 3.5 = $21,000
- **Real annual lapse cost:** **$52,500**

You see what just happened. The naive formula said $17k. The real formula said $52k. The agency looks identical. The decision about how much to invest in retention just changed by 3x.

## Segment by premium size

One more cut, and it is the most useful one. Break your book into three buckets by premium size. Take the top 20 percent, the middle 60 percent, and the bottom 20 percent. Your top 20 percent is almost always where the lapse cost concentrates.

Run the math on just the top bucket. You will usually find that 60 to 70 percent of your total lapse cost lives in that one slice. That is the slice where you are going to reserve your most expensive retention moves in Modules 2 and 3 — personal calls, hand-written cards, same-day turnaround on questions. AI handles the other 80 percent of the book. You handle the top 20 percent with AI quietly doing the prep work behind you.

## Turn the number into a budget

Now the useful part. That $52,500 real annual lapse cost is your retention system's revenue ceiling. Any tool, service, or time investment that recovers even 10 percent of that is generating $5,250 a year of new margin. A $200/month automation tool costs $2,400 a year. Your break-even is clawing back roughly 1.1 percent of retention. A five-hour-per-week producer time investment at $80/hour is $20,800 a year. Your break-even there is recovering about 40 percent of the lapse.

Here is the rule: **spend up to 20 percent of your real annual lapse cost on tools, time, and services dedicated to retention.** That is a generous ceiling that still leaves 80 cents of every recovered dollar as profit. In our example, that is a $10,500 annual budget. You will not spend close to that in this course. The whole stack we build comes in under $250 a month for most agencies. But knowing the ceiling makes every tool decision downstream a one-minute conversation instead of a two-week stall.

## Do this today

Open the spreadsheet you started in Lesson 1. Add these rows:

| Row | Label | Example |
|-----|-------|---------|
| 1 | PL policy count | 700 |
| 2 | PL avg commission | 120 |
| 3 | PL lapse rate | 0.15 |
| 4 | PL LTV multiplier | 2.5 |
| 5 | PL real cost | `=B1*B2*B3*B4` |
| 6 | CL policy count | 100 |
| 7 | CL avg commission | 600 |
| 8 | CL lapse rate | 0.10 |
| 9 | CL LTV multiplier | 3.5 |
| 10 | CL real cost | `=B6*B7*B8*B9` |
| 11 | **Total annual lapse cost** | `=B5+B10` |
| 12 | **Retention budget (20%)** | `=B11*0.2` |

Fill in the real numbers from your AMS. The cells with `?` get replaced with your actuals. If you don't know a lapse rate, assume 15 for PL and 10 for CL and tighten it later when you pull the data in Module 3.

Screenshot the result. That is the financial case for everything you are about to build.

## Next up

In the next lesson we zoom out from dollars to workflow. You will map where AI actually belongs inside an independent agency and, more importantly, where it does not. That map is the blueprint for every tool decision in Modules 2, 3, and 4.
