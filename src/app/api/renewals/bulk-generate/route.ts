import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, getTenantDb } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

async function generateDraftForPolicy(policy: any, orgId: string) {
  const daysToExpiry = daysUntil(policy.expiresAt);
  const expiryStr = policy.expiresAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const prompt = `You are a professional insurance agency assistant writing a renewal outreach email on behalf of the agency.

Policy details:
- Client: ${policy.clientName}
- Policy type: ${policy.policyType}${policy.carrier ? `, carrier: ${policy.carrier}` : ""}
- Policy number: ${policy.policyNumber}
- Expiry date: ${expiryStr} (${daysToExpiry} days away)${policy.premiumAmount ? `\n- Premium: $${policy.premiumAmount.toLocaleString()}` : ""}

Write a professional, warm renewal outreach email. Guidelines:
- Tone: helpful, proactive, not salesy
- Include: the renewal date and a clear call to action (reply or schedule a call)
- Keep it concise (under 200 words)
- Do NOT use generic filler phrases like "I hope this email finds you well"
- Return JSON with two fields: "subject" (email subject line) and "body" (plain text email body, no HTML)`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";

  let subject = `Renewal Notice: Your ${policy.policyType} Policy Expires ${expiryStr}`;
  let body = raw;

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      subject = parsed.subject ?? subject;
      body = parsed.body ?? body;
    }
  } catch {}

  const tenantDb = getTenantDb(orgId);
  return tenantDb.renewalDraft.create({
    data: { organizationId: orgId, policyId: policy.id, subject, body, status: "PENDING" } as any,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const orgId = (session as any)?.organizationId;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { policyIds } = await req.json();
  if (!Array.isArray(policyIds) || policyIds.length === 0) {
    return NextResponse.json({ error: "policyIds array required" }, { status: 400 });
  }
  if (policyIds.length > 20) {
    return NextResponse.json({ error: "Max 20 policies per bulk generate" }, { status: 400 });
  }

  const policies = await prisma.policy.findMany({
    where: { id: { in: policyIds }, organizationId: orgId },
  });

  const drafts = await Promise.all(policies.map((p) => generateDraftForPolicy(p, orgId)));

  return NextResponse.json({ drafts }, { status: 201 });
}
