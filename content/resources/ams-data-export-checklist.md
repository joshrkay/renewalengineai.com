---
title: "AMS Data Export Checklist: What to Pull Before Your First AI Audit"
slug: "ams-data-export-checklist"
description: "The exact AMS data export insurance agencies should pull from Applied Epic, HawkSoft, or EZLynx before an AI audit - tables, fields, and hygiene checks."
publishedAt: "2026-07-12"
category: "Integrations"
primaryKeyword: "AMS data export insurance"
readTime: 9
related:
  - "ams-ai-integration-guide"
  - "ai-renewal-automation-playbook"
---

# AMS Data Export Checklist: What to Pull Before Your First AI Audit

Every AI audit we run starts the same way: we ask the agency for a data export from their AMS. What comes back predicts how the whole engagement will go. Agencies that send clean exports get a roadmap grounded in their actual book. Agencies that send a half-empty spreadsheet with renewal dates missing on 30% of policies spend the first week of the audit doing data cleanup instead of finding revenue.

Industry consultants who handle AMS migrations report the same pattern: the export step is where most projects discover their data problem, and agencies typically need 10-20 hours of staff time to fix gaps that automation can't work around.

This checklist is the export request we send before every $1,500 audit. If you pull this yourself before engaging anyone (us or a competitor), you'll cut days off the assessment and you'll know exactly what shape your book is in. That knowledge is worth having even if you never automate anything.

## Why the audit starts with an export, not a demo

An AI renewal system is only as good as the data that triggers it. Renewal outreach fires off expiration dates. Lead response fires off intake records. Cross-sell fires off policy and household data. If those fields are wrong in the AMS, the automation is wrong at full speed.

So before anyone talks about sequences or response times, the audit has to answer three questions from your real data:

1. **Coverage**: what percentage of active policies have the fields automation needs (expiration date, client email, premium, line of business)?
2. **Freshness**: when were those fields last updated, and is anything stale enough to be untrustworthy?
3. **Volume**: how many renewals, by month and by line, will the system actually touch in the next 12 months?

You can't answer any of those from a demo or a discovery call. You answer them from an export.

## The five exports every audit needs

Whatever AMS you run, the audit needs the same five datasets. Here's each one, the fields that matter, and what we're looking for.

| Export | Key fields | What it tells the audit |
|---|---|---|
| Active policy list | Policy number, line of business, carrier, effective date, **expiration date**, premium, status | Renewal volume by month, premium at risk, missing expiration dates |
| Client contact list | Client ID, name, **email**, mobile phone, mailing address, do-not-contact flags | Reachability: what share of the book can automation actually contact |
| Expiration / renewal report | Policies expiring in the next 90 days sorted by premium | The immediate pipeline, and whether the report matches the policy list |
| Activity / touch log | Last 12 months of client contacts: calls, emails, notes, by producer or CSR | Current outreach coverage - who gets touched before renewal today, and who silently lapses |
| Lapse / cancellation history | Cancelled and non-renewed policies for 24 months, with reason codes if tracked | Your baseline retention rate and where the leaks concentrate |

Two notes on this table.

First, the expiration date column is the single most important field in the entire export. Proactive renewal outreach is where the 15-20% retention lift comes from, and every policy with a missing or wrong expiration date is a policy the system will never touch.

Second, the activity log is the export agencies most often skip, and it's the one that changes the conversation. When an owner sees that policies with zero pre-renewal touches lapse at a multiple of the rate of policies that got a call, the case for automation stops being theoretical.

## Where to find it in Applied Epic, HawkSoft, and EZLynx

The three platforms we see most all support these exports, but they put them in different places and give them different names. (For the deeper integration patterns - APIs, write-back, webhook flows - see our [AMS + AI integration guide](/resources/ams-ai-integration-guide).)

**Applied Epic.** Use the Reports area for a policy detail report filtered to in-force policies, and add expiration date, premium, and line of business as columns. Client contact data comes from a client detail report; make sure email and the marketing consent flags are included. Epic's activity report covers the touch log. Export everything to CSV. If your agency uses IVANS downloads, note which carriers auto-update policy status, because manual-entry carriers are where stale dates cluster.

**HawkSoft.** The expiration report is a standard report and most offices already run it monthly. Pair it with a client list export that includes email and phone, and use the log/activity export for touch history. HawkSoft's reporting is simpler than Epic's, which cuts both ways: exports are quick to run, but if your office tracks things in free-text notes instead of structured fields, expect to find gaps the reports can't show.

**EZLynx.** Pull the policy export from Reports with expiration date and premium columns, and the contact export from the client roster. EZLynx's Retention Center already tracks some renewal risk signals natively, so also export whatever it flags; the audit should reconcile its at-risk list against the raw expiration data rather than trusting either alone.

If your AMS isn't one of these three, the checklist still applies: any system that can't produce these five exports in CSV within a day is itself a finding for the audit.

## The 10-point hygiene pass before you send anything

Run this pass on the exports before anyone analyzes them. Every item is a five-minute spreadsheet check, and together they tell you (and us) how much of the book automation can serve on day one.

1. **Expiration date coverage.** What percent of active policies have a non-blank, future-or-recent expiration date? Below 90% means cleanup before launch.
2. **Email coverage.** What percent of active clients have an email address? This caps what email automation can reach.
3. **Mobile coverage.** Same check for mobile numbers if you plan to text.
4. **Duplicate clients.** Sort by name and address; flag households entered two or three times. Duplicates cause double outreach, which clients notice.
5. **Placeholder junk.** Search emails for "none", "n/a", and the agency's own domain. Placeholder data is worse than blank data because it looks real.
6. **Status accuracy.** Spot-check 20 "active" policies against carrier portals. If more than one is actually cancelled, status is drifting.
7. **Stale activity.** What share of clients have zero logged touches in 12 months? That's your silent-lapse risk pool.
8. **Reason codes.** Do cancellations carry a reason, or is the field blank? Blank reason codes limit what the lapse analysis can attribute.
9. **Do-not-contact flags.** Confirm the export includes them and they're populated. Automation must honor opt-outs from the first send.
10. **Line-of-business consistency.** One naming convention per line, not "Auto", "auto", and "Personal Auto" as three categories.

Don't aim for perfect. Aim for known. An agency that knows its email coverage is 74% can launch automation on the 74% while a CSR backfills the rest. An agency that never checked usually assumes coverage is fine, and finds out otherwise in week one. Our [AI Agency Operations Bootcamp](/courses/ai-agency-ops-bootcamp) has a full module on data hygiene if you want the extended version of this pass.

## Export schedule and handoff format

For the audit itself, a one-time CSV export of the five datasets is enough. Send CSVs, not PDFs: a PDF report can't be analyzed without retyping it, and screenshots are worse.

For ongoing automation after the audit, the working pattern is:

- **Daily**: policies expiring in the next 90-120 days, plus new/changed policies.
- **Weekly**: full client contact refresh, so opt-outs and email changes propagate.
- **Monthly**: full book snapshot for retention math and drift detection.

Whether that runs over an API, scheduled reports to SFTP, or IVANS depends on your AMS and your appetite for IT work; that's a build decision, not an audit decision, and it's covered in [how our process works](/how-it-works). Realistic timeline once the audit is done: 2-3 weeks to a live integration.

## Handle the PII like it's regulated, because it is

These exports contain names, addresses, phone numbers, and policy details. Treat the handoff accordingly:

- Share via a secure channel (encrypted file share), never as a plain email attachment.
- Strip fields the audit doesn't need: SSNs, driver's license numbers, and bank details should never leave the AMS for this purpose.
- Confirm the recipient's retention policy: any auditor should delete raw exports after the engagement, and you should ask when.
- Keep do-not-contact and consent flags attached to the contact data through every downstream system.

Any vendor who shrugs at these questions is telling you something important about how they'll run your outreach.

## The checklist is the first deliverable

Here's the part agencies don't expect: running this checklist is itself the first third of an AI audit. Before we've built anything, you know your renewal volume by month, your reachability, your silent-lapse pool, and your data gaps with numbers attached. Owners have canceled staff meetings over what the activity-log export showed.

Pull the five exports, run the ten checks, and you'll know more about your book by Friday than most agencies learn in a year. And if you'd rather have it done for you, with the leak math and the 90-day roadmap attached, [book the audit](/#pricing) and send us the exports instead.

Clean data doesn't renew policies. But nothing renews policies without it.
