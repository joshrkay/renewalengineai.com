# Content Calendar — RenewalEngineAI

**Prepared:** 2026-08-18/19. **Refreshed:** 2026-08-26 — the backlog shipped; the engine that was meant to keep producing is still broken.
See [SEO-STRATEGY.md](./SEO-STRATEGY.md) §2 for why nothing published between May and August.

---

## 1. The 12-article backlog — SHIPPED

All 12 went live 2026-08-26, not by being written (they were drafted and merged back in July) but by the deploy pipeline being fixed. Verified 200 on production:

| Slug | Category | Status |
|---|---|---|
| `ams-data-export-checklist` | Integrations | ✅ Live |
| `renewal-retention-math-for-p-and-c-agencies` | Retention | ✅ Live |
| `lead-response-time-benchmarks-insurance` | Growth | ✅ Live |
| `ai-tools-vs-hiring-a-csr` | Strategy | ✅ Live |
| `cross-sell-triggers-for-independent-agencies` | Retention | ✅ Live |
| `pii-compliance-ai-insurance-agencies` | Operations | ✅ Live |
| `quote-follow-up-sequences-that-actually-bind` | Growth | ✅ Live |
| `book-segmentation-for-ai-outreach` | Retention | ✅ Live |
| `evaluating-ai-vendors-insurance-agencies` | Strategy | ✅ Live |
| `producer-workflows-post-ai` | Operations | ✅ Live |
| `commercial-lines-ai-renewal-automation` | Retention | ✅ Live |
| `30-60-90-day-ai-rollout-plan` | Strategy | ✅ Live |

**Resource hub: 3 articles → 15.** Retention/automation as a topic cluster is now well covered; adding more generic posts in that vein has sharply diminishing returns.

**Housekeeping:** `_backlog.json` still marks all 12 `drafted`. Set them to `published`. This isn't cosmetic — see §3.

## 2. Also shipped since the last version of this doc

Three of the five "needs new writing" items are done:

1. ✅ **`/integrations/applied-epic`, `/integrations/hawksoft`, `/integrations/ezlynx`** — hub + 3, with `SoftwareApplication` markup.
2. ✅ **`renewalengineai-vs-gohighlevel`** — the GHL-reseller category, no partnership-tension constraint.
3. ✅ **`sonant-vs-liberate`** — the neutral vendor comparison flagged as the highest-leverage single piece in this calendar. Live and never yet crawled.
4. ✅ **`/glossary`** — batched as one project as recommended: 27 terms + hub, each entry self-contained enough for an answer engine to cite alone.
5. ❌ **Third named case study** — still open, still the highest-value remaining piece. Needs a real customer, not a writing slot.

## 3. The engine is still broken — and its last run was a false pass

The weekly content engine (`.github/workflows/weekly-content.yml`) has not produced an article since before the outage. Two independent faults, and **fixing either alone changes nothing**:

- **Missing secrets.** `gh secret list` returns empty. Runs on 2026-07-27, 08-03, 08-10 and 08-17 all died with `Error: TAVILY_API_KEY is not set`. Both `ANTHROPIC_API_KEY` and `TAVILY_API_KEY` are needed.
- **Status-flag mismatch.** The runner selects topics with `status: pending`; `_backlog.json` marks all 12 `drafted`. So the 2026-08-24 run "succeeded" in 1m27s having logged `no pending topics in backlog — nothing to do`. It exited before touching an API key.

Fix both, then add one real topic as `pending` and watch a run end-to-end. **A green check is not evidence the engine works** — it passed while doing nothing four days ago.

## 4. What to write next (once the engine runs)

Priority order, sized for solo/DIY pace. Note the shift: the gap is no longer volume, it's proof and connective tissue.

1. **Third named case study** (roadmap Phase 3) — needs a real customer; start the conversation now since it has the longest lead time.
2. **Internal-linking audit across all 15 articles**, not new prose. The 12 newly-live pieces have never been checked against a live site: each should link to its matching `/compare/*` page and to `/courses` or `/#pricing` by reader intent, and the strongest should link into `/case-studies/*`, which nothing currently points at.
3. **Glossary inbound links.** 28 URLs appeared at once with almost nothing linking to them — the most orphaned section on the site. Contextual `/resources/*` → `/glossary/[term]` links cost minutes each.
4. **A FAQ hub** beyond the homepage `FAQPage` schema — the one glossary-adjacent gap left.
5. **Course preview lessons** — promoting 3–5 of the 25 paywalled lessons to `preview: true` adds indexable, already-written depth for zero writing. Commercial decision.

New `_backlog.json` topics should come from this list, sparingly. A thin footprint that's sharply targeted beats a thick one that's redundant — and at 15 articles the retention cluster is no longer thin.

## 5. Distribution (drafted, unshipped)

`content/social/lead-magnet-launch/` contains LinkedIn/X copy for the full 12-article batch. Same status the articles had until this week: **written, merged, never used.** Now that the articles are actually live and linkable, this copy can finally be posted — publish alongside each piece rather than rewriting it. This is the cheapest distribution available and it has been sitting unused for a month.
