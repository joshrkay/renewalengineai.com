"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Lock, CheckCircle, AlertCircle } from "lucide-react";

interface RecipeCardProps {
  recipe: {
    id: string;
    name: string;
    description: string;
    category: string;
    requiredIntegrations: any;
    minimumTier: string;
    engineType: string;
  };
  isActivated: boolean;
  userTier: string;
  connectedProviders: string[];
}

const tierRank = { AUDIT: 1, SPRINT: 2, MANAGED: 3 };

export function RecipeCard({
  recipe,
  isActivated,
  userTier,
  connectedProviders,
}: RecipeCardProps) {
  const [loading, setLoading] = useState(false);
  const [activated, setActivated] = useState(isActivated);

  const requiredIntegrations = (recipe.requiredIntegrations as string[]) || [];
  const hasRequiredTier =
    (tierRank[userTier as keyof typeof tierRank] || 0) >=
    (tierRank[recipe.minimumTier as keyof typeof tierRank] || 0);
  const missingIntegrations = requiredIntegrations.filter(
    (i) => !connectedProviders.includes(i.toLowerCase())
  );
  const canActivate =
    hasRequiredTier && missingIntegrations.length === 0 && !activated;

  const handleActivate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/automations/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: recipe.id }),
      });
      if (res.ok) {
        setActivated(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">
          {recipe.category}
        </span>
        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-xs font-medium">
          {recipe.engineType}
        </span>
      </div>

      <h3 className="text-lg font-bold text-black mb-2">{recipe.name}</h3>
      <p className="text-sm text-neutral-600 flex-1 mb-4">
        {recipe.description}
      </p>

      {/* Required integrations */}
      {requiredIntegrations.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-neutral-500 mb-2">
            Required integrations:
          </p>
          <div className="flex flex-wrap gap-1">
            {requiredIntegrations.map((integration: string) => {
              const connected = connectedProviders.includes(
                integration.toLowerCase()
              );
              return (
                <span
                  key={integration}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    connected
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {integration}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Status / Action */}
      {activated ? (
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">Active</span>
        </div>
      ) : !hasRequiredTier ? (
        <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl">
          <Lock className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-500">
            Requires {recipe.minimumTier} plan
          </span>
        </div>
      ) : missingIntegrations.length > 0 ? (
        <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-amber-700">
            Connect {missingIntegrations.join(", ")} first
          </span>
        </div>
      ) : (
        <Button
          onClick={handleActivate}
          disabled={loading}
          className="w-full bg-primary text-white rounded-xl"
        >
          <Zap className="w-4 h-4 mr-2" />
          {loading ? "Activating..." : "Activate Recipe"}
        </Button>
      )}
    </div>
  );
}
