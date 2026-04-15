---
title: Quote Comparison Copilots
module: 3
order: 2
duration: 10
---

# Quote Comparison Copilots

When a client asks "which of these quotes is better for me," the right answer requires comparing coverages line by line, not just premiums. That comparison is exactly the kind of work AI excels at. This lesson shows you how to turn raw quote data into a clean side-by-side that you and your client can talk through in minutes.

## Why this matters
Most agents lose quotes not because they had the wrong carrier but because they failed to explain why their recommendation was the right one. A client looking at three premiums with no context will default to the cheapest one. A client looking at a comparison table that highlights coverage differences, exclusions, and value will pick the one you recommend more than half the time.

## The comparison workflow
The workflow has four steps.

**Step 1: Assemble the raw quotes.** You have three carrier quote PDFs open. In the old workflow you would eyeball all three and try to hold the differences in your head. In the new workflow you extract each one with the Lesson 3.1 technique into structured JSON.

**Step 2: Build the comparison.** Feed the three JSON objects into your AI with a prompt like this one.

> Compare these three insurance quotes for the same client. For each coverage line, show the limit and deductible for each carrier side by side. Highlight any differences. Call out coverages present in one carrier but not another. Flag any exclusions that might matter for this client, whose situation is: {client_context}. Produce the output as a clean markdown table, with a written summary paragraph below.

The AI returns a clean comparison table and a paragraph of analysis. You review, tweak one or two things, and you have a client-ready document.

**Step 3: Add your recommendation.** The AI gives you the raw comparison. The recommendation is still your call. Add two or three sentences at the end explaining which quote you recommend and why, based on your professional judgment.

**Step 4: Send it.** The cleaned comparison becomes the centerpiece of your quote presentation. You can walk through it on a Zoom call or send it as a PDF.

## Example of a good comparison
A good comparison highlights things the client would not catch on their own. For example: "Carrier A and Carrier B both include $300 in emergency lock-out coverage. Carrier C does not include this; it's an optional add-on for $25. For a client with a teen driver, this is worth discussing."

That kind of language is what turns an AI-drafted table into a consultative conversation. It's also the kind of language that nobody has time to write by hand for every client.

## Where AI helps and doesn't
AI is excellent at the comparison and the consistent language. AI is not your underwriter. Do not let AI decide which coverage level is appropriate or whether to recommend additional limits. That is your license and your expertise.

Use AI to do the 80 percent of the work that is mechanical (extracting, comparing, writing). Keep the 20 percent that requires judgment (recommending, explaining tradeoffs, answering questions) squarely in your hands.

**Do this today:** Take your last quoted file with three carrier options. Run the extraction and comparison workflow in a single sitting. Compare to the version you originally sent the client.
