import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ─── Mocks ──────────────────────────────────────────────────

const mockSession = { user: { id: "user-1", name: "Test" }, organizationId: "org-1" };
const mockAuth = vi.fn().mockResolvedValue(mockSession);

vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));
vi.mock("@/lib/logger", () => ({ log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } }));

const mockActivateRecipe = vi.fn();
const mockPauseAutomation = vi.fn();
const mockResumeAutomation = vi.fn();
const mockDeactivateAutomation = vi.fn();

vi.mock("@/lib/recipe-engine", async () => {
  const { ActivationError } = await vi.importActual<any>("@/lib/recipe-engine");
  return {
    activateRecipe: (...args: any[]) => mockActivateRecipe(...args),
    pauseAutomation: (...args: any[]) => mockPauseAutomation(...args),
    resumeAutomation: (...args: any[]) => mockResumeAutomation(...args),
    deactivateAutomation: (...args: any[]) => mockDeactivateAutomation(...args),
    ActivationError,
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  mockAuth.mockResolvedValue(mockSession);
});

// ─── Activate Route ─────────────────────────────────────────

describe("POST /api/automations/activate", () => {
  const importRoute = () => import("@/app/api/automations/activate/route");

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const { POST } = await importRoute();
    const req = new NextRequest("http://localhost/api/automations/activate", {
      method: "POST",
      body: JSON.stringify({ recipeId: "r-1" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when no organizationId", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u-1" } });
    const { POST } = await importRoute();
    const req = new NextRequest("http://localhost/api/automations/activate", {
      method: "POST",
      body: JSON.stringify({ recipeId: "r-1" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns activation result on success", async () => {
    mockActivateRecipe.mockResolvedValue({ instanceId: "inst-1", status: "ACTIVE", n8nWorkflowId: "wf-1" });
    const { POST } = await importRoute();
    const req = new NextRequest("http://localhost/api/automations/activate", {
      method: "POST",
      body: JSON.stringify({ recipeId: "r-1" }),
    });

    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.instanceId).toBe("inst-1");
    expect(data.status).toBe("ACTIVE");
  });

  it("returns ActivationError code and status", async () => {
    const { ActivationError } = await import("@/lib/recipe-engine");
    mockActivateRecipe.mockRejectedValue(new ActivationError("insufficient_tier", "Requires MANAGED", 403));
    const { POST } = await importRoute();
    const req = new NextRequest("http://localhost/api/automations/activate", {
      method: "POST",
      body: JSON.stringify({ recipeId: "r-1" }),
    });

    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(403);
    expect(data.error).toBe("insufficient_tier");
  });

  it("returns 500 on unexpected error", async () => {
    mockActivateRecipe.mockRejectedValue(new Error("DB crashed"));
    const { POST } = await importRoute();
    const req = new NextRequest("http://localhost/api/automations/activate", {
      method: "POST",
      body: JSON.stringify({ recipeId: "r-1" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});

// ─── Pause Route ────────────────────────────────────────────

describe("POST /api/automations/[id]/pause", () => {
  const importRoute = () => import("@/app/api/automations/[id]/pause/route");

  it("returns PAUSED on success", async () => {
    mockPauseAutomation.mockResolvedValue(undefined);
    const { POST } = await importRoute();
    const req = new NextRequest("http://localhost/api/automations/inst-1/pause", { method: "POST" });

    const res = await POST(req, { params: Promise.resolve({ id: "inst-1" }) });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("PAUSED");
    expect(mockPauseAutomation).toHaveBeenCalledWith("inst-1", "org-1");
  });

  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const { POST } = await importRoute();
    const req = new NextRequest("http://localhost/api/automations/inst-1/pause", { method: "POST" });

    const res = await POST(req, { params: Promise.resolve({ id: "inst-1" }) });
    expect(res.status).toBe(401);
  });
});

// ─── Resume Route ───────────────────────────────────────────

describe("POST /api/automations/[id]/resume", () => {
  const importRoute = () => import("@/app/api/automations/[id]/resume/route");

  it("returns ACTIVE on success", async () => {
    mockResumeAutomation.mockResolvedValue(undefined);
    const { POST } = await importRoute();
    const req = new NextRequest("http://localhost/api/automations/inst-1/resume", { method: "POST" });

    const res = await POST(req, { params: Promise.resolve({ id: "inst-1" }) });
    const data = await res.json();
    expect(data.status).toBe("ACTIVE");
  });
});

// ─── Deactivate Route ───────────────────────────────────────

describe("POST /api/automations/[id]/deactivate", () => {
  const importRoute = () => import("@/app/api/automations/[id]/deactivate/route");

  it("returns deleted: true on success", async () => {
    mockDeactivateAutomation.mockResolvedValue(undefined);
    const { POST } = await importRoute();
    const req = new NextRequest("http://localhost/api/automations/inst-1/deactivate", { method: "POST" });

    const res = await POST(req, { params: Promise.resolve({ id: "inst-1" }) });
    const data = await res.json();
    expect(data.deleted).toBe(true);
    expect(mockDeactivateAutomation).toHaveBeenCalledWith("inst-1", "org-1");
  });

  it("returns error status from ActivationError", async () => {
    const { ActivationError } = await import("@/lib/recipe-engine");
    mockDeactivateAutomation.mockRejectedValue(new ActivationError("not_found", "Not found", 404));
    const { POST } = await importRoute();
    const req = new NextRequest("http://localhost/api/automations/inst-1/deactivate", { method: "POST" });

    const res = await POST(req, { params: Promise.resolve({ id: "inst-1" }) });
    expect(res.status).toBe(404);
  });
});
