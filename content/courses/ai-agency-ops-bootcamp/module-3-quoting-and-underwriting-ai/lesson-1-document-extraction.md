---
title: Document Extraction
module: 3
order: 1
duration: 9
---

# Document Extraction

Independent agents spend hours every week retyping information from PDFs into quoting systems. Declaration pages, loss runs, ACORD forms, carrier statements. This lesson shows you how to cut that work by 80 percent with AI document extraction.

## What to extract
Start with the three document types that produce the highest volume of manual retyping in a typical agency.

**Declaration pages.** Named insured, address, policy number, effective dates, limits, deductibles, premium, and any endorsements. Every new-client bind requires this data moving from a PDF into your AMS or quoting system.

**Loss runs.** Claim date, claim type, incurred amount, paid amount, status. Commercial quoting depends on five years of loss data, and that data almost always arrives as a PDF.

**ACORD applications.** The same fields carry across dozens of ACORD variants. Named insured, operations description, locations, vehicles, drivers, revenue.

If you process these three document types with AI, you have recovered 60 to 80 percent of the manual retyping time in a typical quoting workflow.

## The cheap way
The cheapest AI extraction is pasting a PDF into Claude or ChatGPT and asking "Extract all policy details from this document as structured JSON." It works for clean PDFs. It is fast. It requires zero integration.

Here is the prompt.

> Extract structured data from the attached insurance document. Return a JSON object with these fields: named_insured, policy_number, effective_date, expiration_date, carrier, limits (object with each coverage type as key), deductibles (object), premium, endorsements (array). If a field is not present in the document, return null for that field. Do not invent data.

Paste the PDF, run the prompt, copy the JSON output, done. A 15-minute manual task becomes a 30-second paste and copy.

## The better way
When you are processing more than five documents a day, the manual paste gets old. The next step up is a dedicated tool like Docparser, Mindee, or Nanonets, or an automation built in Make.com that watches a Gmail label for attachments, runs the extraction, and posts results to a Google Sheet.

Build time on this workflow is usually two to three hours the first time. Payback is often measured in weeks.

## Accuracy guardrails
AI extraction is not perfect. On clean PDFs it is usually 95 percent accurate. On scanned or handwritten PDFs it is worse. Two guardrails.

First, always have a human verify the extracted output against the source document before the data hits your AMS. Five seconds of eyes on a screen saves you from an occasional wrong policy limit.

Second, spot-check with a known document. Every two weeks, run a document you've already processed manually and compare the AI output to your verified data. If the AI is drifting, you'll catch it early.

## Privacy
Do not paste documents with full Social Security numbers or driver's license numbers into a general-purpose AI. Use a tool with a business data agreement and encryption at rest. The document extraction vendors listed above support this; the free tier of general chat tools typically does not.

**Do this today:** Grab one declaration page from a recent bind. Paste it into your chat AI with the prompt above. Time the extraction. Compare to how long it would have taken you to retype the fields manually.
