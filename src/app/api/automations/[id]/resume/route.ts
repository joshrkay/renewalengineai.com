import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const orgId = (session as any).organizationId;

  const instance = await prisma.automationInstance.findFirst({
    where: { id, organizationId: orgId },
  });

  if (!instance) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // TODO: Resume workflow in n8n
  await prisma.automationInstance.update({
    where: { id },
    data: { status: "ACTIVE" },
  });

  return NextResponse.json({ status: "ACTIVE" });
}
