import { NextRequest, NextResponse } from "next/server";
import { log } from "@/lib/logger";
import { generateWeeklyContent } from "@/lib/content-generation/run";
import { isAuthorizedCron } from "@/lib/cron-auth";

// Serverless cron path for the weekly content engine. Redundant with the
// GitHub Actions workflow — the kill-switch env var lets you disable one
// side without a deploy.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Vercel Pro tier default is 60s; higher values require Fluid Compute
// to be enabled on the project and fail the deploy when it isn't.
// If generation times out, enable Fluid Compute in the Vercel dashboard
// and raise this to 300. GitHub Actions is the primary trigger anyway;
// this cron is a backup and only runs once per week.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (process.env.CONTENT_GEN_DISABLED === "1") {
    return NextResponse.json({ skipped: "CONTENT_GEN_DISABLED" });
  }

  const dryRun = req.nextUrl.searchParams.get("dry-run") === "1";

  const githubRepo = process.env.GITHUB_REPOSITORY;
  const githubToken = process.env.GH_PAT;
  const baseBranch = process.env.CONTENT_BASE_BRANCH ?? "main";

  // In non-dry-run mode, fail fast if either piece of the GitHub config is
  // missing. A hardcoded repo fallback would silently push to the wrong
  // repository if the env var got dropped in a misconfigured deploy.
  if (!dryRun) {
    if (!githubRepo) {
      log.error("generate-content cron: GITHUB_REPOSITORY not set");
      return NextResponse.json(
        { error: "missing_github_repository" },
        { status: 500 }
      );
    }
    if (!githubToken) {
      log.error("generate-content cron: GH_PAT not set");
      return NextResponse.json(
        { error: "missing_gh_pat" },
        { status: 500 }
      );
    }
  }

  const github =
    !dryRun && githubRepo && githubToken
      ? (() => {
          const [owner, repo] = githubRepo.split("/");
          return { owner, repo, token: githubToken, baseBranch };
        })()
      : undefined;

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
