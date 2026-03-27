import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/encryption";
import { sendAutomationAlert } from "@/lib/email";
import { verifyWebhookSignature } from "@/lib/webhook-auth";
import { logAudit } from "@/lib/audit";
import { log } from "@/lib/logger";

const RESULT_RETENTION_DAYS = 90;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;
  const bodyText = await req.text();
  const signature = req.headers.get("x-webhook-signature");

  if (!verifyWebhookSignature(bodyText, signature)) {
    log.warn("Invalid webhook signature for LangGraph run:", runId);
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const body = JSON.parse(bodyText);

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

  // Encrypt result data before storage
  const encryptedSummary = body.summary ? encrypt(body.summary) : null;
  const encryptedData = (body.result || body.data)
    ? encrypt(JSON.stringify(body.result || body.data))
    : null;

  await prisma.workflowRun.update({
    where: { id: runId },
    data: {
      status: isError ? "FAILED" : "SUCCESS",
      completedAt: new Date(),
      resultSummaryEncrypted: encryptedSummary,
      resultDataEncrypted: encryptedData,
      errorMessage: body.error || null,
      expiresAt: new Date(Date.now() + RESULT_RETENTION_DAYS * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.automationInstance.update({
    where: { id: run.automationInstanceId },
    data: {
      lastRunAt: new Date(),
      status: isError ? "ERROR" : "ACTIVE",
    },
  });

  await logAudit({
    organizationId: run.automationInstance.organizationId,
    action: isError ? "automation.run_failed" : "automation.run_completed",
    resource: "WorkflowRun",
    resourceId: runId,
    metadata: { recipeSlug: run.automationInstance.recipe.slug },
  });

  const owner = run.automationInstance.organization.users[0];
  if (owner?.email) {
    const safeDetails = isError
      ? "An automation error occurred. Check the dashboard for details."
      : "The automation run completed successfully. View results in your dashboard.";
    await sendAutomationAlert(
      owner.email,
      run.automationInstance.recipe.name,
      isError ? "error" : "completed",
      safeDetails
    );
  }

  return NextResponse.json({ updated: true });
}
