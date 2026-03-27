const LANGGRAPH_API_URL = process.env.LANGGRAPH_API_URL || "";
const LANGGRAPH_API_KEY = process.env.LANGGRAPH_API_KEY || "";

export interface LangGraphThread {
  thread_id: string;
  status: "idle" | "busy" | "interrupted" | "error";
  created_at: string;
  metadata: Record<string, any>;
}

export interface LangGraphRun {
  run_id: string;
  thread_id: string;
  status: "pending" | "running" | "success" | "error" | "timeout";
  created_at: string;
  updated_at: string;
  result?: any;
  error?: string;
}

async function lgFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  if (!LANGGRAPH_API_URL) throw new Error("LANGGRAPH_API_URL is not configured");

  const res = await fetch(`${LANGGRAPH_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(LANGGRAPH_API_KEY ? { "x-api-key": LANGGRAPH_API_KEY } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LangGraph API ${res.status}: ${body}`);
  }

  return res.json();
}

// ─── Thread Management ──────────────────────────────────────

export async function createThread(metadata?: Record<string, any>): Promise<LangGraphThread> {
  return lgFetch<LangGraphThread>("/threads", {
    method: "POST",
    body: JSON.stringify({ metadata: metadata || {} }),
  });
}

export async function getThread(threadId: string): Promise<LangGraphThread> {
  return lgFetch<LangGraphThread>(`/threads/${threadId}`);
}

// ─── Run Management ─────────────────────────────────────────

export async function createRun(
  threadId: string,
  assistantId: string,
  input: Record<string, any>,
  config?: Record<string, any>
): Promise<LangGraphRun> {
  return lgFetch<LangGraphRun>(`/threads/${threadId}/runs`, {
    method: "POST",
    body: JSON.stringify({
      assistant_id: assistantId,
      input,
      config: config || {},
    }),
  });
}

export async function getRun(threadId: string, runId: string): Promise<LangGraphRun> {
  return lgFetch<LangGraphRun>(`/threads/${threadId}/runs/${runId}`);
}

export async function waitForRun(
  threadId: string,
  runId: string,
  timeoutMs = 300_000
): Promise<LangGraphRun> {
  return lgFetch<LangGraphRun>(`/threads/${threadId}/runs/${runId}/join`, {
    signal: AbortSignal.timeout(timeoutMs),
  });
}

export async function cancelRun(threadId: string, runId: string): Promise<void> {
  await lgFetch(`/threads/${threadId}/runs/${runId}/cancel`, { method: "POST" });
}

// ─── Stateless invocation (fire-and-forget or synchronous) ──

export async function invokeGraph(
  assistantId: string,
  input: Record<string, any>,
  config?: Record<string, any>
): Promise<any> {
  const thread = await createThread({ assistantId });
  const run = await createRun(thread.thread_id, assistantId, input, config);
  const result = await waitForRun(thread.thread_id, run.run_id);

  if (result.status === "error") {
    throw new Error(`LangGraph run failed: ${result.error}`);
  }

  return result.result;
}

// ─── Graph IDs for each recipe ──────────────────────────────

export const GRAPH_IDS = {
  rateIncreaseMonitor: "rate-increase-monitor",
  crossSellIntelligence: "cross-sell-intelligence",
  marketResearchAlerts: "market-research-alerts",
} as const;
