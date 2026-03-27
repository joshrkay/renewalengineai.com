import { auth } from "@/lib/auth";
import { prisma, getTenantDb } from "@/lib/db";
import { notFound } from "next/navigation";
import { RecipeActivationWizard } from "@/components/dashboard/RecipeActivationWizard";

const TIER_RANK: Record<string, number> = { AUDIT: 1, SPRINT: 2, MANAGED: 3 };

const INTEGRATION_LABELS: Record<string, string> = {
  ams: "Agency Management System",
  email: "Email Provider",
  crm: "CRM",
  sms: "SMS / Phone",
};

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const orgId = (session as any)?.organizationId;

  const recipe = await prisma.automationRecipe.findUnique({ where: { id } });
  if (!recipe) notFound();

  let org = null;
  let existingInstance = null;
  let connectedProviders: string[] = [];

  if (orgId) {
    const tenantDb = getTenantDb(orgId);

    org = await prisma.organization.findUnique({ where: { id: orgId } });

    existingInstance = await tenantDb.automationInstance.findFirst({
      where: { recipeId: id },
    });

    connectedProviders = (
      await tenantDb.oAuthConnection.findMany({
        where: { status: "CONNECTED" },
        select: { provider: true },
      })
    ).map((c) => c.provider.toLowerCase());
  }

  const requiredIntegrations = (recipe.requiredIntegrations as any as string[]) || [];
  const userTierRank = TIER_RANK[org?.subscriptionTier || "AUDIT"] || 0;
  const requiredTierRank = TIER_RANK[recipe.minimumTier] || 0;
  const hasTier = userTierRank >= requiredTierRank;
  const missingIntegrations = requiredIntegrations.filter(
    (i) => !connectedProviders.includes(i.toLowerCase())
  );

  const recipeConfig = recipe.config as Record<string, any>;

  return (
    <div className="max-w-5xl mx-auto">
      <RecipeActivationWizard
        recipe={{
          id: recipe.id,
          slug: recipe.slug,
          name: recipe.name,
          description: recipe.description,
          category: recipe.category,
          engineType: recipe.engineType,
          minimumTier: recipe.minimumTier,
          requiredIntegrations,
          config: recipeConfig,
        }}
        userTier={org?.subscriptionTier || "AUDIT"}
        hasTier={hasTier}
        connectedProviders={connectedProviders}
        missingIntegrations={missingIntegrations}
        isAlreadyActive={
          existingInstance?.status === "ACTIVE" || existingInstance?.status === "PENDING"
        }
        integrationLabels={INTEGRATION_LABELS}
      />
    </div>
  );
}
