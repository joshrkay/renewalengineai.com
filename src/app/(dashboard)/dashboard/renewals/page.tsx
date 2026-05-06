import { auth } from "@/lib/auth";
import { getTenantDb } from "@/lib/db";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import RenewalsClient from "./RenewalsClient";

export const metadata = { title: "Policy Renewals | RenewalEngineAI" };

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default async function RenewalsPage() {
  const session = await auth();
  const orgId = (session as any)?.organizationId;

  let policies: any[] = [];

  if (orgId) {
    const tenantDb = getTenantDb(orgId);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 90);

    policies = await tenantDb.policy.findMany({
      where: { expiresAt: { lte: cutoff } },
      include: {
        renewalDrafts: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { expiresAt: "asc" },
    });
  }

  const urgent = policies.filter((p) => daysUntil(p.expiresAt) <= 30);
  const upcoming = policies.filter((p) => {
    const d = daysUntil(p.expiresAt);
    return d > 30 && d <= 90;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-black">Policy Renewals</h1>
          <p className="text-neutral-600 mt-1">
            AI-powered renewal outreach for your agency
          </p>
        </div>
        {/* Action buttons only — no table rendered here */}
        <RenewalsClient initialPolicies={[]} actionsOnly />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Urgent (≤30 days)"
          value={urgent.length}
          icon={<AlertCircle className="w-5 h-5 text-red-500" />}
          color="red"
        />
        <StatCard
          label="Upcoming (31–90 days)"
          value={upcoming.length}
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          color="amber"
        />
        <StatCard
          label="Total tracked"
          value={policies.length}
          icon={<CheckCircle className="w-5 h-5 text-green-500" />}
          color="green"
        />
      </div>

      {/* Urgent renewals */}
      {urgent.length > 0 && (
        <Section title="Urgent Renewals" subtitle="Expiring within 30 days">
          <RenewalsClient initialPolicies={urgent} />
        </Section>
      )}

      {/* Upcoming renewals */}
      {upcoming.length > 0 && (
        <Section title="Upcoming Renewals" subtitle="Expiring in 31–90 days">
          <RenewalsClient initialPolicies={upcoming} />
        </Section>
      )}

      {/* Empty state */}
      {policies.length === 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-16 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
          <p className="text-xl font-bold text-black mb-2">No policies tracked yet</p>
          <p className="text-neutral-500 mb-6">
            Add your first policy or import from a CSV to start tracking renewals.
          </p>
          <div className="flex justify-center">
            <RenewalsClient initialPolicies={[]} actionsOnly primaryCta />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "red" | "amber" | "green";
}) {
  const bg = { red: "bg-red-50", amber: "bg-amber-50", green: "bg-green-50" }[color];
  return (
    <div className={`${bg} rounded-2xl border border-neutral-200 p-6`}>
      <div className="flex items-center gap-3 mb-3">{icon}</div>
      <p className="text-3xl font-black text-black">{value}</p>
      <p className="text-sm text-neutral-600 mt-1">{label}</p>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <span className="text-sm text-neutral-500">{subtitle}</span>
      </div>
      {children}
    </div>
  );
}
