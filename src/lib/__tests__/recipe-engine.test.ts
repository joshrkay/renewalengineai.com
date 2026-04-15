import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ──────────────────────────────────────────────────

const mockPrisma = {
  automationRecipe: { findUnique: vi.fn() },
  organization: { findUnique: vi.fn() },
  oAuthConnection: { findMany: vi.fn(), findFirst: vi.fn() },
  automationInstance: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    upsert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
  },
  workflowRun: { create: vi.fn(), deleteMany: vi.fn(), update: vi.fn() },
};

const mockN8n = {
  ensureOrgProject: vi.fn().mockResolvedValue("proj-123"),
  createN8nCredential: vi.fn().mockResolvedValue({ id: "cred-1", name: "test", type: "test" }),
  createWorkflowFromTemplate: vi.fn().mockResolvedValue({ id: "wf-123", name: "test", active: false, nodes: [], connections: {} }),
  activateWorkflow: vi.fn().mockResolvedValue({}),
  deactivateWorkflow: vi.fn().mockResolvedValue({}),
  deleteWorkflow: vi.fn().mockResolvedValue(undefined),
  deleteN8nCredentials: vi.fn().mockResolvedValue(undefined),
};

const mockLanggraph = {
  createThread: vi.fn().mockResolvedValue({ thread_id: "thread-abc" }),
  createRun: vi.fn().mockResolvedValue({ run_id: "run-1", status: "pending" }),
};

vi.mock("@/lib/db", () => ({ prisma: mockPrisma }));
vi.mock("@/lib/n8n", () => mockN8n);
vi.mock("@/lib/langgraph", () => mockLanggraph);
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));
vi.mock("@/lib/logger", () => ({ log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } }));

const {
  validateActivation,
  activateRecipe,
  pauseAutomation,
  resumeAutomation,
  deactivateAutomation,
  cleanupCredentialsForProvider,
  ActivationError,
} = await import("@/lib/recipe-engine");

// ─── Fixtures ───────────────────────────────────────────────

const makeRecipe = (overrides = {}) => ({
  id: "recipe-1",
  slug: "renewal-campaign",
  name: "Renewal Campaign",
  minimumTier: "SPRINT",
  engineType: "N8N",
  requiredIntegrations: ["ams", "email"],
  n8nTemplateId: "template-1",
  langGraphId: null,
  config: { touchpoints: [60, 30, 14] },
  ...overrides,
});

const makeOrg = (overrides = {}) => ({
  id: "org-1",
  name: "Test Agency",
  subscriptionTier: "MANAGED",
  subscriptionStatus: "ACTIVE",
  n8nProjectId: null,
  ...overrides,
});

const makeInstance = (overrides = {}) => ({
  id: "inst-1",
  organizationId: "org-1",
  recipeId: "recipe-1",
  status: "ACTIVE",
  config: {},
  n8nWorkflowId: "wf-123",
  n8nCredentialIds: ["cred-1", "cred-2"],
  langGraphThreadId: null,
  recipe: makeRecipe(),
  ...overrides,
});

// ─── Tests ──────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

describe("validateActivation", () => {
  it("returns recipe and org when valid", async () => {
    mockPrisma.automationRecipe.findUnique.mockResolvedValue(makeRecipe());
    mockPrisma.organization.findUnique.mockResolvedValue(makeOrg());
    mockPrisma.oAuthConnection.findMany.mockResolvedValue([
      { provider: "AMS" },
      { provider: "EMAIL" },
    ]);
    mockPrisma.automationInstance.findUnique.mockResolvedValue(null);

    const result = await validateActivation("org-1", "recipe-1");
    expect(result.recipe.id).toBe("recipe-1");
    expect(result.org.id).toBe("org-1");
  });

  it("throws recipe_not_found when recipe missing", async () => {
    mockPrisma.automationRecipe.findUnique.mockResolvedValue(null);

    await expect(validateActivation("org-1", "bad-id")).rejects.toThrow(ActivationError);
    try { await validateActivation("org-1", "bad-id"); } catch (e: any) {
      expect(e.code).toBe("recipe_not_found");
      expect(e.statusCode).toBe(404);
    }
  });

  it("throws org_not_found when org missing", async () => {
    mockPrisma.automationRecipe.findUnique.mockResolvedValue(makeRecipe());
    mockPrisma.organization.findUnique.mockResolvedValue(null);

    try { await validateActivation("bad-org", "recipe-1"); } catch (e: any) {
      expect(e.code).toBe("org_not_found");
      expect(e.statusCode).toBe(404);
    }
  });

  it("throws insufficient_tier when AUDIT tries SPRINT recipe", async () => {
    mockPrisma.automationRecipe.findUnique.mockResolvedValue(makeRecipe({ minimumTier: "SPRINT" }));
    mockPrisma.organization.findUnique.mockResolvedValue(makeOrg({ subscriptionTier: "AUDIT" }));

    try { await validateActivation("org-1", "recipe-1"); } catch (e: any) {
      expect(e.code).toBe("insufficient_tier");
      expect(e.statusCode).toBe(403);
    }
  });

  it("throws insufficient_tier when SPRINT tries MANAGED recipe", async () => {
    mockPrisma.automationRecipe.findUnique.mockResolvedValue(makeRecipe({ minimumTier: "MANAGED" }));
    mockPrisma.organization.findUnique.mockResolvedValue(makeOrg({ subscriptionTier: "SPRINT" }));

    try { await validateActivation("org-1", "recipe-1"); } catch (e: any) {
      expect(e.code).toBe("insufficient_tier");
    }
  });

  it("allows MANAGED tier for SPRINT recipe", async () => {
    mockPrisma.automationRecipe.findUnique.mockResolvedValue(makeRecipe({ minimumTier: "SPRINT" }));
    mockPrisma.organization.findUnique.mockResolvedValue(makeOrg({ subscriptionTier: "MANAGED" }));
    mockPrisma.oAuthConnection.findMany.mockResolvedValue([{ provider: "AMS" }, { provider: "EMAIL" }]);
    mockPrisma.automationInstance.findUnique.mockResolvedValue(null);

    const result = await validateActivation("org-1", "recipe-1");
    expect(result.org.subscriptionTier).toBe("MANAGED");
  });

  it("throws missing_integrations when connections incomplete", async () => {
    mockPrisma.automationRecipe.findUnique.mockResolvedValue(makeRecipe({ requiredIntegrations: ["ams", "email", "sms"] }));
    mockPrisma.organization.findUnique.mockResolvedValue(makeOrg());
    mockPrisma.oAuthConnection.findMany.mockResolvedValue([{ provider: "AMS" }]); // missing email, sms

    try { await validateActivation("org-1", "recipe-1"); } catch (e: any) {
      expect(e.code).toBe("missing_integrations");
      expect(e.details.missing).toEqual(["email", "sms"]);
      expect(e.statusCode).toBe(400);
    }
  });

  it("passes when all integrations connected", async () => {
    mockPrisma.automationRecipe.findUnique.mockResolvedValue(makeRecipe({ requiredIntegrations: ["ams", "email"] }));
    mockPrisma.organization.findUnique.mockResolvedValue(makeOrg());
    mockPrisma.oAuthConnection.findMany.mockResolvedValue([{ provider: "AMS" }, { provider: "EMAIL" }]);
    mockPrisma.automationInstance.findUnique.mockResolvedValue(null);

    const result = await validateActivation("org-1", "recipe-1");
    expect(result).toBeDefined();
  });

  it("passes when recipe has no required integrations", async () => {
    mockPrisma.automationRecipe.findUnique.mockResolvedValue(makeRecipe({ requiredIntegrations: [] }));
    mockPrisma.organization.findUnique.mockResolvedValue(makeOrg());
    mockPrisma.automationInstance.findUnique.mockResolvedValue(null);

    const result = await validateActivation("org-1", "recipe-1");
    expect(result).toBeDefined();
  });

  it("throws already_activated when ACTIVE instance exists", async () => {
    mockPrisma.automationRecipe.findUnique.mockResolvedValue(makeRecipe());
    mockPrisma.organization.findUnique.mockResolvedValue(makeOrg());
    mockPrisma.oAuthConnection.findMany.mockResolvedValue([{ provider: "AMS" }, { provider: "EMAIL" }]);
    mockPrisma.automationInstance.findUnique.mockResolvedValue({ status: "ACTIVE" });

    try { await validateActivation("org-1", "recipe-1"); } catch (e: any) {
      expect(e.code).toBe("already_activated");
      expect(e.statusCode).toBe(409);
    }
  });

  it("allows reactivation when instance is PAUSED", async () => {
    mockPrisma.automationRecipe.findUnique.mockResolvedValue(makeRecipe());
    mockPrisma.organization.findUnique.mockResolvedValue(makeOrg());
    mockPrisma.oAuthConnection.findMany.mockResolvedValue([{ provider: "AMS" }, { provider: "EMAIL" }]);
    mockPrisma.automationInstance.findUnique.mockResolvedValue({ status: "PAUSED" });

    const result = await validateActivation("org-1", "recipe-1");
    expect(result).toBeDefined();
  });
});

describe("activateRecipe", () => {
  beforeEach(() => {
    mockPrisma.automationRecipe.findUnique.mockResolvedValue(makeRecipe());
    mockPrisma.organization.findUnique.mockResolvedValue(makeOrg());
    mockPrisma.oAuthConnection.findMany.mockResolvedValue([{ provider: "AMS" }, { provider: "EMAIL" }]);
    mockPrisma.oAuthConnection.findFirst.mockResolvedValue({ id: "conn-1", provider: "AMS" });
    mockPrisma.automationInstance.findUnique.mockResolvedValue(null);
    mockPrisma.automationInstance.upsert.mockResolvedValue({ id: "inst-new", status: "ACTIVE" });
  });

  it("creates n8n project, credentials, workflow for N8N recipe", async () => {
    const result = await activateRecipe("org-1", "recipe-1");

    expect(mockN8n.ensureOrgProject).toHaveBeenCalledWith("org-1");
    expect(mockN8n.createN8nCredential).toHaveBeenCalled();
    expect(mockN8n.createWorkflowFromTemplate).toHaveBeenCalled();
    expect(mockN8n.activateWorkflow).toHaveBeenCalledWith("wf-123");
    expect(result.status).toBe("ACTIVE");
  });

  it("creates LangGraph thread for LANGGRAPH recipe", async () => {
    mockPrisma.automationRecipe.findUnique.mockResolvedValue(
      makeRecipe({ engineType: "LANGGRAPH", n8nTemplateId: null, langGraphId: "rate-monitor" })
    );

    await activateRecipe("org-1", "recipe-1");

    expect(mockLanggraph.createThread).toHaveBeenCalled();
    expect(mockN8n.createWorkflowFromTemplate).not.toHaveBeenCalled();
  });

  it("creates both n8n workflow AND LangGraph thread for HYBRID recipe", async () => {
    mockPrisma.automationRecipe.findUnique.mockResolvedValue(
      makeRecipe({ engineType: "HYBRID", n8nTemplateId: "tmpl-1", langGraphId: "graph-1" })
    );

    await activateRecipe("org-1", "recipe-1");

    expect(mockN8n.createWorkflowFromTemplate).toHaveBeenCalled();
    expect(mockLanggraph.createThread).toHaveBeenCalled();
  });

  it("persists credential IDs in the automation instance", async () => {
    await activateRecipe("org-1", "recipe-1");

    const upsertCall = mockPrisma.automationInstance.upsert.mock.calls[0][0];
    expect(upsertCall.create.n8nCredentialIds).toContain("cred-1");
  });

  it("merges user config with recipe defaults", async () => {
    await activateRecipe("org-1", "recipe-1", { customField: "value" });

    const upsertCall = mockPrisma.automationInstance.upsert.mock.calls[0][0];
    expect(upsertCall.create.config).toEqual(
      expect.objectContaining({ touchpoints: [60, 30, 14], customField: "value" })
    );
  });
});

describe("pauseAutomation", () => {
  it("deactivates n8n workflow and sets status to PAUSED", async () => {
    mockPrisma.automationInstance.findFirst.mockResolvedValue(makeInstance());

    await pauseAutomation("inst-1", "org-1");

    expect(mockN8n.deactivateWorkflow).toHaveBeenCalledWith("wf-123");
    expect(mockPrisma.automationInstance.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: "PAUSED" } })
    );
  });

  it("throws not_found for missing instance", async () => {
    mockPrisma.automationInstance.findFirst.mockResolvedValue(null);

    try { await pauseAutomation("bad-id", "org-1"); } catch (e: any) {
      expect(e.code).toBe("not_found");
    }
  });

  it("skips n8n call for LANGGRAPH-only recipe", async () => {
    mockPrisma.automationInstance.findFirst.mockResolvedValue(
      makeInstance({ n8nWorkflowId: null, recipe: makeRecipe({ engineType: "LANGGRAPH" }) })
    );

    await pauseAutomation("inst-1", "org-1");

    expect(mockN8n.deactivateWorkflow).not.toHaveBeenCalled();
    expect(mockPrisma.automationInstance.update).toHaveBeenCalled();
  });
});

describe("resumeAutomation", () => {
  it("reactivates n8n workflow and sets status to ACTIVE", async () => {
    mockPrisma.automationInstance.findFirst.mockResolvedValue(makeInstance({ status: "PAUSED" }));

    await resumeAutomation("inst-1", "org-1");

    expect(mockN8n.activateWorkflow).toHaveBeenCalledWith("wf-123");
    expect(mockPrisma.automationInstance.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: "ACTIVE" } })
    );
  });
});

describe("deactivateAutomation", () => {
  it("deletes workflow, credentials, runs, and instance", async () => {
    mockPrisma.automationInstance.findFirst.mockResolvedValue(makeInstance());

    await deactivateAutomation("inst-1", "org-1");

    expect(mockN8n.deactivateWorkflow).toHaveBeenCalledWith("wf-123");
    expect(mockN8n.deleteWorkflow).toHaveBeenCalledWith("wf-123");
    expect(mockN8n.deleteN8nCredentials).toHaveBeenCalledWith(["cred-1", "cred-2"]);
    expect(mockPrisma.workflowRun.deleteMany).toHaveBeenCalled();
    expect(mockPrisma.automationInstance.delete).toHaveBeenCalled();
  });

  it("continues cleanup even if n8n delete fails", async () => {
    mockPrisma.automationInstance.findFirst.mockResolvedValue(makeInstance());
    mockN8n.deactivateWorkflow.mockRejectedValueOnce(new Error("n8n unreachable"));

    await deactivateAutomation("inst-1", "org-1");

    // Should still clean up DB even though n8n failed
    expect(mockPrisma.automationInstance.delete).toHaveBeenCalled();
  });

  it("skips credential cleanup when none stored", async () => {
    mockPrisma.automationInstance.findFirst.mockResolvedValue(
      makeInstance({ n8nCredentialIds: [] })
    );

    await deactivateAutomation("inst-1", "org-1");

    expect(mockN8n.deleteN8nCredentials).not.toHaveBeenCalled();
  });
});

describe("cleanupCredentialsForProvider", () => {
  it("pauses automations that depend on disconnected provider", async () => {
    mockPrisma.automationInstance.findMany.mockResolvedValue([
      makeInstance({ recipe: makeRecipe({ requiredIntegrations: ["ams", "email"] }) }),
    ]);

    await cleanupCredentialsForProvider("org-1", "AMS");

    expect(mockN8n.deactivateWorkflow).toHaveBeenCalledWith("wf-123");
    expect(mockPrisma.automationInstance.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: "ERROR" } })
    );
  });

  it("skips automations that don't use the disconnected provider", async () => {
    mockPrisma.automationInstance.findMany.mockResolvedValue([
      makeInstance({ recipe: makeRecipe({ requiredIntegrations: ["crm", "email"] }) }),
    ]);

    await cleanupCredentialsForProvider("org-1", "AMS");

    expect(mockN8n.deactivateWorkflow).not.toHaveBeenCalled();
    expect(mockPrisma.automationInstance.update).not.toHaveBeenCalled();
  });
});

describe("ActivationError", () => {
  it("has code, message, statusCode, and optional details", () => {
    const err = new ActivationError("test_code", "Test message", 400, { key: "val" });
    expect(err.code).toBe("test_code");
    expect(err.message).toBe("Test message");
    expect(err.statusCode).toBe(400);
    expect(err.details).toEqual({ key: "val" });
    expect(err).toBeInstanceOf(Error);
  });
});
