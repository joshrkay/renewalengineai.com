import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const tierRank = { AUDIT: 1, SPRINT: 2, MANAGED: 3 };

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const orgId = (session as any).organizationId;
  if (!orgId) {
    return NextResponse.json({ error: "no_organization" }, { status: 400 });
  }

  const { recipeId, config } = await req.json();

  const recipe = await prisma.automationRecipe.findUnique({
    where: { id: recipeId },
  });
  if (!recipe) {
    return NextResponse.json({ error: "recipe_not_found" }, { status: 404 });
  }

  // Check tier
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org) {
    return NextResponse.json({ error: "org_not_found" }, { status: 404 });
  }

  const userTierRank = tierRank[org.subscriptionTier] || 0;
  const requiredTierRank = tierRank[recipe.minimumTier as keyof typeof tierRank] || 0;
  if (userTierRank < requiredTierRank) {
    return NextResponse.json({ error: "insufficient_tier" }, { status: 403 });
  }

  // Check required integrations
  const requiredIntegrations = (recipe.requiredIntegrations as string[]) || [];
  if (requiredIntegrations.length > 0) {
    const connections = await prisma.oAuthConnection.findMany({
      where: {
        organizationId: orgId,
        status: "CONNECTED",
      },
    });
    const connectedProviders = connections.map((c) => c.provider.toLowerCase());
    const missing = requiredIntegrations.filter(
      (i) => !connectedProviders.includes(i.toLowerCase())
    );
    if (missing.length > 0) {
      return NextResponse.json(
        { error: "missing_integrations", missing },
        { status: 400 }
      );
    }
  }

  // Check if already activated
  const existing = await prisma.automationInstance.findUnique({
    where: {
      organizationId_recipeId: { organizationId: orgId, recipeId },
    },
  });
  if (existing && (existing.status === "ACTIVE" || existing.status === "PENDING")) {
    return NextResponse.json({ error: "already_activated" }, { status: 409 });
  }

  // Create automation instance
  // TODO: Call n8n MCP Server to provision workflow
  const instance = await prisma.automationInstance.upsert({
    where: {
      organizationId_recipeId: { organizationId: orgId, recipeId },
    },
    create: {
      organizationId: orgId,
      recipeId,
      status: "ACTIVE",
      config: config || {},
    },
    update: {
      status: "ACTIVE",
      config: config || {},
    },
  });

  return NextResponse.json({ id: instance.id, status: instance.status });
}
