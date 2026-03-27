import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resumeAutomation, ActivationError } from "@/lib/recipe-engine";
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
    await resumeAutomation(id, orgId);
    return NextResponse.json({ status: "ACTIVE" });
  } catch (e) {
    if (e instanceof ActivationError) {
      return NextResponse.json({ error: e.code, message: e.message }, { status: e.statusCode });
    }
    log.error("Resume failed:", e);
    return NextResponse.json({ error: "resume_failed" }, { status: 500 });
  }
}
