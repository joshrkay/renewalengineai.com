import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, getTenantDb } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  const orgId = (session as any)?.organizationId;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.policy.findFirst({
    where: { id: params.id, organizationId: orgId },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { clientName, clientEmail, policyNumber, policyType, carrier, premiumAmount, expiresAt, notes } = body;

  const tenantDb = getTenantDb(orgId);
  const policy = await tenantDb.policy.update({
    where: { id: params.id },
    data: {
      ...(clientName !== undefined && { clientName }),
      ...(clientEmail !== undefined && { clientEmail }),
      ...(policyNumber !== undefined && { policyNumber }),
      ...(policyType !== undefined && { policyType }),
      ...(carrier !== undefined && { carrier }),
      ...(premiumAmount !== undefined && { premiumAmount: parseFloat(premiumAmount) }),
      ...(expiresAt !== undefined && { expiresAt: new Date(expiresAt) }),
      ...(notes !== undefined && { notes }),
    },
  });

  return NextResponse.json(policy);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  const orgId = (session as any)?.organizationId;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.policy.findFirst({
    where: { id: params.id, organizationId: orgId },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.policy.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
