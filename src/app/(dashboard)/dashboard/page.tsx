import { auth } from "@/lib/auth";
import { prisma, getTenantDb } from "@/lib/db";
import { Activity, Zap, Link2, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const orgId = (session as any)?.organizationId;

  let org = null;
  let activeAutomations = 0;
  let connectedIntegrations = 0;
  let recentRuns: any[] = [];

  if (orgId) {
    const tenantDb = getTenantDb(orgId);

    org = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    activeAutomations = await tenantDb.automationInstance.count({
      where: { status: "ACTIVE" },
    });

    connectedIntegrations = await tenantDb.oAuthConnection.count({
      where: { status: "CONNECTED" },
    });

    recentRuns = await prisma.workflowRun.findMany({
      where: {
        automationInstance: { organizationId: orgId },
      },
      include: {
        automationInstance: {
          include: { recipe: true },
        },
      },
      orderBy: { startedAt: "desc" },
      take: 10,
    });
  }

  const tierLabels = {
    AUDIT: "AI-Powered Renewal Audit",
    SPRINT: "Build & Launch",
    MANAGED: "Managed AI Operations",
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-black">Dashboard</h1>
        <p className="text-neutral-600 mt-1">
          Welcome back, {session?.user?.name || "there"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Plan"
          value={org ? tierLabels[org.subscriptionTier] : "—"}
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
        />
        <StatCard
          label="Active Automations"
          value={activeAutomations.toString()}
          icon={<Zap className="w-5 h-5 text-orange-500" />}
        />
        <StatCard
          label="Connected Integrations"
          value={connectedIntegrations.toString()}
          icon={<Link2 className="w-5 h-5 text-blue-500" />}
        />
        <StatCard
          label="Workflow Runs (Recent)"
          value={recentRuns.length.toString()}
          icon={<Activity className="w-5 h-5 text-green-500" />}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h2 className="text-xl font-bold text-black mb-4">Recent Activity</h2>
        {recentRuns.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
            <p className="font-medium">No workflow runs yet</p>
            <p className="text-sm mt-1">
              Activate an automation recipe to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentRuns.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-sm">
                    {run.automationInstance.recipe.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(run.startedAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    run.status === "SUCCESS"
                      ? "bg-green-100 text-green-700"
                      : run.status === "FAILED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {run.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-black text-black">{value}</p>
      <p className="text-sm text-neutral-500 mt-1">{label}</p>
    </div>
  );
}
