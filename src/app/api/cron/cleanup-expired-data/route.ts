import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { log } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Delete expired workflow run results (configurable retention period, default 90 days)
  const expiredRuns = await prisma.workflowRun.deleteMany({
    where: {
      expiresAt: { lte: now },
    },
  });

  // Delete expired password reset tokens
  const expiredTokens = await prisma.passwordResetToken.deleteMany({
    where: {
      expiresAt: { lte: now },
    },
  });

  // Delete old audit logs (keep 1 year)
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  const expiredAuditLogs = await prisma.auditLog.deleteMany({
    where: {
      createdAt: { lte: oneYearAgo },
    },
  });

  log.info("[cleanup] Expired data removed:", {
    workflowRuns: expiredRuns.count,
    resetTokens: expiredTokens.count,
    auditLogs: expiredAuditLogs.count,
  });

  return NextResponse.json({
    deletedWorkflowRuns: expiredRuns.count,
    deletedResetTokens: expiredTokens.count,
    deletedAuditLogs: expiredAuditLogs.count,
  });
}
