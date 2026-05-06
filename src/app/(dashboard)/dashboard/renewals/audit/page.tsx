import { auth } from "@/lib/auth";
import { getTenantDb } from "@/lib/db";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Audit Log | Policy Renewals | RenewalEngineAI" };

export default async function AuditPage() {
  const session = await auth();
  const orgId = (session as any)?.organizationId;

  let logs: any[] = [];

  if (orgId) {
    const tenantDb = getTenantDb(orgId);
    logs = await (tenantDb as any).emailSendLog.findMany({
      orderBy: { sentAt: "desc" },
      take: 200,
      include: {
        policy: { select: { clientName: true, policyNumber: true, policyType: true } },
      },
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/dashboard/renewals"
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Renewals
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-black">Email Audit Log</h1>
        <p className="text-neutral-600 mt-1">All renewal emails sent by your agency</p>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-16 text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
          <p className="text-xl font-bold text-black mb-2">No emails sent yet</p>
          <p className="text-neutral-500">
            Sent renewal emails will appear here with full delivery details.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-500">{logs.length} email{logs.length !== 1 ? "s" : ""} sent</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-500 text-xs font-semibold uppercase tracking-wide">
                <th className="text-left px-6 py-3">Sent At</th>
                <th className="text-left px-6 py-3">Client</th>
                <th className="text-left px-6 py-3">Policy</th>
                <th className="text-left px-6 py-3">Recipient</th>
                <th className="text-left px-6 py-3">Subject</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                  <td className="px-6 py-3 text-neutral-500 whitespace-nowrap">
                    {new Date(log.sentAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 font-semibold">
                    {log.policy?.clientName ?? "—"}
                  </td>
                  <td className="px-6 py-3">
                    <p>{log.policy?.policyType ?? "—"}</p>
                    <p className="text-neutral-400 text-xs">{log.policy?.policyNumber ?? ""}</p>
                  </td>
                  <td className="px-6 py-3 text-neutral-600">{log.recipientEmail}</td>
                  <td className="px-6 py-3 text-neutral-700 max-w-xs truncate">{log.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
