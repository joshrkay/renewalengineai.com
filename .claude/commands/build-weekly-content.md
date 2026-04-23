---
description: Draft the next pillar resource article from the backlog. Researches via WebSearch, writes markdown, commits to a branch, opens a PR for review.
---

You are running the weekly content engine for renewalengineai.com.

## Steps — execute in order, do not skip

1. **Pick the next topic.** Read `content/resources/_backlog.json`. Pick the highest-priority entry where `status === "pending"` and no file matching `content/resources/{slug}.md` exists yet. If none found, stop with "Backlog empty."

2. **Research the topic.** Use the `WebSearch` tool with the topic's `primaryKeyword` and note 4-6 credible sources. Capture url + title + short summary for each. Prefer industry-specific sources (IIABA, Insurance Journal, Applied Systems, HawkSoft, EZLynx, Rough Notes) over general business-news sources.

3. **Draft the article via the shared engine.** Run:

   ```bash
   CLAUDE_CODE_RESEARCH='<findings json>' npx tsx -e '
     import("./src/lib/content-generation/run.ts").then(({ generateWeeklyContent }) =>
       generateWeeklyContent({ trigger: "loop", dryRun: true, searchProvider: "claude-code" })
     );
   '
   ```

   Where `<findings json>` is a JSON array of `{url, title, snippet}` objects from step 2.

   Alternative (simpler, if the above hits node-loader friction): invoke the drafter directly using `npx tsx scripts/generate-weekly-content.ts --dry-run --no-research`. The drafter will skip external research and rely on house knowledge.

4. **Verify the output.** The drafter wrote `content/resources/{slug}.md`. Open it and sanity-check:
   - Frontmatter parses (title, slug, description, publishedAt, category, primaryKeyword, readTime).
   - Word count 1500-2500.
   - At least 3 H2 sections.
   - At least 3 internal links to `/`, `/#pricing`, `/courses/...`, `/mastermind`, `/how-it-works`, `/for-independent-agencies`, or other `/resources/{slug}`.
   - No em-dashes, no banned cliches from `src/lib/content-generation/system-prompt.ts`.
   - Claims match our verified numbers (15-20% retention, 391% conversions, <60s response, $1,500/$6,000/$2,500).

5. **Update the backlog.** Set the topic's `status` to `"drafted"` and add `draftedAt` (ISO 8601 UTC).

6. **Branch + commit + push + PR.** Use the MCP GitHub tools where possible.
   - Branch name: `auto/loop-resource-{slug}-{YYYY}w{WW}` (ISO week).
   - Commit author: your own identity (the user is running this, so their committer info is fine).
   - Commit message: `feat(resources): auto-draft {title}`.
   - Stage: `content/resources/{slug}.md` and `content/resources/_backlog.json`.
   - Push to origin, open PR via `mcp__github__create_pull_request` against the default branch.
   - PR title: `Auto-draft: {title}`
   - PR body: include word count, category, primary keyword, sources list, and a review checklist (tone, claims, links, no banned phrases, table/list present, closing CTA).

7. **Report.** Output the PR URL and a one-line summary. Do not merge the PR — reviewer approval is required.

## Rules

- **Never auto-merge.** All generated content goes through human review.
- **Don't invent pricing, outcomes, or product features.** Stick to what's in `src/lib/content-generation/system-prompt.ts`.
- **If the backlog is empty, stop.** Don't generate a topic the user hasn't approved.
- **If the WebSearch returns nothing useful, say so** — draft from house knowledge only and mention the gap in the PR body so the reviewer knows.
