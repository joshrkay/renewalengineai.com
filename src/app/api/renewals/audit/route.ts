import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTenantDb } from "@/lib/db";

export async function GET() {
  const session = await auth();
  const orgId = (session as any)?.organizationId;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantDb = getTenantDb(orgId);
  const logs = await tenantDb.emailSendLog.findMany({
    orderBy: { sentAt: "desc" },
    take: 200,
    include: {
      policy: { select: { clientName: true, policyNumber: true, policyType: true } },
    },
  });

  return NextResponse.json(logs);
}
