import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runLangGraphRecipe } from "@/lib/recipe-engine";
import * as n8n from "@/lib/n8n";
import { log } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Group by organization so each tenant is processed independently
  const orgs = await prisma.organization.findMany({
    where: {
      subscriptionStatus: "ACTIVE",
      automationInstances: { some: { status: "ACTIVE" } },
    },
    select: { id: true },
  });

  let triggered = 0;
  let errors = 0;
  const orgResults: Record<string, { triggered: number; errors: number }> = {};

  for (const org of orgs) {
    orgResults[org.id] = { triggered: 0, errors: 0 };

    // Fetch only this org's active instances
    const instances = await prisma.automationInstance.findMany({
      where: { organizationId: org.id, status: "ACTIVE" },
      include: { recipe: true },
    });

    for (const instance of instances) {
      const config = instance.config as any;
      const schedule = config?.schedule;

      if (!schedule) continue;
      if (!isTimeToRun(schedule, instance.lastRunAt)) continue;

      try {
        if (instance.recipe.engineType === "LANGGRAPH" || instance.recipe.engineType === "HYBRID") {
          if (instance.recipe.langGraphId) {
            await runLangGraphRecipe(instance.id, instance.organizationId);
            orgResults[org.id].triggered++;
            triggered++;
          }
        }

        if (instance.recipe.engineType === "N8N" && instance.n8nWorkflowId) {
          await n8n.executeWorkflow(instance.n8nWorkflowId);

          await prisma.automationInstance.update({
            where: { id: instance.id },
            data: { lastRunAt: new Date() },
          });
          orgResults[org.id].triggered++;
          triggered++;
        }
      } catch (e) {
        log.error(`[org:${org.id}] Scheduled run failed for instance ${instance.id}:`, e);
        orgResults[org.id].errors++;
        errors++;

        await prisma.workflowRun.create({
          data: {
            automationInstanceId: instance.id,
            status: "FAILED",
            completedAt: new Date(),
            errorMessage: String(e),
          },
        });
      }
    }
  }

  return NextResponse.json({ orgsProcessed: orgs.length, triggered, errors });
}

function isTimeToRun(schedule: string, lastRunAt: Date | null): boolean {
  if (!lastRunAt) return true;

  const elapsed = Date.now() - lastRunAt.getTime();
  const ONE_HOUR = 3600_000;
  const ONE_DAY = 86400_000;

  switch (schedule) {
    case "hourly":
      return elapsed >= ONE_HOUR;
    case "daily":
      return elapsed >= ONE_DAY;
    case "weekly":
      return elapsed >= 7 * ONE_DAY;
    case "monthly":
      return elapsed >= 30 * ONE_DAY;
    default:
      return false;
  }
}
