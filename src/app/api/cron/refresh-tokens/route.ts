import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decrypt, encrypt } from "@/lib/encryption";
import { sendTokenExpiryWarning } from "@/lib/email";

// Token endpoint configuration per provider
const TOKEN_REFRESH_CONFIG: Record<string, { tokenUrl: string; clientIdEnv: string; clientSecretEnv: string }> = {
  GMAIL: {
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientIdEnv: "GMAIL_CLIENT_ID",
    clientSecretEnv: "GMAIL_CLIENT_SECRET",
  },
  OUTLOOK: {
    tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    clientIdEnv: "OUTLOOK_CLIENT_ID",
    clientSecretEnv: "OUTLOOK_CLIENT_SECRET",
  },
  HUBSPOT: {
    tokenUrl: "https://api.hubapi.com/oauth/v1/token",
    clientIdEnv: "HUBSPOT_CLIENT_ID",
    clientSecretEnv: "HUBSPOT_CLIENT_SECRET",
  },
  SALESFORCE: {
    tokenUrl: "https://login.salesforce.com/services/oauth2/token",
    clientIdEnv: "SALESFORCE_CLIENT_ID",
    clientSecretEnv: "SALESFORCE_CLIENT_SECRET",
  },
};

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const soon = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  const expiringConnections = await prisma.oAuthConnection.findMany({
    where: {
      status: "CONNECTED",
      refreshToken: { not: null },
      tokenExpiresAt: { lte: soon },
    },
    include: {
      organization: { include: { users: { take: 1 } } },
    },
  });

  let refreshed = 0;
  let warned = 0;
  let failed = 0;

  for (const connection of expiringConnections) {
    const config = TOKEN_REFRESH_CONFIG[connection.provider];
    if (!config) {
      // Provider doesn't support refresh (API key-based) — warn user
      const owner = connection.organization.users[0];
      if (owner?.email) {
        await sendTokenExpiryWarning(owner.email, connection.provider);
        warned++;
      }
      continue;
    }

    const clientId = process.env[config.clientIdEnv];
    const clientSecret = process.env[config.clientSecretEnv];

    if (!clientId || !clientSecret || !connection.refreshToken) {
      const owner = connection.organization.users[0];
      if (owner?.email) {
        await sendTokenExpiryWarning(owner.email, connection.provider);
        warned++;
      }
      continue;
    }

    try {
      const refreshToken = decrypt(connection.refreshToken);
      const tokenRes = await fetch(config.tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      const tokens = await tokenRes.json();

      if (tokens.access_token) {
        await prisma.oAuthConnection.update({
          where: { id: connection.id },
          data: {
            accessToken: encrypt(tokens.access_token),
            refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : undefined,
            tokenExpiresAt: tokens.expires_in
              ? new Date(Date.now() + tokens.expires_in * 1000)
              : null,
            status: "CONNECTED",
          },
        });
        refreshed++;
      } else {
        throw new Error(tokens.error || "No access token in response");
      }
    } catch (e) {
      console.error(`Token refresh failed for ${connection.provider} (org ${connection.organizationId}):`, e);
      await prisma.oAuthConnection.update({
        where: { id: connection.id },
        data: { status: "EXPIRED" },
      });
      const owner = connection.organization.users[0];
      if (owner?.email) {
        await sendTokenExpiryWarning(owner.email, connection.provider);
      }
      failed++;
    }
  }

  return NextResponse.json({
    processed: expiringConnections.length,
    refreshed,
    warned,
    failed,
  });
}
