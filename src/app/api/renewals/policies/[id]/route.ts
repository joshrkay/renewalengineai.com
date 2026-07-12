import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, getTenantDb } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const orgId = (session as any)?.organizationId;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.policy.findFirst({
    where: { id, organizationId: orgId },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const { clientName, clientEmail, policyNumber, policyType, carrier, premiumAmount, expiresAt, notes } = body as {
    clientName?: string; clientEmail?: string; policyNumber?: string;
    policyType?: string; carrier?: string; premiumAmount?: unknown;
    expiresAt?: unknown; notes?: string;
  };

  // Validate the two parsed fields up front so typos surface as 400s
  // instead of Prisma validation 500s.
  let parsedPremium: number | undefined;
  if (premiumAmount !== undefined) {
    parsedPremium = parseFloat(String(premiumAmount));
    if (!Number.isFinite(parsedPremium)) {
      return NextResponse.json({ error: "invalid_premium_amount" }, { status: 400 });
    }
  }
  let parsedExpiresAt: Date | undefined;
  if (expiresAt !== undefined) {
    parsedExpiresAt = new Date(String(expiresAt));
    if (Number.isNaN(parsedExpiresAt.getTime())) {
      return NextResponse.json({ error: "invalid_expires_at" }, { status: 400 });
    }
  }

  const tenantDb = getTenantDb(orgId);
  const policy = await tenantDb.policy.update({
    where: { id },
    data: {
      ...(clientName !== undefined && { clientName }),
      ...(clientEmail !== undefined && { clientEmail }),
      ...(policyNumber !== undefined && { policyNumber }),
      ...(policyType !== undefined && { policyType }),
      ...(carrier !== undefined && { carrier }),
      ...(parsedPremium !== undefined && { premiumAmount: parsedPremium }),
      ...(parsedExpiresAt !== undefined && { expiresAt: parsedExpiresAt }),
      ...(notes !== undefined && { notes }),
    },
  });

  return NextResponse.json(policy);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const orgId = (session as any)?.organizationId;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.policy.findFirst({
    where: { id, organizationId: orgId },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.policy.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
