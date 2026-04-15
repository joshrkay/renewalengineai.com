---
title: COI and Endorsement Bots
module: 4
order: 2
duration: 10
---

# COI and Endorsement Bots

Commercial clients ask for Certificates of Insurance constantly. A busy commercial account can generate five to fifteen COI requests per week. Each one looks almost identical to the last. This is the perfect AI use case: high volume, low stakes, high repetition, clear template.

## The workflow
A COI request comes in by email. A human needs to read the request to figure out the certificate holder, the policy to pull from, and any special endorsement requirements. Then the human either uses a carrier portal to issue the certificate or drafts it in an ACORD form. Finally, they email the certificate back to whoever asked.

With AI, the first two steps (reading and extracting) become automated. The third step (issuing) still needs a human in most carrier workflows. The fourth step (delivery) becomes automated too.

The net time saved is usually five to eight minutes per COI. Over a month on a commercial-heavy agency, that is hours.

## The extraction prompt
When a COI request email arrives, the first AI call extracts the requested certificate holder.

> Extract the following from this COI request email: certificate_holder_name, certificate_holder_address, project_description, additional_insured_status (yes/no), waiver_of_subrogation (yes/no), any_special_language. Return as JSON. If a field is not mentioned, return null.

That returns clean, structured data about what the requester wants.

## Matching to the policy
The second AI call takes the extracted data and checks it against the client's existing policy data. This requires your policy data to be accessible somewhere (a Google Sheet export from your AMS works fine to start).

> Given this COI request and this client's policy data, confirm whether the request can be fulfilled as-is, or whether it requires an endorsement. Return status (ok, needs_endorsement, cannot_fulfill) and a one-sentence reason.

Now you have a labeled COI request that tells you whether you can issue it instantly or whether you need to contact the underwriter for an endorsement first.

## The endorsement sibling workflow
Endorsement requests run through the same basic pattern. A request comes in for a change to the policy. AI extracts the requested change. A human decides whether to submit it to the carrier.

The difference is that endorsements usually have lower volume and higher complexity per request, so the time savings per request are smaller but still meaningful.

## A light automation to close the loop
Connect the extraction to a Google Sheet or a Notion database that logs every COI and endorsement request with its status. Two benefits.

First, you have a running log of your service volume, which is useful when you want to make a case for hiring or when you want to measure your own efficiency gains.

Second, you have a searchable history when a client says "I asked for this certificate last month, did you send it" and you need to look up what happened.

## Rule of thumb
A good measure of whether this workflow is paying off: after two weeks of running it, count how many COIs went out the door and divide your time-spent-on-COIs by that number. If it is above ten minutes per COI, the workflow is not yet optimized and you should walk through each step to find the friction. Below five minutes per COI, the workflow is working and you can scale.

**Do this today:** Pull your last five COI requests out of your sent folder and look at how long each one took you. That is your baseline for the before-and-after measurement next month.
