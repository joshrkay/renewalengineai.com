---
title: Personalization at Scale With AI
module: 2
order: 3
duration: 11
---

# Personalization at Scale With AI

Personalization is where AI earns its keep. In this lesson you build the exact prompt and the exact workflow that turns a generic template into a message that sounds like you wrote it yourself for one specific client.

## The ingredient list
Good personalization needs four ingredients in the prompt.

1. **Client facts.** First name, household details if you have them, policy type, premium, year they became a client, any claim history.
2. **Voice samples.** Two or three emails you have actually sent, pasted into the prompt so the model can mimic your tone.
3. **The occasion.** Which touch in the sequence is this (value reminder, review offer, renewal delivery) and what the desired reader feeling is.
4. **The constraint.** Length, style, channel, and a hard rule that the AI must never invent coverage details.

## The prompt that works
Here is a starting prompt you can paste into ChatGPT, Claude, or any other model and customize. Save it as a reusable template.

> You are drafting a renewal touch email on behalf of {agent_name}, an independent insurance agent. Write in {agent_name}'s voice, based on the sample emails below. Do not invent any coverage details. Use only the facts in the Client Facts block.
>
> Goal of this message: {occasion_goal}
>
> Client Facts: {client_facts_block}
>
> Voice samples: {two_to_three_real_emails}
>
> Constraints: Under 150 words. Plain text, no subject line. Warm but professional. End with a soft question that invites a reply.

Run this prompt once for each policy in your queue. Paste the client facts from your AMS export. The model returns a draft in your voice. You spend five seconds reading it, thirty seconds making one tweak, and it's ready.

## Speeding it up with a script
If you are sending more than ten renewal touches a week, doing this by hand gets old. The next evolution is a simple Google Sheet or Airtable that holds your client facts for the week, a column that runs each row through the AI with the same prompt, and a column that holds the drafted message for your review.

Tools like Zapier, Make.com, and n8n can wire this up in under an hour. The course templates include the exact Zap setup.

## Guardrails
Two rules that protect you.

First, never let the AI output go directly to the client. Always approve each message, even if the approval takes one second. This keeps you in the loop and catches the rare hallucination.

Second, keep a log of every prompt you run and every client it touched. If a question ever comes up about what you said to whom, you have a record.

**Do this today:** Write down three of your real client emails from the past month. These are your voice samples for the prompt above. You cannot personalize at scale without them.
