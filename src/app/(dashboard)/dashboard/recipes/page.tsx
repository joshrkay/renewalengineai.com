import { auth } from "@/lib/auth";
import { prisma, getTenantDb } from "@/lib/db";
import { RecipeCard } from "@/components/dashboard/RecipeCard";
import { Sparkles, Zap } from "lucide-react";

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

  const activeCount = activeInstances.length;
  const categories = [...new Set(recipes.map((r) => r.category))];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero header */}
      <div className="relative mb-10 bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50 rounded-3xl p-8 md:p-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary">Automation Marketplace</span>
          </div>
          <h1 className="text-4xl font-black text-black tracking-tight mb-2">
            Automation Recipes
          </h1>
          <p className="text-lg text-neutral-500 max-w-xl">
            Pre-built AI automations for your agency. Select a recipe, connect your tools, customize the content, and go live.
          </p>

          {activeCount > 0 && (
            <div className="mt-6 flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-green-700">
                  {activeCount} active automation{activeCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recipes by category */}
      {categories.map((category) => {
        const categoryRecipes = recipes.filter((r) => r.category === category);
        return (
          <div key={category} className="mb-10">
            <h2 className="text-xl font-bold text-black mb-5">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isActivated={activeInstances.includes(recipe.id)}
                  userTier={org?.subscriptionTier || "AUDIT"}
                  connectedProviders={connectedProviders}
                />
              ))}
            </div>
          </div>
        );
      })}

      {recipes.length === 0 && (
        <div className="text-center py-20 text-neutral-500">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
          <p className="text-lg font-medium">No recipes available yet</p>
          <p className="text-sm mt-1">
            Recipes will appear here once they are configured by the team
          </p>
        </div>
      )}
    </div>
  );
}
