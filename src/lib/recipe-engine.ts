import { prisma } from "@/lib/db";
import * as n8n from "@/lib/n8n";
import * as langgraph from "@/lib/langgraph";
import { decrypt } from "@/lib/encryption";

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

  // Tier check
  const userRank = TIER_RANK[org.subscriptionTier] || 0;
  const requiredRank = TIER_RANK[recipe.minimumTier] || 0;
  if (userRank < requiredRank) {
    throw new ActivationError(
      "insufficient_tier",
      `This recipe requires the ${recipe.minimumTier} plan. You are on ${org.subscriptionTier}.`,
      403
    );
  }

  // Integration check
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

  // Duplicate check
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

  let n8nWorkflowId: string | undefined;
  let langGraphThreadId: string | undefined;

  const instanceName = `${org.name} - ${recipe.name}`;
  const mergedConfig = { ...(recipe.config as any), ...userConfig };

  // Provision based on engine type
  if (recipe.engineType === "N8N" || recipe.engineType === "HYBRID") {
    if (recipe.n8nTemplateId) {
      // Create n8n credentials for each required integration
      const credentialIds: Record<string, string> = {};
      const required = (recipe.requiredIntegrations as any as string[]) || [];

      for (const provider of required) {
        const providerEnum = provider.toUpperCase();
        const connection = await prisma.oAuthConnection.findFirst({
          where: { organizationId: orgId, provider: providerEnum as any, status: "CONNECTED" },
        });
        if (connection) {
          const cred = await n8n.createN8nCredential(orgId, providerEnum, instanceName);
          credentialIds[providerEnum] = cred.id;
        }
      }

      // Create workflow from template with injected credentials
      const workflow = await n8n.createWorkflowFromTemplate(
        recipe.n8nTemplateId,
        instanceName,
        orgId,
        mergedConfig,
        credentialIds
      );
      n8nWorkflowId = workflow.id;

      // Activate the workflow
      await n8n.activateWorkflow(workflow.id);
    }
  }

  if (recipe.engineType === "LANGGRAPH" || recipe.engineType === "HYBRID") {
    if (recipe.langGraphId) {
      // Create a persistent thread for this automation
      const thread = await langgraph.createThread({
        orgId,
        recipeSlug: recipe.slug,
        config: mergedConfig,
      });
      langGraphThreadId = thread.thread_id;
    }
  }

  // Create or update the automation instance
  const instance = await prisma.automationInstance.upsert({
    where: { organizationId_recipeId: { organizationId: orgId, recipeId } },
    create: {
      organizationId: orgId,
      recipeId,
      status: "ACTIVE",
      config: mergedConfig,
      n8nWorkflowId: n8nWorkflowId || langGraphThreadId || null,
    },
    update: {
      status: "ACTIVE",
      config: mergedConfig,
      n8nWorkflowId: n8nWorkflowId || langGraphThreadId || null,
    },
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

  // Deactivate in n8n
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

  // Re-activate in n8n
  if (instance.n8nWorkflowId && (instance.recipe.engineType === "N8N" || instance.recipe.engineType === "HYBRID")) {
    await n8n.activateWorkflow(instance.n8nWorkflowId);
  }

  await prisma.automationInstance.update({
    where: { id: instanceId },
    data: { status: "ACTIVE" },
  });
}

// ─── Deactivate (full teardown) ─────────────────────────────

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
      // Workflow may already be deleted in n8n — continue with local cleanup
      console.error("n8n cleanup error (non-fatal):", e);
    }
  }

  // Delete all workflow runs, then the instance
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

  const threadId = instance.n8nWorkflowId; // We store the LangGraph thread ID here for LANGGRAPH-only recipes
  if (!threadId) throw new ActivationError("no_thread", "No LangGraph thread found", 400);

  // Gather org context — pull client data from connected AMS
  const connections = await prisma.oAuthConnection.findMany({
    where: { organizationId: orgId, status: "CONNECTED" },
  });

  const orgContext: Record<string, any> = {
    orgId,
    config: instance.config,
    connectedProviders: connections.map((c) => c.provider),
  };

  // For AMS-connected orgs, include credentials reference so LangGraph can pull data
  const amsConnection = connections.find((c) =>
    ["APPLIED_EPIC", "HAWKSOFT", "EZLYNX"].includes(c.provider)
  );
  if (amsConnection) {
    orgContext.amsProvider = amsConnection.provider;
    orgContext.amsAccessToken = decrypt(amsConnection.accessToken);
  }

  // Create workflow run record
  const run = await prisma.workflowRun.create({
    data: {
      automationInstanceId: instance.id,
      status: "RUNNING",
    },
  });

  // Submit to LangGraph (async — results come back via webhook or polling)
  try {
    const lgRun = await langgraph.createRun(
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
