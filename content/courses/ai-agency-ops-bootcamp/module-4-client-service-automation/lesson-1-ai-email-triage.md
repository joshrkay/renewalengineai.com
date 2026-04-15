---
title: AI Email Triage
module: 4
order: 1
duration: 9
---

# AI Email Triage

The agency inbox is where time quietly disappears. Most agents spend 90 minutes to two hours a day reading, sorting, and responding to emails that could be handled in 30 minutes with the right triage system. AI triage gives you that time back.

## What triage looks like
Triage is not auto-responding. Triage is sorting incoming emails into categories and drafting responses that a human approves before sending. The categories that matter in an insurance agency inbox are usually these.

**Service requests.** Change of address, add a driver, remove a vehicle, update a policy. These have standard responses and can be handled by a CSR or an AI draft.

**COI requests.** Certificates of insurance. High frequency on commercial accounts. Completely templated work.

**Billing questions.** "Why did my premium go up" or "when is my payment due." Often answerable directly from the policy data.

**Claims communications.** Anything from carriers, adjusters, or clients about an active claim. Needs immediate human attention.

**New business inquiries.** Anything that looks like a prospect. Needs fast routing, per Module 2.

**Noise.** Newsletters, marketing, vendor pitches. Archive without reading.

A good triage system sorts every incoming email into one of these categories in seconds, then routes it accordingly.

## The setup
Here is a simple setup using Gmail and a workflow tool like Make.com or Zapier.

Step 1: Create Gmail labels matching the six categories above plus "review."

Step 2: Build a Make.com scenario that triggers on new incoming email. The scenario sends the email subject and body to your chat AI with a classification prompt.

Step 3: The AI returns a category. Make.com applies the Gmail label.

Step 4: For categories with templated responses (service requests, COI, billing), the scenario also generates a draft response in your drafts folder, labeled for your review.

Total build time: two to three hours. Payback: immediate.

## The classification prompt
> Classify this email into one of: service_request, coi_request, billing_question, claims, new_business, noise. Return only the category as a single word. Email subject: {subject}. Email body: {body}.

Simple prompts work best for classification. Don't overthink it.

## Drafting the response
For the three categories that benefit from a templated draft (service, COI, billing), use a second prompt that generates a reply in your voice.

> Draft a short, professional response to this email in the voice of {agent_name}, who runs an independent insurance agency. Do not make commitments about coverage or premium. If the request needs policy data you don't have, ask the client to confirm. Keep it under 80 words.

Review and send with a single click. The entire inbox session feels lighter immediately.

## What to leave alone
Do not AI-triage the claims category. Those emails need your full attention and nothing else. Flag them visibly and respond personally. The time you save on everything else is what buys you the bandwidth to be present for the conversations that matter.

**Do this today:** Look at your inbox for the last 24 hours. Count how many of the emails would have been handled by category automation. For most agents, the number is more than 60 percent. That is the opportunity.
