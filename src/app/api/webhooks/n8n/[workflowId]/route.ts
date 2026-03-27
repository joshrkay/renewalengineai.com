import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendAutomationAlert } from "@/lib/email";
import { verifyWebhookSignature } from "@/lib/webhook-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const { workflowId } = await params;
  const bodyText = await req.text();
  const signature = req.headers.get("x-webhook-signature");

  if (!verifyWebhookSignature(bodyText, signature)) {
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

  const run = await prisma.workflowRun.create({
    data: {
      automationInstanceId: instance.id,
      status: isError ? "FAILED" : "SUCCESS",
      startedAt: body.startedAt ? new Date(body.startedAt) : new Date(),
      completedAt: new Date(),
      resultSummary: body.summary || null,
      resultData: body.data || null,
      errorMessage: body.error || null,
    },
  });

  await prisma.automationInstance.update({
    where: { id: instance.id },
    data: {
      lastRunAt: new Date(),
      status: isError ? "ERROR" : "ACTIVE",
    },
  });

  const owner = instance.organization.users[0];
  if (owner?.email) {
    await sendAutomationAlert(
      owner.email,
      instance.recipe.name,
      isError ? "error" : "completed",
      isError
        ? body.error || "An error occurred during execution."
        : body.summary || "The automation run completed successfully."
    );
  }

  return NextResponse.json({ runId: run.id });
}
