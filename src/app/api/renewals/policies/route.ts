import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTenantDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  const orgId = (session as any)?.organizationId;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") ?? "90");
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + days);

  const tenantDb = getTenantDb(orgId);
  const policies = await tenantDb.policy.findMany({
    where: { expiresAt: { lte: cutoff } },
    include: {
      renewalDrafts: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { expiresAt: "asc" },
  });

  return NextResponse.json(policies);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const orgId = (session as any)?.organizationId;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { clientName, clientEmail, policyNumber, policyType, carrier, premiumAmount, expiresAt, notes } = body;

  if (!clientName || !clientEmail || !policyNumber || !policyType || !expiresAt) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const tenantDb = getTenantDb(orgId);
  const policy = await tenantDb.policy.create({
    data: {
      organizationId: orgId,
      clientName,
      clientEmail,
      policyNumber,
      policyType,
      carrier,
      premiumAmount: premiumAmount ? parseFloat(premiumAmount) : null,
      expiresAt: new Date(expiresAt),
      notes,
    },
  });

  return NextResponse.json(policy, { status: 201 });
}
