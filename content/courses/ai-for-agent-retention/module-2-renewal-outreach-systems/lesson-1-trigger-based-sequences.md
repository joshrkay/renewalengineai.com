---
title: Trigger-Based Renewal Sequences
module: 2
order: 1
duration: 14
---

# Trigger-Based Renewal Sequences

A good renewal sequence is not a blast. It is not a monthly newsletter. It is not "touch the client whenever I get around to it." A good renewal sequence is a set of small, well-timed touches fired by specific events on each individual policy. In this lesson you build the exact trigger schedule that works for independent agents, understand the logic behind each touch, and wire the whole thing up so it runs without you having to remember anything.

By the end of this lesson you will know the seven-touch cadence, the AMS date field that fires each one, the channel the touch goes out on, the goal of each message, and the single rule you are not allowed to break.

## Why triggers beat calendars

Most agencies that try to "do renewal outreach better" start with a calendar. They pick one day a week to call the clients renewing in the next 30 days. It feels like a system because it lives on a calendar. It is not a system. It is a backlog.

Calendar-based outreach has three problems. First, it is always reactive to whatever else is happening that week, which means in a busy week it gets skipped. Second, it treats every client with the same renewal cadence regardless of when in the cycle they actually are, which means nobody gets touched at the right moment. Third, it requires you to remember to do it, and anything that requires remembering eventually stops happening.

A trigger-based system has none of these problems. Every touch fires off a date field in your AMS — usually the policy expiration date — and runs on its own. Your job is not to "remember to call this week's renewals." Your job is to approve the AI-drafted touches as they land in your queue each day. The scheduling is not a skill you have to practice. It is a thing the system does.

## The seven touches that work

After testing this with dozens of agents across personal and commercial lines, the rhythm below produces the best results. The dates are calculated as X minus N, where X is the policy expiration date. Personal lines uses the cadence as-is. Commercial lines stretches the early touches out by about two weeks because commercial clients do their renewal thinking earlier.

**X minus 90 — heads-up.** Soft email. Not about the renewal. About them. A market update, a local tip, a quick check-in ("just wanted to make sure we had everything right on your account before we start looking at your renewal"). This resets the relationship three months before the renewal conversation. It also gives the client plenty of runway to raise anything they have been meaning to mention.

**X minus 60 — check-in.** Second email. This one asks one specific policy-related question: any changes in the household, any new vehicles, any coverage concerns. The goal is to produce a reply. A reply at this stage is gold — it means the relationship is warm and the renewal is effectively locked.

**X minus 45 — value recap.** Email. This is the one that separates you from a captive agent. You write a short summary of what this policy did for the client in the last year. Any claims paid, any coverage you added, any savings you negotiated. If nothing happened, write a paragraph about why nothing happening is actually the desired outcome ("your coverage was in place and ready; you never had to think about it"). Clients under-appreciate insurance because they under-appreciate avoided loss. This touch fixes that.

**X minus 30 — rate preview.** Email. This is where you front-run any rate increase. If the renewal is coming in higher than last year, you tell the client here, plainly, along with the reason and what you are doing about it. Do not let the rate increase arrive as a surprise buried in a renewal packet. Clients shop when they feel ambushed. They don't shop when they feel informed.

**X minus 14 — phone call (top 20 percent only).** The most expensive touch, reserved for the highest-value accounts. Fifteen minutes on the phone, client-led. You ask how things are and listen more than you talk. This is not a sales call. It is a relationship maintenance call. The top 20 percent of your book earns this; everybody else gets the email cadence.

**X minus 7 — SMS nudge.** Text message. Short. "Hey {first_name}, just a reminder your {policy_type} renewal delivers next week. Anything I should know before it goes out?" That single text produces more replies than three emails combined on most books, because it feels one-to-one in a way email no longer does.

**X plus 1 — thank you.** Email, the day after the renewal delivers. Short. Sincere. "Thanks for sticking with us another year. We appreciate your trust." No CTA. No next step. Just gratitude. This touch has a reply rate of roughly zero and a retention impact larger than any other single touch in the sequence. Clients remember the moment you said thank you for nothing in return.

![Trigger-based renewal sequence timeline: seven touches from X-90 through X+1, each one fired by a date field on the policy and delivered through the right channel at the right moment](/courses/retention/trigger-sequence-timeline.svg)

## What each trigger actually fires

Behind the schedule sits a simple event system. The trigger is always the X-date minus some number of days. The action is a specific prompt-to-draft plus a specific delivery channel (email, SMS, or a calendar task for the phone call).

The tool that fires the event does not need to be expensive or fancy. Zapier, Make.com, and n8n all support "run this action N days before a date field" as a native trigger. You wire it up once per touch. That is seven Zaps. A half-day build. Done forever.

The important architectural choice is that each message is *generated* at the moment of sending, not written in advance as a static template. Static templates produce "Dear Valued Customer" emails that clients immediately recognize as mass mail. AI-drafted messages at send time produce emails that reference the client's actual policy, their actual history, and your actual voice. We build that drafting flow in the next lesson.

## The one rule you cannot break

Every outgoing touch must come from a real email address that belongs to a real person on your team. No `noreply@agency.com`. No generic `renewals@`. If a client hits reply, they must reach a human inbox that gets answered within the business day.

That one rule is what separates a retention sequence that feels like service from one that feels like spam. Every time you are tempted to route outgoing mail through a marketing automation tool's shared sender, stop and remember this rule. The technical cost of using a real sender is zero. The trust cost of using a fake one is the entire system.

## A note on SMS compliance

SMS is not free-for-all. Before you turn on the X-7 SMS touch, make sure every client on your list has opted in to SMS communication, either through a form on your website or a documented verbal opt-in logged in your AMS. TCPA violations are expensive and the trial lawyer industry is excellent at finding them. Your AMS probably has a "texting opt-in" field already. If it does not, add it as a custom field this week.

## Do this today

Two concrete actions.

1. **Pick one policy** from your upcoming renewals. Write down the X-date. Calculate the seven trigger dates (X-90, X-60, X-45, X-30, X-14, X-7, X+1). These are your calendar anchors for that one client. Walk through the sequence in your head and imagine the client receiving each touch. That mental rehearsal is what tells you whether the cadence feels right for your voice before you automate it.

2. **Find the SMS opt-in field** in your AMS. If it exists, pull a count of how many active clients are opted in. If it doesn't exist, create it. You will need it in two lessons.

## Next up

In the next lesson we layer channels. A sequence that lives only in email is leaving response rate on the table. Every agent has clients who ignore email and answer texts within minutes, and clients who will pick up a call but delete everything else. The next lesson is about using the right channel for the right touch without feeling intrusive.
