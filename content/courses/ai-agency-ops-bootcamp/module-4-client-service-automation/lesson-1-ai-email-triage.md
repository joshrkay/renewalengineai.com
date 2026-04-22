---
title: AI Email Triage
module: 4
order: 1
duration: 13
---

# AI Email Triage

The agency inbox is where time quietly disappears. Walk into almost any independent agency at 10am and you will find the owner or a senior CSR 40 minutes into an inbox session that started "I'll just knock out a few emails before the 10:30 call." By noon the inbox is mostly handled, no real work has moved forward, and the rest of the day is already behind schedule. That pattern repeats five days a week, and it is the single biggest source of invisible capacity loss in most small agencies.

Most agents spend 90 minutes to 2 hours a day reading, sorting, responding to, and drafting emails that could be handled in 25 to 35 minutes with the right triage system. The gap is not effort. It is that every email gets the same level of attention — a careful read, a careful response — regardless of whether the email is a routine COI request or an active claims situation that actually needs the careful read. AI triage closes that gap by sorting emails into categories and drafting routine responses so the human only spends real attention on the emails that genuinely need it.

By the end of this lesson you will have a six-category triage system, the exact Make.com or Zapier pipeline to wire it up, the two working prompts (classification and drafting), and the hard rule about which category the AI must never touch.

## What triage actually is

Triage is **not** auto-responding. This is the first sentence most agents get wrong when they hear "AI email automation" and it is the sentence that keeps many of them from trying the system at all. Auto-responding — where an AI sends unreviewed replies directly to clients — is a terrible idea in an insurance context. Licensing, regulatory, and trust reasons all argue against it. One bad auto-response about coverage lands you in an E&O conversation you do not want to have.

Triage is a two-step pipeline. **Step 1: classify every incoming email into a category.** **Step 2: for the categories that have templated responses, pre-draft a reply into your drafts folder for a human to review and send in one click.** The human stays in the loop on every single email that reaches a client. The AI saves the 90 percent of the time that was being spent on mechanical sorting and first-draft writing.

A typical inbox session after implementing triage: open Gmail, see 18 pre-categorized emails, click through the 12 pre-drafted responses in the "service" and "COI" labels (approve 11, edit 1), spend real attention on the 2 claims emails and the 1 new business lead, archive the 3 pieces of noise. Total time: 22 minutes. Previous time on the same inbox: 75 minutes.

## The six categories that cover 95 percent of an agency inbox

Keep the category list small. Six is enough to capture almost every routine email and still let the CSR make routing decisions quickly. More than six and the classification starts slipping.

**Category 1 — Service requests.** Change of address, add a driver, remove a vehicle, update a beneficiary, change a payment method. These are templated requests with templated responses and they are the single highest-volume category in most agencies. Probably 30 to 40 percent of all non-spam email on a typical day. Perfect candidates for pre-drafted responses.

**Category 2 — COI requests.** Certificates of insurance. High frequency on commercial books. Completely templated work once the COI generation workflow exists (we cover the COI bot in Lesson 4.2). The triage step's job is to label the email as a COI request so it flows into the right queue, not to issue the COI itself.

**Category 3 — Billing questions.** "Why did my premium go up?" "When is my next payment due?" "Why was I charged twice?" These are answerable directly from the policy and billing data in most cases. The pre-drafted reply can pull the answer from the AMS or can frame a "let me look into this and get back to you" response with a specific callback time.

**Category 4 — Claims communications.** Anything from a carrier claims team, an adjuster, or a client reporting or discussing an active claim. This category is **non-negotiable human attention, always, no automation whatsoever.** We come back to this rule below.

**Category 5 — New business inquiries.** Anything that looks like a prospective client. These should be routed immediately into the lead-capture pipeline from Module 2 (classification, routing, SLA clock). The triage system's job here is just to recognize the email as new business and forward it — not to draft a response itself.

**Category 6 — Noise.** Newsletters, vendor pitches, industry marketing, conference invites, cold sales outreach. Archive without a response. This category is bigger than most agents realize — usually 20 to 30 percent of all inbound.

One optional seventh category — **Internal** — for email from the carrier, underwriter, or other internal partners. Some agencies route these to a separate label for the producer to handle in a dedicated block rather than mixing them with client communications. Optional, not required.

## The Make.com (or Zapier) pipeline

Wiring this up takes one afternoon. Here is the structure.

**Step 1 — Create Gmail labels** matching the six categories above plus "review" and optionally "internal." Label creation is a 2-minute task in Gmail.

**Step 2 — Build a scenario that triggers on new incoming email.** Make.com and Zapier both have Gmail "new email" triggers. Filter the trigger to exclude emails already labeled to prevent loops. If you use a unified inbox (Front, Help Scout), most of these tools have equivalent triggers.

**Step 3 — Classification call.** The scenario sends the email subject and the first 1,000 characters of the email body to Claude or ChatGPT with the classification prompt (below). The response is a single category word.

**Step 4 — Apply the label.** The scenario applies the matching Gmail label based on the returned category.

**Step 5 — Conditional drafting.** If the category is service_request, coi_request, or billing_question, the scenario makes a second AI call with the drafting prompt (below) and creates a Gmail draft with the generated response. The draft sits in the Drafts folder waiting for the CSR to review.

**Step 6 — Exceptions.** If the category is claims or new_business, apply the label but **do not draft a response.** These go to the human with a visible flag and no AI interference.

Total build time: 2 to 3 hours the first time, including testing with real emails from the last week. Cost: existing Make.com or Zapier subscription plus $5 to $15 a month in API fees depending on inbox volume.

## The classification prompt

Keep this prompt short. Simple classification is one area where overthinking the prompt actively hurts accuracy.

> Classify this email into exactly one of these categories: service_request, coi_request, billing_question, claims, new_business, noise.
>
> - service_request: existing client asking for a policy change, update, or routine service action
> - coi_request: request for a certificate of insurance
> - billing_question: question about premium, payment, billing cycle, or charges
> - claims: anything relating to an active or potential insurance claim, including adjuster communications
> - new_business: prospective client inquiring about a new quote or new policy
> - noise: newsletters, marketing, vendor pitches, non-client outreach
>
> Return only the category word with no other text.
>
> Email subject: {subject}
> Email body: {body}

That is the whole prompt. Six categories, six definitions, one-word response. Do not add enrichment fields, sentiment, priority scoring, or any other decoration. The more you add to a classification prompt, the more the model drifts. Keep it surgical.

## The drafting prompt for service, COI, and billing

When the category is service_request, coi_request, or billing_question, the second prompt drafts a response. Here is the working version.

> Draft a short, professional response to this email in the voice of {agent_name}, who runs an independent insurance agency. Use the voice samples below to match tone and rhythm.
>
> Hard rules:
> - Do not make any commitments about coverage or premium.
> - Do not promise a specific outcome on a policy change — say you will look into it and confirm.
> - If the request requires policy data you do not have in the email, ask the client to confirm the specific fields you need.
> - Under 80 words.
> - Warm but professional. End with a soft question that invites any additional detail.
> - Plain text. No signature block. No subject line.
>
> Voice samples:
> {voice_sample_1}
> ---
> {voice_sample_2}
>
> Incoming email:
> Subject: {subject}
> From: {from_name}
> Body: {body}

The voice samples come from the same file you built in the Retention course (Lesson 2.3) — three real sent emails in your actual voice. The drafting prompt hits the 80 percent mark on first try and the CSR review catches the occasional edge case.

## The inbox session after triage

Here is what a triaged inbox session actually looks like, start to finish.

1. **Open Gmail.** The inbox is pre-labeled with six colored labels from the overnight and morning triage runs. Nothing needs sorting.
2. **Service requests (8 emails, 6 minutes).** Click through the Drafts folder. Read each pre-drafted reply. Approve 5, edit 2 for specific details, add one missing context line on the 8th. Send.
3. **COI requests (4 emails, 3 minutes).** The COI bot from Lesson 4.2 has already generated the certificates and attached them to the drafts. Review each, click send.
4. **Billing questions (2 emails, 4 minutes).** Pre-drafted replies exist. Both need a specific number looked up in the AMS. Paste the number in, send.
5. **Claims (1 email, 8 minutes).** Real attention. Read carefully. Write the response by hand because no AI is touching this category. Reply personally.
6. **New business (1 email, 2 minutes).** Forward into the lead-capture pipeline. The classification and routing Zap from Module 2 handles the rest.
7. **Noise (6 emails, 30 seconds).** Archive all.

Total: 24 minutes. Previous inbox session on the same volume: 75 minutes. Net recovered: 51 minutes per day, or about 4 hours per week on a 5-day inbox cadence.

## The hard rule — never touch claims

One category must never go near the AI drafting workflow: **claims.**

Claims communications are legally and relationally sensitive in ways that chat AI does not reliably handle. The subtleties of what you can and cannot say about coverage, the pace and tone of communication with an adjuster, the specific language that protects the client's position without making a coverage representation on your end — all of these require human judgment and a human voice. A pre-drafted AI response to a claim email is a liability, full stop.

Triage labels claims emails so you can find them fast. That is the extent of AI involvement in this category. You read every claim email yourself and respond personally, every time, for as long as you hold a license. The time you save on service, COI, billing, and noise is what buys you the bandwidth to be fully present on the claims conversations that actually need you.

## A note on the "review" label

Add a `review` label and a rule: if the classification prompt returns anything other than the six canonical categories, or if the email is unusually long, or if the email contains keywords like "lawsuit," "subpoena," "attorney," "complaint," or "regulator," the scenario applies the `review` label instead of any other category and does not draft a response. The review label is the safety net for anything the normal triage should not handle. You check it manually like a regular inbox, but it only has 1 to 3 emails a day in a well-tuned system.

## Do this today

Open your inbox and scroll through the last 24 hours of messages. Count how many fall into each of the six categories using the definitions above. In a typical agency inbox, 60 to 75 percent of the emails are service requests, COI requests, billing questions, and noise — all of which have pre-drafted or archive workflows. That is the capacity you are going to recover.

Write the number down. "Yesterday I handled 22 emails, 15 of them could have been pre-drafted or auto-labeled." That number is the business case. Present-you will use it to justify the 3 hours of build time when you sit down to wire up the triage pipeline this week.

## Next up

The next lesson takes one of the categories — COI and endorsement requests — and builds the end-to-end bot that generates the certificate itself, matches it against the policy, emails it to the requestor, and logs everything in the AMS. It is the highest-ROI automation in the entire client service module, and it is the one that makes commercial lines producers stop dreading COI emails.
