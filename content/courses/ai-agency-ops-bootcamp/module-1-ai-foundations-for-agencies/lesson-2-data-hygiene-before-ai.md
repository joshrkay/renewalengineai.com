---
title: Data Hygiene Before AI
module: 1
order: 2
duration: 14
---

# Data Hygiene Before AI

Most AI workflows fail because the data going in is a mess. This lesson is about the unglamorous work of cleaning up your agency data so the tools in the rest of the course actually work.

I know this is not the lesson you signed up for. You wanted to build cool AI workflows. You did not want to spend a Saturday in Google Sheets normalizing state codes. But this is the lesson that separates the agents who get real value from this course from the ones who quit in Module 3 because "the tools don't work." The tools work. The data is broken. Fix the data.

## The three data sins

**Missing contact fields.** If half your clients have no email address in the AMS, no automation can email them. This is the single most common blocker and also the most ignored, because AMS systems happily let you bind a policy without a valid email on file. Before you build any workflow, make sure at least 95 percent of your active policies have a current email address and phone number.

To check where you stand: export your active policies and sort by email column. Count the blanks. In a typical agency the blank rate is 15 to 30 percent. That is 15 to 30 percent of your book that is invisible to every retention tool you are about to deploy. Fix this first or the rest of the course cannot help you.

**Duplicate records.** The same client with three slightly different spellings and two carrier IDs. "Robert Smith," "Bob Smith," and "Smith, Robert Jr." are the same person in the AMS but three different people to an automation tool. AI tools will treat them as separate people and send duplicate messages. Clean duplicates once, save yourself dozens of embarrassing follow-ups.

Duplicates usually happen when a client moves from one producer to another inside the agency, when a renewal gets rebound under a slightly different name, or when a commercial client is entered once as the individual owner and once as the business entity. Auditing for duplicates is boring but it catches real money — agencies regularly find five to ten percent of their "active" records are actually duplicates of another active record.

**Inconsistent fields.** Policy type spelled three different ways ("HO-3", "HO3", "Homeowners"). State codes mixed with state names ("CA" in one row, "California" in the next). Effective dates in inconsistent formats (MM/DD/YYYY, DD-MM-YY, some Excel serial numbers, some text). These break every downstream automation and silently corrupt every AI prompt that tries to reason across the book.

Inconsistent fields are the hardest data problem to spot because nothing looks wrong at first glance. You only find it when your workflow returns "0 matching records" for a filter that should match hundreds.

The work to fix each of these is simple but tedious. Budget half a day. Do it before you touch any of the workflow lessons.

## A weekend cleanup script

Here is the sequence that works for most agencies.

**Friday afternoon: export.** Pull your active policies from the AMS into a single CSV. Include at minimum: client name, client ID, email, phone, policy type, policy number, carrier, effective date, expiration date, premium, commission. Open it in Google Sheets or Excel.

**Friday evening: flag missing fields.** Add a helper column that flags any row missing an email or phone:

```
=IF(OR(ISBLANK(E2), ISBLANK(F2)), "MISSING", "OK")
```

Sort by that column. You now have a list of records that need manual completion on Monday. Export just the missing rows to a second sheet so you can work through them without fear of breaking the master file.

**Saturday morning: deduplicate.** In Google Sheets, select the client name column, go to Data > Data cleanup > Remove duplicates. Start with exact matches. Then sort alphabetically and eyeball for near-duplicates. An hour of this catches 80 percent of the problem. For the stubborn cases, use the FUZZY MATCH function (available as a free add-on) to catch near-matches at 90 percent similarity.

**Saturday afternoon: normalize.** Pick the three worst fields and normalize them to a single canonical format:

- **Policy type**: pick standardized codes (HO3, HO5, DP3, PAP, BOP, etc.) and find-and-replace variants.
- **State**: pick two-letter codes and convert any full state names.
- **Dates**: pick YYYY-MM-DD and convert everything. This format sorts correctly and is unambiguous across tools.

Find-and-replace everything. Double-check the top 20 rows by eye before committing.

**Sunday: privacy sweep.** Add one more column flagging any row that contains what looks like an SSN, driver's license number, or banking detail in a free-text notes field. You are looking for rows where somebody pasted sensitive data into a "notes" or "comments" column because the AMS had nowhere better to put it. Those cells need to be scrubbed before the file goes into any AI tool. We cover why in the Privacy note below.

**Sunday evening: save the clean file.** Save two copies. One is your working cleaned file. The other is your backup, dated. Do not touch the backup.

## What "good enough" looks like

You are not trying to achieve perfection. You are trying to get above the threshold where AI tools can work without tripping over obvious errors.

A reasonable threshold:

- **95 percent or more** of records have both an email and a phone
- **Zero obvious duplicates** in the top 100 clients by premium (the rest can wait)
- **Policy type, state, and date** fields are normalized to a single format
- **Zero sensitive data** in free-text notes columns

That is good enough. Ship the clean file and move on. You can refine later as you find rough edges.

## The ongoing hygiene routine

One weekend cleanup is not permanent. Data decays. Agents retire and take their mental context with them. New records come in with the same old mistakes. You need a small ongoing routine or you will be doing this again next year.

The minimum viable ongoing routine:

- **Every Monday**, run a 5-minute check on new policies bound last week. Any new record missing an email or phone gets flagged and the producer gets a note.
- **Every quarter**, run the duplicate check again on the top 100 clients. It is fast once you know the pattern.
- **Every year**, do the full cleanup again. Schedule it. Put it on the calendar. Treat it like a physical for the agency.

Ten minutes a week plus two hours a year prevents the 20-hour annual disaster you just went through.

## Privacy and security note

When you move agency data into cloud tools, you are creating a new surface for data exposure. Two rules.

**First, use a business account for any AI or automation tool, not a personal one.** Business accounts have better data-handling agreements, separate audit trails, and the legal standing to protect you if anything ever goes wrong. Enterprise or business tiers on Claude, ChatGPT, and Zapier all come with BAAs or equivalent data protection commitments. The personal tiers do not.

**Second, never paste client Social Security numbers, driver's license numbers, or banking details into a general-purpose AI.** The chat models are excellent at processing this data. They are also training on the inputs in some tiers, logging the interactions in others, and in all cases creating a record of sensitive data in a place where sensitive data should not exist. The tools in Module 3 for document extraction have stricter data handling for a reason. Respect the line. If a document contains SSNs, redact them first (a Python script, a Google Sheets formula, or a careful find-and-replace) before the document goes anywhere near a chat model.

Your license and your reputation are not worth the five minutes you save by skipping the redaction step.

## Do this today

Open your AMS and pull a single report: active policies missing an email address. The number is usually bigger than you'd guess.

That report is your weekend project. Do not proceed to Module 2 until you are above the 95 percent threshold. The rest of the course assumes your data is clean enough to work with. Build on sand, everything falls down.

## Next up

Next lesson we pick your first three AI use cases. You cannot roll out ten workflows at once. You can roll out three. The next lesson is about picking the three that produce the biggest visible wins so that your team believes in the system before the novelty wears off.
