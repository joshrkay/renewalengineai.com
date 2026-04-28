import { nextPendingTopic, readBacklog, updateTopicStatus } from "./backlog";
import { researchTopic } from "./search";
import { draftArticle } from "./draft";
import { draftLinkedInPost } from "./linkedin";
import { writeLocal, openPullRequest, openPullRequestViaAPI } from "./commit";
import type { GenerationResult, Trigger } from "./types";

type RunOptions = {
  trigger: Trigger;
  /** If true, skip PR creation and just write the markdown file locally. */
  dryRun?: boolean;
  searchProvider?: "tavily" | "claude-code" | "none";
  github?: {
    owner: string;
    repo: string;
    token: string;
    baseBranch: string;
  };
};

export async function generateWeeklyContent(
  opts: RunOptions
): Promise<GenerationResult | null> {
  const backlog = readBacklog();
  const topic = nextPendingTopic(backlog);

  if (!topic) {
    console.log("[run] no pending topics in backlog — nothing to do");
    return null;
  }

  console.log(`[run] picked topic: ${topic.slug} (${topic.title})`);

  const provider = opts.searchProvider ?? "tavily";
  console.log(`[run] research via ${provider}`);
  const research = await researchTopic(topic, provider);
  console.log(`[run] ${research.findings.length} research findings`);

  const article = await draftArticle(research);
  console.log(
    `[run] drafted ${article.wordCount} words (${article.readTime} min read)`
  );

  // Draft LinkedIn post alongside the article. Errors are non-fatal —
  // the article ships regardless, and the PR body will show a placeholder.
  try {
    article.linkedInPost = await draftLinkedInPost(article);
    console.log("[run] LinkedIn post drafted");
  } catch (err) {
    console.warn("[run] LinkedIn post draft failed (non-fatal):", err);
  }

  if (opts.dryRun || !opts.github) {
    // Serverless file systems (Vercel) are read-only; skip the local write
    // in that environment and return the article in memory. The local /loop
    // and GitHub Actions paths still write to disk for easy review.
    const canWriteLocal = opts.trigger !== "vercel-cron";
    const filePath = canWriteLocal
      ? writeLocal(article)
      : `content/resources/${article.slug}.md`;
    console.log(
      canWriteLocal
        ? `[run] dry-run: wrote ${filePath}`
        : `[run] dry-run (serverless): skipped local write; article held in memory`
    );
    return {
      trigger: opts.trigger,
      article,
      branch: "(dry-run)",
      filePath,
    };
  }

  // Serverless triggers (Vercel Cron) can't shell out to git — use the
  // pure-Octokit commit path. Triggers with a real working tree (GitHub
  // Actions, local /loop) use local git for commits identical to a human's.
  let prUrl: string;
  if (opts.trigger === "vercel-cron") {
    const updatedBacklog = updateTopicStatus(backlog, topic.slug, {
      status: "drafted",
      draftedAt: new Date().toISOString(),
    });
    prUrl = await openPullRequestViaAPI(
      article,
      { ...opts.github, trigger: opts.trigger },
      JSON.stringify(updatedBacklog, null, 2) + "\n"
    );
  } else {
    prUrl = await openPullRequest(article, {
      ...opts.github,
      trigger: opts.trigger,
    });
  }

  console.log(`[run] PR opened: ${prUrl}`);

  return {
    trigger: opts.trigger,
    article,
    branch: "(see PR)",
    prUrl,
    filePath: `content/resources/${article.slug}.md`,
  };
}
