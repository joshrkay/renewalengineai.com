/**
 * n8n API client for managing workflows programmatically.
 *
 * Uses n8n's REST API and MCP Server Trigger nodes for:
 * - Provisioning workflows from templates
 * - Activating/deactivating workflows
 * - Injecting user-specific credentials and config
 * - Monitoring execution status
 *
 * @see https://docs.n8n.io/advanced-ai/accessing-n8n-mcp-server/
 */

const N8N_BASE_URL = process.env.N8N_BASE_URL || "";
const N8N_API_KEY = process.env.N8N_API_KEY || "";

interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
}

async function n8nFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${N8N_BASE_URL}/api/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": N8N_API_KEY,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`n8n API error ${res.status}: ${body}`);
  }

  return res.json();
}

export async function getWorkflow(workflowId: string): Promise<N8nWorkflow> {
  return n8nFetch(`/workflows/${workflowId}`);
}

export async function activateWorkflow(workflowId: string): Promise<void> {
  await n8nFetch(`/workflows/${workflowId}/activate`, { method: "POST" });
}

export async function deactivateWorkflow(workflowId: string): Promise<void> {
  await n8nFetch(`/workflows/${workflowId}/deactivate`, { method: "POST" });
}

export async function duplicateWorkflow(
  sourceWorkflowId: string,
  name: string
): Promise<N8nWorkflow> {
  // Get the source workflow
  const source = await n8nFetch(`/workflows/${sourceWorkflowId}`);

  // Create a new workflow based on the source
  const newWorkflow = await n8nFetch("/workflows", {
    method: "POST",
    body: JSON.stringify({
      name,
      nodes: source.nodes,
      connections: source.connections,
      settings: source.settings,
    }),
  });

  return newWorkflow;
}

export async function getWorkflowExecutions(
  workflowId: string,
  limit = 10
): Promise<any[]> {
  const data = await n8nFetch(
    `/executions?workflowId=${workflowId}&limit=${limit}`
  );
  return data.data || [];
}
