# Content Calendar — RenewalEngineAI

**Prepared:** 2026-08-18/19. See [SEO-STRATEGY.md](./SEO-STRATEGY.md) §2 before reading this — the backlog described below is **already drafted**, not a to-do list of writing tasks.

---

## 1. Current state (correcting the premise most content plans would start from)

`content/resources/_backlog.json` lists 12 topics, all marked `status: pending`. That flag is stale. All 12 are fully drafted as `.md` files and were merged into `main` via PR #25 on 2026-08-19:

| Slug | Category | Status |
|---|---|---|
| `ams-data-export-checklist` | Integrations | Drafted, merged, awaiting deploy |
| `renewal-retention-math-for-p-and-c-agencies` | Retention | Drafted, merged, awaiting deploy |
| `lead-response-time-benchmarks-insurance` | Growth | Drafted, merged, awaiting deploy |
| `ai-tools-vs-hiring-a-csr` | Strategy | Drafted, merged, awaiting deploy |
| `cross-sell-triggers-for-independent-agencies` | Retention | Drafted, merged, awaiting deploy |
| `pii-compliance-ai-insurance-agencies` | Operations | Drafted, merged, awaiting deploy |
| `quote-follow-up-sequences-that-actually-bind` | Growth | Drafted, merged, awaiting deploy |
| `book-segmentation-for-ai-outreach` | Retention | Drafted, merged, awaiting deploy |
| `evaluating-ai-vendors-insurance-agencies` | Strategy | Drafted, merged, awaiting deploy |
| `producer-workflows-post-ai` | Operations | Drafted, merged, awaiting deploy |
| `commercial-lines-ai-renewal-automation` | Retention | Drafted, merged, awaiting deploy |
| `30-60-90-day-ai-rollout-plan` | Strategy | Drafted, merged, awaiting deploy |

**Action for this backlog: none, other than updating `status` to `published` once the deploy pipeline is fixed and these go live.** Do not commission new versions of these topics.

## 2. What actually needs new writing (after the backlog ships)

Once the 12 articles are confirmed live (check `/resources/[slug]` returns 200 for each, not the sitemap — dynamic sitemap will already reflect them), the real gaps are the ones in [SITE-STRUCTURE.md](./SITE-STRUCTURE.md) §"Gaps" and [COMPETITOR-ANALYSIS.md](./COMPETITOR-ANALYSIS.md) §3, not more retention/automation posts — that category is now well covered. Priority order, sized for solo/DIY pace (roughly one piece every 1–2 weeks, reusing the existing content engine where possible):

1. **`/integrations/applied-epic`, `/integrations/hawksoft`, `/integrations/ezlynx`** — 3 short, high-intent landing pages. Not blog posts; these are conversion pages, so write manually rather than through the weekly-content engine (which is tuned for long-form resource articles, not landing-page copy).
2. **`renewalengineai-vs-gohighlevel`** comparison page — targets the GHL-reseller competitor category identified in COMPETITOR-ANALYSIS.md §2, no partnership-tension constraint.
3. **`sonant-vs-liberate`** neutral vendor comparison — highest-leverage single piece in this whole calendar (see COMPETITOR-ANALYSIS.md §3.2 for why). Do this before more resource articles.
4. **`/glossary`** — batch this as one project, not a drip. 15–25 short definitional entries (AMS, CSR, book of business, lapse rate, bind rate, etc.), each self-contained enough to be citable by an AI answer engine on its own.
5. Third named case study (coordinate with roadmap Phase 2 — needs a real customer, not just writing).

## 3. Engine maintenance, not new topics

Once the current 12-item backlog clears, add new topics to `_backlog.json` sparingly and only from the priority list above — resist the temptation to keep the engine "fed" with generic retention content just because it's running. A thin content footprint that's sharply targeted beats a thick one that's redundant.

Also verify, once the engine is confirmed running: each new article should link to (a) the matching `/compare/*` page if one exists, and (b) either `/courses` or `/#pricing` depending on reader intent — [SITE-STRUCTURE.md](./SITE-STRUCTURE.md) flags that the 3 originally-published articles weren't consistently doing this; audit them alongside the 12 new ones rather than treating it as solved.

## 4. Distribution (already-drafted, same status as the articles)

`content/social/lead-magnet-launch/` and the branch behind PR #25 already contain LinkedIn/X copy for the full 12-article batch (`social-content-pillar-cluster.md` on that branch). Same rule as §1: this is drafted, not a task — publish it alongside each article once live, don't rewrite it.
