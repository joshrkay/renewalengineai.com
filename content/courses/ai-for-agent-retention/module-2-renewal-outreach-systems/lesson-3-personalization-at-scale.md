---
title: Personalization at Scale With AI
module: 2
order: 3
duration: 15
---

# Personalization at Scale With AI

Personalization is where AI earns its keep. Every other piece of the retention system — the triggers, the channels, the cadence — is plumbing. The personalization is the water. If your messages sound generic, the whole system fails regardless of how well the plumbing runs. If your messages sound personal, every other piece of the system compounds.

By the end of this lesson you will have the exact prompt that produces client-ready drafts in your voice, a voice-capture routine you can do in 20 minutes, a three-tier escalation for how much editing each draft needs, and the guardrails that keep AI from inventing coverage details it has no business inventing.

## The four ingredients of a good draft

Every good AI-personalized touch has exactly four ingredients. Miss any one and the draft sounds wrong.

**Client facts.** First name, household composition if you have it, policy type, premium, the year they became a client, any claim history, a note about their last interaction with you. The model cannot produce a "real" email about someone if it does not know who that someone is. Facts are pulled directly from your AMS export into the prompt at send time. Never hand-typed. Never from memory.

**Voice samples.** Two or three complete emails you have actually sent to real clients, pasted into the prompt. The model learns your tone from these samples better than from any "write in a friendly professional voice" instruction. Think of it like showing a ghostwriter three examples of how you talk so they can copy your rhythm. Without voice samples the AI produces a generic LinkedIn-flavored email that every client immediately recognizes as not-you.

**The occasion.** Which touch in the sequence is this? X-45 value recap? X-30 rate preview? X+1 thank you? Each has a different emotional target. The prompt needs to state the occasion and the desired reader feeling, or the model will guess and usually guess wrong.

**The constraint.** Length cap, channel, a hard rule that the AI must not invent coverage details, and a "soft question at the end" instruction that makes every message invite a reply. Constraints are what keeps the AI from being too enthusiastic and writing a 400-word email when you wanted 90 words.

## The prompt that works

Here is the prompt. Save this as a reusable template in your chat AI. Every future touch uses some version of this.

> You are drafting a renewal touch email on behalf of {agent_name}, an independent insurance agent in {city}. Write in {agent_name}'s voice based on the three sample emails below. Match the rhythm, the vocabulary, the punctuation habits, and the level of warmth. Do not invent any coverage details, policy numbers, or claim outcomes. Use only facts in the Client Facts block.
>
> Goal of this message: {occasion_goal — e.g., "recap the value this policy provided over the last year and remind the client that their coverage is in place, without any hint of selling"}.
>
> Client Facts:
> {client_facts_block — first name, household, policy type, premium, year-first-bound, any claims, last-interaction note}
>
> Voice samples (three recent real emails from {agent_name}, in order):
> {email_1}
> ---
> {email_2}
> ---
> {email_3}
>
> Constraints: Under 150 words. Plain text body, no subject line, no greeting line beyond "Hi {first_name}," no signature block. Warm but professional. Reference one specific fact from the Client Facts block. End with a single soft question that invites a reply without asking for a sale.

Paste that into Claude or ChatGPT with the blanks filled in and you get a draft that passes the "sounds like me" test on the first try, roughly 80 percent of the time.

## The voice capture routine

You cannot write this prompt without voice samples. Most agents skip this step and then wonder why the output feels robotic. Spend 20 minutes on this one-time task and every future draft gets better.

Open your sent folder. Find three emails that you remember writing where you felt good about the tone — a warm client check-in, a thoughtful response to a concern, a relationship touch you were proud of. Copy all three into a text file called `voice-samples.txt`. Save it where you can reach it fast.

Every quarter, revisit this file. Swap in one new sample and retire the oldest. Your voice evolves. The samples should evolve with it. An agency that updates its voice samples quarterly produces drafts that stay on-brand; one that doesn't ends up with drafts that sound like their 2023 self a year later.

## Speeding it up with a workflow tool

If you are sending more than 10 touches per week, doing this by hand gets old fast. The evolution is a Google Sheet or Airtable with one row per upcoming touch, columns for the client facts and the occasion, and a Zapier or Make.com automation that pipes each row through the prompt and drops the generated draft into a "pending approval" column.

Here is the exact Zap structure:

1. **Trigger:** New row added to the "upcoming touches" sheet (or scheduled time reached on an existing row).
2. **Format the prompt:** Combine the fact block, the voice samples, and the occasion into a single prompt string.
3. **Call the AI:** OpenAI or Anthropic action, pass the prompt, receive the draft.
4. **Write back:** Update the row with the generated draft in the "pending approval" column.
5. **Notify:** Post a Slack or email ping that new drafts are waiting.

Build time the first time: about 90 minutes, mostly fighting with Zapier's field mappings. Refinement time on subsequent tweaks: under 10 minutes. This is one of the highest-ROI automations in the whole course, and it is also one of the most common places agents give up because of the initial fight. Push through the first build. Every future hour saved pays it back.

## The three-tier editing escalation

Not every draft needs the same amount of review. Waste happens when you edit every draft with the same 30-second care regardless of how important it is. The fix: sort drafts into three tiers and edit proportionally.

**Tier A — top 20 percent clients or sensitive occasions (rate previews, post-claim notes).** Read every word. Budget 45 seconds per draft. Rewrite anything that feels even slightly off. These drafts hit clients whose relationship with you can absorb zero robotic touches.

**Tier B — middle 60 percent clients on routine touches (X-60, X-45, X+1).** Scan for hallucinations, tighten one sentence if needed, ship it. Budget 8 seconds per draft. The bar is "does this sound like me and is everything in it true," not "is this perfect."

**Tier C — bottom 20 percent clients on the minimal cadence.** Skim for anything obviously wrong. Budget 2 seconds per draft. If you never would have written a hand-crafted message to this client anyway, do not spend three minutes polishing the AI draft. Ship it and move on.

Following this escalation, a solo agent handles 60 to 80 drafts in a single 15-minute sitting without feeling rushed. Without the escalation, those same 80 drafts eat two hours and nobody finishes the list.

## The guardrails that protect you

Three rules that keep AI personalization out of trouble.

**Never let the AI output go directly to the client.** Always approve each message, even if the approval takes two seconds. Approval is what catches the rare hallucination (an invented discount, a wrong claim reference, a mis-stated renewal date) and what keeps you in the loop professionally. Your license does not want to meet a mass email you never read.

**Keep a log of every prompt you run and every client it touched.** A simple Google Sheet with `date | client_id | occasion | prompt_version | draft | edited | sent` is enough. If a client ever questions what you said, you can pull up the exact draft. This is also how you spot patterns in edits — if you keep changing the same phrase across drafts, fix the prompt.

**Do not put Social Security numbers, driver's license numbers, or banking details into any chat AI prompt.** The client facts block should contain relationship-level data (name, premium tier, renewal date, policy type). It should never contain PII that you would be embarrassed to see in a data breach disclosure. This is true on the business tiers too — the best privacy promise is "we never had the data in the first place."

## Do this today

Open your sent folder. Find three emails you wrote in the past 30 days that sound like the warmest, most-you version of your voice. Copy them into a `voice-samples.txt` file and save it somewhere you can find fast.

That single file is the foundation of every AI touch you will send for the next quarter. Without it, every draft is just a LinkedIn-flavored guess at what you sound like. With it, every draft starts 80 percent of the way there.

## Next up

That finishes Module 2. You now have a working renewal outreach system — triggers, channels, and personalization. Every policy in your book has a sequence it can run through without you remembering to do anything.

Module 3 is the second half of the retention job: figuring out which clients need extra attention *before* they hit the normal sequence. We build a lapse-risk scoring system, a weekly book-health dashboard, and a sorting routine that tells you which five clients to call this week. That is where AI starts to see things you cannot see, at a scale you cannot match by hand.
