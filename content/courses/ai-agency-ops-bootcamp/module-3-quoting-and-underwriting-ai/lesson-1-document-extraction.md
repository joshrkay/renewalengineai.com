---
title: Document Extraction
module: 3
order: 1
duration: 13
---

# Document Extraction

Walk through almost any independent agency and you will find at least one person — a CSR, a junior producer, sometimes the owner — retyping information from a PDF into a quoting system. Declaration pages. Loss runs. ACORD forms. Carrier statements. Renewal quotes from the incumbent carrier. Every one of those documents started as structured data in some other system, got flattened into a PDF for email transmission, and now has to be re-extracted by hand on the receiving end.

A solo agent on a commercial book spends somewhere between 4 and 12 hours a week on this retyping. A small agency with two CSRs often has *one full-time seat* quietly absorbed by the same work. It is the single largest undocumented cost center in most independent agencies, and AI document extraction cuts it by 80 to 90 percent with a workflow you can set up in an afternoon.

By the end of this lesson you will know which document types to extract first, the cheap no-code starter workflow, the better automated version for higher volume, the accuracy guardrails that keep the extracted data trustworthy, and the privacy rules that keep you out of compliance trouble.

![The document extraction pipeline: a PDF carrier statement flows through AI extraction into structured rows and lands in the AMS in about 90 seconds, with a human reviewer spot-checking flagged rows](/courses/bootcamp/document-extraction-pipeline.svg)

## Which documents to extract first

Resist the temptation to build a universal extractor that handles every PDF that arrives in your inbox. That is a year-long project. Start with the three document types that produce the highest volume of manual retyping in a typical agency. Get those working, then expand.

**Declaration pages.** Every new-client bind requires these fields moving from a PDF into your AMS: named insured, mailing address, policy number, effective dates, carrier name, limits for each coverage line, deductibles, premium, and any endorsements. A dec page extraction that used to take 12 minutes of careful retyping becomes a 30-second paste-and-verify with AI. On a typical agency processing 20 binds a week, that is 3.5 hours a week recovered, forever.

**Loss runs.** Commercial quoting depends on three to five years of loss history, and that data almost always arrives as a PDF with 15 to 80 rows per page. Each row has claim date, claim type, incurred amount, paid amount, open reserve, and status. Hand-retyping a five-year loss run for a mid-size account is a 25-minute task that CSRs hate. AI extraction turns it into a 90-second extraction plus a 30-second spot-check.

**ACORD applications.** The same set of fields carries across dozens of ACORD form variants — named insured, operations description, locations, vehicles, drivers, revenue, prior coverage. When a prospect sends you an ACORD 125 from another agent, retyping it into your quoting system is a 15-to-30-minute task. AI extraction handles the ACORD 125, 126, 127, 130, and 140 with the same prompt if the fields are named cleanly.

If you implement extraction for these three document types, you have recovered 60 to 80 percent of the manual retyping time in a typical quoting workflow. Everything beyond these three is diminishing returns. Save the remaining document types for year two.

## The cheap way — manual paste extraction

The cheapest AI extraction workflow is pasting a PDF into Claude or ChatGPT (on a business tier with a data agreement — see privacy section below) and asking for structured output. It works for clean digital PDFs. It is fast. It requires zero integration and zero setup cost beyond the AI subscription you already have.

Here is the prompt. Save it as a reusable template.

> Extract structured data from the attached insurance document. Return a JSON object with these fields:
>
> - `document_type` (string: "dec_page", "loss_run", "acord_application", "carrier_quote", or "other")
> - `named_insured` (string)
> - `mailing_address` (string)
> - `policy_number` (string)
> - `effective_date` (date, ISO format)
> - `expiration_date` (date, ISO format)
> - `carrier` (string)
> - `limits` (object with each coverage type as key, limit amount as value)
> - `deductibles` (object)
> - `total_premium` (number)
> - `endorsements` (array of strings)
> - `loss_history` (array of objects with claim_date, type, incurred, paid, status — only for loss runs)
>
> If a field is not present in the document, return null for that field. Do not invent data, make educated guesses, or fill in missing values from general knowledge. If a field is ambiguous, return null and add a note in a separate `flags` array describing the ambiguity.
>
> Respond only with valid JSON. No commentary, no markdown fences.

Paste the PDF, run the prompt, copy the JSON output, paste the relevant fields into your AMS or quoting system. A 15-minute manual task becomes a 45-second paste-verify-paste cycle. The single biggest time save in the entire course comes from this one workflow for agencies doing commercial or mid-market personal lines.

## The better way — an automated pipeline

Once you are processing more than five documents a day, the manual paste workflow gets old. The next step up is an automated pipeline that watches an inbox or a folder, extracts automatically, and posts results to a place the CSR can review and approve.

Build this with one of two patterns.

**Pattern A — Zapier or Make.com with AI step.** Trigger: new email in a Gmail label called "extract-me," or new file in a Google Drive folder. Step 1: pull the PDF content using the built-in PDF parser. Step 2: call Claude or ChatGPT with the extraction prompt. Step 3: write the JSON to a Google Sheet row. Step 4: Slack ping the CSR with a link.

Build time: 2 to 3 hours the first time. Cost: existing Zapier subscription plus $5 to $10 a month in API fees for typical agency volume.

**Pattern B — A dedicated extraction tool.** Docparser, Mindee, Nanonets, and a handful of insurance-specific tools (Ask Kodiak, Indio, Convr) offer extraction as a hosted service with pre-trained models for insurance documents. They are more accurate out of the box on messy scanned PDFs, they handle OCR for image-based documents, and they integrate with common AMS platforms.

Build time: a few hours to a day depending on AMS integration depth. Cost: $50 to $300 a month depending on volume. Worth it if your document volume is above 30 a day or if you are processing a lot of scanned (non-digital) PDFs.

Start with Pattern A unless you have a specific reason to go with Pattern B. Most agencies never outgrow the Zapier version.

## Accuracy guardrails

AI extraction is not perfect. On clean digital PDFs, a modern chat AI is usually 95 to 98 percent accurate on structured fields. On scanned PDFs with OCR in the mix, accuracy drops to the 85 to 92 percent range. On handwritten annotations or marked-up forms, it gets worse. You need two guardrails to keep the error rate from reaching your AMS.

**Guardrail 1 — Human verification before data hits the AMS.** Every extracted field goes into a review sheet first. A CSR spends 30 to 60 seconds verifying the key fields against the source PDF — usually the named insured, the premium, and the effective dates — before clicking an "approve and push" button that copies the data to the quoting system. Five seconds of eyes per field is plenty to catch the occasional wrong decimal, missed endorsement, or flipped date.

This is the single most important discipline in document extraction and the one most often skipped. "I trust the AI" is the sentence that comes immediately before a $5,000 limit field gets wrong by a factor of ten and binds a policy at the wrong number. Human review is non-negotiable on anything that touches a policy number, limit, or premium.

**Guardrail 2 — Two-week spot-check routine.** Every two weeks, take one document you have already extracted and manually re-verify every field — not just the key fields. Compare to the AI's original output. If the AI is drifting (same field type getting wrong repeatedly), you will catch it in the spot check before it becomes a systemic problem. Drift usually signals a carrier format change or an OCR issue rather than a model problem.

If spot-check accuracy falls below 95 percent on clean digital PDFs, the prompt needs tightening or you need to switch from Pattern A to Pattern B. If it falls on a specific carrier's format, add a carrier-specific prompt variant.

## The privacy rules that keep you out of trouble

Insurance documents contain PII that you cannot treat casually. Declaration pages have SSNs on some lines. ACORD forms have driver's license numbers. Loss runs sometimes include claimant names and injury details. Treating this data the same way you would treat a LinkedIn profile is not acceptable.

Three rules.

**Rule 1 — Use a business-tier AI with a data processing agreement.** Claude for Work, ChatGPT Enterprise/Team, Gemini Enterprise. Never the free consumer tier. The business tiers explicitly do not use your data for training and contractually guarantee data handling terms. This is the baseline.

**Rule 2 — Redact the highest-sensitivity fields before extraction when you can.** Full SSNs, driver's license numbers, bank account and routing numbers, and any medical details. If you only need the named insured and the policy limits, you do not need the SSN passing through the AI. Most dedicated extraction tools (Pattern B) handle redaction automatically. For the manual Pattern A workflow, a quick visual scan of the PDF before pasting is usually enough.

**Rule 3 — Never paste policyholder PII into a free public chat tool.** If you are experimenting with a new prompt on the free tier before upgrading, use a dummy document with fake data. Keep real client documents on the paid business tier only.

The short version: the tools you use for retention personalization (Lesson 2.3 in the Retention course) are the same business-tier accounts you use for document extraction. You do not need a second AI subscription. You need to keep the paid tier honest and never drop back to the consumer tier for real client data.

## What the workflow looks like end-to-end

A working document extraction workflow for a typical mid-market agency looks like this:

1. New loss run arrives in the producer's inbox from the current carrier.
2. Producer forwards the email to `extract@agency.com`, a Gmail label that triggers the Zap.
3. Zap pulls the PDF attachment, runs the extraction prompt against Claude, writes the results to a "pending extraction review" Google Sheet, and Slacks the CSR.
4. CSR opens the sheet, scans the extracted rows against the source PDF (90 seconds), flags anything ambiguous, and clicks "approved."
5. A second Zap copies the approved rows into the AMS-linked spreadsheet that the quoting system pulls from.
6. The producer opens the quoting system, pulls the insured's updated loss history, and starts the quote.

Total elapsed time from email receipt to quote-ready data: under 3 minutes. Previous elapsed time via manual retyping: 25 minutes. The system pays for itself within the first week of operation.

## Do this today

Grab one declaration page from a recent bind in your sent folder. Open your business-tier Claude or ChatGPT account. Paste the extraction prompt from this lesson. Drop in the dec page. Time the extraction. Compare to how long it would have taken to retype the same fields into your AMS by hand.

The first time most agents run this, the result is a 30-second extraction of a document they last retyped in 12 minutes. That one comparison usually sells the whole workflow on the spot. No further convincing needed.

## Next up

Extraction gets the data into your system. The next lesson covers what to do with it — specifically, comparing quotes from two to five carriers side by side to pick the best option for the client. AI is exceptional at reading across similar documents and calling out meaningful differences, which is exactly what a quote comparison needs. We cover the comparison prompt, the producer workflow, and the one pitfall that embarrasses agents who skip the human review step.
