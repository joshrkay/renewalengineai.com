import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deactivateAutomation, ActivationError } from "@/lib/recipe-engine";
import { log } from "@/lib/logger";

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

  try {
    await deactivateAutomation(id, orgId);
    return NextResponse.json({ deleted: true });
  } catch (e) {
    if (e instanceof ActivationError) {
      return NextResponse.json({ error: e.code, message: e.message }, { status: e.statusCode });
    }
    log.error("Deactivation failed:", e);
    return NextResponse.json({ error: "deactivation_failed" }, { status: 500 });
  }
}
