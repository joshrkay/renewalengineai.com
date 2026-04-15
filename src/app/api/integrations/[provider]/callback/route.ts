import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/encryption";
import { logAudit } from "@/lib/audit";
import { log } from "@/lib/logger";
import { cookies } from "next/headers";

const TOKEN_CONFIG: Record<
  string,
  { tokenUrl: string; clientIdEnv: string; clientSecretEnv: string; redirectPath: string; usePkce?: boolean }
> = {
  gmail: {
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientIdEnv: "GMAIL_CLIENT_ID",
    clientSecretEnv: "GMAIL_CLIENT_SECRET",
    redirectPath: "/api/integrations/gmail/callback",
    usePkce: true,
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
  applied_epic: {
    tokenUrl: "https://login.myappliedproducts.com/identity/connect/token",
    clientIdEnv: "APPLIED_EPIC_CLIENT_ID",
    clientSecretEnv: "APPLIED_EPIC_CLIENT_SECRET",
    redirectPath: "/api/integrations/applied_epic/callback",
  },
  ezlynx: {
    tokenUrl: "https://app.ezlynx.com/oauth/token",
    clientIdEnv: "EZLYNX_CLIENT_ID",
    clientSecretEnv: "EZLYNX_CLIENT_SECRET",
    redirectPath: "/api/integrations/ezlynx/callback",
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
  const providerKey = provider.toLowerCase();
  const config = TOKEN_CONFIG[providerKey];

  if (!config) {
    return NextResponse.redirect(
      new URL("/dashboard/settings/integrations?error=unsupported_provider", req.url)
    );
  }

  const code = req.nextUrl.searchParams.get("code");
  const stateParam = req.nextUrl.searchParams.get("state");
  const errorParam = req.nextUrl.searchParams.get("error");

  // Handle provider-side errors (user denied, etc.)
  if (errorParam) {
    log.warn("OAuth denied by user for provider:", providerKey);
    return NextResponse.redirect(
      new URL(`/dashboard/settings/integrations?error=${errorParam}`, req.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/dashboard/settings/integrations?error=no_code", req.url)
    );
  }

  // Validate CSRF state token from cookie
  const cookieStore = await cookies();
  const stateCookie = cookieStore.get(`oauth_state_${providerKey}`)?.value;
  let orgId: string | null = null;

  if (stateCookie) {
    try {
      const stored = JSON.parse(stateCookie);
      if (stored.token !== stateParam) {
        log.warn("OAuth state mismatch for provider:", providerKey);
        return NextResponse.redirect(
          new URL("/dashboard/settings/integrations?error=invalid_state", req.url)
        );
      }
      orgId = stored.orgId;
    } catch {
      log.warn("Invalid OAuth state cookie for provider:", providerKey);
    }
    cookieStore.delete(`oauth_state_${providerKey}`);
  }

  if (!orgId) {
    orgId = (session as any).organizationId;
  }

  if (!orgId) {
    return NextResponse.redirect(
      new URL("/dashboard/settings/integrations?error=no_org", req.url)
    );
  }

  const clientId = process.env[config.clientIdEnv]!;
  const clientSecret = process.env[config.clientSecretEnv]!;
  const baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) {
    return NextResponse.redirect(
      new URL("/dashboard/settings/integrations?error=config_missing", req.url)
    );
  }
  const redirectUri = `${baseUrl}${config.redirectPath}`;

  try {
    // Build token exchange params
    const tokenParams: Record<string, string> = {
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    };

    // Include PKCE code_verifier if this provider uses it
    if (config.usePkce) {
      const cookieStore = await cookies();
      const codeVerifier = cookieStore.get(`pkce_${providerKey}`)?.value;
      if (codeVerifier) {
        tokenParams.code_verifier = codeVerifier;
        // Clear the PKCE cookie
        cookieStore.delete(`pkce_${providerKey}`);
      }
    }

    const tokenRes = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(tokenParams),
    });

    const tokens = await tokenRes.json();

    if (!tokens.access_token) {
      log.error("Token exchange failed for provider:", providerKey, "status:", tokenRes.status);
      return NextResponse.redirect(
        new URL("/dashboard/settings/integrations?error=token_exchange_failed", req.url)
      );
    }

    const providerEnum = PROVIDER_MAP[providerKey] as any;

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
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
        tokenExpiresAt: tokens.expires_in
          ? new Date(Date.now() + tokens.expires_in * 1000)
          : null,
        scopes: tokens.scope || null,
        status: "CONNECTED",
      },
      update: {
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : undefined,
        tokenExpiresAt: tokens.expires_in
          ? new Date(Date.now() + tokens.expires_in * 1000)
          : null,
        scopes: tokens.scope || null,
        status: "CONNECTED",
      },
    });

    await logAudit({
      organizationId: orgId,
      userId: (session.user as any).id,
      action: "oauth.connected",
      resource: "OAuthConnection",
      metadata: { provider: providerKey },
    });

    return NextResponse.redirect(
      new URL("/dashboard/settings/integrations?connected=" + providerKey, req.url)
    );
  } catch (e) {
    log.error("OAuth callback error for provider:", providerKey);
    return NextResponse.redirect(
      new URL("/dashboard/settings/integrations?error=callback_failed", req.url)
    );
  }
}
