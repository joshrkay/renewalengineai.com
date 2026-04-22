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
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const { workflowId } = await params;
  const bodyText = await req.text();
  const signature = req.headers.get("x-webhook-signature");

  if (!verifyWebhookSignature(bodyText, signature)) {
    log.warn("Invalid webhook signature for n8n workflow:", workflowId);
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const body = JSON.parse(bodyText);

  const instance = await prisma.automationInstance.findFirst({
    where: { n8nWorkflowId: workflowId },
    include: {
      recipe: true,
      organization: { include: { users: { take: 1 } } },
    },
  });

  if (!instance) {
    return NextResponse.json({ error: "instance_not_found" }, { status: 404 });
  }

  const isError = body.status === "error";

  // Encrypt result data before storage — may contain customer PII
  const encryptedSummary = body.summary ? encrypt(body.summary) : null;
  const encryptedData = body.data ? encrypt(JSON.stringify(body.data)) : null;

  const run = await prisma.workflowRun.create({
    data: {
      automationInstanceId: instance.id,
      status: isError ? "FAILED" : "SUCCESS",
      startedAt: body.startedAt ? new Date(body.startedAt) : new Date(),
      completedAt: new Date(),
      resultSummaryEncrypted: encryptedSummary,
      resultDataEncrypted: encryptedData,
      errorMessage: body.error || null,
      expiresAt: new Date(Date.now() + RESULT_RETENTION_DAYS * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.automationInstance.update({
    where: { id: instance.id },
    data: {
      lastRunAt: new Date(),
      status: isError ? "ERROR" : "ACTIVE",
    },
  });

  await logAudit({
    organizationId: instance.organizationId,
    action: isError ? "automation.run_failed" : "automation.run_completed",
    resource: "WorkflowRun",
    resourceId: run.id,
    metadata: { recipeSlug: instance.recipe.slug, workflowId },
  });

  // Send alert email with sanitized summary (no raw customer data)
  const owner = instance.organization.users[0];
  if (owner?.email) {
    const safeDetails = isError
      ? "An automation error occurred. Check the dashboard for details."
      : "The automation run completed successfully. View results in your dashboard.";
    await sendAutomationAlert(owner.email, instance.recipe.name, isError ? "error" : "completed", safeDetails);
  }

  return NextResponse.json({ runId: run.id });
}
