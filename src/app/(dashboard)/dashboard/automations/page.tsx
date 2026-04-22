import { auth } from "@/lib/auth";
import { getTenantDb } from "@/lib/db";
import { Activity, Pause, Play, Trash2 } from "lucide-react";
import { AutomationActions } from "@/components/dashboard/AutomationActions";

export default async function AutomationsPage() {
  const session = await auth();
  const orgId = (session as any)?.organizationId;

  const instances = orgId
    ? await getTenantDb(orgId).automationInstance.findMany({
        where: {},
        include: {
          recipe: true,
          runs: {
            orderBy: { startedAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-black">Active Automations</h1>
        <p className="text-neutral-600 mt-1">
          Monitor and manage your running automations
        </p>
      </div>

      {instances.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
          <Activity className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
          <p className="text-lg font-medium text-neutral-600">
            No active automations
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            Go to Recipes to activate your first automation
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {instances.map((instance) => {
            const lastRun = instance.runs[0];
            return (
              <div
                key={instance.id}
                className="bg-white rounded-2xl border border-neutral-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-black">
                        {instance.recipe.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          instance.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : instance.status === "PAUSED"
                            ? "bg-yellow-100 text-yellow-700"
                            : instance.status === "ERROR"
                            ? "bg-red-100 text-red-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {instance.status}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500">
                      {instance.recipe.description}
                    </p>
                    {lastRun && (
                      <p className="text-xs text-neutral-400 mt-2">
                        Last run: {new Date(lastRun.startedAt).toLocaleString()}{" "}
                        — {lastRun.status}
                      </p>
                    )}
                  </div>
                  <AutomationActions
                    automationId={instance.id}
                    status={instance.status}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
