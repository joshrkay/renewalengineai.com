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
  projectId?: string;
}

export interface N8nCredential {
  id: string;
  name: string;
  type: string;
}

export interface N8nProject {
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

// ─── Project Management (Per-Org Isolation) ─────────────────

export async function createProject(orgId: string, orgName: string): Promise<N8nProject> {
  return n8nFetch<N8nProject>("/projects", {
    method: "POST",
    body: JSON.stringify({ name: `tenant-${orgId} | ${orgName}` }),
  });
}

export async function getProject(projectId: string): Promise<N8nProject> {
  return n8nFetch<N8nProject>(`/projects/${projectId}`);
}

export async function deleteProject(projectId: string): Promise<void> {
  await n8nFetch(`/projects/${projectId}`, { method: "DELETE" });
}

/**
 * Ensures the org has an n8n Project. Creates one if it doesn't exist.
 * Stores the projectId on the Organization record.
 */
export async function ensureOrgProject(orgId: string): Promise<string> {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org) throw new Error(`Organization ${orgId} not found`);

  if (org.n8nProjectId) {
    return org.n8nProjectId;
  }

  const project = await createProject(orgId, org.name);

  await prisma.organization.update({
    where: { id: orgId },
    data: { n8nProjectId: project.id },
  });

  return project.id;
}

// ─── Credential Management (Project-Scoped) ────────────────

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
  const projectId = await ensureOrgProject(orgId);

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
      projectId,
    }),
  });
}

export async function deleteN8nCredential(credentialId: string): Promise<void> {
  await n8nFetch(`/credentials/${credentialId}`, { method: "DELETE" });
}

export async function deleteN8nCredentials(credentialIds: string[]): Promise<void> {
  for (const id of credentialIds) {
    try {
      await deleteN8nCredential(id);
    } catch (e) {
      console.error(`Failed to delete n8n credential ${id} (non-fatal):`, e);
    }
  }
}

// ─── Workflow Management (Project-Scoped) ───────────────────

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
  const projectId = await ensureOrgProject(orgId);
  const template = await getWorkflow(templateWorkflowId);
  const webhookSecret = process.env.WEBHOOK_SECRET || "";

  const nodes = template.nodes.map((node: any) => {
    const updatedNode = { ...node };

    if (updatedNode.credentials) {
      for (const [credKey] of Object.entries(updatedNode.credentials as Record<string, any>)) {
        const matchingCredId = Object.entries(credentialIds).find(
          ([provider]) => CREDENTIAL_TYPE_MAP[provider] === credKey || credKey.toLowerCase().includes(provider.toLowerCase())
        );
        if (matchingCredId) {
          updatedNode.credentials[credKey] = { id: matchingCredId[1], name: credKey };
        }
      }
    }

    if (updatedNode.type === "n8n-nodes-base.set" && updatedNode.name === "Config") {
      updatedNode.parameters = {
        ...updatedNode.parameters,
        values: {
          ...updatedNode.parameters?.values,
          ...config,
          _orgId: orgId,
        },
      };
    }

    return updatedNode;
  });

  // Create workflow inside the org's project
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
      projectId,
    }),
  });

  // Patch callback nodes with actual workflow ID and HMAC signature
  const patchedNodes = workflow.nodes.map((node: any) => {
    if (node.type === "n8n-nodes-base.httpRequest" && node.name?.includes("Callback")) {
      return {
        ...node,
        parameters: {
          ...node.parameters,
          url: `${WEBHOOK_BASE_URL}/api/webhooks/n8n/${workflow.id}`,
          sendHeaders: true,
          headerParameters: {
            parameters: [
              { name: "x-webhook-signature", value: `={{$json.signature || "${webhookSecret}" }}` },
            ],
          },
        },
      };
    }
    return node;
  });

  await updateWorkflowNodes(workflow.id, { nodes: patchedNodes });

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
  return n8nFetch<N8nExecution>("/executions", {
    method: "POST",
    body: JSON.stringify({ workflowId, data: data || {} }),
  });
}

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
