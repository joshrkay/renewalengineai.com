import fs from "node:fs";
import path from "node:path";
import type { Backlog, BacklogItem, BacklogStatus } from "./types";

const BACKLOG_PATH = path.join(
  process.cwd(),
  "content",
  "resources",
  "_backlog.json"
);

export function readBacklog(): Backlog {
  if (!fs.existsSync(BACKLOG_PATH)) return { topics: [] };
  const raw = fs.readFileSync(BACKLOG_PATH, "utf-8");
  return JSON.parse(raw) as Backlog;
}

export function writeBacklog(backlog: Backlog): void {
  fs.writeFileSync(BACKLOG_PATH, JSON.stringify(backlog, null, 2) + "\n");
}

/**
 * Pick the next topic to draft — highest priority, status === "pending",
 * not already matching a slug that exists under content/resources/.
 */
export function nextPendingTopic(backlog: Backlog): BacklogItem | undefined {
  const existingSlugs = new Set(
    fs
      .readdirSync(path.join(process.cwd(), "content", "resources"))
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
      .map((f) => f.replace(/\.md$/, ""))
  );

  return backlog.topics
    .filter((t) => t.status === "pending" && !existingSlugs.has(t.slug))
    .sort((a, b) => b.priority - a.priority)[0];
}

export function updateTopicStatus(
  backlog: Backlog,
  slug: string,
  updates: Partial<Pick<BacklogItem, "status" | "draftedAt" | "prUrl" | "notes">>
): Backlog {
  return {
    topics: backlog.topics.map((t) =>
      t.slug === slug ? { ...t, ...updates } : t
    ),
  };
}

export function markDrafted(slug: string, prUrl?: string): void {
  const backlog = readBacklog();
  const updated = updateTopicStatus(backlog, slug, {
    status: "drafted",
    draftedAt: new Date().toISOString(),
    prUrl,
  });
  writeBacklog(updated);
}

export { BACKLOG_PATH };
export type { BacklogStatus };
