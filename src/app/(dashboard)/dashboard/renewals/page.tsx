import { auth } from "@/lib/auth";
import { getTenantDb, prisma } from "@/lib/db";
import { AlertCircle, Clock, CheckCircle, History } from "lucide-react";
import Link from "next/link";
import RenewalsClient from "./RenewalsClient";

export const metadata = { title: "Policy Renewals | RenewalEngineAI" };

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default async function RenewalsPage() {
  const session = await auth();
  const orgId = (session as any)?.organizationId;

  let policies: any[] = [];
  let orgName: string | null = null;

  if (orgId) {
    const tenantDb = getTenantDb(orgId);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 90);

    [policies, orgName] = await Promise.all([
      tenantDb.policy.findMany({
        where: { expiresAt: { lte: cutoff } },
        include: {
          renewalDrafts: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { expiresAt: "asc" },
      }),
      prisma.organization.findUnique({ where: { id: orgId }, select: { name: true } }).then((o) => o?.name ?? null),
    ]);
  }

  const urgent = policies.filter((p) => daysUntil(p.expiresAt) <= 30);
  const upcoming = policies.filter((p) => {
    const d = daysUntil(p.expiresAt);
    return d > 30 && d <= 90;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Agency banner */}
      {orgName && (
        <div className="mb-4 px-4 py-2 bg-neutral-900 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          {orgName}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-black">Policy Renewals</h1>
          <p className="text-neutral-600 mt-1">
            AI-powered renewal outreach for your agency
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/renewals/audit"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-white border border-neutral-200 text-black hover:bg-neutral-50 transition-colors"
          >
            <History className="w-4 h-4" /> Audit Log
          </Link>
          {/* Action buttons only — no table rendered here */}
          <RenewalsClient initialPolicies={[]} actionsOnly />
        </div>
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-neutral-300" />
          </div>
          <p className="text-xl font-bold text-black mb-2">Start tracking your renewals</p>
          <p className="text-neutral-500 mb-2 max-w-md mx-auto">
            Add policies expiring in the next 90 days and let AI draft personalized renewal emails — ready to send in one click.
          </p>
          <p className="text-xs text-neutral-400 mb-8">
            Most agencies recover 15–30% more renewals with proactive outreach.
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
