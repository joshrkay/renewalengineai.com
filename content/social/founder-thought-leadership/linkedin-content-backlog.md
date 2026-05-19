# Founder LinkedIn Content Backlog & Cadence

**Owner:** Founder (not delegable — the voice is the product).
**Cadence:** 3 posts/week. Mondays / Wednesdays / Fridays.
**Positioning voice:** Vendor-agnostic operator. Field notes, not thought leadership. Say specific things, cite numbers, name names (when fair).

---

## Weekly cadence themes

| Day | Theme | Purpose |
|---|---|---|
| **Monday** | POV / takedown / contrarian | Gets distribution (strong opinions travel). Establishes the "neutral operator" authority. |
| **Wednesday** | Field note / implementation story | Signals we're actually doing the work. Unique content no vendor can write. |
| **Friday** | Case study snippet or metric | Proof. One named agency, one number, one takeaway. Closes the week with evidence. |

---

## Post backlog (12 drafts, 4 weeks)

Each post: ≤1,300 characters. Hook in first line. Line breaks every 1–2 sentences for LinkedIn readability. No hashtag spam — 3 max, placed at the bottom.

---

### Week 1

#### Mon — POV: "Why I won't recommend one AI vendor over another on this call"

```
Got asked last week: "Which AI vendor is best for my agency?"

The answer you want is a name. The honest answer is "it depends on your book."

A 300-PIF personal lines agency on HawkSoft with a phone-answering problem should probably pick Sonant.

A 500-PIF mixed book on Epic with a renewal cadence problem should probably skip voice AI entirely and run a multi-channel cadence.

A 150-PIF scratch agency should probably not buy AI yet — they should clean their AMS data.

Anyone who names one vendor on a first call without seeing your book is selling you the vendor, not solving your problem.

This is why we built the audit as a paid deliverable.

#insurance #AIAdoption #P_C
```

#### Wed — Field note: "The most expensive thing in most AMS data is the phone number field"

```
Field note from a stack implementation last week.

The agency had 487 active policies in Applied Epic. Their renewal automation was only reaching 312 of them by phone.

Not because the tool couldn't dial the other 175.

Because the phone-number field had:
- 52 records with carrier phone numbers, not client
- 31 with (555) 555-5555 placeholders from data migration
- 19 landlines that had been disconnected in 2021
- 73 with mobile numbers in the landline field and vice versa

You can't tune a voice AI stack on top of that. We spent 4 days on data hygiene before anything AI-related.

The retention lift came from the cleanup, not from the AI.

This is the boring part nobody in the category is writing about.
```

#### Fri — Case-study snippet (placeholder — use once first case study is live)

```
Case study going live next week.

[Named agency], personal lines, Applied Epic, 350 policies.

Before: 82% renewal retention. 47-hour average lead response. No cross-sell visibility.

After 120 days of Managed Ops on the stack we recommended: 94% retention. 38-second lead response. $187K of premium recovered in the window.

Full write-up drops Tuesday. The interesting part: we recommended against voice AI in the audit. Their problem was email cadence, not call answer.

The wrong stack would've been "install voice AI, call it done." The right stack was boring.
```

---

### Week 2

#### Mon — POV: "Every 'AI for insurance' demo does this one thing"

```
Watched 11 insurance AI demos in the last 60 days.

Nine of them did this:

Demo agent: "Watch how our AI handles a renewal call."
Pre-canned "angry customer" recording plays.
AI responds smoothly. Handles the objection. Books a review.
Demo agent: "And that's how we lift retention 20%."

What's missing:
- The AI never hears a mumbled phone connection.
- The prospect is always in 1 of the 3 scripts they trained on.
- Nothing ever writes back to the AMS on the call.
- The pricing model is never discussed.

A demo is theater. Your book is reality.

The question that matters: "Can I see a call that went wrong, and how you handled it?"

If they can't show you that, they don't have the product yet.
```

#### Wed — Field note: "What we do in the first 48 hours of a new engagement"

```
First 48 hours of a new Managed Ops engagement:

Hour 0–4: AMS read-only access confirmed. Data pull runs.
Hour 4–12: Phone/email/address field quality report. (Usually bad.)
Hour 12–24: Top-20 at-risk-renewal accounts identified. Principal review.
Hour 24–36: Stack decision validated against actual data. Sometimes we change our pick from what the audit said.
Hour 36–48: Two campaigns live on a 10-account test cohort. No full-book rollout yet.

Week 2 is where we expand.

Most agencies' mental model is "we sign, you turn on AI." It's closer to "we sign, we spend 2 days reading your book, then we turn on a 10-account test."

Slow at the start, fast in the middle, compounding at the end.
```

#### Fri — Metric: "The one retention number that matters"

```
Every AI vendor in insurance will give you a retention lift number.

"23% lift on at-risk accounts."
"4.5% average policy retention improvement."
"91% to 95% retention in 120 days."

The number that actually matters isn't retention %.

It's retained premium ÷ cost of program.

One 3-point retention lift on a $2M book ≈ $60K of retained premium. If the program costs $30K/year, ROI is clear. If the book is $500K and the program costs $30K/year, it's not.

Before you pick a vendor or a services partner, do this math first. Most AI buying mistakes in insurance are scale-mismatch, not vendor-mismatch.
```

---

### Week 3

#### Mon — POV: "The GoHighLevel P&C Snapshot is not automation"

```
Controversial, but worth saying.

The GoHighLevel "P&C Insurance Snapshot" at $497/mo is being sold to independent agencies by marketing agencies every day.

It's a templated funnel. Email drips. Text drips. A pipeline stage.

It is not:
- Integrated with your AMS (data does not flow back).
- Aware of renewal timing on specific policies.
- Able to trigger on life events or policy events.
- Able to distinguish at-risk accounts from healthy ones.

What it IS: a way to spam your lead list on a schedule.

For a brand-new producer with no book, that's fine. For an agency with 300 policies already, it costs you renewal data integrity for $497/mo.

If the only automation in your agency is a GHL snapshot, you don't have automation. You have a mailing list.
```

#### Wed — Field note: "Why we talked an agency out of buying our Build & Launch"

```
Honest note.

Two weeks ago we ran an audit on a 180-PIF personal lines agency on EZLynx. The principal wanted to buy the full Build & Launch ($6K) + Managed Ops ($2.5K/mo).

We told them no.

Why: at 180 PIF and ~$400K of annual premium, a 3-point retention lift is ~$12K/year retained. Our program cost ~$36K/year. The math doesn't work until they're at ~350 PIF or have commercial lines in the mix.

We sent them to the $297 AI for Agent Retention course and told them to call us back in 12 months.

If a services firm can't tell you when you shouldn't hire them, they're going to cost you more than they save you.

The course link is in the first comment.
```

#### Fri — Case-study snippet #2 (placeholder — use after second case study is live)

```
Stack teardown: [named agency], commercial P&C, 180 accounts, HawkSoft.

Audit found the leak wasn't renewal — it was cross-sell. The agency had a 2.1 policies-per-household average. Industry benchmark on their book mix: 3.5+.

Stack we built:
- HawkSoft → custom AMS tap for policy events.
- [Named vendor] for at-risk classification and cross-sell scoring.
- Multi-channel cadence (email + text) for outreach.
- Manual producer handoff on any account scoring >0.8.

Outcome 120 days in: $312K of cross-sell opportunities surfaced, 2.3 → 4.1 policies per household on touched accounts.

Full case study on the site. Linked in the comments.
```

---

### Week 4

#### Mon — POV: "What 'AI for insurance' will actually look like in 18 months"

```
Prediction for April 2027.

What dies:
- Generic "AI receptionist" pitches that can't write back to an AMS.
- Vendor-neutral "marketplaces" that are really just vendor affiliate pages.
- Any AI product priced per seat instead of per outcome.

What grows:
- Specialized agents for one insurance task at a time (renewal, quote follow-up, at-risk classification) — orchestration layers on top.
- AMS vendors bundling AI that's "good enough and already paid for" — pressure on standalone tools.
- Services firms that pick and run the best-of-breed stack per agency.

What stays the same:
- The principal still gets called by the same 12 clients every week about the same 6 questions.
- Data hygiene is still the bottleneck.
- Trust still travels by word of mouth at the state Big I meeting.

If you're planning AI adoption around anything else, re-check your map.
```

#### Wed — Field note: "The one question that sorts who buys from who loops forever"

```
After running ~40 audits, the question that sorts decisive buyers from perpetual shoppers:

"What's the single metric that will tell you this is working 90 days from now?"

Decisive buyers answer in one number. "Retention goes from 88% to 91%." "Lead response under 60 seconds on personal lines." "15 more bound quotes a month."

Loopers say: "I'll just know." Or they list 8 metrics.

If a prospect can't name the number in the audit call, they're not buying this quarter. We give them the audit deliverable, tell them to come back when they know the number, and move on.

A services firm's worst trap is running $6K implementations for agencies that don't know what success looks like.
```

#### Fri — Metric: "The numbers inside a Stack Recommendation Report"

```
What actually goes into the Stack Recommendation Report (our $1,500 audit deliverable):

1. Current-state numbers.
Retention %, lead response time, quote-to-bind %, cross-sell penetration.

2. Book data-quality score.
Phone fields. Email fields. Last-touched date. Field-completion %.

3. Leak analysis.
Dollars leaking annually on the current numbers. Split by: renewal, lead response, quote follow-up, cross-sell.

4. Stack recommendation.
Named vendors. Why each. Estimated costs. Estimated outcome delta.

5. Integration scope.
What we'd build against the AMS. Hours. Who owns what.

6. ROI projection.
Dollars recovered over Year 1, assuming implementation on schedule.

We deliver this whether or not the agency continues with us. If they take it to a different vendor, we still did our job.
```

---

## Posting mechanics

- **Schedule in advance** (Buffer / Hypefury / LinkedIn native scheduler). Post manually isn't sustainable at 3/week.
- **First comment:** Always add a comment in the first 10 minutes with a link (audit tool, case study, course). LinkedIn penalizes links in the post body.
- **Reply plan:** Respond to every comment in the first 24 hours. That's where the trust compounds.
- **Reuse:** Every post that gets >50 reactions gets repurposed — into an email, a YouTube short, a blog snippet.

---

## Tracking

| Post # | Theme | Posted date | Impressions | Reactions | Comments | Link clicks |
|---|---|---|---|---|---|---|

Weekly review: top 3 posts, what worked, what to double down on.
