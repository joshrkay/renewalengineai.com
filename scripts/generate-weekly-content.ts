/**
 * Entry point for the GitHub Actions weekly content workflow.
 *
 * Env:
 *   ANTHROPIC_API_KEY — required
 *   TAVILY_API_KEY    — required unless --no-research
 *   GITHUB_TOKEN      — provided by Actions automatically
 *   GITHUB_REPOSITORY — e.g. "joshrkay/renewalengineai.com" (provided by Actions)
 *   GITHUB_REF_NAME   — base branch (provided by Actions); defaults to "main"
 *
 * Flags:
 *   --dry-run       skip git commit and PR creation, just write the markdown file
 *   --no-research   skip Tavily research (use house knowledge only)
 *
 * Usage:
 *   npx tsx scripts/generate-weekly-content.ts
 *   npx tsx scripts/generate-weekly-content.ts --dry-run
 */
import { generateWeeklyContent } from "../src/lib/content-generation/run";

async function main() {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes("--dry-run");
  const noResearch = argv.includes("--no-research");

  const githubRepo = process.env.GITHUB_REPOSITORY;
  const githubToken = process.env.GITHUB_TOKEN;
  const baseBranch = process.env.CONTENT_BASE_BRANCH ?? "main";

  const github =
    !dryRun && githubRepo && githubToken
      ? (() => {
          const [owner, repo] = githubRepo.split("/");
          return { owner, repo, token: githubToken, baseBranch };
        })()
      : undefined;

  if (!dryRun && !github) {
    console.error(
      "Refusing to run non-dry-run without GITHUB_REPOSITORY and GITHUB_TOKEN set."
    );
    process.exit(1);
  }

  const result = await generateWeeklyContent({
    trigger: "github-actions",
    dryRun,
    searchProvider: noResearch ? "none" : "tavily",
    github,
  });

  if (!result) {
    console.log("No action taken (empty backlog).");
    process.exit(0);
  }

  console.log("Done.");
  console.log(JSON.stringify(
    { slug: result.article.slug, words: result.article.wordCount, prUrl: result.prUrl },
    null,
    2
  ));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
