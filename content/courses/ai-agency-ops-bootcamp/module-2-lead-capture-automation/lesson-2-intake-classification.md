---
title: Intake Classification
module: 2
order: 2
duration: 10
---

# Intake Classification

A lead form that dumps raw responses into your inbox is only half a system. The other half is sorting and labeling those responses so you know, in ten seconds, whether the lead is worth calling in the next hour or whether it can wait until tomorrow. AI does this sorting for you.

## What you're classifying
Every incoming lead should get four pieces of metadata attached to it before it reaches a human.

**Urgency.** Is this a new policy bind needed by a closing date tomorrow, or someone casually shopping rates in six months? Your response time should match.

**Line of business.** Personal auto, homeowners, commercial general liability, commercial auto, workers comp, and so on. This determines who on your team picks it up.

**Fit.** Does this lead match your ideal client profile, or are they outside your appetite? You don't want to spend 45 minutes on a lead you can't write.

**Language and location.** Which state, which language preference, any indication that another language specialist should handle it.

A human reading 20 leads a day can do this classification in about 30 minutes. An AI can do it in ten seconds per lead, with no coffee required, while you sleep.

## The prompt
Here is a starter prompt you can paste into ChatGPT or Claude and adapt.

> You are a lead classification assistant for an independent insurance agency. For the incoming lead below, return a JSON object with four fields: urgency (high, medium, low), line_of_business (auto, home, commercial_gl, commercial_auto, wc, other), fit (good, marginal, bad), and notes (any flags or unusual details). Base urgency on timing language in the lead. Base fit on whether the lead's situation matches the agency's appetite, which is: {your_appetite_description}.
>
> Lead: {raw_lead_text}

Feed each new lead into that prompt and the AI returns a clean, structured tag. You can then display the tag in a Google Sheet, a Slack channel, or a Kanban board.

## Wiring it up
Use Zapier, Make.com, or n8n to create a three-step automation.

Step 1: Trigger when a new lead arrives (from the form in Lesson 2.1, from your inbox, or from your CRM).

Step 2: Call your chat AI with the classification prompt above. Pass in the lead text. Get back the JSON.

Step 3: Append a row to a Google Sheet or post a Slack message with the classified lead.

Build time: about an hour the first time, ten minutes for subsequent refinements.

## Why JSON output matters
AI can return classifications as prose, but prose is hard to route. Asking for a JSON object forces the model into a structured format, which is trivially parseable by Zapier or Make. One small prompt change unlocks a much more reliable pipeline.

If the model occasionally returns malformed JSON, add the instruction "Respond only with valid JSON. Do not include any other text." to the prompt. That usually fixes it.

**Do this today:** Take your last five incoming leads and run them through the classification prompt manually. Compare the AI's classification to your own judgment. If they match more than four out of five times, you're ready to automate.
