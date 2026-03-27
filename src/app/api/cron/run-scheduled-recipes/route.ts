import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runLangGraphRecipe } from "@/lib/recipe-engine";
import * as n8n from "@/lib/n8n";

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Find all active automation instances that are due for a scheduled run
  const activeInstances = await prisma.automationInstance.findMany({
    where: { status: "ACTIVE" },
    include: { recipe: true },
  });

  let triggered = 0;
  let errors = 0;

  for (const instance of activeInstances) {
    const config = instance.config as any;
    const schedule = config?.schedule;

    if (!schedule) continue; // Not a scheduled recipe

    // Check if it's time to run based on schedule
    const shouldRun = isTimeToRun(schedule, instance.lastRunAt);
    if (!shouldRun) continue;

    try {
      if (instance.recipe.engineType === "LANGGRAPH" || instance.recipe.engineType === "HYBRID") {
        // Run the LangGraph component
        if (instance.recipe.langGraphId) {
          await runLangGraphRecipe(instance.id, instance.organizationId);
          triggered++;
        }
      }

      if (instance.recipe.engineType === "N8N" && instance.n8nWorkflowId) {
        // For n8n-only scheduled recipes, trigger an execution
        await n8n.executeWorkflow(instance.n8nWorkflowId);

        await prisma.automationInstance.update({
          where: { id: instance.id },
          data: { lastRunAt: new Date() },
        });
        triggered++;
      }
    } catch (e) {
      console.error(`Scheduled run failed for instance ${instance.id}:`, e);
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

  return NextResponse.json({ activeInstances: activeInstances.length, triggered, errors });
}

function isTimeToRun(schedule: string, lastRunAt: Date | null): boolean {
  if (!lastRunAt) return true; // Never run before

  const now = new Date();
  const elapsed = now.getTime() - lastRunAt.getTime();
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
