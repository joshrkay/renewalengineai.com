---
title: COI and Endorsement Bots
module: 4
order: 2
duration: 13
---

# COI and Endorsement Bots

Commercial clients ask for Certificates of Insurance constantly. A busy commercial account can generate five to fifteen COI requests per week. A mid-size agency with 60 commercial clients on the book sees 80 to 200 COI requests a month. Every one of them looks almost identical to the last. Every one requires a human to read the request, identify the policy, check whether the requested language is already on the policy or requires an endorsement, generate the certificate (usually through a carrier portal), and email it back.

Time per COI in most agencies: 8 to 15 minutes by the time you account for the context-switch, the portal login, the form fill, and the send. Multiply by 120 COIs a month and you are looking at 16 to 30 hours a month of producer or CSR time spent on what is, by any honest accounting, the most mechanical work in the agency. This is the perfect AI use case: high volume, high repetition, clear template, low judgment, and massive time recovery when you automate most of the steps.

This lesson shows you the four-step bot workflow, the extraction and matching prompts, where the human must stay in the loop (certificate issuance for regulatory reasons), the endorsement sibling workflow that reuses most of the same pipeline, and the logging discipline that turns the bot into both a time-saver and a searchable audit trail.

By the end of this lesson you will have a clear workflow for automating 80 percent of a typical COI request, two working prompts, a rule of thumb for measuring whether the bot is paying off, and a sense of what "good" looks like at the 90-day mark.

## The four steps of a COI request

Every COI request has four steps. AI handles steps 1, 2, and 4 cleanly. Step 3 — actual certificate issuance — stays with a human for now.

**Step 1 — Read the request and extract the requested details.** Who is the certificate holder? What is their address? What project or purpose is the certificate for? Does the requester need to be named as an additional insured? Do they need waiver of subrogation? Are there any unusual language requirements? A human can extract this in 90 seconds. AI does it in 5 seconds.

**Step 2 — Match the request against the client's existing policy.** Can the requested language be issued as-is from the existing policy, or does the request require an endorsement first? A human reading carefully can check this in 2 to 4 minutes if they have the policy in front of them. AI does it in 10 seconds if the policy data is accessible in a sheet or database.

**Step 3 — Issue the certificate.** Log into the carrier portal (or use the ACORD form directly), fill in the request details, generate the certificate. This step still belongs to a human for most carriers — portal logins, carrier-specific certificate requirements, and the regulatory expectation that a licensed person is attesting to the coverage language. Some carriers have started exposing COI APIs and in the next two years this step will become automatable for a lot of them. Today, the human stays in this step.

**Step 4 — Email the finished certificate to the requestor and log the request.** Delivery and record-keeping. Fully automatable.

The workflow above recovers 5 to 8 minutes per COI in most agencies — roughly 60 to 80 percent of the time — and leaves the human only the step that genuinely requires them. On 120 COIs a month, that is 10 to 16 hours of recovered capacity. One CSR getting an extra day a week back is not a trivial number.

## Step 1 — The extraction prompt

When a COI request email arrives (detected by the triage system from Lesson 4.1 labeling it `coi_request`), the first AI call extracts the request details into structured JSON.

> Extract COI request details from this email. Return a JSON object with these fields:
>
> - `requesting_client`: the client whose policy this certificate is for (the insured, not the holder)
> - `certificate_holder_name`: the name of the entity who will receive the certificate
> - `certificate_holder_address`: full address
> - `project_description`: the project or purpose described in the request, if any (under 200 chars)
> - `additional_insured_requested`: boolean
> - `waiver_of_subrogation_requested`: boolean
> - `primary_and_noncontributory_requested`: boolean
> - `special_language`: any unusual or custom wording the requester asked for (under 300 chars)
> - `requested_lines`: array of insurance lines requested (e.g., ["general_liability", "auto", "workers_comp"])
> - `urgency_indicated`: boolean, true only if the email says "urgent," "asap," "today," or equivalent
>
> If a field is not mentioned in the request, return null or false as appropriate. Do not infer — only return what is explicitly in the email.
>
> Respond only with valid JSON.
>
> Email:
> {email_body}

Run this on every incoming email the triage system labels `coi_request`. The output goes into the next step automatically.

## Step 2 — The matching prompt

The second AI call takes the extracted request and checks it against the client's existing policy data. This requires your policy data to be accessible to the AI — a Google Sheet exported from the AMS works fine for the first version. The sheet has one row per policy with columns for client name, policy type, carrier, effective dates, limits, and the endorsements currently on the policy (additional insured status, waiver of subrogation, primary and noncontributory, etc.).

> Given this COI request and this client's existing policy data, determine whether the request can be fulfilled as-is from the current policy, or whether it requires an endorsement to be added before issuing.
>
> Return a JSON object with:
>
> - `status`: one of "ok" (can issue directly), "needs_endorsement" (policy must be endorsed first), "cannot_fulfill" (request cannot be met with this policy — e.g., requesting a line the policy does not include)
> - `reason`: one sentence explaining the determination
> - `missing_items`: array of specific endorsements or coverages the request requires that are not on the current policy (empty array if status is "ok")
> - `suggested_next_step`: one sentence — what the CSR should do next
>
> Be conservative. If you are not certain the policy already has the requested endorsement, return "needs_endorsement" rather than "ok." When in doubt, escalate.
>
> COI request:
> {extracted_request_json}
>
> Current policy data:
> {client_policy_row}

Now the CSR has a pre-triaged COI request: label says `ok`, they issue immediately. Label says `needs_endorsement`, they request the endorsement from the carrier before issuing. Label says `cannot_fulfill`, they contact the client to clarify or decline. In all three cases the CSR knows in five seconds what category they are in, which removes most of the cognitive load that used to slow COI work down.

## Step 3 — The human-issued certificate

The CSR logs into the carrier portal (or uses the agency's internal ACORD filler), generates the certificate using the details from the extraction, and downloads the PDF. This step takes 90 to 180 seconds in most modern carrier portals. A good portal with a frequent-certificate shortcut takes 60 seconds. A bad legacy portal takes 4 minutes.

The CSR does not re-type anything from the request email into the portal — they copy from the structured JSON the extraction prompt produced. This alone eliminates the transcription errors that cause the "wait, the certificate has the wrong address" follow-up emails that eat another 10 minutes.

## Step 4 — The delivery and logging loop

Once the CSR downloads the certificate PDF, the workflow closes the loop:

1. Attach the PDF to an auto-drafted email to the certificate holder (or back to the original requester). The email body is pre-drafted using a light version of the drafting prompt from Lesson 4.1.
2. The CSR reviews the drafted email, the attached certificate, and clicks send. One action.
3. The automation logs the entire transaction in a Google Sheet or Notion database: client name, certificate holder, date requested, date issued, status (ok/endorsement/declined), the CSR who handled it, the elapsed time from request to delivery.

The logging is not optional. See the "logging discipline" section below.

## The endorsement sibling workflow

Endorsement requests run through essentially the same pipeline with two differences: the extraction prompt asks for different fields (what change is requested, effective date, any impact on limits or premium) and the matching step is simpler (does this endorsement exist on this policy, yes or no). The CSR still submits the endorsement request to the carrier through whatever channel the carrier uses.

Endorsement volume is usually 20 to 40 percent of COI volume in a typical commercial agency, and the time per request is slightly higher (more judgment in the submission step). The time savings per endorsement are smaller than per COI but still meaningful — 3 to 5 minutes each. Reuse the same Make.com or Zapier scenario with a different label filter and two modified prompts.

## The logging discipline

Connect the extraction and matching steps to a Google Sheet or a Notion database that logs every COI and endorsement request with its full metadata. Two benefits, both of which matter more than they look at first.

**Benefit 1 — Running volume data for capacity decisions.** You have a searchable record of service volume over time. When you want to make a case for hiring a second CSR, you can point to "we processed 340 COIs in August," which is a much better argument than "we're busy." When you want to measure your own efficiency gains from implementing the bot, the log tells you exactly how time-per-COI moved over 90 days.

**Benefit 2 — Searchable history for client disputes.** When a client emails "I asked for a certificate last month, did you send it?" — and this happens more often than anyone admits — you can pull up the exact request, the exact response, the exact certificate, and the exact date. That one search has resolved more "misunderstanding" conversations than any apology email you could write. It also protects you in the rare cases where a certificate dispute escalates.

The log is a 30-second addition to the Zap (append a row with the extracted fields and the status). Skipping it is the false economy that turns a good automation into a half-automation.

## The rule of thumb for measuring payoff

A good measure of whether the COI bot is paying off: after two weeks of running it, count how many COIs went out the door during the window. Divide your total time spent on COI work by that number. The result is your time-per-COI in minutes.

- **Over 10 minutes per COI** — the workflow is not yet optimized. Walk through each step with a stopwatch on a live request. The friction is almost always either a carrier portal that requires too many clicks or a CSR still re-typing data they could have copied from the extraction. Fix the specific friction point.
- **5 to 10 minutes per COI** — the workflow is working. Keep running it and expect incremental gains as the CSR gets faster.
- **Under 5 minutes per COI** — the workflow is tuned. At this level, you can scale commercial volume without scaling headcount, which is the whole point of the automation.

Most agencies hit 6 to 8 minutes within the first 30 days and settle at 4 to 6 minutes by day 90.

## What not to automate

Two pieces of the COI workflow agents sometimes try to push into automation and should not.

**Don't auto-issue certificates with non-standard language.** If the request includes unusual wording, a custom hold-harmless provision, or a reference to something the AI has not seen before, the workflow should escalate to a human read. Custom language is where E&O exposure lives, and you want a human eye on it every single time.

**Don't auto-send certificates without the CSR's explicit approval click.** The temptation to remove the "click send" step is strong because it feels like the last manual step. Do not remove it. That single click is the regulatory audit trail that says a licensed person reviewed and issued the certificate. Removing it breaks something you cannot afford to break.

## Do this today

Pull your last five COI requests from your sent folder. For each one, look at the original request email, the certificate that went out, and the date/time gap between the two. Jot down the approximate time you spent on each request (generous estimate — include the portal login and the send).

Add the five numbers. That is your current weekly-ish baseline for COI work. Write it in your ops log. Come back to the same number in 30 days after running the bot and see how much capacity you have recovered. The before-and-after comparison is the ROI case for any further investment in client-service automation.

## Next up

COI and endorsement bots recover time on the high-volume inbound requests. The next lesson flips the direction — from reactive service to proactive check-ins. AI can drive client outreach at moments that matter (policy anniversaries, life events, post-claim follow-ups) without adding any manual work to the producer's schedule. That is how a small agency starts to feel larger and more attentive to clients without actually growing the team.
