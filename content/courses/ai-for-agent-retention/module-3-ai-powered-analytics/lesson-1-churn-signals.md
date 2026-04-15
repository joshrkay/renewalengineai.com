---
title: Identifying Churn Signals in Your Book
module: 3
order: 1
duration: 10
---

# Identifying Churn Signals in Your Book

Every lapsed policy sent a signal before it lapsed. The problem is that those signals lived in nine different places and no human has the time to connect them. In this lesson you learn which signals actually predict churn, and how to start watching for them without building a database.

## The five signals that matter
After reviewing hundreds of lapse events, the same handful of signals keep showing up.

**Payment friction.** The first late payment is not a lapse, but it is a tripwire. Clients who pay late once are three to four times more likely to lapse within twelve months than clients who never pay late.

**Premium shock.** A rate increase over a certain threshold, usually 15 percent, triggers shopping behavior. This is the most predictable signal in the entire book. If you know a renewal is coming in hot, you already know which policy is at risk.

**Service contact drop-off.** A client who used to call, email, or update their policy every few months and then goes silent for six-plus months is telling you something. Silence is not loyalty. It often means they are already shopping.

**Life event triggers.** A new home, a new job, a new state, a new business, a divorce, a teen driver. Every one of these creates a reason to call another agent. If you are not the one reaching out at the life event, someone else is.

**Policy downgrade requests.** A client asking to lower coverage or remove a line is almost always in financial stress. Stress leads to shopping. Catch these conversations and you can save the relationship; miss them and the policy is gone.

## Where the signals live
Each of these signals already exists in your data, just in inconvenient places. Payment friction is in the carrier portal. Premium shock is in the upcoming renewal quotes. Service drop-off is in your email and CRM history. Life events are in public records and social media. Downgrade requests are in your notes.

The trick is not building an integration layer. It is asking AI to read across all of those sources and flag the matches for you once a week.

## A simple weekly practice
Dedicate 30 minutes every Monday morning to this. Export the following into a single folder or document: your list of upcoming renewals with their new premium, any late payment alerts from the last 14 days, and any clients who opened or logged a service request in the last 30 days.

Feed the whole thing into an AI model with a prompt like: "Here are three lists. Tell me which clients appear on more than one list, and which clients on the first list have the biggest premium increases. Rank the top 20 by risk."

In five seconds you have your at-risk list for the week. In the next lesson we turn that list into a dashboard.

**Do this today:** Pull the next 30 days of upcoming renewals and highlight the top five by premium increase. Those are five conversations you need to have this week.
