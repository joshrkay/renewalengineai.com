import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendRetentionLeakAuditNotification } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import { log } from "@/lib/logger";
import {
  calculateAnnualLeakage,
  MAX_POLICY_COUNT,
  MAX_AVG_PREMIUM,
  AMS_VALUES,
} from "@/lib/retention-leak-audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      email?: unknown;
      name?: unknown;
      agencyName?: unknown;
      policyCount?: unknown;
      currentRetention?: unknown;
      avgPremium?: unknown;
      ams?: unknown;
      source?: unknown;
    };

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const name =
      typeof body.name === "string" && body.name.trim()
        ? body.name.trim().slice(0, 120)
        : null;
    const agencyName =
      typeof body.agencyName === "string" && body.agencyName.trim()
        ? body.agencyName.trim().slice(0, 160)
        : null;

    const policyCount = Number(body.policyCount);
    if (!Number.isFinite(policyCount) || policyCount < 1 || policyCount > MAX_POLICY_COUNT) {
      return NextResponse.json({ error: "invalid_policy_count" }, { status: 400 });
    }

    const currentRetention = Number(body.currentRetention);
    if (
      !Number.isFinite(currentRetention) ||
      currentRetention < 1 ||
      currentRetention > 99
    ) {
      return NextResponse.json({ error: "invalid_retention" }, { status: 400 });
    }

    const avgPremium = Number(body.avgPremium);
    if (!Number.isFinite(avgPremium) || avgPremium < 1 || avgPremium > MAX_AVG_PREMIUM) {
      return NextResponse.json({ error: "invalid_avg_premium" }, { status: 400 });
    }

    const amsRaw = typeof body.ams === "string" ? body.ams.trim() : "";
    const ams = (AMS_VALUES as readonly string[]).includes(amsRaw) ? amsRaw : "";
    if (!ams) {
      return NextResponse.json({ error: "invalid_ams" }, { status: 400 });
    }

    const source =
      typeof body.source === "string" && body.source.trim()
        ? body.source.trim().slice(0, 64)
        : "home";

    const policyCountInt = Math.round(policyCount);
    const currentRetentionInt = Math.round(currentRetention);
    const avgPremiumInt = Math.round(avgPremium);
    const annualLeakage = calculateAnnualLeakage({
      policyCount: policyCountInt,
      currentRetention: currentRetentionInt,
      avgPremium: avgPremiumInt,
    });

    const submission = await prisma.retentionLeakAudit.create({
      data: {
        email,
        name,
        agencyName,
        policyCount: policyCountInt,
        currentRetention: currentRetentionInt,
        avgPremium: avgPremiumInt,
        ams,
        annualLeakage,
        source,
      },
    });

    await logAudit({
      action: "retention_leak_audit.submitted",
      resource: "RetentionLeakAudit",
      resourceId: submission.id,
      metadata: { source, ams, annualLeakage },
    });

    sendRetentionLeakAuditNotification({
      email,
      name,
      agencyName,
      policyCount: policyCountInt,
      currentRetention: currentRetentionInt,
      avgPremium: avgPremiumInt,
      ams,
      annualLeakage,
      source,
    }).catch((err) => {
      log.error("[retention-leak-audit] notification failed:", err);
    });

    return NextResponse.json({ ok: true, annualLeakage });
  } catch (err) {
    log.error("[retention-leak-audit] submission failed:", err);
    return NextResponse.json({ error: "submission_failed" }, { status: 500 });
  }
}
