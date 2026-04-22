---
title: Identifying Churn Signals in Your Book
module: 3
order: 1
duration: 14
---

# Identifying Churn Signals in Your Book

Every lapsed policy sent a signal before it lapsed. Usually more than one. The problem is that those signals live in nine different places — the carrier portal, the AMS notes, the email archive, the billing system, the occasional text thread — and no human has the time to connect them across 800 clients. By the time the lapse shows up in your month-end report, the signals were already there for 60 days and nobody noticed.

This lesson shows you which signals actually predict churn (the ones we actually measured, not the ones that sound smart), how to watch for them without building a data warehouse, and the 30-minute Monday practice that turns the whole thing into a routine you will actually do.

By the end of this lesson you will know the five signals that matter, where each one lives in your systems, and the weekly AI prompt that pulls them into a single ranked at-risk list.

## The five signals that actually matter

After reviewing hundreds of lapse events across a dozen agencies, the same handful of signals keep showing up. Most "churn prediction" lists you'll see online include twenty indicators. In real agency data, five of them do 90 percent of the work. Focus there.

**Payment friction.** The first late payment is not a lapse, but it is a tripwire. Clients who pay late even once are three to four times more likely to lapse within twelve months than clients who never pay late. The second late payment inside six months is nearly a guarantee. Payment friction shows up in the carrier portal, usually as a "NSF" or "late" flag on the billing activity. Pull this once a week and you have the single most reliable churn signal in the book.

**Premium shock.** A rate increase over a certain threshold triggers shopping behavior. The threshold varies slightly by line of business, but the working number is 12 percent for personal auto, 15 percent for homeowners, and 8 percent for commercial general liability. Above those, the client starts thinking about alternatives whether they tell you or not. This is the most predictable signal in the entire book because you can see it coming 60 days out from the renewal quote. If you know a renewal is coming in hot, you already know which policy is at risk and you have two months to pre-empt it.

**Service contact drop-off.** A client who used to call, email, or update their policy every few months and then goes silent for six-plus months is telling you something. Silence is not loyalty. In my data, "no inbound contact in 6+ months" is a stronger lapse predictor than any demographic variable. It often means the client is already shopping and they don't want the awkwardness of talking to you until the decision is made. Catching the silence at month four instead of month nine is the whole game.

**Life event triggers.** A new home, a new job, a new state, a new business, a divorce, a teen driver reaching driving age, a kid leaving the house. Every single one of these creates a reason for the client to call another agent. Life events are not tracked in your AMS, but they often show up in public records (property transfers, business filings), in social media if you know where to look, or in a throwaway sentence in an email you didn't pay attention to. If you are not the one reaching out at the life event, someone else is.

**Policy downgrade requests.** A client asking to lower coverage or remove a line is almost always in financial stress. Stress leads to shopping. Catch these conversations in the moment, respond with empathy and options, and you can save the relationship. Miss them, let a CSR handle the downgrade as a routine service request, and the policy is usually gone within 90 days.

## Where the signals actually live

Each of these signals already exists somewhere in your data. The hard part is not capturing them. The hard part is that they each live in a different place.

- **Payment friction** lives in the carrier portal, under billing activity. Most agencies never export this. Export it.
- **Premium shock** lives in the renewal quotes as they flow in, 60 days out from X-date. Most AMS platforms will export upcoming renewals with new premiums.
- **Service contact drop-off** lives in your email client and your AMS notes. Gmail search for `from:{client_email}` plus date filter is a surprisingly effective free tool for this.
- **Life events** live in public records (county assessor sites for property transfers, secretary of state for business filings) and in whatever the client has told you about themselves over the years.
- **Downgrade requests** live in your AMS notes, usually in free text.

You do not need to build an integration layer across all five. You need to export each one into a single weekly folder, then ask AI to read across them.

## The weekly Monday practice

Block 30 minutes every Monday morning. Same time every week. Non-negotiable. This is the highest-leverage 30 minutes in your week once the system is running.

**Minutes 0 to 10 — export.** Pull five files into one folder (or five tabs in a Google Sheet):

1. Upcoming renewals in the next 60 days with old premium, new premium, and percent change.
2. Late payment alerts from the carrier portal for the last 14 days.
3. Clients who opened a service request in the last 30 days (for the opposite — so you can also see who hasn't).
4. Clients with a downgrade request note in the last 30 days.
5. Your client list with "last contact date" for each row.

**Minutes 10 to 20 — run the ranking prompt.** Paste the following into Claude or ChatGPT:

> Here are five lists from my agency. For each client appearing on any list, assign a churn risk score from 1 (low) to 10 (high) based on these weights: renewal with 15%+ premium increase = +4; payment friction in last 14 days = +3; no inbound contact in 180+ days = +2; downgrade request in last 30 days = +3; known life event in last 30 days = +2. Return the top 20 clients by total score, with the score and the reasons. Format as a markdown table.
>
> List 1 — upcoming renewals with premium change: {paste}
> List 2 — late payments: {paste}
> List 3 — recent service requests: {paste}
> List 4 — downgrade requests: {paste}
> List 5 — last contact dates: {paste}

In five seconds the AI returns your top-20 at-risk list with reasons. That list is your entire worklist for the week.

**Minutes 20 to 30 — triage.** Take the top 20 list and decide who gets a phone call, who gets a personalized email, and who gets added to the watchlist. We cover the exact triage rules in Lesson 3.3. For now, the main discipline is that you pick exactly five people to personally call this week and block the time on your calendar right now, before the list goes stale.

## A note on false positives

No churn scoring system is perfect, and neither is this one. Expect that about 30 to 40 percent of the clients you flag will never have considered lapsing. That is fine. Reaching out to a client who was going to stay anyway doesn't hurt — it produces a warm moment, a small thank-you, and sometimes a referral. The cost of a false positive is about 60 seconds of your time. The cost of a false negative (missing a real churn risk) is the full lapse cost from Module 1. The math is always in favor of over-flagging.

## What you are not doing

You are not building a machine learning model. You are not hiring a data scientist. You are not moving your data into a new platform. You are exporting a handful of files once a week and asking AI to find patterns you already know how to recognize when you have time — which is never.

The entire complexity of this lesson is in the discipline to do the 30-minute Monday ritual every single week. The tools are cheap. The prompts are simple. The ritual is the thing.

## Do this today

Pull your next 60 days of upcoming renewals from your AMS. Sort by percent premium change descending. Highlight the top 10 by increase. Those 10 clients are the most at-risk policies in your book right now, measured by the single strongest signal we have, and you did it in four minutes with zero AI.

That list is your homework for this week. Pick three of them and schedule a phone call before Friday.

## Next up

In the next lesson we turn the at-risk list into a weekly dashboard. Not a Tableau dashboard. A five-cell Google Sheet that tells you, in 30 seconds on a Monday morning, whether your book is healthy this week or bleeding. The dashboard is what makes the Monday ritual sustainable over 12 months instead of petering out in February.
