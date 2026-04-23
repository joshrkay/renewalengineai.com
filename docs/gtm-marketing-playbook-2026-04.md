# GTM Marketing Playbook — April 2026

**Source of truth:** `docs/competitor-research-2026-04.md`
**Branch:** `claude/research-competitors-aJnZT`
**Positioning:** We are the **service implementation AI partner** for independent P&C agencies — vendor-agnostic, retention-focused, and we run the stack after we build it.

This playbook is the executable companion to the strategy doc. Each section links to a companion artifact in `content/email/` or `content/social/` where the actual copy lives.

---

## 1. Positioning statement (single source of truth)

> **RenewalEngineAI is the AI operations partner for independent P&C agencies.** We pick the right retention stack for your book — from the vendors you've already heard of — integrate it into Applied Epic, HawkSoft, or EZLynx, and run it for you week-over-week. We're not the tool. We're the partner that makes the tools actually work on your book.

**Say it this way:**
- **To an agency principal:** "We operate your AI stack so you don't have to learn it. Your retention goes up; nothing new lands on your CSR's plate."
- **To a vendor partnerships lead:** "We're the implementation + managed-ops layer for small P&C agencies your team can't profitably onboard. We credential your tool, integrate it, and keep the customer healthy. You get a referral fee and a happier long-tail customer."
- **To an AMS marketplace listing:** "Insurance-vertical AI implementation partner. Multi-AMS. Retention-first. Managed ops as standard."

**Don't say:**
- "AI platform." (We're not.)
- "Competes with Sonant / Liberate / Strada." (They're partners.)
- "Custom AI development." (We implement, don't build.)

---

## 2. ICP and messaging matrix

### ICP (primary)

- **Independent P&C agency.** 200–800 PIF, $1.5M–$8M written premium. Multi-carrier.
- **AMS:** Applied Epic, HawkSoft, or EZLynx.
- **Team shape:** 2–10 seats; principal is still in the book; no dedicated ops or tech lead.
- **Pain pattern:** Renewal retention under 90%, lead response over 10 minutes, inconsistent quote follow-up, no visibility on cross-sell opportunities.
- **Budget:** Can absorb $3K/mo of managed ops spend for a 3–5 point retention lift.

### ICP (secondary)

- **Small commercial agency, 400–1,500 PIF.** Same AMS list. Retention lever smaller but cross-sell lever larger.
- **Scratch agencies at 18–36 months old.** No legacy processes to unwind; faster implementations.

### Not our ICP (at least not yet)

- Captive agencies (FARM, Allstate, State Farm) — different decision model.
- Carriers, MGAs, brokers with 50+ agents — Strada / Liberate serve them better.
- Life/health-only shops — different AMS, different cadences.
- Sub-100-PIF solos — unit economics don't work yet; revisit in 2027.

### Messaging matrix (who → message)

| Audience | Headline | Primary proof | CTA |
|---|---|---|---|
| Agency principal (cold) | "Stop losing 15% of your book to renewal leaks." | Named case study + $ retained | Run the free Retention Leak Audit |
| Agency principal (warm) | "We pick the right AI stack for your agency and run it." | Stack Recommendation Report sample | Book the $1,500 paid audit |
| Vendor partnerships lead | "We close small-agency deals your team can't profitably service." | Referral economics + joint case study | 20-min partnership call |
| Catalyit / HawkSoft / AMS marketplace | "Insurance-vertical AI implementation partner; multi-AMS." | Partner directory one-pager | Apply for listing |
| Conference audience | "Field notes from 30+ small-agency AI deployments." | War stories, real numbers | 1:1 at the show |
| Podcast host | "Vendor-agnostic operator — I'll tell you when *not* to buy the tool." | Neutral POV + data | 30-min interview |

---

## 3. Channel plan (priority order)

Each channel links to its artifact.

### Channel 1 — Vendor partner referrals (#1 priority)

- **Artifact:** [`content/email/vendor-partnerships/`](../content/email/vendor-partnerships/)
- **Targets (in order):** Sonant AI → Liberate → Better Agency/GloveBox → Strada → Momentum AMP.
- **Offer to each:** "You send us the inbound you can't profitably serve (small agency, messy data, services buyer). We close it, credential your tool, and keep the customer healthy. Referral fee or reciprocity."
- **KPI:** 1 signed partnership in 30 days; 2 partnerships + 2 referred wins in 90 days.

### Channel 2 — Marketplace and association listings

- **Catalyit:** Apply as implementation partner in week 1. Sonant is already on Catalyit; we fit as the "implementation partner" taxonomy, not the "tool" taxonomy.
- **HawkSoft Connect:** Apply for services/implementation partner listing.
- **Applied Marketplace:** Apply. Timeline 60–90 days; keep the pitch tight to "services partner, not software vendor."
- **Big I state associations:** Start with home state + 2 adjacent. Offer a free 30-min "Retention Leak" webinar to members.
- **KPI:** Catalyit live in 60 days; HawkSoft or Applied listing live in 90 days; 1 state Big I webinar booked by day 90.

### Channel 3 — Named case studies (content flywheel)

- **Artifact:** [`content/email/case-study-sourcing/`](../content/email/case-study-sourcing/)
- **Mechanics:** Offer the first 5 reference customers 50% off Year 1 Managed Ops in exchange for on-record case study, logo rights, and a video testimonial.
- **Structure each case study uses:** Agency profile → retention leak we found → stack we picked (named vendors) → integration work → outcome in $.
- **Format per customer:** 1 long-form page, 1 PDF one-sheet, 1 2-minute video, 3 LinkedIn snippets, 1 email to the list.
- **KPI:** 3 named case studies live by day 90. Replace both composite case studies by end of Q3.

### Channel 4 — Vertical SEO (integrator-native, ~30 pages)

- **Artifact:** `content/resources/_backlog.json` (new topics appended).
- **Focus:** Own the **evaluation-phase** SERP, not the generic-category SERP.
  - Neutral vendor comparisons (Sonant vs Liberate, Better Agency vs GloveBox, Momentum vs Applied Epic).
  - AMS-specific AI roundups ("Best AI tools for Applied Epic agencies," etc.).
  - Vendor evaluation guides ("How to evaluate an AI vendor for your P&C agency," already in backlog).
  - Quarterly "AI stack teardown" for independent agencies.
- **Rhythm:** 2 new pages per week via the existing `build-weekly-content` engine; goal 30 integrator-native pages by end of Q3.
- **KPI:** 10 new pages in 30 days; 30 by day 90; 3 pages ranking on page 1 for their target keyword by day 90.

### Channel 5 — Founder distribution

- **Artifact:** [`content/social/founder-thought-leadership/linkedin-content-backlog.md`](../content/social/founder-thought-leadership/linkedin-content-backlog.md)
- **LinkedIn:** 3 posts/week; Mon = POV/takedown, Wed = field note from a live implementation, Fri = named case-study snippet or metric.
- **Podcast tour:** [`content/email/podcast-tour-outreach/`](../content/email/podcast-tour-outreach/)
  - Target list: Agency Nation, Millionaire Insurance Producer, The Jason & Carl Show, Independent Agent Podcast, Agency Growth Machine, Ridiculously Amazing Insurance Agent.
  - Cadence: 2 shows/month booked; 6 appearances in Q3.
- **Monthly open office hours:** Free 60-min Zoom for any principal who wants to talk AI strategy. Founder runs it. Low-friction top-of-funnel.
- **KPI:** 12 LinkedIn posts/month (36 in 90 days); 6 podcast bookings by day 90; first open office hours live by day 45.

### Channel 6 — Retention Leak Audit (free TOFU tool)

- **What it is:** Self-serve widget on the home page. Inputs: book size (PIF), current retention %, avg annual premium, AMS. Outputs: annual $ leakage, 3-point-lift $ recovery, CTA to the paid audit.
- **Build:** Use the existing Next.js app; ship as a server action with GA4 event tracking (new event: `retention_leak_audit_submit`).
- **Promotion:** Hero section CTA, footer CTA, bottom of every resource page, linked from LinkedIn, included in Email 1 of the outbound sequence.
- **KPI:** 150 submissions in first 30 days post-launch; 5% convert to paid audit inquiries.

### Channel 7 — Paid, surgically

- **Google search only.** Long-tail evaluation keywords: "Sonant AI review," "Liberate vs Strada for small agency," "best AI for Applied Epic agency." Budget ceiling: $2K/month.
- **LinkedIn outbound (not paid ads).** Founder-account sales navigator; 30 connections/week targeted at principals at 200–800 PIF agencies.
- **Do not run:** Brand-alternative campaigns, Facebook/Instagram display, YouTube pre-roll. Not our buyer motion.
- **KPI:** $2K/mo max spend; CAC under $500 on paid audits from search.

---

## 4. The 30/60/90 (marketing-specific)

### 30 days — foundations + partnership outreach

- [ ] Ship the Retention Leak Audit tool on the home page. Instrument GA4 event.
- [ ] Rename the paid audit deliverable to "Stack Recommendation Report"; update `how-it-works`, `pricing`, and audit landing copy.
- [ ] Vendor partner outreach sent to all 5 targets. Follow-ups scheduled.
- [ ] Catalyit application submitted.
- [ ] Case-study sourcing emails sent to 5 existing customers. First 2 interviews booked.
- [ ] 2 new comparison pages live: Sonant vs Liberate, Better Agency vs GloveBox.
- [ ] Messaging matrix distributed to everyone who talks to customers.
- [ ] LinkedIn cadence live: 3 posts/week from founder account.
- [ ] First 4 podcast pitches sent; 1 booking target.

### 60 days — first wins

- [ ] First vendor partnership agreement signed.
- [ ] First named case study published (page + PDF + video + LinkedIn push).
- [ ] HawkSoft Connect + Applied Marketplace applications submitted.
- [ ] Open office hours live; first session booked.
- [ ] 10+ new integrator-native SEO pages indexed.
- [ ] 6 podcast pitches sent; 2 bookings confirmed.
- [ ] First state Big I webinar scheduled.

### 90 days — second wins + ready to scale

- [ ] 2 vendor partnerships active. 2 referred agencies landed.
- [ ] 3 named case studies published.
- [ ] Catalyit listing live.
- [ ] HawkSoft or Applied implementation-partner listing live (or clear status).
- [ ] 30 integrator-native SEO pages indexed; 3 ranking on page 1.
- [ ] Performance-guarantee Managed Ops tier live on pricing page.
- [ ] Applied Net 2026 decision made (co-sponsor with partner, or defer).
- [ ] 6 podcast appearances aired or scheduled.

---

## 5. KPIs (weekly scoreboard)

Pipeline / revenue (already in `ARR_SPRINT.md` — this section replaces it for the marketing owner):

| Metric | Target (end of Q3 2026) |
|---|---|
| Free Retention Leak Audit submissions | 500 cumulative |
| Paid audits booked | 24 (8/mo run-rate by Q3 end) |
| Paid audits → Build & Launch | ≥50% |
| Build & Launch → Managed Ops | ≥80% |
| Vendor partnerships signed | 2 |
| Referred leads landed | 2 |
| Named case studies published | 3 |
| SEO pages indexed (integrator-native) | 30 |
| SEO pages ranking page 1 | 3 |
| Podcast appearances | 6 |
| LinkedIn posts published | 36 cumulative in Q3 |
| Catalyit / AMS marketplace listings live | ≥1 |

Weekly review: What moved, what stalled, what's the single blocker next week. 30 min, Monday.

---

## 6. Budget sketch (quarterly, directional)

- **Paid search:** $6K/quarter ($2K/mo ceiling).
- **LinkedIn Sales Nav (founder seat):** ~$300/quarter.
- **Video production for case studies:** $1.5K/case study × 3 = $4.5K.
- **Catalyit / AMS listing fees:** variable; budget $5K placeholder.
- **State Big I webinar sponsorship:** $1K/state × 2 = $2K.
- **Conference attendance (2026, non-booth):** $2K travel + vendor co-sponsor contribution.
- **Tooling (analytics, scheduling, outreach):** existing stack.
- **Total new spend, Q3:** ~$20K. Against $200K–$300K of ARR momentum if the plan works, that's a 10–15% of revenue marketing burn — healthy for a services firm.

---

## 7. Ownership (placeholder — to be filled)

| Channel | Owner |
|---|---|
| Vendor partnerships | Founder (not delegable until first partnership closes) |
| Case study sourcing | Founder → hands off to content lead after kit is live |
| SEO / content engine | Existing `build-weekly-content` engine + content lead review |
| Founder distribution (LinkedIn, podcast) | Founder |
| Retention Leak Audit tool build | Engineering |
| Catalyit / AMS marketplace applications | Founder (one-time) |
| Weekly review | Founder + 1 ops person |

---

## 8. Artifact index

- [Master strategy](./competitor-research-2026-04.md) — the positioning + competitor landscape source of truth.
- [Vendor partner outreach kit](../content/email/vendor-partnerships/) — per-vendor email templates + one-pager outline.
- [Case study sourcing kit](../content/email/case-study-sourcing/) — customer ask email + interview guide + case study template.
- [Founder LinkedIn backlog](../content/social/founder-thought-leadership/linkedin-content-backlog.md) — 12 post drafts + cadence.
- [Podcast tour outreach kit](../content/email/podcast-tour-outreach/) — target list + pitch template + founder one-sheet.
- [SEO backlog](../content/resources/_backlog.json) — integrator-native topics appended to the existing queue.
