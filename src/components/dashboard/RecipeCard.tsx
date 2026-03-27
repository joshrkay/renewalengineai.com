"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Brain,
  Workflow,
} from "lucide-react";

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

const tierRank: Record<string, number> = { AUDIT: 1, SPRINT: 2, MANAGED: 3 };

const ENGINE_CONFIG: Record<string, { icon: any; label: string; color: string }> = {
  N8N: { icon: Workflow, label: "Automation", color: "bg-orange-100 text-orange-700" },
  LANGGRAPH: { icon: Brain, label: "AI-Powered", color: "bg-purple-100 text-purple-700" },
  HYBRID: { icon: Zap, label: "AI + Automation", color: "bg-blue-100 text-blue-700" },
};

const CATEGORY_COLORS: Record<string, string> = {
  Retention: "bg-emerald-50 text-emerald-700",
  "Lead Generation": "bg-sky-50 text-sky-700",
  Sales: "bg-violet-50 text-violet-700",
  "Revenue Growth": "bg-amber-50 text-amber-700",
  "Market Intelligence": "bg-rose-50 text-rose-700",
};

export function RecipeCard({
  recipe,
  isActivated,
  userTier,
  connectedProviders,
}: RecipeCardProps) {
  const requiredIntegrations = (recipe.requiredIntegrations as string[]) || [];
  const hasRequiredTier =
    (tierRank[userTier] || 0) >= (tierRank[recipe.minimumTier] || 0);
  const missingIntegrations = requiredIntegrations.filter(
    (i) => !connectedProviders.includes(i.toLowerCase())
  );
  const engine = ENGINE_CONFIG[recipe.engineType] || ENGINE_CONFIG.N8N;
  const EngineIcon = engine.icon;

  return (
    <Link
      href={`/dashboard/recipes/${recipe.id}`}
      className="group block"
    >
      <div className="relative bg-white rounded-2xl border border-neutral-200 p-6 h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5">
        {/* Status indicator */}
        {isActivated && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-green-700">Active</span>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <Badge className={`${CATEGORY_COLORS[recipe.category] || "bg-neutral-100 text-neutral-700"} border-0 text-xs`}>
            {recipe.category}
          </Badge>
          <Badge className={`${engine.color} border-0 text-xs gap-1`}>
            <EngineIcon className="w-3 h-3" />
            {engine.label}
          </Badge>
        </div>

        {/* Title & description */}
        <h3 className="text-lg font-bold text-black mb-2 group-hover:text-primary transition-colors">
          {recipe.name}
        </h3>
        <p className="text-sm text-neutral-500 flex-1 mb-5 line-clamp-2">
          {recipe.description}
        </p>

        {/* Integration status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {requiredIntegrations.map((int) => {
              const connected = connectedProviders.includes(int.toLowerCase());
              return (
                <div
                  key={int}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    connected
                      ? "bg-green-100 text-green-700"
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                  title={`${int.toUpperCase()} ${connected ? "(connected)" : "(not connected)"}`}
                >
                  {int[0].toUpperCase()}
                </div>
              );
            })}
          </div>

          {!hasRequiredTier ? (
            <div className="flex items-center gap-1 text-neutral-400 text-xs">
              <Lock className="w-3 h-3" />
              {recipe.minimumTier}
            </div>
          ) : (
            <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          )}
        </div>
      </div>
    </Link>
  );
}
