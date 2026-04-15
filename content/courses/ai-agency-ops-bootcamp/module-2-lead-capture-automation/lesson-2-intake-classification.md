---
title: Intake Classification
module: 2
order: 2
duration: 13
---

# Intake Classification

A lead form that dumps raw responses into your inbox is only half a system. The other half is sorting and labeling those responses so you know, within ten seconds of a lead landing, whether it needs a phone call in the next hour or whether it can wait until tomorrow morning. Without that sort, every lead looks equally urgent, which means every lead gets treated with the same mediocre response time, which means the actual hot leads cool off while you work through a queue.

AI does the sort for you. In ten seconds per lead. While you are on another call, in a meeting, or asleep. This lesson shows you exactly what to classify, the working prompt, how to wire it into an automation that runs forever, and the one discipline that makes the classification actually useful instead of being another layer of data nobody acts on.

By the end of this lesson you will have a four-field classification schema, a copy-pasteable prompt, a 3-step Zap structure, and a validation routine you run for the first two weeks to make sure the AI is classifying correctly before you trust it unattended.

## What you are classifying

Every incoming lead should get exactly four pieces of metadata attached to it before it reaches a human. Not six. Not ten. Four. More fields become noise and the CSR stops looking at any of them. Less, and you cannot make a routing decision.

**Field 1 — Urgency (high / medium / low).** The single most important classification. Is this a new policy bind needed by a closing date tomorrow? High. Someone casually shopping rates for a renewal in three months? Low. Someone who just got a non-renewal notice and is searching for coverage this week? High. Your response SLA should be tied directly to this field — we cover the SLA rules in Lesson 2.3.

The AI derives urgency mostly from language cues in the lead text: words like "tomorrow," "closing," "non-renewed," "cancelled," "urgent," "ASAP" are strong signals of high urgency. "In a few months," "just looking," "comparing rates," "no rush" are strong signals of low urgency. Medium is the default when nothing triggers either side.

**Field 2 — Line of business.** Personal auto, homeowners, commercial general liability, commercial auto, workers comp, umbrella, business owner's policy, life, other. This determines who on your team picks it up. If your agency has one producer for personal lines and another for commercial, this field is the routing key. If you are solo, it still matters for how you prepare before the call.

**Field 3 — Fit (good / marginal / bad).** Does the lead match your agency's appetite? Are they in a state you write in, a line you write in, and a risk profile you can place competitively? A lead for long-haul trucking when you do not write commercial auto at all is a "bad" fit — you should know that in ten seconds so you can respond with a warm referral instead of spending 45 minutes building a quote you cannot place.

The AI needs to know your appetite to classify fit. You teach it your appetite once, in the prompt, and it applies the rule automatically to every new lead. We cover the appetite-description format below.

**Field 4 — Notes.** A short, free-text field for anything unusual or worth flagging. "Recently divorced, mentioned ex-husband has the current policy" or "Owns three rental properties, may be commercial" or "Prior DUI mentioned offhand." Notes catch the details that do not fit in any structured field but might matter when the CSR picks up the phone.

A human reading 20 leads a day can do this classification in 30 to 45 minutes. An AI can do it in ten seconds per lead, consistently, at 2am, for roughly $0.002 in API cost. That is a 200x speed-up at effectively zero ongoing cost. The setup, not the ongoing operation, is where the entire investment lives.

## The prompt that works

Here is the starter prompt. Save it as a reusable template. Every classification run uses some version of this.

> You are a lead classification assistant for an independent insurance agency. For the incoming lead below, return a JSON object with exactly four fields:
>
> - `urgency`: one of "high", "medium", "low". High = closing date within 14 days, non-renewal, policy cancelled, explicit "this week" language. Medium = default case with no timing signals. Low = explicit "just looking," "in a few months," or no commitment to buy.
> - `line_of_business`: one of "personal_auto", "home", "commercial_gl", "commercial_auto", "wc", "bop", "umbrella", "life", "other".
> - `fit`: one of "good", "marginal", "bad". Use the agency appetite description below to decide.
> - `notes`: a short string (under 200 characters) with any unusual details, flags, or context worth passing to the human who picks up this lead. If nothing stands out, return an empty string.
>
> Agency appetite: {your_appetite_description}
>
> Lead text:
> {raw_lead_text}
>
> Respond only with valid JSON. Do not include any other text, markdown, or code fences.

The `{your_appetite_description}` block is your agency's appetite in plain English. Three to five sentences. Example: "We write personal auto and homeowners in TN and KY. Preferred auto: clean driving record, no DUIs in past 7 years, homeowners bundled. Preferred home: owner-occupied, built after 1985, no prior water claims. We do not write commercial auto, long-haul trucking, or life. Commercial lines only for BOPs under $2M revenue."

That description sits in the prompt forever. When your appetite changes (you start writing commercial auto, you exit a state), you update the description once and every future classification uses the new version. This is the only part of the prompt you will touch after initial setup.

## Why JSON output is non-negotiable

AI can return classifications as prose ("This looks like a high-urgency home insurance lead from a good-fit client"), but prose is impossible to route reliably in an automation. The Zap needs a predictable field it can parse. Asking for JSON forces the model into a structured format, which is trivially parseable by Zapier, Make, or n8n.

If the model occasionally returns malformed JSON (maybe 1 in 50 cases in my experience), the line `Respond only with valid JSON. Do not include any other text, markdown, or code fences.` fixes it almost every time. If you still see occasional failures, add a fallback step in the Zap that re-prompts with "The previous response was not valid JSON. Try again, returning only a JSON object."

## Wiring it up — the 3-step Zap

Use Zapier, Make.com, or n8n to build exactly three steps. Not more.

**Step 1 — Trigger.** A new lead arrives. The trigger is either the Tally/Typeform form from Lesson 2.1, a new email matching a filter in Gmail, or a new row in your CRM. All three work. Pick the source that is already in your workflow.

**Step 2 — Classify.** Call Claude or ChatGPT with the classification prompt above. Pass in the `{your_appetite_description}` (hard-coded in the Zap) and `{raw_lead_text}` (mapped from the trigger step). The model returns a JSON string.

**Step 3 — Route.** Parse the JSON and either:
- Append a row to a "new leads" Google Sheet with columns for each classification field plus the original lead text.
- Post a Slack message to a `#new-leads` channel with the urgency and line of business in the message body, plus a link to the full lead.
- Create a task in your CRM with a priority matching the urgency.

Pick one of these three for the first build. Do not try to do all three. You can add the others later once the first one is working.

Build time: about 60 to 90 minutes the first time, mostly fighting with field mappings. Subsequent tweaks take under 10 minutes. Ongoing cost: under $5 a month in API fees for a typical agency volume, plus the Zapier or Make subscription you already pay for.

## The two-week validation routine

Do not trust the classification unattended for the first two weeks. Instead, run a validation routine that builds your trust before you cut the human out of the loop.

For the first two weeks, every classified lead goes to a sheet with two columns: the AI's classification and a blank column for your override. Spend 2 minutes a day reviewing the last 24 hours of classifications. If the AI and your judgment agree on 4 out of 5 classifications, you can trust it. If they disagree on more than 1 in 5, look at the disagreement — usually you need to tighten the appetite description or add a clarifying rule to the prompt.

Most agencies hit 90 percent agreement within the first week if the appetite description is honest and specific. The few that do not usually have a vague appetite ("we write most personal lines stuff") that the AI cannot reason about. Tighten the description and re-run.

After two weeks of stable 90 percent agreement, turn off the validation sheet and let the Zap route leads automatically.

## What not to classify

A short list of fields agencies try to add to the classification schema and should not:

- **Estimated premium.** The AI does not know your rater. Any premium it guesses is wrong in a way that will embarrass you.
- **Recommended carrier.** Same problem. Do not let the AI pick a carrier from an incoming lead — that is the producer's judgment call with real underwriting consequences.
- **Sentiment or mood.** Useless for routing. Feels fancy. Pick nothing.
- **Lead score from 1 to 10.** A numeric score hides the reasoning. The three-level urgency and three-level fit fields give you enough resolution to route without pretending you have more precision than you do.

Stick to the four fields. Everything else is decoration.

## Do this today

Take your last five incoming leads from your inbox or CRM. Copy each one into a blank chat with Claude or ChatGPT. Paste the classification prompt above with your appetite description filled in. Run it five times. Compare the AI's classification to what you would have said.

If the AI matches your judgment on 4 out of 5, you are ready to automate. If it matches on 3 or fewer, rewrite the appetite description with more specificity and run the test again. Do not wire up the Zap until the manual test hits 4 out of 5, or the automation will route leads incorrectly and you will spend weeks untangling it.

## Next up

Classification tells you *what* a lead is. The next lesson covers *what to do with it* — the response-time SLAs by urgency bucket, the routing rules that decide who picks up which lead, and the escalation path when a lead sits too long. Capturing and classifying leads is pointless if the handoff still takes 24 hours. Lesson 2.3 closes the loop.
