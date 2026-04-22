---
title: Risk Flagging Workflows
module: 3
order: 3
duration: 13
---

# Risk Flagging Workflows

Every experienced producer has developed a gut for applications that are going to be trouble. The claims-heavy fleet. The loss runs that look cleaned up in a way that suggests something was left out. The shaky ownership history. The operations description that doesn't match the workers comp class code. The renewal that left three carriers in three years for reasons nobody wants to discuss.

That gut is valuable. It is also slow, inconsistent, and trapped inside one person's head. A producer having a good day reads a submission and instantly sees the trouble. The same producer on a Friday afternoon at 4:30pm misses the same patterns. A new producer who has not seen enough bad submissions yet misses patterns the senior producer would catch in five seconds. The wisdom exists in the agency but it does not scale across people or days.

AI does a first-pass risk scan on every submission in 30 seconds, flags the items worth discussing before you invest serious quoting time, and leaves your gut free for the harder judgment calls. This lesson shows you exactly what to flag, the working prompt, the 15-minute rule that protects your time, and the flag library discipline that turns a starter prompt into real competitive advantage over 6 to 12 months.

By the end of this lesson you will have a list of the flags that actually predict submission problems, a copy-pasteable flagging prompt that works on extracted application data, the rules that keep the AI on the right side of the underwriting line, and a plan for building the flag library into a durable agency asset.

## What "risk flagging" actually is

Risk flagging is *not* underwriting. This distinction is the most important sentence in the lesson and the place most agents get confused. You are not having the AI make a binding decision. You are not having the AI decline submissions. You are not having the AI set terms or rate the risk. Every one of those actions is licensed underwriting work and you would not delegate it to an AI even if the AI were excellent at it (which it is not).

Risk flagging is a *triage* step. You are generating a list of "things worth asking the client about before I go deep on this submission" so your time investment matches the likelihood of a successful placement. The flags are the sharpened pencil, not the decision. You still decide what to do with each flag.

Why does this matter? Because producers routinely spend 2 to 4 hours quoting a submission that was dead-on-arrival for a reason that would have been obvious in the first 90 seconds if someone had been looking for it. The cost is not the dead submission — you cannot avoid every bad submission — it is the 3 hours of wasted work multiplied across 5 dead submissions a month. That is 15 producer hours a month spent quoting risks that were never going to place. The flag review recovers most of that time by killing bad submissions before they eat the budget.

## The flags that matter

The specific flags vary by line of business, but a good starter list for commercial submissions includes these. Every one of them is a pattern I have seen blow up a quote that looked fine on paper.

**Loss experience flags:**
- Loss ratio trending up over the last three years (the direction matters more than the absolute number).
- Multiple claims in a single policy year, especially if the claims are the same type repeating.
- A gap in prior coverage between the expiration of the last policy and the effective date of the new submission.
- A very recent large claim (within 90 days of renewal) that "just closed" with suspicious amounts.
- Loss runs that do not reconcile with the application's "number of prior claims" answer.

**Operations and appetite flags:**
- Operations description that is outside your stated agency appetite — e.g., long-haul trucking when you write local delivery, or restaurants with liquor when you write BOPs on general retail.
- Operations description that doesn't match the payroll or revenue figures (a "small contractor" with $8M revenue is either not small or not just a contractor).
- Workers comp class codes that do not match the operations description.
- New operations or business lines added in the last 12 months not reflected in the prior policy.
- Subsidiary or parent company relationships not disclosed in the base application.

**Documentation flags:**
- Revenue or payroll inconsistencies between the application, the supplemental, and any financial documents provided.
- Missing or incomplete safety program information on a workers comp or GL risk where it should exist.
- Recent ownership changes (especially if the ownership change happened right before the submission).
- Incumbent carrier not listed or listed as "various" — this is usually a tell that the applicant is actively shopping and possibly non-renewed.
- Prior agent or broker not listed, or listed as "self" when operations suggest the applicant should have had a broker.
- Claims that mention litigation or coverage disputes in the narrative but not in the structured loss run fields.

Each of these is a yellow flag on its own. Three or more yellow flags on a single submission and you have a red-flag submission worth an honest conversation with the client before proceeding.

**The point of flagging is never to decline.** The point is to ask the right questions before you spend an hour building a quote that isn't going to place. Some red-flag submissions become great clients after one 15-minute phone call that surfaces the real story. Others go to a competitor who gets to waste their 4 hours instead of yours.

## The flagging prompt

Here is the prompt. It assumes you have run the application and loss runs through the extraction pipeline from Lesson 3.1 so you have structured JSON to hand in.

> You are a risk flagging assistant for an independent insurance agent. Read the application data, loss run data, and agency appetite description below. Generate a list of items that should be verified or discussed with the client before the agent spends significant time on this submission.
>
> Organize the flags into three categories:
> 1. Loss experience (anything from the loss runs or claims history)
> 2. Operations and appetite fit (anything from the application that raises appetite, scope, or classification questions)
> 3. Documentation issues (inconsistencies, missing data, or items that don't reconcile across the submission)
>
> For each flag, provide:
> - The category it belongs to
> - A one-sentence description of the specific concern
> - The specific data point(s) from the input that triggered the flag
> - A suggested follow-up question the producer could ask the client
>
> Do not make a recommendation to bind or decline. Do not predict whether the submission will be accepted by any carrier. Do not suggest specific coverage terms. Your only job is to surface items worth asking about before the agent spends time quoting.
>
> If no flags apply, return an empty list. Do not invent concerns to justify flagging.
>
> Application data: {extracted_application_json}
> Loss runs: {extracted_loss_runs_json}
> Agency appetite: {your_appetite_description}
>
> Return the output as a JSON array with one object per flag.

Run this prompt on every new commercial submission as step 1 of your intake, right after the extraction pipeline completes. Total elapsed time: about 30 seconds. The producer reads the flags, decides whether to proceed, schedules a call to ask the follow-up questions, or passes on the submission.

## The 15-minute rule

A practical rule from agencies that have run this workflow for a year: **if the AI flag review plus your own initial scan takes more than 15 minutes and you still cannot see a credible path to placement, pass.**

You are not obligated to quote every submission that walks in the door. Protecting your time is part of running a profitable agency. The producer who quotes every submission regardless of flags spends 60 percent of their week on work that produces zero revenue. The producer who uses the 15-minute rule spends that same hour on three other submissions that are each more likely to place.

The 15-minute rule is not about being picky. It is about matching effort to probability. A submission with 4 yellow flags across loss experience, operations, and documentation is telling you something. The right response is either a direct conversation to resolve the flags (15 minutes, cheap) or a polite pass (zero minutes, also cheap). The wrong response is to "just build a quick quote to see what happens" and spend two hours on something that was never going to place anyway.

Hard to do at first. Gets easier once you have watched five submissions play out exactly the way the flags said they would.

## Building a flag library — the compounding asset

The starter prompt above is functional but generic. The real value comes from tuning the flag list to your specific agency's appetite, your specific carriers' underwriting tendencies, and the specific bad-submission patterns you have seen in your book. Every agency has some of these patterns and almost none of them are written down anywhere.

Build the flag library with two simple disciplines.

**Add a flag every time a bad submission taught you something.** When a submission that looked fine on paper turned out to have an issue during the carrier underwriting review, trace it back. What pattern in the application or loss run could have predicted the issue? Add that pattern as a new flag rule to the prompt. Over 6 months you will add 15 to 25 new flag rules that are specific to your agency's reality.

**Remove a flag every time one produces a false positive twice in a row.** The starter prompt will flag things that turn out to be non-issues in your book. If "revenue inconsistency between application and supplemental" flags four submissions and none of them are actually problems, the rule is not helpful for your line mix. Drop it or tighten the threshold.

After 6 to 12 months of this discipline, your flag prompt is a real competitive asset. It encodes your agency's accumulated underwriting wisdom in a form that runs in seconds on every new submission, works on Friday afternoon, works for new producers, and never forgets. The prompt itself — the text file — is worth more than most of the software subscriptions in your agency.

Version the prompt. Save each major revision with a date. If a change degrades flag quality, you can roll back. Treat it like code.

## The human in the loop always stays

One more reminder that the whole risk-flagging workflow depends on the producer staying in the loop and making the final judgment on every flagged item. The AI is not telling you to bind or decline. It is handing you a sharper pencil. You decide what to write with it.

If you find yourself trusting the AI's flags so much that you start passing on submissions without reading them yourself, you have gone too far. Pull back. The flags are inputs to your judgment, not a substitute for it. A submission with zero flags can still be a bad fit. A submission with five flags can still be a great client. The producer's read of the whole picture is the decision — and remains the decision for as long as licensed humans underwrite insurance.

## What good looks like after 90 days

Three months into running this workflow consistently, the numbers should move in visible ways. Your producer time spent on dead submissions should drop from whatever it was to under 15 percent of total quoting time. Your hit ratio (quotes issued that become bound policies) should climb because the submissions that reach the full-quote stage are higher-quality on average. Your flag library should have grown from the starter prompt to a tuned version with 15 to 30 agency-specific rules.

You will notice the change first in the feeling of "I'm getting to the good work faster now." You will see it later in the numbers when the quarterly review shows your quote-to-bind ratio moving up.

## Do this today

Take your three most recent commercial submissions from the last 30 days. Run them through the flagging prompt manually in Claude or ChatGPT — paste the application data, the loss run data, and your agency appetite description. Read the flags.

Compare the AI's flags to what your gut told you about each submission when it first came in. Two patterns will show up. On at least one submission, the AI will flag something your gut missed — usually a documentation or reconciliation issue your eyes glossed over. On at least one submission, your gut will have caught something the AI missed — usually a pattern specific to your market that is not in the starter prompt yet.

Both findings are valuable. The first tells you where the AI is already adding value. The second gives you the first entry in your flag library — add the pattern to the prompt as a new rule before you forget. That is how the library starts.

## Next up

That finishes Module 3. You now have a quoting pipeline that extracts documents in 30 seconds, compares quotes in 90 seconds, and flags risky submissions in 30 seconds. Module 4 moves the automation lens from pre-bind to post-bind — the client service work that eats CSR time throughout the policy period. We cover AI email triage, COI and endorsement bots, and proactive check-ins. Together they recover 8 to 12 hours per CSR per week, which is usually the exact capacity needed to let you grow the book without hiring.
