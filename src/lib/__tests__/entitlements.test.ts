import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ──────────────────────────────────────────────────

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({ auth: () => mockAuth() }));
vi.mock("@/lib/logger", () => ({
  log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const mockFindUnique = vi.fn();
vi.mock("@/lib/db", () => ({
  prisma: {
    courseEntitlement: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
  },
}));

const entitledSession = {
  user: { id: "user-1" },
  organizationId: "org-1",
};

beforeEach(() => {
  vi.clearAllMocks();
});

const importModule = () => import("@/lib/entitlements");

describe("getCourseAccess", () => {
  it("returns unauthenticated when there is no session", async () => {
    mockAuth.mockResolvedValue(null);
    const { getCourseAccess } = await importModule();
    expect(await getCourseAccess("ai-for-agent-retention")).toEqual({
      allowed: false,
      reason: "unauthenticated",
    });
  });

  it("returns no_organization for a session without an org", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    const { getCourseAccess } = await importModule();
    expect(await getCourseAccess("ai-for-agent-retention")).toEqual({
      allowed: false,
      reason: "no_organization",
    });
  });

  it("returns not_entitled when no entitlement row exists", async () => {
    mockAuth.mockResolvedValue(entitledSession);
    mockFindUnique.mockResolvedValue(null);
    const { getCourseAccess } = await importModule();
    expect(await getCourseAccess("ai-for-agent-retention")).toEqual({
      allowed: false,
      reason: "not_entitled",
    });
  });

  it("returns entitled when the entitlement row exists", async () => {
    mockAuth.mockResolvedValue(entitledSession);
    mockFindUnique.mockResolvedValue({ id: "ent-1" });
    const { getCourseAccess } = await importModule();
    expect(await getCourseAccess("ai-for-agent-retention")).toEqual({
      allowed: true,
      reason: "entitled",
    });
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: {
        organizationId_courseSlug: {
          organizationId: "org-1",
          courseSlug: "ai-for-agent-retention",
        },
      },
      select: { id: true },
    });
  });

  // The error reason is what keeps a paying customer from being shown a
  // purchase button during an infrastructure failure — it must never be
  // conflated with unauthenticated/not_entitled.
  it("returns error (not unauthenticated) when the DB lookup throws", async () => {
    mockAuth.mockResolvedValue(entitledSession);
    mockFindUnique.mockRejectedValue(new Error("connection refused"));
    const { getCourseAccess } = await importModule();
    expect(await getCourseAccess("ai-for-agent-retention")).toEqual({
      allowed: false,
      reason: "error",
    });
  });

  it("returns error when auth() itself throws (e.g. MissingSecret)", async () => {
    mockAuth.mockRejectedValue(new Error("MissingSecret"));
    const { getCourseAccess } = await importModule();
    expect(await getCourseAccess("ai-for-agent-retention")).toEqual({
      allowed: false,
      reason: "error",
    });
  });
});
