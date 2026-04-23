export type Trigger = "github-actions" | "vercel-cron" | "loop" | "manual";

export type BacklogStatus = "pending" | "drafted" | "published" | "skipped";

export type BacklogItem = {
  slug: string;
  title: string;
  description: string;
  primaryKeyword: string;
  category: string;
  priority: number;
  status: BacklogStatus;
  notes?: string;
  draftedAt?: string;
  prUrl?: string;
};

export type Backlog = {
  topics: BacklogItem[];
};

export type ResearchResult = {
  topic: BacklogItem;
  findings: ResearchFinding[];
};

export type ResearchFinding = {
  url: string;
  title: string;
  snippet: string;
};

export type DraftedArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  primaryKeyword: string;
  readTime: number;
  publishedAt: string;
  body: string;
  /** The final markdown file contents, ready to write verbatim. */
  rawMarkdown: string;
  sources: ResearchFinding[];
  wordCount: number;
};

export type GenerationResult = {
  trigger: Trigger;
  article: DraftedArticle;
  branch: string;
  prUrl?: string;
  filePath: string;
};
