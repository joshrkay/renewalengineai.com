import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendAutomationAlert } from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;
  const body = await req.json();

  const run = await prisma.workflowRun.findUnique({
    where: { id: runId },
    include: {
      automationInstance: {
        include: {
          recipe: true,
          organization: { include: { users: { take: 1 } } },
        },
      },
    },
  });

  if (!run) {
    return NextResponse.json({ error: "run_not_found" }, { status: 404 });
  }

  const isError = body.status === "error" || body.status === "failed";

  await prisma.workflowRun.update({
    where: { id: runId },
    data: {
      status: isError ? "FAILED" : "SUCCESS",
      completedAt: new Date(),
      resultSummary: body.summary || null,
      resultData: body.result || body.data || null,
      errorMessage: body.error || null,
    },
  });

  await prisma.automationInstance.update({
    where: { id: run.automationInstanceId },
    data: {
      lastRunAt: new Date(),
      status: isError ? "ERROR" : "ACTIVE",
    },
  });

  // Email the org owner about the result
  const owner = run.automationInstance.organization.users[0];
  if (owner?.email) {
    await sendAutomationAlert(
      owner.email,
      run.automationInstance.recipe.name,
      isError ? "error" : "completed",
      isError
        ? body.error || "An error occurred during execution."
        : body.summary || "The automation run completed successfully."
    );
  }

  return NextResponse.json({ updated: true });
}
