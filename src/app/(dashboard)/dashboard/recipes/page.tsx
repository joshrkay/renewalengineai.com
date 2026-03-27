import { auth } from "@/lib/auth";
import { prisma, getTenantDb } from "@/lib/db";
import { RecipeCard } from "@/components/dashboard/RecipeCard";

export default async function RecipesPage() {
  const session = await auth();
  const orgId = (session as any)?.organizationId;

  const recipes = await prisma.automationRecipe.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  let org = null;
  let activeInstances: string[] = [];

  if (orgId) {
    const tenantDb = getTenantDb(orgId);

    org = await prisma.organization.findUnique({
      where: { id: orgId },
    });
    const instances = await tenantDb.automationInstance.findMany({
      where: {},
      select: { recipeId: true, status: true },
    });
    activeInstances = instances
      .filter((i) => i.status === "ACTIVE" || i.status === "PENDING")
      .map((i) => i.recipeId);
  }

  const connectedProviders = orgId
    ? (
        await getTenantDb(orgId).oAuthConnection.findMany({
          where: { status: "CONNECTED" },
          select: { provider: true },
        })
      ).map((c) => c.provider.toLowerCase())
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-black">Automation Recipes</h1>
        <p className="text-neutral-600 mt-1">
          Pre-built automations ready to activate for your agency
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isActivated={activeInstances.includes(recipe.id)}
            userTier={org?.subscriptionTier || "AUDIT"}
            connectedProviders={connectedProviders}
          />
        ))}
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-20 text-neutral-500">
          <p className="text-lg font-medium">No recipes available yet</p>
          <p className="text-sm mt-1">
            Recipes will appear here once they are configured by the team
          </p>
        </div>
      )}
    </div>
  );
}
