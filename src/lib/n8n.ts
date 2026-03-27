import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/encryption";

const N8N_BASE_URL = process.env.N8N_BASE_URL || "";
const N8N_API_KEY = process.env.N8N_API_KEY || "";
const WEBHOOK_BASE_URL = process.env.NEXTAUTH_URL || "https://renewalengineai.com";

export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: any[];
  connections: Record<string, any>;
  settings?: Record<string, any>;
  tags?: { id: string; name: string }[];
}

export interface N8nCredential {
  id: string;
  name: string;
  type: string;
}

export interface N8nExecution {
  id: string;
  finished: boolean;
  mode: string;
  status: string;
  startedAt: string;
  stoppedAt: string | null;
  workflowId: string;
  data?: any;
}

async function n8nFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  if (!N8N_BASE_URL) throw new Error("N8N_BASE_URL is not configured");
  if (!N8N_API_KEY) throw new Error("N8N_API_KEY is not configured");

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
    throw new Error(`n8n API ${res.status}: ${body}`);
  }

  return res.json();
}

// ─── Credential Management ─────────────────────────────────

const CREDENTIAL_TYPE_MAP: Record<string, string> = {
  GMAIL: "googleOAuth2Api",
  OUTLOOK: "microsoftOAuth2Api",
  HUBSPOT: "hubspotOAuth2Api",
  SALESFORCE: "salesforceOAuth2Api",
  TWILIO: "twilioApi",
  APPLIED_EPIC: "httpHeaderAuth",
  HAWKSOFT: "httpHeaderAuth",
  EZLYNX: "httpHeaderAuth",
};

export async function createN8nCredential(
  orgId: string,
  provider: string,
  name: string
): Promise<N8nCredential> {
  const connection = await prisma.oAuthConnection.findUnique({
    where: { organizationId_provider: { organizationId: orgId, provider: provider as any } },
  });

  if (!connection) throw new Error(`No ${provider} connection found for org ${orgId}`);

  const credType = CREDENTIAL_TYPE_MAP[provider] || "httpHeaderAuth";
  const accessToken = decrypt(connection.accessToken);
  const refreshToken = connection.refreshToken ? decrypt(connection.refreshToken) : undefined;

  const credentialData: Record<string, any> = { accessToken };
  if (refreshToken) credentialData.refreshToken = refreshToken;
  if (connection.scopes) credentialData.scope = connection.scopes;

  return n8nFetch<N8nCredential>("/credentials", {
    method: "POST",
    body: JSON.stringify({
      name: `${name} - ${provider}`,
      type: credType,
      data: credentialData,
    }),
  });
}

export async function deleteN8nCredential(credentialId: string): Promise<void> {
  await n8nFetch(`/credentials/${credentialId}`, { method: "DELETE" });
}

// ─── Workflow Management ────────────────────────────────────

export async function getWorkflow(workflowId: string): Promise<N8nWorkflow> {
  return n8nFetch<N8nWorkflow>(`/workflows/${workflowId}`);
}

export async function createWorkflowFromTemplate(
  templateWorkflowId: string,
  name: string,
  orgId: string,
  config: Record<string, any>,
  credentialIds: Record<string, string>
): Promise<N8nWorkflow> {
  const template = await getWorkflow(templateWorkflowId);

  // Inject credentials into nodes that need them
  const nodes = template.nodes.map((node: any) => {
    const updatedNode = { ...node };

    // Map credential references to the org's provisioned credentials
    if (updatedNode.credentials) {
      for (const [credKey, credVal] of Object.entries(updatedNode.credentials as Record<string, any>)) {
        const matchingCredId = Object.entries(credentialIds).find(
          ([provider]) => CREDENTIAL_TYPE_MAP[provider] === credKey || credKey.toLowerCase().includes(provider.toLowerCase())
        );
        if (matchingCredId) {
          updatedNode.credentials[credKey] = { id: matchingCredId[1], name: credKey };
        }
      }
    }

    // Inject the webhook callback URL into HTTP Request nodes that post results
    if (updatedNode.type === "n8n-nodes-base.httpRequest" && updatedNode.name?.includes("Callback")) {
      updatedNode.parameters = {
        ...updatedNode.parameters,
        url: `${WEBHOOK_BASE_URL}/api/webhooks/n8n/${templateWorkflowId}`,
      };
    }

    // Inject user config into Set nodes named "Config"
    if (updatedNode.type === "n8n-nodes-base.set" && updatedNode.name === "Config") {
      updatedNode.parameters = {
        ...updatedNode.parameters,
        values: {
          ...updatedNode.parameters?.values,
          ...config,
        },
      };
    }

    return updatedNode;
  });

  const workflow = await n8nFetch<N8nWorkflow>("/workflows", {
    method: "POST",
    body: JSON.stringify({
      name,
      nodes,
      connections: template.connections,
      settings: {
        ...template.settings,
        executionOrder: "v1",
      },
    }),
  });

  return workflow;
}

export async function activateWorkflow(workflowId: string): Promise<N8nWorkflow> {
  return n8nFetch<N8nWorkflow>(`/workflows/${workflowId}/activate`, { method: "POST" });
}

export async function deactivateWorkflow(workflowId: string): Promise<N8nWorkflow> {
  return n8nFetch<N8nWorkflow>(`/workflows/${workflowId}/deactivate`, { method: "POST" });
}

export async function deleteWorkflow(workflowId: string): Promise<void> {
  await n8nFetch(`/workflows/${workflowId}`, { method: "DELETE" });
}

export async function executeWorkflow(workflowId: string, data?: Record<string, any>): Promise<N8nExecution> {
  return n8nFetch<N8nExecution>(`/executions`, {
    method: "POST",
    body: JSON.stringify({
      workflowId,
      data: data || {},
    }),
  });
}

// ─── Execution Tracking ─────────────────────────────────────

export async function getExecution(executionId: string): Promise<N8nExecution> {
  return n8nFetch<N8nExecution>(`/executions/${executionId}`);
}

export async function getWorkflowExecutions(
  workflowId: string,
  limit = 20
): Promise<{ data: N8nExecution[]; nextCursor?: string }> {
  return n8nFetch(`/executions?workflowId=${workflowId}&limit=${limit}`);
}

export async function updateWorkflowNodes(
  workflowId: string,
  updates: { nodes?: any[]; settings?: Record<string, any> }
): Promise<N8nWorkflow> {
  return n8nFetch<N8nWorkflow>(`/workflows/${workflowId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}
