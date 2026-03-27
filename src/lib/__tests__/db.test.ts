import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock PrismaClient before importing db module
const mockFindMany = vi.fn().mockResolvedValue([]);
const mockFindFirst = vi.fn().mockResolvedValue(null);
const mockCount = vi.fn().mockResolvedValue(0);
const mockCreate = vi.fn().mockResolvedValue({ id: "test" });
const mockDeleteMany = vi.fn().mockResolvedValue({ count: 0 });

const mockExtends = vi.fn().mockImplementation((config: any) => {
  // Return an object that simulates the extended Prisma client
  // by calling the query interceptors with tracked args
  return {
    oAuthConnection: {
      findMany: async (args: any = {}) => {
        const queryFn = config.query.oAuthConnection.findMany;
        return queryFn({
          args: { where: args.where || {}, ...args },
          query: (finalArgs: any) => {
            mockFindMany(finalArgs);
            return Promise.resolve([]);
          },
        });
      },
      findFirst: async (args: any = {}) => {
        const queryFn = config.query.oAuthConnection.findFirst;
        return queryFn({
          args: { where: args.where || {}, ...args },
          query: (finalArgs: any) => {
            mockFindFirst(finalArgs);
            return Promise.resolve(null);
          },
        });
      },
      count: async (args: any = {}) => {
        const queryFn = config.query.oAuthConnection.count;
        return queryFn({
          args: { where: args.where || {}, ...args },
          query: (finalArgs: any) => {
            mockCount(finalArgs);
            return Promise.resolve(0);
          },
        });
      },
      create: async (args: any = {}) => {
        const queryFn = config.query.oAuthConnection.create;
        return queryFn({
          args: { data: args.data || {}, ...args },
          query: (finalArgs: any) => {
            mockCreate(finalArgs);
            return Promise.resolve({ id: "test" });
          },
        });
      },
      deleteMany: async (args: any = {}) => {
        const queryFn = config.query.oAuthConnection.deleteMany;
        return queryFn({
          args: { where: args.where || {}, ...args },
          query: (finalArgs: any) => {
            mockDeleteMany(finalArgs);
            return Promise.resolve({ count: 0 });
          },
        });
      },
    },
    automationInstance: {
      findMany: async (args: any = {}) => {
        const queryFn = config.query.automationInstance.findMany;
        return queryFn({
          args: { where: args.where || {}, ...args },
          query: (finalArgs: any) => {
            mockFindMany(finalArgs);
            return Promise.resolve([]);
          },
        });
      },
      findFirst: async (args: any = {}) => {
        const queryFn = config.query.automationInstance.findFirst;
        return queryFn({
          args: { where: args.where || {}, ...args },
          query: (finalArgs: any) => {
            mockFindFirst(finalArgs);
            return Promise.resolve(null);
          },
        });
      },
      count: async (args: any = {}) => {
        const queryFn = config.query.automationInstance.count;
        return queryFn({
          args: { where: args.where || {}, ...args },
          query: (finalArgs: any) => {
            mockCount(finalArgs);
            return Promise.resolve(0);
          },
        });
      },
      create: async (args: any = {}) => {
        const queryFn = config.query.automationInstance.create;
        return queryFn({
          args: { data: args.data || {}, ...args },
          query: (finalArgs: any) => {
            mockCreate(finalArgs);
            return Promise.resolve({ id: "test" });
          },
        });
      },
    },
    subscription: {
      findMany: async (args: any = {}) => {
        const queryFn = config.query.subscription.findMany;
        return queryFn({
          args: { where: args.where || {}, ...args },
          query: (finalArgs: any) => {
            mockFindMany(finalArgs);
            return Promise.resolve([]);
          },
        });
      },
      findFirst: async (args: any = {}) => {
        const queryFn = config.query.subscription.findFirst;
        return queryFn({
          args: { where: args.where || {}, ...args },
          query: (finalArgs: any) => {
            mockFindFirst(finalArgs);
            return Promise.resolve(null);
          },
        });
      },
    },
  };
});

vi.mock("@prisma/client", () => {
  return {
    PrismaClient: class MockPrismaClient {
      $extends = mockExtends;
    },
  };
});

const { getTenantDb } = await import("@/lib/db");

const TEST_ORG_ID = "org-tenant-test-123";

describe("getTenantDb", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("oAuthConnection", () => {
    it("injects organizationId into findMany", async () => {
      const db = getTenantDb(TEST_ORG_ID);
      await db.oAuthConnection.findMany({ where: { status: "CONNECTED" } });
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: TEST_ORG_ID, status: "CONNECTED" }),
        })
      );
    });

    it("injects organizationId into findFirst", async () => {
      const db = getTenantDb(TEST_ORG_ID);
      await db.oAuthConnection.findFirst({ where: { provider: "GMAIL" } });
      expect(mockFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: TEST_ORG_ID }),
        })
      );
    });

    it("injects organizationId into count", async () => {
      const db = getTenantDb(TEST_ORG_ID);
      await db.oAuthConnection.count({ where: { status: "CONNECTED" } });
      expect(mockCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: TEST_ORG_ID }),
        })
      );
    });

    it("sets organizationId on create data", async () => {
      const db = getTenantDb(TEST_ORG_ID);
      await db.oAuthConnection.create({ data: { provider: "GMAIL", accessToken: "tok" } as any });
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ organizationId: TEST_ORG_ID }),
        })
      );
    });

    it("injects organizationId into deleteMany", async () => {
      const db = getTenantDb(TEST_ORG_ID);
      await db.oAuthConnection.deleteMany({ where: { provider: "GMAIL" } });
      expect(mockDeleteMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: TEST_ORG_ID }),
        })
      );
    });
  });

  describe("automationInstance", () => {
    it("injects organizationId into findMany", async () => {
      const db = getTenantDb(TEST_ORG_ID);
      await db.automationInstance.findMany({ where: { status: "ACTIVE" } });
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: TEST_ORG_ID, status: "ACTIVE" }),
        })
      );
    });

    it("injects organizationId into count", async () => {
      const db = getTenantDb(TEST_ORG_ID);
      await db.automationInstance.count({ where: {} });
      expect(mockCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: TEST_ORG_ID }),
        })
      );
    });
  });

  describe("subscription", () => {
    it("injects organizationId into findMany", async () => {
      const db = getTenantDb(TEST_ORG_ID);
      await db.subscription.findMany({ where: {} });
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: TEST_ORG_ID }),
        })
      );
    });

    it("injects organizationId into findFirst", async () => {
      const db = getTenantDb(TEST_ORG_ID);
      await db.subscription.findFirst({ where: { status: "ACTIVE" } });
      expect(mockFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: TEST_ORG_ID, status: "ACTIVE" }),
        })
      );
    });
  });

  describe("cross-tenant isolation", () => {
    it("different orgIds produce different filters", async () => {
      const dbA = getTenantDb("org-A");
      const dbB = getTenantDb("org-B");

      await dbA.oAuthConnection.findMany({ where: {} });
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: "org-A" }),
        })
      );

      vi.clearAllMocks();

      await dbB.oAuthConnection.findMany({ where: {} });
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organizationId: "org-B" }),
        })
      );
    });

    it("preserves existing where clauses while adding org filter", async () => {
      const db = getTenantDb(TEST_ORG_ID);
      await db.oAuthConnection.findMany({
        where: { status: "CONNECTED", provider: "GMAIL" as any },
      });
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: TEST_ORG_ID,
            status: "CONNECTED",
            provider: "GMAIL",
          }),
        })
      );
    });
  });
});
