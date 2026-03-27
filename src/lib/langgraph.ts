/**
 * LangGraph API client for AI-powered workflow execution.
 *
 * LangGraph handles AI-heavy tasks like:
 * - Market research and rate analysis
 * - Cross-sell intelligence (coverage gap analysis)
 * - Content generation for outbound campaigns
 *
 * The LangGraph service is a separate Python/FastAPI deployment
 * that hosts LangGraph agents and communicates via REST API.
 */

const LANGGRAPH_API_URL = process.env.LANGGRAPH_API_URL || "";
const LANGGRAPH_API_KEY = process.env.LANGGRAPH_API_KEY || "";

interface LangGraphTask {
  taskId: string;
  status: "queued" | "running" | "completed" | "failed";
  result?: any;
}

async function langGraphFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${LANGGRAPH_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LANGGRAPH_API_KEY}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LangGraph API error ${res.status}: ${body}`);
  }

  return res.json();
}

export async function submitTask(
  agentId: string,
  input: Record<string, any>
): Promise<LangGraphTask> {
  return langGraphFetch("/tasks", {
    method: "POST",
    body: JSON.stringify({ agentId, input }),
  });
}

export async function getTaskStatus(taskId: string): Promise<LangGraphTask> {
  return langGraphFetch(`/tasks/${taskId}`);
}

export async function cancelTask(taskId: string): Promise<void> {
  await langGraphFetch(`/tasks/${taskId}/cancel`, { method: "POST" });
}
