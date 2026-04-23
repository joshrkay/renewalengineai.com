---
title: "Ridgeline Commercial Insurance: Cross-Sell & Retention on HawkSoft"
slug: "ridgeline-commercial-insurance"
description: "A 180-account commercial lines agency on HawkSoft used AI cross-sell scoring and renewal automation to surface $312K in cross-sell opportunities and lift retention 9 points in the first year."
publishedAt: "2026-04-22"
agencyName: "Ridgeline Commercial Insurance"
region: "Mountain West US"
lineOfBusiness: "Commercial Lines"
ams: "HawkSoft"
bookSizeLabel: "$1.2M"
policyCount: 180
engagement: "Audit + Build + Managed Ops"
headlineResults:
  - value: "86% → 95%"
    label: "Commercial renewal retention"
  - value: "$312K"
    label: "Cross-sell opportunities surfaced"
  - value: "2.3 → 4.1"
    label: "Policies per household"
composite: true
primaryKeyword: "commercial insurance AI case study"
---

> **Representative case study.** Ridgeline Commercial Insurance is a composite drawn from several engagements with commercial lines agencies in the $1&ndash;2M book range. Numbers reflect typical outcomes. Full NDA-attributed references are available on request &mdash; email hello@renewalengineai.com.

## The agency

Ridgeline is a representative independent commercial P&C agency:

- **Book size:** $1.2M in commercial premium, mostly mid-market commercial (contractors, professional services, small manufacturing).
- **Accounts:** ~180 commercial accounts, most with 2&ndash;4 policies per household but a long tail of single-policy businesses.
- **Team:** Owner-producer plus 3 commercial CSRs. One junior producer in training.
- **AMS:** HawkSoft CMS. Heavy daily use; notes and activities populated well.
- **Lead sources:** Referrals (~70%), direct (~20%), one niche association sponsorship.

## The starting state

Commercial renewal workflows have more stakeholders and more decision points than personal lines. At audit start, Ridgeline had a defensible but leaky operation:

| Metric | Ridgeline baseline | Target |
|---|---|---|
| Renewal retention | 86% | 93%+ |
| Cross-sell rate (accounts with 2+ policies) | 58% | 75%+ |
| Average policies per household | 2.3 | 3.5+ |
| Renewal pre-touch rate (60+ days out) | 31% | 95%+ |
| Time from RFP inbound to first response | 2.1 days | Under 4 hours |

The owner&rsquo;s specific frustration: commercial accounts were landing on renewal without anyone looking at whether the business had added a location, hired employees (workers comp trigger), or acquired new equipment. Single-policy accounts were staying single-policy because nobody had the time to structure a coverage conversation.

Ridgeline had considered hiring a fourth CSR at $68K fully loaded. The math didn&rsquo;t work &mdash; they&rsquo;d need to bind another $250K+ in new commission to clear the hurdle.

## What we built (Weeks 1-3)

### 1. Cross-sell intelligence layer

We ran HawkSoft&rsquo;s account data through a classifier trained on coverage-gap patterns:

- Single-policy commercial accounts flagged for Workers Comp, Commercial Auto, and Umbrella gaps based on business type and payroll indicators.
- Multi-policy accounts flagged for life-event triggers (new address, employee count changes, equipment schedule updates) that suggested coverage reviews.
- Account scoring combined recency-of-last-review, premium size, and gap severity into a ranked list.

Output was a weekly "Top 20 cross-sell opportunities" report delivered to the owner every Monday morning, with the specific conversation opener for each account.

### 2. Commercial renewal cadence

A modified version of the four-touch cadence from [the renewal playbook](/resources/ai-renewal-automation-playbook), tuned for commercial:

- **Touch 1 (Day 90):** Renewal review invitation referencing any known changes at the account since last renewal. For commercial, we open earlier than personal lines because the risk conversation takes longer.
- **Touch 2 (Day 60):** Structured renewal questionnaire delivered as a signed PDF or online form. Asks about employee count, revenue, new locations, new equipment, and claim history.
- **Touch 3 (Day 30):** Draft renewal with rate context and any identified coverage gaps flagged.
- **Touch 4 (Day 14):** Producer scheduling call, ranked by risk.

The questionnaire step was the unlock &mdash; it surfaced coverage gaps the CSRs would have missed and naturally opened the cross-sell conversation.

### 3. HawkSoft integration patterns

We hit every pattern the [AMS integration guide](/resources/ams-ai-integration-guide) covers: nightly sync against the HawkSoft API, event hooks on activity changes, write-back of AI interactions as Notes on the account (never on the policy), and opt-out enforcement via a dedicated consent field.

### 4. Lead response

RFP inbound response compressed from 2.1 days to under 2 hours via AI-drafted first-touch. For commercial RFPs specifically, the AI doesn&rsquo;t try to quote &mdash; it confirms receipt, asks three intake questions, and schedules the scoping call.

## 12-month results

Commercial cycles are longer, so the most meaningful numbers land at the 6-12 month mark rather than 90 days.

| Metric | Baseline | Month 12 |
|---|---|---|
| Commercial renewal retention | 86% | **95%** |
| Cross-sell opportunities surfaced (cumulative) | &mdash; | **$312K in identified opportunity** |
| Cross-sell opportunities closed | &mdash; | **$91K in new commission-eligible premium** |
| Average policies per household | 2.3 | **4.1** |
| RFP response time | 2.1 days | **Under 2 hours** |

### What the dollar impact looks like

- **Retention lift:** 9 points of retention on a $1.2M book equals roughly $108K of annual premium retained that would otherwise have churned.
- **Cross-sell:** $91K of new premium from cross-sell conversations the AI surfaced in the first 12 months. Roughly 29% conversion rate on the opportunities the classifier flagged.
- **RFP capture:** Faster response lifted RFP-to-bind from 22% to 34%; modest volume but every bind is a multi-year relationship.

Net: **the engagement returned roughly 4.5&times; the combined Audit + Build + 12 months of Managed Ops cost in the first year.**

## Why commercial was a slightly different build

Commercial lines AI automation has three patterns that don&rsquo;t apply to personal:

1. **The structured renewal questionnaire.** Personal lines clients don&rsquo;t need this. Commercial clients expect it &mdash; it&rsquo;s how the broker-client relationship signals seriousness. AI drafts the questionnaire and analyzes the responses; the CSR runs the follow-up call.
2. **Account-level scoring, not policy-level.** A household with auto and home is a cross-sell target for umbrella. A business with GL and Workers Comp is a cross-sell target for Cyber, EPLI, or Commercial Auto &mdash; and the scoring logic has to reason about NAICS codes, not claims history.
3. **Longer sales cycles, different metrics.** Personal lines renewal success shows up in 90 days. Commercial shows up in 6&ndash;12 months. Managed Ops has to hold pattern-of-work long enough for the signal to emerge.

## Would this work for your commercial book?

Reasonable fit if:

- You have 100+ commercial accounts, weighted toward mid-market (not micro-SMB).
- Your AMS data captures business type, employee count, and revenue at the account level (HawkSoft, Applied Epic, and EZLynx all can).
- Your team has 2-4 CSRs and is at capacity &mdash; which is when the CSR-replacement math works.

[Book the audit](/#pricing) to get numbers specific to your book. For agencies evaluating the AI-vs-hiring tradeoff specifically, [read about the engagement process](/how-it-works).

---

*Ridgeline Commercial Insurance is a composite case study. Numbers and names are representative; no individual client is identified. Real attributed case studies available on request under NDA.*
