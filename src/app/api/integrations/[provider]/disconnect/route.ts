import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const PROVIDER_MAP: Record<string, string> = {
  gmail: "GMAIL",
  outlook: "OUTLOOK",
  hubspot: "HUBSPOT",
  salesforce: "SALESFORCE",
  twilio: "TWILIO",
  applied_epic: "APPLIED_EPIC",
  hawksoft: "HAWKSOFT",
  ezlynx: "EZLYNX",
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { provider } = await params;
  const orgId = (session as any).organizationId;
  if (!orgId) {
    return NextResponse.json({ error: "no_organization" }, { status: 400 });
  }

  const providerEnum = PROVIDER_MAP[provider.toLowerCase()] as any;
  if (!providerEnum) {
    return NextResponse.json({ error: "unsupported_provider" }, { status: 400 });
  }

  await prisma.oAuthConnection.deleteMany({
    where: {
      organizationId: orgId,
      provider: providerEnum,
    },
  });

  return NextResponse.json({ disconnected: true });
}
