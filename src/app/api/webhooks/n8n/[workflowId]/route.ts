import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const { workflowId } = await params;
  const body = await req.json();

  // Find the automation instance by n8n workflow ID
  const instance = await prisma.automationInstance.findFirst({
    where: { n8nWorkflowId: workflowId },
  });

  if (!instance) {
    return NextResponse.json({ error: "instance_not_found" }, { status: 404 });
  }

  // Create a workflow run record
  const run = await prisma.workflowRun.create({
    data: {
      automationInstanceId: instance.id,
      status: body.status === "error" ? "FAILED" : "SUCCESS",
      startedAt: body.startedAt ? new Date(body.startedAt) : new Date(),
      completedAt: new Date(),
      resultSummary: body.summary || null,
      resultData: body.data || null,
      errorMessage: body.error || null,
    },
  });

  // Update instance last run time
  await prisma.automationInstance.update({
    where: { id: instance.id },
    data: {
      lastRunAt: new Date(),
      status: body.status === "error" ? "ERROR" : "ACTIVE",
    },
  });

  return NextResponse.json({ runId: run.id });
}
