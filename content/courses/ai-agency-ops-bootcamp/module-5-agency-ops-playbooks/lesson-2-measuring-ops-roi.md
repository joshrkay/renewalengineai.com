---
title: Measuring Ops ROI
module: 5
order: 2
duration: 13
---

# Measuring Ops ROI

You have built a lot of workflows across the first four modules. Lead capture pipelines. Document extraction. Quote comparison copilots. Risk flagging. Email triage. COI bots. Proactive check-ins. SOPs. At this point in the bootcamp most agents look at the list and feel a quiet pride at how much plumbing they have laid down — and then, in the next breath, worry that they cannot actually prove any of it is working. Which is exactly what kills most ops automation projects in the agencies I have watched run them. Without measurement, the AI ops work quietly dies the first week a big client crisis hits and there is no defense against "maybe we should pause some of this and refocus."

This lesson fixes that vulnerability. It gives you three numbers to track — only three, because more than three gets ignored — a baseline discipline to establish before you implement anything new, a quality metric that keeps speed from quietly destroying output, a monthly review ritual that takes 30 minutes, and the one number that tells you when it is time to hire your next person instead of automating further.

By the end of this lesson you will have an ops scorecard template you can build in 15 minutes, a baseline-first protocol for every new workflow, and a defensive story for the ops work that any business partner or internal skeptic can understand in one sentence.

## The three numbers that matter

Resist the temptation to build a 15-metric ops dashboard. Three numbers cover 90 percent of the decisions you will actually make. More than that and the scorecard becomes a research project nobody updates.

**Number 1 — Hours saved per week.** Compare how long a process used to take (the baseline) versus how long it takes now with AI. Multiply by the weekly frequency. Sum across all workflows. The result is the total agency time reclaimed each week by the ops automations.

Example: Your COI bot handles 30 requests a week. Pre-bot time per request was 10 minutes. Post-bot time is 3 minutes. Savings: 7 minutes × 30 = 210 minutes per week, or 3.5 hours. Do this calculation for every workflow, sum, and you have the headline number that defends the whole program.

A healthy ops program at a small agency reclaims 8 to 15 hours per week total — one full day a week at minimum. That is the number you quote when someone asks "what is the AI ops work actually producing?"

**Number 2 — Output quality rating.** Did the automated outputs hold the standard you had before the automation? Speed without quality is not a win — it just means more bad work gets shipped faster. The quality metric is the counterweight that keeps the automation honest.

Measure quality by sampling 10 outputs per workflow each month. Time yourself reviewing each sample and categorize it:

- **High quality**: Review requires less than 30 seconds. Output is ready to send as-is or with a tiny edit.
- **Medium quality**: Review requires 30 seconds to 2 minutes. Output needs meaningful editing but is a useful starting point.
- **Low quality**: Review requires more than 2 minutes or a full rewrite. Output saved less time than writing from scratch.

Healthy ratios on a working automation: 70 percent high, 25 percent medium, 5 percent low. If low quality creeps above 15 percent, something in the prompt, the inputs, or the voice samples needs attention. Tune the workflow before you accept the worse output as the new normal.

**Number 3 — Revenue touched.** For workflows that interact with clients directly (retention outreach, new lead handling, proactive check-ins, COI delivery), track the dollar value of the policies that moved through the workflow in a given month. This is the "revenue exposed to the system" — not the revenue the system is responsible for, but the revenue that would have been affected if the system were turned off.

Example: $140,000 of renewal premium ran through your retention check-in workflow in August. That is the number to track. It contextualizes the time saved — are you saving 8 hours a week on workflows that touch $50,000 of revenue, or on workflows that touch $400,000 of revenue? Same hours, very different priorities for where to invest next.

Three numbers. One spreadsheet. 15 minutes per month to update. That is the whole ops scorecard.

## Baseline first — the discipline most agencies skip

You cannot measure "hours saved" without a baseline. Before you roll out any new workflow, time yourself doing the manual version with a stopwatch. Write the number down in the scorecard before a single line of automation gets built. This is the step most agencies skip and the step that makes the whole measurement effort retroactively impossible three months later.

The specific baseline discipline:

1. Pick the process you are about to automate.
2. For one full business week, every time you do that process, log the start time, the end time, and the count of items handled. "Tuesday: 4 COIs, 11:15-11:42" is enough.
3. Sum the week. Divide by count to get per-item time. Multiply by typical weekly volume to get per-week time.
4. Write the number down. Save it in the scorecard with a "baseline as of {date}" note.

Total baseline cost: 20 minutes of logging over one week. That small investment is what makes the future ROI story defensible. Skip it and you will spend the next year trying to estimate what you used to do, and the estimates will always be wrong in whichever direction makes you feel worse.

Do this before the automation is built. Not after. Not "I'll remember how long it used to take." You will not remember. Nobody ever does.

## The quality metric is the slipperiest one — measure it anyway

Quality is the hardest of the three numbers to pin down because "good output" is subjective and varies by workflow. The definition above — high / medium / low based on review time — is deliberately crude, but crude is better than nothing. The worst outcome in an ops program is letting output quality drift silently while celebrating hours saved. That drift eats the relationship with the clients faster than any other failure mode.

A practical monthly quality sampling routine:

- Pick one workflow per week (so each workflow gets sampled roughly monthly).
- Randomly pick 10 outputs from the past week.
- For each one, imagine you are reviewing it before it ships. Time the review mentally (15 seconds, 45 seconds, 3 minutes).
- Rate each sample as high / medium / low.
- Log the three counts.
- Total time: 10 minutes.

If a workflow drifts to below 70 percent high quality for two consecutive months, pause new output on that workflow until you have diagnosed the drift. Usually the cause is stale voice samples, a carrier format change, or a new edge case the prompt was not tuned for. Fix and resume.

## Revenue touched is not revenue attributed

Be careful with how you talk about the revenue touched number. If $140,000 of renewal premium ran through your retention workflow in August, that does **not** mean the workflow was responsible for retaining all $140,000. Some of that premium would have retained anyway without any proactive outreach. Claiming the full amount as "revenue the system produced" is the kind of sentence that quietly destroys the credibility of the whole ops program the first time someone pushes back on the math.

The honest framing is: *"The system is exposed to $140,000 of renewal revenue each month. Our retention rate has moved from 84 percent to 87 percent since we started this program. That 3-point lift on this revenue is about $4,200 per month, or $50,000 annualized."* That framing is defensible because it separates "revenue touched" (the opportunity) from "revenue attributed" (the measured lift).

Use the touched number to prioritize. Use the attributed lift to defend. Never conflate the two.

## The monthly review ritual

Block 30 minutes on the last Friday of every month. The 30 minutes is for reviewing the ops scorecard the way you review the retention dashboard on Mondays.

The ritual:

1. **Update the scorecard** (10 minutes). Pull hours saved, quality sample result, and revenue touched for each workflow.
2. **Note what changed** (5 minutes). One sentence per workflow. "COI bot hours saved down this month because new carrier portal change." "Retention workflow quality up because we refreshed voice samples."
3. **Pick one bottleneck** (5 minutes). What is the lowest-leverage workflow right now? Is it producing enough value to justify the review time, or should it be retired? Is there an obvious tune that would move it from medium to high quality?
4. **Write one commitment for next month** (5 minutes). One thing you will change, test, or measure next month. Not three. One.
5. **File the review** (5 minutes). Save it in the ops folder with the date. Over a year these become a real running narrative of what worked and what did not.

After six monthly reviews you will have a clear story of which workflows earned their keep and which quietly did not. That data is more valuable than the automations themselves. It is what lets you double down on the three workflows that are producing 70 percent of the value and quietly retire the two that were good ideas on paper but did not hold up in practice.

## The one number that tells you to hire

The hours-saved number has a second use beyond defending the ops program: it tells you when it is time to hire your next team member. The rule:

**When the ops automations are saving 10+ hours per week, and the agency is still running at full capacity with no slack, the automations have hit their ceiling. The next hour of capacity has to come from a person, not a workflow.**

This is important because the default response to "we're overloaded" in an agency that has read this course is "let me automate one more thing." Sometimes that is correct. But above roughly 10-15 hours of saved time per week, the automation curve flattens — the remaining work is judgment-heavy, relational, or too edge-case-y to automate well. Adding more automation at that point produces diminishing returns and usually adds complexity without recovering meaningful time.

If you are at 10+ hours saved and still drowning, the honest answer is a new hire. A CSR. A producer. A VA. The ops automations made the hire viable in the first place by bringing cost-per-capacity down; now they are at their ceiling and a human has to take the next unit of load.

Do not confuse "we could probably automate this next thing too" with "this is actually the next best dollar of investment." Most of the time at the 10-hour mark the best next dollar is a paycheck.

## Defending the ops work in one sentence

When a business partner, spouse, or internal skeptic asks what the AI ops work is actually producing, here is the one-sentence answer you should be able to give from the scorecard.

> "We are saving about {X} hours a week across {number} automated workflows, with output quality holding at {high%} high and {medium%} medium. Those hours cover the work that would otherwise require {0.3 or 0.5 or 0.7} of a CSR seat, and they are touching {$Y} of revenue each month."

Fill in the blanks from the scorecard. Rehearse the sentence. Deliver it the first time someone asks. It is the same defensive framing as the 10pm retention defense from the Retention course — a number attached to a specific mechanism, delivered in one breath, ends most of the "is this worth it" conversations before they get started.

## Do this today

Open a fresh Google Sheet. Create one row per workflow you are currently running or planning to run. Columns: baseline time per unit, current time per unit, weekly volume, hours saved per week, quality sample result (most recent month), revenue touched (most recent month), last review date. Label the sheet `ops-scorecard` and save it alongside your retention log.

If you have not yet built any automations, leave the rows blank and put "baseline pending" in the current-time column. Before you implement the first workflow, do the baseline-first week of logging and fill in the starting number. That single act — writing down the baseline before the automation exists — is the most important measurement discipline in the whole course.

## Next up

Measurement tells you whether the ops work is paying off. The next and final lesson covers how to roll the whole ops program out to producers and CSRs without the usual resistance, without "we don't have time to learn another thing," and without the whole initiative stalling the first time a CSR says "I already know how to do it the old way." That last lesson is the difference between an ops program that stays in the owner's corner of the business and one that becomes the agency's actual way of working.
