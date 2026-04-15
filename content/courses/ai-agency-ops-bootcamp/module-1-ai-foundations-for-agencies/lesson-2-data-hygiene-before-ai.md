---
title: Data Hygiene Before AI
module: 1
order: 2
duration: 8
---

# Data Hygiene Before AI

Most AI workflows fail because the data going in is a mess. This lesson is about the unglamorous work of cleaning up your agency data so the tools in the rest of the course actually work.

## The three data sins
**Missing contact fields.** If half your clients have no email address in the AMS, no automation can email them. This is the single most common blocker. Before you build any workflow, make sure at least 95 percent of your active policies have a current email address and phone number.

**Duplicate records.** The same client with three slightly different spellings and two carrier IDs. AI tools will treat these as separate people and send duplicate messages. Clean duplicates once, save yourself dozens of embarrassing follow-ups.

**Inconsistent fields.** Policy type spelled three different ways. State codes mixed with state names. Effective dates in inconsistent formats. These break every downstream automation.

The work to fix each of these is simple but tedious. Budget half a day. Do it before you touch any of the workflow lessons.

## A weekend cleanup script
Here is the sequence that works for most agencies.

Friday afternoon: export your active policies from the AMS into a single CSV. Open it in Google Sheets.

Friday evening: add a column that flags any row missing an email or phone. Sort by that column. You now have a list of records that need manual completion on Monday.

Saturday: run a simple deduplication. In Google Sheets, select the client name column, go to Data > Data cleanup > Remove duplicates. Start with exact matches. Then sort alphabetically and eyeball for near-duplicates. An hour of this catches 80 percent of the problem.

Sunday: normalize the three worst fields. Usually this is policy type, state, and effective date. Pick one canonical format and run find-and-replace. Re-import the cleaned CSV back into the AMS, or keep the cleaned version as your working file.

## What "good enough" looks like
You are not trying to achieve perfection. You are trying to get above the threshold where AI tools can work without tripping over obvious errors.

A reasonable threshold: 95 percent of records have both an email and phone. Zero obvious duplicates in the top 100 clients by premium. Policy type, state, and date fields are normalized. That is good enough. Ship and move on.

## Privacy and security note
When you move agency data into cloud tools, you are creating a new surface for data exposure. Two rules.

First, use a business account for any AI or automation tool, not a personal one. Business accounts have better data-handling agreements and keep audit trails.

Second, never paste client Social Security numbers, driver's license numbers, or banking details into a general-purpose AI. The tools in Module 3 for document extraction have stricter data handling for a reason. Respect the line.

**Do this today:** Open your AMS and pull a single report: active policies missing an email address. The number is usually bigger than you'd guess. That report is your weekend project.
