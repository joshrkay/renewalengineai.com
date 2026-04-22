import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/encryption";
import { logAudit } from "@/lib/audit";
import { log } from "@/lib/logger";

// Validation config for credential-based providers
const CREDENTIAL_PROVIDERS: Record<
  string,
  {
    providerEnum: string;
    requiredFields: string[];
    testUrl?: string;
    buildTestAuth: (creds: Record<string, string>) => { headers: Record<string, string> };
  }
> = {
  hawksoft: {
    providerEnum: "HAWKSOFT",
    requiredFields: ["clientId", "clientSecret"],
    testUrl: "https://partner.hawksoft.app/v3/agencies",
    buildTestAuth: (creds) => ({
      headers: {
        Authorization: "Basic " + Buffer.from(`${creds.clientId}:${creds.clientSecret}`).toString("base64"),
      },
    }),
  },
  twilio: {
    providerEnum: "TWILIO",
    requiredFields: ["accountSid", "authToken"],
    testUrl: "https://api.twilio.com/2010-04-01/Accounts/{accountSid}.json",
    buildTestAuth: (creds) => ({
      headers: {
        Authorization: "Basic " + Buffer.from(`${creds.accountSid}:${creds.authToken}`).toString("base64"),
      },
    }),
  },
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
  const providerKey = provider.toLowerCase();
  const config = CREDENTIAL_PROVIDERS[providerKey];

  if (!config) {
    return NextResponse.json(
      { error: "unsupported_provider", message: `${provider} does not use credential-based auth` },
      { status: 400 }
    );
  }

  const orgId = (session as any).organizationId;
  if (!orgId) {
    return NextResponse.json({ error: "no_organization" }, { status: 400 });
  }

  const body = await req.json();

  // Validate required fields
  for (const field of config.requiredFields) {
    if (!body[field] || typeof body[field] !== "string" || !body[field].trim()) {
      return NextResponse.json(
        { error: "missing_field", field, message: `${field} is required` },
        { status: 400 }
      );
    }
  }

  // Test the credentials against the provider API
  if (config.testUrl) {
    try {
      let testUrl = config.testUrl;
      // Replace any template variables in the URL
      for (const [key, value] of Object.entries(body)) {
        testUrl = testUrl.replace(`{${key}}`, value as string);
      }

      const testAuth = config.buildTestAuth(body);
      const testRes = await fetch(testUrl, {
        method: "GET",
        headers: testAuth.headers,
      });

      if (!testRes.ok) {
        log.warn("Credential validation failed for provider:", providerKey, "status:", testRes.status);
        return NextResponse.json(
          { error: "invalid_credentials", message: "The credentials could not be verified. Please check and try again." },
          { status: 401 }
        );
      }
    } catch (e) {
      log.error("Credential test request failed for provider:", providerKey);
      return NextResponse.json(
        { error: "test_failed", message: "Could not reach the provider to validate credentials. Please try again." },
        { status: 502 }
      );
    }
  }

  // Store credentials encrypted (combine into a single access token for storage consistency)
  const credentialPayload = JSON.stringify(body);

  await prisma.oAuthConnection.upsert({
    where: {
      organizationId_provider: {
        organizationId: orgId,
        provider: config.providerEnum as any,
      },
    },
    create: {
      organizationId: orgId,
      provider: config.providerEnum as any,
      accessToken: encrypt(credentialPayload),
      status: "CONNECTED",
    },
    update: {
      accessToken: encrypt(credentialPayload),
      status: "CONNECTED",
    },
  });

  await logAudit({
    organizationId: orgId,
    userId: (session.user as any).id,
    action: "credential.created",
    resource: "OAuthConnection",
    metadata: { provider: providerKey, method: "api_key" },
  });

  return NextResponse.json({ connected: true, provider: providerKey });
}
