import { prisma } from "@/lib/db";
import * as n8n from "@/lib/n8n";
import * as langgraph from "@/lib/langgraph";
import { logAudit } from "@/lib/audit";
import { log } from "@/lib/logger";

const TIER_RANK: Record<string, number> = { AUDIT: 1, SPRINT: 2, MANAGED: 3 };

export interface ActivationResult {
  instanceId: string;
  status: string;
  n8nWorkflowId?: string;
  langGraphThreadId?: string;
}

// ─── Validation ─────────────────────────────────────────────

export async function validateActivation(orgId: string, recipeId: string) {
  const recipe = await prisma.automationRecipe.findUnique({ where: { id: recipeId } });
  if (!recipe) throw new ActivationError("recipe_not_found", "Recipe not found", 404);

  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org) throw new ActivationError("org_not_found", "Organization not found", 404);

  const userRank = TIER_RANK[org.subscriptionTier] || 0;
  const requiredRank = TIER_RANK[recipe.minimumTier] || 0;
  if (userRank < requiredRank) {
    throw new ActivationError(
      "insufficient_tier",
      `This recipe requires the ${recipe.minimumTier} plan. You are on ${org.subscriptionTier}.`,
      403
    );
  }

  const required = (recipe.requiredIntegrations as any as string[]) || [];
  if (required.length > 0) {
    const connections = await prisma.oAuthConnection.findMany({
      where: { organizationId: orgId, status: "CONNECTED" },
    });
    const connected = connections.map((c) => c.provider.toLowerCase());
    const missing = required.filter((i) => !connected.includes(i.toLowerCase()));
    if (missing.length > 0) {
      throw new ActivationError(
        "missing_integrations",
        `Missing required integrations: ${missing.join(", ")}`,
        400,
        { missing }
      );
    }
  }

  const existing = await prisma.automationInstance.findUnique({
    where: { organizationId_recipeId: { organizationId: orgId, recipeId } },
  });
  if (existing && (existing.status === "ACTIVE" || existing.status === "PENDING")) {
    throw new ActivationError("already_activated", "This recipe is already active", 409);
  }

  return { recipe, org };
}

// ─── Activation ─────────────────────────────────────────────

export async function activateRecipe(
  orgId: string,
  recipeId: string,
  userConfig?: Record<string, any>
): Promise<ActivationResult> {
  const { recipe, org } = await validateActivation(orgId, recipeId);

  // Ensure org has an n8n project for data isolation
  await n8n.ensureOrgProject(orgId);

  let n8nWorkflowId: string | undefined;
  let langGraphThreadId: string | undefined;
  const n8nCredentialIds: string[] = [];

  const instanceName = `${recipe.name}`;
  const mergedConfig = { ...(recipe.config as any), ...userConfig };

  // Provision n8n workflow (for N8N and HYBRID recipes)
  if (recipe.engineType === "N8N" || recipe.engineType === "HYBRID") {
    if (recipe.n8nTemplateId) {
      const required = (recipe.requiredIntegrations as any as string[]) || [];
      const credentialIds: Record<string, string> = {};

      for (const provider of required) {
        const providerEnum = provider.toUpperCase();
        const connection = await prisma.oAuthConnection.findFirst({
          where: { organizationId: orgId, provider: providerEnum as any, status: "CONNECTED" },
        });
        if (connection) {
          const cred = await n8n.createN8nCredential(orgId, providerEnum, instanceName);
          credentialIds[providerEnum] = cred.id;
          n8nCredentialIds.push(cred.id);
        }
      }

      const workflow = await n8n.createWorkflowFromTemplate(
        recipe.n8nTemplateId,
        instanceName,
        orgId,
        mergedConfig,
        credentialIds
      );
      n8nWorkflowId = workflow.id;

      await n8n.activateWorkflow(workflow.id);
    }
  }

  // Provision LangGraph thread (for LANGGRAPH and HYBRID recipes)
  if (recipe.engineType === "LANGGRAPH" || recipe.engineType === "HYBRID") {
    if (recipe.langGraphId) {
      const thread = await langgraph.createThread({
        orgId,
        recipeSlug: recipe.slug,
        config: mergedConfig,
      });
      langGraphThreadId = thread.thread_id;
    }
  }

  // Persist everything — workflow ID, credential IDs, and LangGraph thread ID are all tracked
  const instance = await prisma.automationInstance.upsert({
    where: { organizationId_recipeId: { organizationId: orgId, recipeId } },
    create: {
      organizationId: orgId,
      recipeId,
      status: "ACTIVE",
      config: mergedConfig,
      n8nWorkflowId: n8nWorkflowId || null,
      n8nCredentialIds: n8nCredentialIds,
      langGraphThreadId: langGraphThreadId || null,
    },
    update: {
      status: "ACTIVE",
      config: mergedConfig,
      n8nWorkflowId: n8nWorkflowId || null,
      n8nCredentialIds: n8nCredentialIds,
      langGraphThreadId: langGraphThreadId || null,
    },
  });

  await logAudit({
    organizationId: orgId,
    action: "automation.activated",
    resource: "AutomationInstance",
    resourceId: instance.id,
    metadata: { recipeSlug: recipe.slug, engineType: recipe.engineType },
  });

  return {
    instanceId: instance.id,
    status: instance.status,
    n8nWorkflowId,
    langGraphThreadId,
  };
}

// ─── Pause ──────────────────────────────────────────────────

export async function pauseAutomation(instanceId: string, orgId: string): Promise<void> {
  const instance = await prisma.automationInstance.findFirst({
    where: { id: instanceId, organizationId: orgId },
    include: { recipe: true },
  });
  if (!instance) throw new ActivationError("not_found", "Automation not found", 404);

  if (instance.n8nWorkflowId && (instance.recipe.engineType === "N8N" || instance.recipe.engineType === "HYBRID")) {
    await n8n.deactivateWorkflow(instance.n8nWorkflowId);
  }

  await prisma.automationInstance.update({
    where: { id: instanceId },
    data: { status: "PAUSED" },
  });
}

// ─── Resume ─────────────────────────────────────────────────

export async function resumeAutomation(instanceId: string, orgId: string): Promise<void> {
  const instance = await prisma.automationInstance.findFirst({
    where: { id: instanceId, organizationId: orgId },
    include: { recipe: true },
  });
  if (!instance) throw new ActivationError("not_found", "Automation not found", 404);

  if (instance.n8nWorkflowId && (instance.recipe.engineType === "N8N" || instance.recipe.engineType === "HYBRID")) {
    await n8n.activateWorkflow(instance.n8nWorkflowId);
  }

  await prisma.automationInstance.update({
    where: { id: instanceId },
    data: { status: "ACTIVE" },
  });
}

// ─── Deactivate (full teardown — workflow + credentials) ────

export async function deactivateAutomation(instanceId: string, orgId: string): Promise<void> {
  const instance = await prisma.automationInstance.findFirst({
    where: { id: instanceId, organizationId: orgId },
    include: { recipe: true },
  });
  if (!instance) throw new ActivationError("not_found", "Automation not found", 404);

  // Delete the n8n workflow
  if (instance.n8nWorkflowId && (instance.recipe.engineType === "N8N" || instance.recipe.engineType === "HYBRID")) {
    try {
      await n8n.deactivateWorkflow(instance.n8nWorkflowId);
      await n8n.deleteWorkflow(instance.n8nWorkflowId);
    } catch (e) {
      log.error("n8n workflow cleanup error (non-fatal):", (e as Error).message);
    }
  }

  // Delete all n8n credentials created for this instance
  const credIds = (instance.n8nCredentialIds as string[]) || [];
  if (credIds.length > 0) {
    await n8n.deleteN8nCredentials(credIds);
  }

  // Clean up workflow runs, then delete the instance
  await prisma.workflowRun.deleteMany({ where: { automationInstanceId: instanceId } });
  await prisma.automationInstance.delete({ where: { id: instanceId } });
}

// ─── Run a LangGraph recipe on-demand or via cron ───────────

export async function runLangGraphRecipe(
  instanceId: string,
  orgId: string
): Promise<string> {
  const instance = await prisma.automationInstance.findFirst({
    where: { id: instanceId, organizationId: orgId, status: "ACTIVE" },
    include: { recipe: true },
  });
  if (!instance) throw new ActivationError("not_found", "Active automation not found", 404);
  if (!instance.recipe.langGraphId) throw new ActivationError("no_graph", "Recipe has no LangGraph graph configured", 400);

  const threadId = instance.langGraphThreadId;
  if (!threadId) throw new ActivationError("no_thread", "No LangGraph thread found", 400);

  const connections = await prisma.oAuthConnection.findMany({
    where: { organizationId: orgId, status: "CONNECTED" },
    select: { provider: true, id: true },
  });

  // Pass credential REFERENCES, not decrypted tokens.
  // LangGraph calls our /api/internal/credentials endpoint to fetch tokens server-side.
  const orgContext: Record<string, any> = {
    orgId,
    config: instance.config,
    connectedProviders: connections.map((c) => c.provider),
    credentialRefs: connections.map((c) => ({ provider: c.provider, connectionId: c.id })),
    dataApiUrl: `${process.env.NEXTAUTH_URL}/api/internal/org-data`,
  };

  const amsConnection = connections.find((c) =>
    ["APPLIED_EPIC", "HAWKSOFT", "EZLYNX"].includes(c.provider)
  );
  if (amsConnection) {
    orgContext.amsProvider = amsConnection.provider;
    orgContext.amsConnectionId = amsConnection.id;
    // Tokens are NOT sent — LangGraph calls our API to fetch data via the connection
  }

  const run = await prisma.workflowRun.create({
    data: { automationInstanceId: instance.id, status: "RUNNING" },
  });

  try {
    await langgraph.createRun(
      threadId,
      instance.recipe.langGraphId,
      orgContext,
      { run_id: run.id, callback_url: `${process.env.NEXTAUTH_URL}/api/webhooks/langgraph/${run.id}` }
    );

    await prisma.automationInstance.update({
      where: { id: instance.id },
      data: { lastRunAt: new Date() },
    });

    return run.id;
  } catch (e) {
    await prisma.workflowRun.update({
      where: { id: run.id },
      data: { status: "FAILED", completedAt: new Date(), errorMessage: String(e) },
    });
    throw e;
  }
}

// ─── Clean up n8n credentials when a provider is disconnected ─

export async function cleanupCredentialsForProvider(
  orgId: string,
  provider: string
): Promise<void> {
  // Find all automation instances for this org that use this provider
  const instances = await prisma.automationInstance.findMany({
    where: { organizationId: orgId },
    include: { recipe: true },
  });

  for (const instance of instances) {
    const required = (instance.recipe.requiredIntegrations as any as string[]) || [];
    const needsProvider = required.some((r) => r.toLowerCase() === provider.toLowerCase());

    if (!needsProvider) continue;

    // This automation depends on the disconnected provider — pause it
    if (instance.status === "ACTIVE" && instance.n8nWorkflowId) {
      try {
        await n8n.deactivateWorkflow(instance.n8nWorkflowId);
      } catch (e) {
        log.error(`Failed to pause workflow for instance ${instance.id}:`, (e as Error).message);
      }
    }

    await prisma.automationInstance.update({
      where: { id: instance.id },
      data: { status: "ERROR" },
    });
  }
}

// ─── Error type ─────────────────────────────────────────────

export class ActivationError extends Error {
  code: string;
  statusCode: number;
  details?: any;

  constructor(code: string, message: string, statusCode: number, details?: any) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
