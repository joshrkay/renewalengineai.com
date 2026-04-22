---
title: Proactive Client Check-Ins
module: 4
order: 3
duration: 13
---

# Proactive Client Check-Ins

Most agencies are reactive. A client calls, the agency responds. A client emails, the agency replies. A client has a problem, the agency helps. All of it competent, all of it correct, and all of it completely indistinguishable from every competitor in the market. The clients do not think of you as a relationship — they think of you as a service provider they interact with when something goes wrong. Which is exactly how they think of the electric company, and exactly why they will switch for a $200 premium difference when the next renewal lands.

The fix is proactive check-ins at the moments that matter — moments where a short, well-timed, genuine message from the agency catches problems before they turn into cancellations, surfaces cross-sell opportunities the client was already thinking about, and builds the texture of a real relationship. The problem is that proactive outreach is almost never worth the manual time it takes to do right. A hand-written check-in to 200 clients a month at three minutes each is 10 hours of producer time, which is why it never happens. AI turns that 10 hours into 90 minutes.

This lesson covers the four moments worth automating, the drafting workflow that produces check-ins that do not feel like marketing, the three rules that keep them feeling like relationship touches instead of sales pitches, and the two metrics that tell you whether the program is working.

By the end of this lesson you will know which triggers to build first, the exact workflow for a proactive check-in pipeline, the language rules that separate relationship-building outreach from the kind of automated spam clients immediately recognize, and the measurement discipline that prevents the program from drifting into noise.

## The four moments that matter

Not every possible check-in is worth automating. Most of them produce nothing — a client ignores them, thinks they are marketing, and quietly resents the noise. Four specific moments consistently produce retention and cross-sell lift across every agency I have seen run this pattern. Start with one, prove it, add the next.

**Moment 1 — 30 days after bind.** The new client has had enough time to use the policy, notice any gap, or form a first impression about your agency. They have not yet had enough time to forget who you are or what your voice sounds like. A short, personal check-in at day 30 — "Hey, just wanted to make sure everything is clear on the new policy and see if any questions have come up since we bound" — catches confusion early, surfaces cross-sell conversations (the new homeowner who just realized they need an umbrella, the new auto client who also owns a boat), and reinforces that you think of them as a person, not a policy number.

Response rate on 30-day check-ins on a healthy book: 30 to 40 percent. About one in every eight responses produces a real conversation that leads to additional coverage. That ratio alone pays for the whole automation.

**Moment 2 — Three days after a claim closes.** Claims are the agency's report card. The client's experience of the claim is the single biggest factor in whether they renew with you or leave. And most agencies never ask how the claim went once it closes — the claim file closes in the AMS, everyone moves on, and the client is left to privately decide whether the experience was good or bad. Without a conversation, the private decision is almost always "it was fine but nothing special," which is not enough to retain them at the next renewal.

A short check-in three days after a claim closes — "Hey, just saw the claim closed. How did the experience go for you? Anything I can help with on the back end?" — is the single most impactful retention moment in the entire client service workflow. Response rates on post-claim check-ins are typically 50 to 70 percent because the client has something to say. About half of those responses are "everything was great, thank you," which is a warm moment you did not have before. About a quarter are "here's what could have been better," which is gold for both retention and for the conversation with the adjuster. The remaining quarter are neutral or polite non-answers, which are still worth the moment.

**Moment 3 — The policy anniversary (not the renewal).** The one-year mark of the relationship, not the 60-days-before-renewal touchpoint. A short note at the 12-month mark of first bind saying "It's been a year since we started working together — wanted to say thanks and see how everything's going." It is completely unexpected, it costs the client nothing, and it positions you as the thoughtful option in a market where every competitor is silent between renewals.

Response rates are lower — 15 to 25 percent — because the client did not have a triggering event. But the ones who do respond often respond warmly, and the non-response clients still noted that you reached out. That noticing compounds over years.

**Moment 4 — Life event triggers.** New home, new baby, new business, new state, new job, divorce, teen driver reaching driving age, adult child moving out, retirement. Every single one of these creates a coverage conversation and every single one creates a reason for the client to call another agent. When you learn about a life event — from the client directly, from a change request, from a social media mention you happened to see, from public records on a home purchase — a same-week check-in to review coverage is gold.

This is the highest-response moment of all four (often above 60 percent) because the life event is already on the client's mind. It is also the hardest to automate because the trigger is usually a human detecting the event rather than a system event. The automation starts manual and gets semi-automated over time (property-record monitoring, for example, can surface new home purchases without any human detection).

## The check-in drafting workflow

The AI workflow for proactive check-ins is a light variation on the personalization workflow from the Retention course Lesson 2.3. The same voice samples, the same prompt skeleton, different occasions.

**Step 1 — A trigger fires.** For the 30-day-after-bind check-in, the trigger is "bind date + 30 days." For the post-claim check-in, the trigger is a claim status change to "closed." For the policy anniversary, the trigger is "bind anniversary." For the life event, the trigger is usually a human flagging it in a sheet. The triggers live in Zapier, Make, or a scheduled script reading your AMS export.

**Step 2 — The automation pulls the client's facts.** Client name, policy details, bind date, any relevant context (claim outcome summary for post-claim, a note about what was bound for 30-day check-in). The facts come from the same AMS export you use for retention personalization.

**Step 3 — AI drafts a short, personal check-in message** using the facts plus your voice samples. The prompt is a variation on the personalization prompt from the Retention course — the only difference is the "occasion" field, which varies by moment.

> You are drafting a short proactive check-in message on behalf of {agent_name}, an independent insurance agent. Write in {agent_name}'s voice based on the voice samples below.
>
> The occasion is: {occasion — e.g., "30 days after bind," "three days after claim closed," "one-year policy anniversary"}. The goal is to make the client feel seen without any marketing pitch.
>
> Hard rules:
> - Reference one specific fact from the client facts block (the policy type, a claim detail, the bind date).
> - End with one open-ended question. Not a CTA.
> - Under 75 words.
> - No signature block, no subject line, no greeting beyond "Hi {first_name},".
> - No mention of additional products, quotes, discounts, or referrals.
>
> Client facts: {client_facts}
> Voice samples: {voice_sample_1} --- {voice_sample_2} --- {voice_sample_3}

**Step 4 — A human reviews the draft in 5 to 10 seconds and clicks send.** Tier B review from the Retention course (Lesson 2.3 there) applies here: check for anything obviously wrong, tighten one sentence if needed, ship it. Do not rewrite. The power of the workflow is the volume.

**Step 5 — Log the outcome.** Did the client reply? What kind of reply? Did it turn into a conversation or an upsell? The logging feeds the measurement step (below) and tells you whether each trigger is worth running.

## The three rules that keep check-ins from feeling like marketing

The line between "thoughtful check-in" and "automated spam" is thin and clients detect the difference within the first sentence. Three rules keep you on the right side.

**Rule 1 — No call-to-action at the end.** No "click here to get a quote." No "reply if you'd like to discuss additional coverage." No "visit our website to learn more." A check-in that ends with a CTA is a marketing email pretending to be a check-in, and the client knows it. If a cross-sell is appropriate, the client will raise it themselves in their reply. Your job is to make the message safe to reply to.

**Rule 2 — Reference something specific that only a human could have noticed.** "How did the claim on your Honda go?" "Is the new roof holding up now that you've had the policy for a few months?" "How's the first year with the new restaurant?" The specificity is what makes the message land. Generic check-ins ("Just checking in to see how you're doing") read as automated regardless of how personalized the underlying pipeline is. The specific detail in the opening sentence is the entire battle.

This is where the fact blocks in the personalization prompt earn their keep. A good fact block has five to seven specific items about the client, and the prompt instruction "reference one specific fact" ensures the draft uses one of them. Without the specific fact, the check-in is noise.

**Rule 3 — One question only.** End with a single open-ended question. "How are things?" "Anything I can help with since the claim wrapped up?" "How's the new house settling in?" Not a survey. Not a list. Not a "please let me know about all of the following." One question, open-ended, inviting whatever answer the client wants to give. This format produces the highest response rate by a wide margin.

## Measurement

Track two numbers on the proactive check-in program. Not ten metrics. Two.

**Metric 1 — Reply rate.** The percentage of sent check-ins that get any kind of response from the client. A one-word "thanks!" counts. A full paragraph counts. Anything that shows the client read it and felt moved to respond.

Healthy reply rate by trigger:
- 30-day-after-bind: 30 to 40 percent
- Post-claim: 50 to 70 percent
- Policy anniversary: 15 to 25 percent
- Life event: 50 to 80 percent (highest of all)

If your reply rate is below these ranges for a specific trigger, the message is too templated, the specific fact is not specific enough, or the voice samples are stale.

**Metric 2 — Reply value.** The percentage of replies that turn into a meaningful conversation — a cross-sell discussion, a referral, a claim follow-up that improves the relationship, a piece of information about the client you did not know. Healthy value rate is about one in five replies producing a meaningful conversation.

If reply rate is healthy but reply value is low, you are asking the wrong closing question or the message is not opening a door the client feels comfortable walking through. Try varying the question.

Track both numbers for every trigger, monthly, in the same running log you use for retention metrics. Drop any trigger that does not produce healthy numbers after 60 days of running. The four moments listed above all usually work, but your specific mix of clients may make one of them underperform — better to know and drop it than to keep sending noise.

## The capacity math

Running all four triggers on a typical agency book of 600 policies produces roughly this volume:

- 30-day bind check-ins: 8 to 12 per week (assuming ~40 new binds a month)
- Post-claim check-ins: 2 to 6 per week
- Policy anniversaries: 8 to 12 per week (spread across the year)
- Life event check-ins: 1 to 4 per week

Total: about 20 to 35 check-ins per week. At 10 seconds per AI-drafted approval, that is 3 to 6 minutes a day of actual reviewing work. Compare to the 10 hours a month of manual drafting it would take to produce the same volume by hand. That is the AI leverage — it is not the sending, it is the drafting-at-volume.

## Do this today

Pick one trigger. Just one. I recommend the 30-day-after-bind check-in because it is the easiest to stand up (every agent has bind dates in their AMS) and it produces visible reply rate within the first month.

Pull a list of the five clients whose policies bound exactly 30 days ago. Send each one a short, personal check-in message by hand. Do not automate it. Do not batch it. Write five distinct messages and send them one at a time. Note which ones reply, what they say, and how the replies make you feel about the client.

That's the baseline feel. Before you automate anything, you need to know what the texture of the conversation sounds like when it is hand-written, so you can tell the difference between an AI draft that captures the texture and one that is going through the motions. The manual pass takes 20 minutes and saves you from building an automation that doesn't work.

Once you have the feel, come back and wire up the automation. The voice samples, the prompt, the trigger, the approval queue, the log. One trigger at a time. Measure for 30 days. Add the second trigger.

## Next up

That finishes Module 4. The client service automations together — inbox triage, COI bot, check-in workflow — recover 8 to 12 hours per CSR per week in most agencies. That is exactly the amount of capacity needed to either grow the book without hiring or hand off more work to the existing team. Module 5 turns the agency's scattered operational knowledge into a real SOP library, measures the ROI of the ops work you've built so far, and shows you how to roll the whole thing out to producers and CSRs without the usual resistance. That is where the tools become an actual agency capability instead of a few clever automations.
