---
title: Routing and Response SLAs
module: 2
order: 3
duration: 13
---

# Routing and Response SLAs

Classifying a lead is useless if nobody responds to it on time. This is the lesson that closes the loop on the lead-capture system: the routing rules that decide *who* picks up each lead, the SLA clock that decides *how fast* they have to act, and the enforcement mechanisms that keep the whole thing from drifting back into "we'll get to it when we can."

Every ops automation in Module 2 up to this point has been input-handling. This lesson is about output — turning classified leads into booked policies. Skip the SLA work and the Zap you built in Lesson 2.2 is a very expensive way to route leads into a slower version of the inbox you had before.

By the end of this lesson you will have a routing matrix that fits your current team size, four SLA tiers tied to the urgency field from Lesson 2.2, three light-touch enforcement mechanisms, and a clear rule on what parts of the lead-response conversation AI should never touch.

![The AI lead intake pipeline: five stages from capture through classify, enrich, route, and respond, each tagged with the elapsed seconds, ending in an SLA clock and an AMS log](/courses/bootcamp/lead-intake-pipeline.svg)

## The speed-to-lead reality

Industry research on lead response times is brutal and the numbers are not debated. A lead contacted within **5 minutes** is roughly **9 times more likely** to convert than a lead contacted within an hour. A lead contacted within an hour is several times more likely to convert than a lead contacted the next day. By 24 hours, conversion rates are a fraction of the 5-minute baseline. The speed factor dominates almost every other variable, including price, carrier, and quoted coverage level.

Why? Because leads shop in parallel. The visitor who submitted your form also submitted forms at two to four competitor sites in the same browsing session. Whoever calls back first gets the conversation. The second caller gets "I'm already talking to someone." By the third caller it is over. You are not competing on price or service at that point — you are competing on being the first ring.

Most agencies have no SLA at all. Leads come in, they sit, they get handled when someone notices them in the inbox, and the median response time runs somewhere between 6 and 26 hours. Compare that to a 5-minute target and you see the lever. The fix is not a new CRM. The fix is not lead-scoring software. The fix is a rule, written down, and enforced.

## The routing matrix

Start with a simple matrix. On one axis you have the classification output from Lesson 2.2: the `urgency` field (high / medium / low) and the `line_of_business` field. On the other axis you have your team — the producer, the CSR, the owner, or just you if you are solo.

A minimal routing matrix for a two-person agency looks like this.

| Urgency | Line of Business | Routes to | SLA |
|---|---|---|---|
| High | Personal auto / home | Producer | Call within 15 minutes |
| High | Commercial | Owner | Call within 15 minutes |
| Medium | Any line | Producer | Email within 1 hour, call within 4 hours |
| Low | Any line | CSR | Email within 4 hours |
| Any | Bad fit | CSR | Warm-referral email within 1 business day |

That is the entire matrix. Five rows. Add more rows as your team grows and the routing becomes more specialized, but start with five. More rows at the start creates confusion about who owns what, which is worse than a slightly blunt routing.

The principle is the same regardless of team size: **faster response for more urgent work, higher-skill person for the more complex work.** A solo agent's version of the matrix still has four urgency × line rows, but every row routes to "me" — the value is the SLA column, not the assignment column.

## The four SLA tiers

The SLA clock starts the moment the lead lands in your classification Zap. Not the moment a human sees the email. Not the moment the CSR logs into the CRM. The instant the lead is timestamped in your system, the clock is running.

**Tier 1 — Flash response (5 to 15 minutes).** High-urgency leads: closing dates this week, non-renewals, cancelled policies, someone who needs coverage for a car they just bought. These leads are already talking to competitors and you have minutes, not hours, before they are gone. Target response: 5 minutes if you can, 15 minutes as the hard ceiling.

**Tier 2 — Fast response (1 hour).** Medium-urgency leads who are actively shopping but do not have a hard deadline this week. Target: a personalized email within 1 hour acknowledging the lead and setting a call time, followed by the call within 4 hours.

**Tier 3 — Same-day response (4 hours).** Low-urgency leads — casual shoppers, renewal comparisons for future dates, "just looking" inquiries. Target: a personalized email within 4 business hours. The email itself is the first touch and it sets up the next step.

**Tier 4 — Next-business-day (24 hours).** Bad-fit leads that will get a warm-referral email. Target: one business day. The goal is not to convert the lead — it is to send them to a trusted referral partner with a warm intro so the lead does not waste your pipeline and does not have a bad experience with your agency. Bad-fit leads referred well become referral sources *back* to you within a year more often than you would guess.

## Enforcing the SLA

A rule without enforcement is a wish. Three light-touch enforcement mechanisms work. Pick one for month one. Add a second in month three if you need it. Never run all three — the overhead is worse than the missed SLAs.

**Mechanism 1 — The visible timer.** When a lead arrives in your `#new-leads` Slack channel or your "new leads" Google Sheet, the timestamp is visible. Use a simple formula or a Slack bot to change the message color or add an emoji indicator that flips red when the SLA window is 50 percent elapsed. The red flag is enough to snap attention back to the lead. No escalation needed — you just made the problem visible.

Build time: 15 minutes in Zapier if you use the "update row" action on a Google Sheet and a conditional formatting rule. Or use a free Slack bot like Lead Response Timer.

**Mechanism 2 — The escalation path.** If the assigned person has not claimed the lead (by marking it "in progress" in the sheet, or adding an emoji, or moving a CRM card) within **half** the SLA window, the Zap automatically reassigns it to a backup person and pings both. Reassignment is silent — no public shaming. The escalation is about getting the lead handled, not about catching the original assignee slacking.

Build time: 30 to 45 minutes. This is the most reliable mechanism for teams of three or more. Overkill for a solo agent.

**Mechanism 3 — The weekly review.** Every Monday, during your normal ops meeting, pull the week's classified leads and their response times. Any lead that missed its SLA gets discussed — **not to blame, but to diagnose.** Was the classification wrong? Was the assignee on a sales call when the lead came in? Was the SLA itself unrealistic? Fix the system, not the person. Most SLA misses are system failures, not effort failures.

Build time: zero. Just add "lead SLA review" to the existing weekly ops meeting agenda.

For a solo agent, mechanism 1 is enough. For a two-to-five person agency, mechanism 1 plus mechanism 3 covers almost every case. Only bring in mechanism 2 when you have three or more people splitting lead handling and the escalation logic actually changes who picks up the lead.

## The automation ceiling — what AI does not do

This is a good place to remember what the AI is and is not doing in this pipeline. AI is:

- Classifying the lead into urgency, line of business, fit, and notes.
- Routing the lead to the right person.
- Starting the SLA clock.
- Optionally drafting a proposed opening email or SMS that a human reviews and sends.

AI is **not**:

- Calling the lead. A human dials and speaks.
- Having the full opening conversation. The first real back-and-forth is a human voice.
- Quoting the policy. The producer quotes.
- Binding the policy. Licensed humans bind. This is a regulatory boundary and an AI cannot cross it.

The temptation, every few months, is to try to have an AI voicebot handle the opening conversation with a prospective client. The tech exists. It sort of works. And it almost always hurts the conversion rate because the client knows within 10 seconds that they are talking to a bot, they feel disrespected, and they hang up to call a competitor where a human will pick up. Licensing requirements, trust, and the nuance of an insurance conversation all argue for a human voice on the first real conversation for the foreseeable future.

Use AI to get the right lead to the right human, fast, with a ready-to-send draft opening. Let the human close. That is the right division of labor today, and it will be the right division for at least the next few years.

## Drafting the first touch with AI

One place AI adds major value in the response is drafting the initial outreach message. When a medium-urgency lead lands, the Zap can automatically generate a proposed first-touch email — referencing the specific line of business, the city, any notes from the classification field — and drop it in a "pending approval" column. The producer reads it for 10 seconds, clicks send, and the lead gets a personalized acknowledgment within minutes of landing, even if the producer is between calls.

The prompt for the first-touch draft is a small variation on the personalization prompt from the Retention course (Lesson 2.3 there): voice samples, client facts, the occasion ("new lead first touch"), and a hard constraint that the draft must not quote a premium, make a coverage recommendation, or promise placement. The producer's job is the 10-second approve and send, not the writing.

This one automation — draft-then-approve on new leads — cuts the median first-touch time from 26 hours to under 5 minutes in most agencies that implement it. It is the highest-ROI automation in the entire lead-capture module.

## What good looks like

A few months into running this system, the numbers should move in visible, measurable ways. Median first-touch time on high-urgency leads drops from hours to under 15 minutes. Conversion rate on inbound leads climbs noticeably — 20 to 40 percent improvement is typical, depending on the starting baseline. Bad-fit leads stop eating producer time and start coming back as referrals. The ops meeting shifts from "why didn't we respond to this lead" to "which lead lost the best chance of closing and what can we learn."

You will feel the improvement in month one when the producer catches a high-urgency lead in 10 minutes and binds it the same day. You will see the improvement in the numbers by month three when the running conversion rate on the dashboard is meaningfully higher than it was a quarter earlier.

## Do this today

Pick one SLA number. Just one. Write it down. "High urgency leads get a human response within 15 minutes." Commit to it for two weeks. Do nothing else — do not build the Zap, do not change the routing matrix, do not add automation. Just commit to the rule and see what breaks. Most agencies find out they can hit the rule on 70 percent of leads by pure discipline, and then the automation is the fix for the other 30 percent. But you cannot know which piece to automate until you have tried to run the rule manually and seen where it fails.

At the end of the two weeks, the failures will tell you exactly where to add the Zap, the timer, or the escalation. That is how you build a system that matches your actual workflow instead of one that matches a vendor's demo video.

## Next up

That finishes Module 2. You now have a lead-capture pipeline that turns web visitors into classified, routed, SLA-tracked opportunities without manual triage. Module 3 moves upstream — from lead capture to the quoting and underwriting work that happens after a lead becomes a prospect. We cover document extraction, quote comparison copilots, and risk flagging — the three places AI meaningfully reduces the 45-minute-per-quote grind that eats every producer's afternoon.
