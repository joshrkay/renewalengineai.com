---
title: Quote Comparison Copilots
module: 3
order: 2
duration: 13
---

# Quote Comparison Copilots

When a client asks "which of these quotes is better for me," the right answer almost never comes from the premium column. It comes from comparing coverages, limits, deductibles, exclusions, and endorsements line by line across two to five carriers, and then translating those differences into plain English for a client who does not read policy forms for a living. That comparison is exactly the kind of pattern-matching work AI is very good at — and exactly the kind of work that eats an hour of producer time per quote when done by hand.

This lesson shows you how to turn raw quote data into a clean side-by-side comparison that you and your client can talk through in minutes, the exact prompt that produces a consultant-grade output, the four-step producer workflow, and the one pitfall that turns a clever automation into an E&O claim.

By the end of this lesson you will have a ready-to-use comparison prompt, a workflow that pairs with the extraction pipeline from Lesson 3.1, a template for the written summary paragraph, and a clear rule for where AI ends and your license begins.

## Why this matters more than it looks

Most agents lose quotes not because they had the wrong carrier on the table but because they failed to explain why their recommendation was the right one. A client looking at three premiums with no context defaults to the cheapest number. A client looking at a comparison table that highlights the meaningful coverage differences — the $100k difference in liability, the water-backup endorsement one carrier offers, the replacement-cost versus actual-cash-value distinction — picks the one you recommend more than half the time. Same quotes. Different presentation. Different conversion rate.

The problem is the hand-built comparison. It takes 45 to 75 minutes to produce a clean side-by-side for three carriers if you are doing it manually in a Word table, and most producers do not have that 45 minutes per quote. So the presentation slips, the client gets "here are three quotes, the cheapest is Carrier C" in the email body, and the client picks the cheapest even when you know Carrier A is the right fit. You lose the quote. The client saves $200 a year. Two years later the client has an uncovered loss and leaves you anyway for a different reason.

AI does the comparison in 90 seconds. That is the entire unlock. The quality of the comparison matters, but the throughput matters more — because now you can produce a client-ready comparison for every quote instead of just the top 20 percent of quotes that are worth the time investment.

## The four-step comparison workflow

**Step 1 — Assemble the raw quote data.** You have two to five carrier quote PDFs. In the old workflow you would open all of them and try to hold the differences in your head while typing into a Word table. In the new workflow, you run each PDF through the extraction pipeline from Lesson 3.1 to produce structured JSON. Every quote ends up in the same schema — named coverage lines, limits, deductibles, premium, endorsements — which makes the comparison trivial.

If you are just starting this workflow and have not wired up the full extraction Zap yet, you can do Step 1 manually: paste each PDF into Claude one at a time with the extraction prompt, and copy the JSON into a scratch document. Slow, but functional for the first few weeks.

**Step 2 — Build the comparison.** Feed the two-to-five JSON objects into Claude or ChatGPT with this prompt:

> Compare these insurance quotes for the same client. For each coverage line, show the limit and deductible for each carrier side by side. Include premium at the bottom. Highlight any differences that are greater than 10 percent in limit amount or greater than $250 in deductible. Call out coverages present in one carrier's quote but not another. Flag any exclusions, sub-limits, or endorsement restrictions that might matter for this client given their situation described below.
>
> Client context: {one_paragraph_client_description_including_household_assets_risk_factors_and_priorities}
>
> Produce the output as:
> 1. A clean markdown table with rows for each coverage line and columns for each carrier.
> 2. A second short table showing the total premium and any fees.
> 3. A 3-4 sentence plain-English summary below the table highlighting the two or three most important differences a non-insurance person should understand.
> 4. A "questions to ask the client" section with 2-3 questions that would help the producer choose between the quotes.
>
> Do not recommend a carrier yourself. Do not claim any quote is "better." Present differences factually.
>
> Quotes:
> Quote 1 (Carrier: {carrier_1_name}): {carrier_1_json}
> Quote 2 (Carrier: {carrier_2_name}): {carrier_2_json}
> Quote 3 (Carrier: {carrier_3_name}): {carrier_3_json}

The last two lines — "do not recommend a carrier" and "do not claim any quote is better" — are load-bearing. Without them, the AI will happily rank the quotes and say "Carrier B appears to offer the best value," which is exactly the kind of statement you do not want an AI making on a licensed transaction. Force the AI to stay in the comparison lane. You stay in the recommendation lane.

**Step 3 — Add your recommendation.** The AI returns a clean comparison plus a factual summary plus a set of questions. You read it in 60 seconds. You think about the client's situation — their budget, their risk tolerance, the claim they had last year, the teen driver coming into the household next month. Then you write 2 to 4 sentences at the end of the document in your own voice that say something like:

> "Given your priorities — the jump in auto coverage now that the teen is driving and keeping the home deductible manageable — I recommend Carrier A. The premium is $180 a year more than Carrier C, but the $500k umbrella is included rather than add-on, and the water-backup coverage matters given your finished basement. Happy to walk through any piece of this on a call."

That paragraph is the producer's professional judgment. The AI cannot and should not produce it for you. But the AI produced everything *underneath* it — the table, the summary, the questions — and that is 80 percent of the work.

**Step 4 — Send it.** The finished document is a one-page PDF or an email body with the table and your recommendation. You can walk through it on a Zoom call with the client, send it as an attachment, or paste it into the body of an email. The point is that the client sees a consultant-quality comparison with a clear recommendation from you, not a copy-paste of three raw carrier quote PDFs.

## What a good comparison sounds like

A good AI-produced comparison highlights the things a client would never notice on their own. Examples from real comparisons I have seen come out of this workflow:

- "Carriers A and B include $300 of emergency lockout coverage in the base form. Carrier C does not include this; it is a $25/year optional add-on. For a household with a teen driver, worth discussing."
- "Carrier A writes the roof on replacement cost. Carriers B and C switch to actual cash value once the roof is 15 years old. The home's current roof is 12 years old per the client description, which means a meaningful coverage difference beginning in 3 years."
- "All three carriers write $500k personal liability. Carrier A offers an excess liability endorsement up to $1M for an additional $85/year; the others require a separate umbrella policy."
- "Carriers B and C require a separate rider for the grand piano mentioned in the client description. Carrier A covers it under scheduled personal property at no additional cost up to $10,000."

That kind of language is what turns a comparison table into a consultative conversation. It is also the kind of language that almost nobody has time to write by hand for every three-carrier quote — which is exactly why most producers ship the raw premiums and lose the quotes they should have won.

## Where AI helps and where it must not

AI is excellent at:

- Reading across multiple quote documents and finding structural differences.
- Producing consistent, clean comparison tables.
- Writing plain-English explanations of coverage differences.
- Identifying questions the producer should ask the client.
- Flagging endorsements and exclusions that non-specialists would miss.

AI is not your underwriter and not your licensed agent. It must not:

- Recommend a specific carrier or rank quotes by "best value."
- Decide what coverage limits are appropriate for a client's risk.
- Interpret ambiguous policy language or make coverage representations.
- Promise placement or indicate a quote is "approved."
- Suggest adding or removing coverage based on the client's situation.

The line is simple: AI handles comparison and explanation. You handle recommendation and advice. Cross that line and you are putting the AI's output in front of a client as a licensed recommendation, which you cannot defend in an E&O situation. Stay on the right side of the line and the tool is a force multiplier. Cross it and it is a liability.

## The one pitfall that creates real risk

The pitfall that embarrasses agents — and occasionally triggers E&O claims — is treating the AI's factual summary as if it were an actual coverage opinion. The AI might write: "Carrier A provides broader water damage coverage than Carrier B." That sentence looks factual but it is a *conclusion* about coverage, not a fact. The actual fact is "Carrier A includes form HO 04 95 water backup endorsement; Carrier B does not." The producer's job is to check whether the AI's summary matches the actual policy forms and to correct any interpretive language that slipped into the factual section.

Read the AI's output with a skeptical eye every single time. If a sentence claims one carrier is "better" or "broader" or "more comprehensive" in any way, either delete the sentence or rewrite it as a specific factual comparison. This is a 30-second discipline per comparison and it is the single most important guardrail in the whole workflow.

## A worked example end-to-end

Producer receives three carrier quotes for a new homeowner client in Nashville — young professional couple, $420k dwelling, finished basement, one classic car in a detached garage, no prior claims.

- 9:02am — PDFs arrive in inbox
- 9:03am — Producer forwards to `extract@agency.com`
- 9:05am — Extraction Zap writes three JSON rows to "pending quote comparison" sheet
- 9:06am — Producer opens Claude, pastes the three JSON blobs plus one paragraph of client context, runs the comparison prompt
- 9:07am — AI returns table, summary, and questions
- 9:08am — Producer reads the output, corrects one sentence that slipped into interpretation ("Carrier A has broader water coverage" → "Carrier A includes water backup endorsement HO 04 95 up to $5,000; Carriers B and C do not include this endorsement in the base form")
- 9:10am — Producer writes the 3-sentence recommendation at the bottom
- 9:11am — Producer emails the one-page comparison to the client with the subject "Your three homeowner options, side by side"
- 9:11am — Client replies within an hour, usually with one specific question

Total producer time on the comparison: 9 minutes. Previous producer time on the same comparison by hand: 55 minutes. Quality of the presentation: noticeably higher because the AI catches details the producer would not bother writing about by hand.

## Do this today

Take your last quoted file with two or three carrier options. Run the extraction pipeline on each quote (or paste them into Claude manually if you have not built the Zap yet). Paste the extracted data into a fresh chat with the comparison prompt from this lesson. Compare the output to the version you originally sent the client. Most agents find the AI-produced comparison is better, in under 10 minutes, than the hand-built version they spent 45 minutes on the first time around.

## Next up

Extraction gets the data in. Comparison shows the options. The next lesson covers the third piece of the quoting pipeline: automated risk flagging. Before you spend time quoting a risk, you want to know if there is a hidden issue that will either kill the quote or change the terms substantially. AI can scan a submission and flag the risks that matter — prior claims patterns, coverage gaps, territorial concerns — in 30 seconds, before you invest the full quote effort.
