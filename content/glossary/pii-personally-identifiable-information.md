---
term: "PII (Personally Identifiable Information)"
slug: "pii-personally-identifiable-information"
shortDefinition: "Personally identifiable information is any data that can identify a specific individual — names, addresses, dates of birth, driver's license and Social Security numbers, and the medical and financial details insurance agencies routinely hold."
category: "AI & Automation"
aliases:
  - "Personally Identifiable Information"
  - "Personal Data"
updatedAt: "2026-08-24"
related:
  - "retrieval-augmented-generation"
  - "large-language-model"
  - "ams-agency-management-system"
---

**Personally identifiable information (PII)** is any data that can identify a specific individual. Insurance agencies hold unusually dense concentrations of it, which raises the stakes on every automation decision.

## What agencies actually hold

Names, addresses, dates of birth, phone numbers and email addresses, **driver's license numbers**, **Social Security numbers**, VINs, banking and payment details, claims histories, and — through health-adjacent coverages and injury claims — **medical information**.

That last category is why agencies cannot treat privacy as a generic IT concern. A workers' compensation claim file contains medical detail with its own regulatory weight.

## The rules that apply

- **Gramm-Leach-Bliley Act (GLBA)** — governs financial institutions including insurance producers; requires a written information security program and privacy notices
- **State insurance data security laws** — many states have adopted the NAIC model law, with breach notification timelines
- **State privacy statutes** — CCPA/CPRA in California and a growing list of state equivalents, each with their own access and deletion rights
- **TCPA** — governs calls and texts, and is where automated outreach most commonly creates exposure

## The automation-specific questions

Before any AI system touches agency data, three things need answers on paper:

1. **Where does the data go?** Which vendor processes it, in which jurisdiction, under what contract.
2. **Is it retained or used for training?** Enterprise API terms typically exclude training; consumer chat products often do not. Pasting a client's dec page into a consumer chatbot is a disclosure.
3. **Who can retrieve it?** Access controls have to survive the automation, not be bypassed by it.

## The practical minimum

Minimize what the automation sees, prefer providers contractually barred from training on your data, log access, enforce opt-outs centrally across every channel, and keep a written record of these decisions. The record is what makes the position defensible later.

## Go deeper

- [PII Compliance for AI in Insurance Agencies](/resources/pii-compliance-ai-insurance-agencies)
