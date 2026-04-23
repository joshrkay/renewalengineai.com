import { NextRequest, NextResponse } from "next/server";
import { log } from "@/lib/logger";
import { generateWeeklyContent } from "@/lib/content-generation/run";

// Serverless cron path for the weekly content engine. Redundant with the
// GitHub Actions workflow — the kill-switch env var lets you disable one
// side without a deploy.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Generating an article with adaptive thinking can take ~60-90s; bump the
// Vercel function duration ceiling above the default.
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (process.env.CONTENT_GEN_DISABLED === "1") {
    return NextResponse.json({ skipped: "CONTENT_GEN_DISABLED" });
  }

  const dryRun = req.nextUrl.searchParams.get("dry-run") === "1";

  const githubRepo = process.env.GITHUB_REPOSITORY ?? "joshrkay/renewalengineai.com";
  const githubToken = process.env.GH_PAT;
  const baseBranch = process.env.CONTENT_BASE_BRANCH ?? "main";

  const github =
    !dryRun && githubToken
      ? (() => {
          const [owner, repo] = githubRepo.split("/");
          return { owner, repo, token: githubToken, baseBranch };
        })()
      : undefined;

  if (!dryRun && !github) {
    log.error("generate-content cron: GH_PAT not set; refusing to run");
    return NextResponse.json(
      { error: "missing_gh_pat" },
      { status: 500 }
    );
  }

  try {
    const result = await generateWeeklyContent({
      trigger: "vercel-cron",
      dryRun,
      searchProvider: "tavily",
      github,
    });

    if (!result) {
      return NextResponse.json({ status: "no_pending_topics" });
    }

    return NextResponse.json({
      status: "ok",
      slug: result.article.slug,
      words: result.article.wordCount,
      prUrl: result.prUrl,
    });
  } catch (error) {
    log.error("generate-content cron failed:", error);
    return NextResponse.json(
      { error: "generation_failed" },
      { status: 500 }
    );
  }
}
