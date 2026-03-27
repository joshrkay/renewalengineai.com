import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/encryption";

// Token endpoint configuration per provider
const TOKEN_CONFIG: Record<
  string,
  { tokenUrl: string; clientIdEnv: string; clientSecretEnv: string; redirectPath: string }
> = {
  gmail: {
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientIdEnv: "GMAIL_CLIENT_ID",
    clientSecretEnv: "GMAIL_CLIENT_SECRET",
    redirectPath: "/api/integrations/gmail/callback",
  },
  outlook: {
    tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    clientIdEnv: "OUTLOOK_CLIENT_ID",
    clientSecretEnv: "OUTLOOK_CLIENT_SECRET",
    redirectPath: "/api/integrations/outlook/callback",
  },
  hubspot: {
    tokenUrl: "https://api.hubapi.com/oauth/v1/token",
    clientIdEnv: "HUBSPOT_CLIENT_ID",
    clientSecretEnv: "HUBSPOT_CLIENT_SECRET",
    redirectPath: "/api/integrations/hubspot/callback",
  },
  salesforce: {
    tokenUrl: "https://login.salesforce.com/services/oauth2/token",
    clientIdEnv: "SALESFORCE_CLIENT_ID",
    clientSecretEnv: "SALESFORCE_CLIENT_SECRET",
    redirectPath: "/api/integrations/salesforce/callback",
  },
};

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { provider } = await params;
  const config = TOKEN_CONFIG[provider.toLowerCase()];

  if (!config) {
    return NextResponse.redirect(
      new URL("/dashboard/integrations?error=unsupported_provider", req.url)
    );
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(
      new URL("/dashboard/integrations?error=no_code", req.url)
    );
  }

  const orgId = state || (session as any).organizationId;
  if (!orgId) {
    return NextResponse.redirect(
      new URL("/dashboard/integrations?error=no_org", req.url)
    );
  }

  const clientId = process.env[config.clientIdEnv]!;
  const clientSecret = process.env[config.clientSecretEnv]!;
  const origin = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const redirectUri = `${origin}${config.redirectPath}`;

  // Exchange code for tokens
  try {
    const tokenRes = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokens.access_token) {
      console.error("Token exchange failed:", tokens);
      return NextResponse.redirect(
        new URL("/dashboard/integrations?error=token_exchange_failed", req.url)
      );
    }

    const providerEnum = PROVIDER_MAP[provider.toLowerCase()] as any;

    // Store encrypted tokens
    await prisma.oAuthConnection.upsert({
      where: {
        organizationId_provider: {
          organizationId: orgId,
          provider: providerEnum,
        },
      },
      create: {
        organizationId: orgId,
        provider: providerEnum,
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token
          ? encrypt(tokens.refresh_token)
          : null,
        tokenExpiresAt: tokens.expires_in
          ? new Date(Date.now() + tokens.expires_in * 1000)
          : null,
        scopes: tokens.scope || null,
        status: "CONNECTED",
      },
      update: {
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token
          ? encrypt(tokens.refresh_token)
          : undefined,
        tokenExpiresAt: tokens.expires_in
          ? new Date(Date.now() + tokens.expires_in * 1000)
          : null,
        scopes: tokens.scope || null,
        status: "CONNECTED",
      },
    });

    return NextResponse.redirect(
      new URL("/dashboard/integrations?connected=" + provider, req.url)
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/integrations?error=callback_failed", req.url)
    );
  }
}
