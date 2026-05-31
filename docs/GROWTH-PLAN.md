# RenewalEngineAI — Content, GEO & SCO Growth Plan

**Goal:** Turn the site into a two-path conversion engine where a visitor can either
(a) **start a free self-serve trial of the product**, or (b) **book the Calendly "Free
Renewal Audit"** — and feed both paths with content that ranks (SEO), converts (CRO),
and gets cited by AI engines (GEO).

> Scope decisions (confirmed with owner): "the product" = a **new self-serve SaaS trial**
> of the renewals dashboard (does not exist yet — this plan includes building it).
> "SCO" = **SEO + CRO** (rank *and* convert).

This document supersedes the stale root-level strategy files (`conversion-test-results.md`,
`offer-funnel-iteration.md`, `scaling-winning-elements.md`, `ops/EXECUTION-BOARD.md`).
Those reference pre-Next.js `.html` pages and contain fabricated A/B metrics — keep for
history, but treat this as the source of truth.

---

## 0. Where we are today (audit)

**Strong foundations already shipped:**
- Next.js App Router marketing site + provisioned-only dashboard (renewals tracking + AI
  renewal-email generation), Stripe checkout, NextAuth, Prisma/Neon.
- Mature SEO/GEO scaffolding: `Organization`/`WebSite`/`Person`/`Service` `@graph`
  (`src/app/layout.tsx`), dynamic `sitemap.ts`, `robots.ts` with a full AI-crawler
  allowlist (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…), comprehensive `llms.txt`,
  per-page canonicals, OpenGraph/Twitter.
- Per-page-type schema is **already good**: resources/comparisons/case-studies emit
  `Article` + `SpeakableSpecification` + `BreadcrumbList`; courses emit
  `Course`/`Offer`/`CourseInstance`; home emits `FAQPage`.
- Automated content engine: weekly GitHub Action (`.github/workflows/weekly-content.yml`)
  drafts a long-form resource from `content/resources/_backlog.json` (12 pending topics)
  with enforced house voice, internal links, and a subtle CTA (`src/lib/content-generation/*`).
- Content inventory: 3 resources, 3 comparisons, 2 case studies, 2 courses (28 lessons),
  2 lead magnets, Mastermind + Team Licenses.

**Conversion gaps / leaks (the important part):**
| # | Gap | Evidence | Impact |
|---|-----|----------|--------|
| L1 | **Homepage lead magnet is broken** — POSTs to `/api/lead-magnet`, which doesn't exist (the `LeadMagnetSubscriber` model exists, the route doesn't). | `src/components/marketing/LeadMagnet.tsx:19` vs `src/app/api` | Every homepage email capture 404s. Top-of-funnel leak. |
| L2 | **No self-serve product signup/trial.** `/login` has no "Sign up"; accounts are only created by the Stripe webhook (post-purchase set-password). | `src/app/login/page.tsx`, `src/app/api/stripe/webhook/route.ts` | The "product" conversion path the owner wants does not exist. |
| L3 | **Content pages lack a strong conversion block.** Resource/comparison/case-study bodies have only a subtle inline text link; the dual-CTA `AuditTripwire` is used on just 2 pages. | `src/components/resources/ResourceBody.tsx`, `AuditTripwire` usage | Article readers (the GEO/SEO traffic) have no clear next step. |
| L4 | **Cold traffic sent straight to $6,000 / $2,500-mo Stripe checkout** from homepage pricing. | `src/components/marketing/Pricing.tsx:81` | High-friction; no low-commitment entry. |
| L5 | **No AI-referral / GEO measurement.** GA4 + Humblytics exist but nothing parses chatgpt.com / perplexity.ai / gemini referrers or AI-crawler hits. | `src/app/layout.tsx`, `src/lib/analytics.ts` | Can't prove or tune GEO. |
| L6 | Lessons have canonicals but **no JSON-LD**; no per-article `FAQPage`; no `Review`/`AggregateRating`; `sameAs` is LinkedIn-only. | lesson page; resources `[slug]` | Missed GEO/rich-result surface area. |

---

## 1. Target conversion architecture (the spine of everything)

Two parallel paths, mapped to buyer intent — **presented side by side, never competing:**

```
                         ┌─────────────────────────────────────────┐
   SEO / GEO / Social ──▶ │  Content (resources, comparisons, AMS,   │
   (top of funnel)        │  case studies, glossary, calculators)    │
                         └───────────────┬─────────────┬─────────────┘
                                         │             │
                  "Try it yourself, free"│             │"Have us build & run it"
                           (low friction)│             │(high touch)
                                         ▼             ▼
                              ┌────────────────┐   ┌──────────────────┐
                              │ SELF-SERVE      │   │ CALENDLY          │
                              │ TRIAL (new)     │   │ Free Renewal Audit│
                              │ → dashboard     │   │ → Audit/Build/    │
                              │ → upgrade $$    │   │   Managed         │
                              └───────┬────────┘   └──────────────────┘
                                      │  in-app: "Want us to run this? Book a call" ──▶ (Calendly)
                                      ▼
                               Self-serve paid plan (Stripe)
```

**Rules this plan enforces everywhere:**
1. Every high-traffic page (home, content, AMS, comparisons) offers **both** CTAs:
   primary = **Start free trial**, secondary = **Book a free audit**.
2. Email capture (lead magnet) is the fallback for visitors not ready for either.
3. The trial is itself a sales channel: in-app prompts route high-touch users to Calendly
   (PLG → sales-assist).

**Primary KPIs:** trial signups, trial→paid, Calendly bookings, booking→close.
**Leading indicators:** organic sessions, AI-referral sessions, lead-magnet subs, activation rate (first AI draft generated).

---

## 2. Phase 1 — Fix the leaks (Week 1, fast + high ROI)

These are small, mostly-wired changes that stop losing the traffic we already get.

- **L1 — Build `POST /api/lead-magnet`**: write to the existing `LeadMagnetSubscriber`
  model, send the playbook via `src/lib/email.ts`, fire a `lead_capture` GA event. ~1 file.
- **L3 — Ship a shared `<ContentCTA />`** (generalize `AuditTripwire`): two buttons
  ("Start free trial" + "Book a free audit") + email-capture fallback. Render it at the
  bottom of every resource/comparison/case-study and inside `ResourceBody` after the body.
- **L5 — AI-referral tracking**: in `src/lib/analytics.ts`, tag sessions whose referrer is
  `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `claude.ai`, `copilot.microsoft.com`,
  `bing.com/chat` as `ai_referral` (GA4 custom dimension). Log AI-crawler user-agents from
  middleware for a weekly "who's crawling us" report.
- **Backlog expansion**: grow `_backlog.json` from 12 → 30+ topics (see §5) so the weekly
  engine never starves.
- **Housekeeping**: move the stale `.html`-era docs into `docs/archive/` so they stop
  contaminating the content engine's prompt context (the engine reads
  `scaling-winning-elements.md`).

---

## 3. Phase 2 — Self-serve product trial (PLG) — Weeks 2–4

The net-new "product signup" path. The data model is already 80% ready:
`SubscriptionStatus.TRIALING` exists, the demo-seed script exists, AI draft generation works.

### 3.1 Signup + trial flow
- **New `/signup` page** + **`POST /api/auth/signup`**: create `Organization` +
  `User` (hashed password or magic-link), set `subscriptionStatus = TRIALING`. Add a
  `trialEndsAt DateTime?` column to `Organization` (migration) → default 14 days.
- Add **"Start free trial"** to `/login`, the header, hero, pricing, and `<ContentCTA />`.
- Reuse the existing Stripe webhook provisioning logic; factor account creation into a
  shared `provisionOrg()` so signup and purchase share one path.

### 3.2 Activation = the "magic moment"
- On signup, **auto-seed demo policies** (promote `scripts/seed-renewals-demo.ts` to a
  `seedDemoData(orgId)` lib function). The dashboard is never empty.
- Guided first-run: **(1)** see 12 renewals → **(2)** click "Generate AI renewal email" →
  **(3)** read a drafted email in the agency's voice → **(4)** connect Gmail/Outlook (OAuth
  already supported) → **(5)** import your own CSV.
  Activation metric = **first AI draft generated** within session 1.

### 3.3 Trial gating + conversion
- Trial limits: cap real sends (demo mode drafts freely, sending requires connect/upgrade);
  show days-left + upgrade banner.
- Two in-app conversion routes: **Upgrade** → Stripe self-serve plan; **"Have us run it"**
  → Calendly. Lifecycle emails on day 1 / 3 / 7 / 11 / 14.

### 3.4 Open decision (owner): self-serve price point
Tiers today are service-only (`AUDIT`/`SPRINT`/`MANAGED`). A self-serve trial needs a
self-serve subscription to convert into. The archived `ARR_SPRINT.md` floated
Starter $299 / Growth $799 / Pro $1,999. **Recommendation:** launch one simple
self-serve **Starter** plan (e.g., $299–$499/mo, policy-count tiered) and keep
done-for-you (Build/Managed) as the upsell. *Needs your pricing call before §3.3 build.*

---

## 4. Phase 3 — Content engine: pillar/cluster model

Move from "ad-hoc articles" to a **hub-and-spoke topical authority** structure. Five pillars,
each = one comprehensive pillar page + 6–10 interlinked cluster articles, all cross-linked
and pointing at the two conversion paths.

| Pillar | Pillar page | Why | Primary conversion |
|--------|-------------|-----|--------------------|
| **P1 Renewal retention & automation** | `/resources/ai-renewal-automation-playbook` (exists, expand) | Core money keyword | Trial + Calendly |
| **P2 Instant lead response** | `/resources/instant-lead-response-under-60-seconds` (exists) | High-intent, strong stats | Trial + Calendly |
| **P3 AMS integration** (Applied Epic / HawkSoft / EZLynx) | `/resources/ams-ai-integration-guide` (exists) + **new `/for/applied-epic`, `/for/hawksoft`, `/for/ezlynx`** | Low-competition, very high intent | Trial |
| **P4 AI for insurance agencies** (category education) | **new** `/resources/ai-for-insurance-agencies` | GEO goldmine — broad "what is" queries AI engines answer | Email + Trial |
| **P5 Agency economics & ops** (CSR vs AI, ROI, rollout) | `/compare/renewalengineai-vs-hiring-csr` (exists) | Decision-stage, buyer math | Calendly |

### New content **types** to add (surface area for SEO + GEO + conversion)
1. **AMS landing pages** `/for/{applied-epic|hawksoft|ezlynx}` — integration details +
   FAQ schema + `SoftwareApplication`/`HowTo`. Highest-intent, lowest-competition.
2. **Comparison expansion** — the FAQ already names GoHighLevel; build
   `/compare/renewalengineai-vs-gohighlevel`, `…-vs-an-internal-build`, plus any competitor
   prospects mention. Comparison pages win "vs" and "alternative" searches *and* AI answers.
3. **Solution pages** `/solutions/{renewal-automation|lead-response|quote-follow-up|cross-sell}`
   — today these are homepage sections only; break out as indexable pages.
4. **Glossary** `/glossary/{term}` — clean definitions ("X-date", "book of business",
   "lapse rate", "instant lead response"). AI engines love and cite crisp definitions.
5. **Interactive tools** `/tools/roi-calculator`, `/tools/retention-calculator` — promote the
   existing `ROICalculator` component to standalone indexable pages. Tools earn backlinks +
   convert (gate the emailed report → trial).
6. **Original benchmark report** — "2026 Insurance Lead Response & Retention Benchmark."
   Original data is the single highest-leverage GEO + link-building asset (see §5.3).

### Cadence
- **Weekly (automated):** 1 resource article (existing engine; expanded backlog).
- **Bi-weekly (assisted):** 1 AMS page **or** 1 comparison **or** 1 solution page.
- **Monthly:** 1 case study + refresh of the worst-performing top-10 page.
- **Quarterly:** refresh pillar pages; re-publish benchmark with fresh data.

### Engine upgrades (`src/lib/content-generation/*`)
- Teach it to also draft **comparison** and **AMS** page types (new templates/system prompts).
- Add `faqs:` to article frontmatter → render `FAQPage` schema per article (see §5).
- Auto-regenerate `llms.txt` when new content ships (currently static).
- Keep prompt-caching discipline (system prompt already cache-stable).

A concrete **12-week editorial calendar** lives in §7.

---

## 5. GEO — Generative Engine Optimization

We already have the table stakes (llms.txt, crawler allowlist, Article/FAQ/Speakable schema).
This is how we get **cited and recommended** by ChatGPT, Perplexity, Gemini, Claude, AI Overviews.

### 5.1 On-page (in the content engine)
- **Answer-first**: every article and every H2 opens with a 40–60 word, self-contained,
  extractable answer before elaborating. Tighten the engine's "scannable answer" rule into a
  hard "definition-style lead sentence" rule.
- **Question-shaped H2s** matching real prompts ("How fast can AI respond to insurance leads?").
- **Cited statistics**: every stat (391%, 78%, 15–20%) gets a named source + outbound link.
  AI engines prefer and re-cite sourced claims.
- **Machine-readable structure**: ≥1 comparison table or numbered list per article (already required).
- **Per-article `FAQPage` schema** via frontmatter `faqs:` (extend `resources.ts`,
  `system-prompt.ts`, and the `[slug]` page). FAQ schema is the most-cited format in AI answers.
- **`llms.txt` + add `llms-full.txt`** (full-content dump) and auto-update on publish.

### 5.2 Entity & off-site (where GEO is actually won)
- **Expand `Organization.sameAs`** beyond LinkedIn: Crunchbase, G2, Capterra, Clutch,
  Twitter/X, YouTube, founder LinkedIn. A consistent entity footprint builds the trust graph
  AI engines lean on.
- **Get listed & reviewed**: G2 + Capterra ("AI insurance agency software" categories),
  insurance software directories, Product Hunt. Reviews → `AggregateRating` schema → citations.
- **Get mentioned**: targeted presence in `/r/InsuranceAgent`, NetVU / Applied user
  communities, agency Facebook groups, IA-focused newsletters/podcasts, 2–3 guest posts on
  insurtech blogs. AI answers heavily weight third-party corroboration, not just your site.

### 5.3 Be the source (highest leverage)
Publish the **original benchmark report** (§4 type 6). Original numbers ("median insurance
lead-response time is X; agencies under 1 min convert Y% more") become the thing AI engines
quote and competitors link to. This single asset can do more for GEO than 20 articles.

### 5.4 Measure GEO
- AI-referral GA4 dimension (§2 L5) + monthly **manual citation audit**: run a fixed prompt
  set ("best AI tools for insurance renewals", "how fast should an agency respond to leads",
  "Applied Epic AI automation") across ChatGPT/Perplexity/Gemini/Claude and log whether we're
  cited. Track citation share over time.
- Weekly AI-crawler hit report from middleware logs.

---

## 6. SCO — SEO + CRO

### 6.1 SEO (rank)
- **Keyword/topic map** per pillar — pair commercial-intent ("insurance renewal automation
  software", "{AMS} AI automation", "AI for insurance agents") with informational queries the
  clusters answer. The `llms.txt` "Target Keywords" block is a good seed list.
- **Technical fixes**:
  - Add JSON-LD to **lesson pages** (`LearningResource`/`Course` part-of).
  - Per-page **OG images** (extend `opengraph-image.tsx` per section) for better social/AI cards.
  - **Core Web Vitals**: the hero uses multiple large blurred gradients + `animate-pulse` —
    audit LCP/CLS on mobile; lazy/`content-visibility` the heavy decorative layers.
  - **Programmatic** AMS + comparison pages from a small data file → consistent metadata,
    schema, internal links at scale.
- **Internal linking**: resources already render `related`; extend related + breadcrumb +
  "part of pillar" links to comparisons/case-studies/solutions. Every cluster links up to its
  pillar and sideways to 2–3 siblings.

### 6.2 CRO (convert)
- Fix L1 (lead magnet) and ship `<ContentCTA />` (L3) — biggest immediate wins.
- **Dual-CTA everywhere** once the trial exists: "Start free trial" (primary) + "Book a free
  audit" (secondary). Today the site is Calendly-only on most CTAs.
- **Re-sequence homepage pricing (L4)**: keep Audit→Calendly; gate raw $6k/$2.5k-mo Stripe
  buttons behind "Start trial" or "Book a call" for cold traffic (run as an experiment).
- **Real experimentation**: use the installed Humblytics + GA4 for genuine A/B tests
  (headline, CTA label, trial-vs-audit primacy). Replace the fabricated results in the
  archived docs with a live experiment log. Primary metric = trial signups + bookings.
- **Friction reducers**: exit-intent + scroll-depth offers on content pages; keep lead-magnet
  email-only; social proof near every CTA (add real logos/G2 badge as they land).

---

## 7. 12-week execution roadmap & editorial calendar

| Wk | Conversion / Product | Content shipped | GEO / SEO |
|----|----------------------|-----------------|-----------|
| 1 | Fix `/api/lead-magnet`; ship `<ContentCTA/>`; AI-referral tracking | Expand backlog to 30+; archive stale docs | Add `faqs:` schema plumbing |
| 2 | `/signup` + `/api/auth/signup` + `trialEndsAt` migration | P4 pillar: *AI for Insurance Agencies* | `sameAs` expansion; G2/Capterra listings |
| 3 | Demo-data auto-seed + guided first-run | `/for/applied-epic` | Per-article FAQ schema live |
| 4 | Trial gating + upgrade→Stripe + book-a-call→Calendly; lifecycle emails | `/for/hawksoft`, `/for/ezlynx` | Lesson JSON-LD; OG images |
| 5 | "Start free trial" CTA across site; pricing experiment | `/compare/...-vs-gohighlevel` | CWV pass on hero |
| 6 | Trial analytics dashboard | `/tools/roi-calculator` standalone | `llms-full.txt`; auto-update llms.txt |
| 7 | First CRO A/B (CTA primacy) | Solution page: renewal-automation | Internal-link/related rollout |
| 8 | Iterate trial activation | Solution page: lead-response | Programmatic comparison metadata |
| 9 | — | **Benchmark report** (data collection + write) | Begin citation-audit baseline |
| 10 | Sales-assist prompts in trial | Glossary (10 terms) | Off-site mentions / guest posts |
| 11 | Expansion/upgrade emails | Case study #3 + refresh top-10 page | Review-driven `AggregateRating` |
| 12 | Review funnel end-to-end; plan next quarter | Pillar refresh | GEO citation-share report |

**Backlog topics to add now** (extends `_backlog.json`): AI for insurance agencies (P4 pillar);
Applied Epic / HawkSoft / EZLynx AI guides; vs GoHighLevel; vs internal build; renewal email
templates; lead-response SLA template; X-date strategy; book-of-business health metrics;
insurance AI compliance checklist; multi-line cross-sell triggers; producer comp in an AI agency;
"how AI engines pick insurance tools" (meta/GEO).

---

## 8. Measurement & definition of done

**Funnel events (GA4 + server-side via `trackServerEvent`):**
`page_view → lead_capture → trial_signup → activation(first_ai_draft) → upgrade | calendly_booking`.

**Weekly scoreboard:** organic sessions · AI-referral sessions · AI-crawler hits ·
lead-magnet subs · trial signups · activation % · trial→paid % · Calendly bookings · close %.

**This plan is "done" when:**
1. A visitor can self-serve **start a trial** and reach the AI-draft magic moment, **or**
   **book the audit** — from any major page. ✅ both paths live.
2. The lead-magnet capture works and is tracked.
3. Every content page has dual CTAs + per-article FAQ schema.
4. The pillar/cluster structure + AMS/comparison/solution pages are published and interlinked.
5. AI-referral + citation tracking is reporting, and the benchmark report is live.

---

### Open decisions for the owner
1. **Self-serve price point** (§3.4) — needed before building trial→paid upgrade.
2. **Trial length & limits** (recommend 14 days, sending gated).
3. **Competitor list** for comparison expansion (who do prospects actually mention?).
4. Whether to keep raw $6k/$2.5k-mo Stripe buttons on the cold homepage or gate them (§6.2).
