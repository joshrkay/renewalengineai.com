import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Building2, CreditCard, Users } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  const orgId = (session as any)?.organizationId;

  let org = null;
  let subscription = null;

  if (orgId) {
    org = await prisma.organization.findUnique({
      where: { id: orgId },
    });
    subscription = await prisma.subscription.findFirst({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
    });
  }

  const tierLabels = {
    AUDIT: "AI-Powered Renewal Audit",
    SPRINT: "Build & Launch",
    MANAGED: "Managed AI Operations",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-black">Settings</h1>
        <p className="text-neutral-600 mt-1">
          Manage your organization and billing
        </p>
      </div>

      {/* Organization */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Organization</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-500">Name</p>
            <p className="font-medium">{org?.name || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Created</p>
            <p className="font-medium">
              {org?.createdAt
                ? new Date(org.createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Subscription</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-500">Plan</p>
            <p className="font-medium">
              {org
                ? tierLabels[org.subscriptionTier as keyof typeof tierLabels]
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Status</p>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                org?.subscriptionStatus === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {org?.subscriptionStatus || "—"}
            </span>
          </div>
          {subscription?.currentPeriodEnd && (
            <div>
              <p className="text-sm text-neutral-500">Current Period Ends</p>
              <p className="font-medium">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Account</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-500">Name</p>
            <p className="font-medium">{session?.user?.name || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Email</p>
            <p className="font-medium">{session?.user?.email || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
