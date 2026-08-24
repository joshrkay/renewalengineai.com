---
term: "LLM (Large Language Model)"
slug: "large-language-model"
shortDefinition: "A large language model is an AI system trained on large volumes of text that generates and interprets natural language — the technology behind AI email triage, drafting, classification, and document extraction in insurance agencies."
category: "AI & Automation"
aliases:
  - "Large Language Model"
  - "Generative AI"
updatedAt: "2026-08-24"
related:
  - "retrieval-augmented-generation"
  - "intake-classification"
  - "document-extraction"
---

A **large language model (LLM)** is an AI system trained on large volumes of text that can interpret and generate natural language. In an insurance agency it is the component that reads an inbound email and understands what is being asked, drafts a reply, extracts fields from a dec page, or classifies a request.

## What LLMs are genuinely good at

- **Classification** — deciding that an email is a certificate request rather than a billing question
- **Extraction** — pulling named insured, limits, and dates out of an unstructured document
- **Drafting** — producing a first-pass response in the agency's voice
- **Summarization** — condensing a long thread into what the CSR needs to know

These share a shape: transforming language that already exists into a different, more useful form.

## What they are not good at

- **Arithmetic and rating.** An LLM should never compute a premium. That is a rater's job.
- **Authoritative coverage answers.** A model asked whether a policy covers a loss will produce a confident, plausible answer that may be wrong. Coverage determinations come from the policy form.
- **Anything requiring guaranteed consistency.** The same input can produce different outputs.

## The operating rule that keeps this safe

Use the model to **read, route, and draft** — not to **decide or send unsupervised** where the decision carries E&O exposure. A model that classifies a certificate request and prepares the document for a CSR to approve is doing useful work with a human backstop. A model that issues certificates on its own is an uninsured liability.

Agencies that get value from LLMs almost always draw that line explicitly and early. Agencies that get burned are usually the ones that never drew it.
