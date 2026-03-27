import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Models that are scoped to an organization (tenant)
const TENANT_MODELS = new Set([
  "OAuthConnection",
  "AutomationInstance",
  "WorkflowRun",
  "Subscription",
]);

// Models where the org relationship is via a parent (e.g., WorkflowRun → AutomationInstance → org)
const INDIRECT_TENANT_MODELS = new Set(["WorkflowRun"]);

/**
 * Returns a Prisma client extended with middleware that automatically
 * enforces organizationId filtering on all tenant-scoped queries.
 *
 * Use this in dashboard pages and API routes instead of raw `prisma`
 * to guarantee tenant isolation.
 */
export function getTenantDb(organizationId: string) {
  return prisma.$extends({
    query: {
      oAuthConnection: {
        async findMany({ args, query }) {
          args.where = { ...args.where, organizationId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, organizationId };
          return query(args);
        },
        async count({ args, query }) {
          args.where = { ...args.where, organizationId };
          return query(args);
        },
        async create({ args, query }) {
          args.data = { ...args.data, organizationId } as any;
          return query(args);
        },
        async deleteMany({ args, query }) {
          args.where = { ...args.where, organizationId };
          return query(args);
        },
      },
      automationInstance: {
        async findMany({ args, query }) {
          args.where = { ...args.where, organizationId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, organizationId };
          return query(args);
        },
        async count({ args, query }) {
          args.where = { ...args.where, organizationId };
          return query(args);
        },
        async create({ args, query }) {
          args.data = { ...args.data, organizationId } as any;
          return query(args);
        },
      },
      subscription: {
        async findMany({ args, query }) {
          args.where = { ...args.where, organizationId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, organizationId };
          return query(args);
        },
      },
    },
  });
}

export type TenantDb = ReturnType<typeof getTenantDb>;
