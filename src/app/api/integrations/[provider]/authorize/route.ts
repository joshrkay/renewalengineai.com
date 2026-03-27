import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";

// Providers that use OAuth 2.0 redirect flow
const OAUTH_CONFIG: Record<
  string,
  {
    authUrl: string;
    clientIdEnv: string;
    scopes: string;
    redirectPath: string;
    extraParams?: Record<string, string>;
    usePkce?: boolean;
  }
> = {
  gmail: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    clientIdEnv: "GMAIL_CLIENT_ID",
    scopes: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly",
    redirectPath: "/api/integrations/gmail/callback",
    usePkce: true,
  },
  outlook: {
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    clientIdEnv: "OUTLOOK_CLIENT_ID",
    scopes: "Mail.Send Mail.ReadWrite offline_access",
    redirectPath: "/api/integrations/outlook/callback",
    extraParams: { response_mode: "query" },
  },
  hubspot: {
    authUrl: "https://app.hubspot.com/oauth/authorize",
    clientIdEnv: "HUBSPOT_CLIENT_ID",
    scopes: "crm.objects.contacts.read crm.objects.contacts.write crm.objects.deals.read",
    redirectPath: "/api/integrations/hubspot/callback",
  },
  salesforce: {
    authUrl: "https://login.salesforce.com/services/oauth2/authorize",
    clientIdEnv: "SALESFORCE_CLIENT_ID",
    scopes: "api refresh_token",
    redirectPath: "/api/integrations/salesforce/callback",
  },
  applied_epic: {
    authUrl: "https://login.myappliedproducts.com/identity/connect/authorize",
    clientIdEnv: "APPLIED_EPIC_CLIENT_ID",
    scopes: "epic/clients:read epic/policies:read epic/contacts:read",
    redirectPath: "/api/integrations/applied_epic/callback",
  },
  ezlynx: {
    authUrl: "https://app.ezlynx.com/oauth/authorize",
    clientIdEnv: "EZLYNX_CLIENT_ID",
    scopes: "applicants policies contacts",
    redirectPath: "/api/integrations/ezlynx/callback",
  },
};

// Providers that use API keys / basic auth (NOT OAuth)
const CREDENTIAL_PROVIDERS = new Set(["hawksoft", "twilio"]);

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

  // Non-OAuth providers should use the credential form, not this route
  if (CREDENTIAL_PROVIDERS.has(providerKey)) {
    return NextResponse.json(
      { error: "use_credential_form", message: `${provider} uses API key authentication. Use the credential form instead.` },
      { status: 400 }
    );
  }

  const config = OAUTH_CONFIG[providerKey];
  if (!config) {
    return NextResponse.json({ error: "unsupported_provider" }, { status: 400 });
  }

  const clientId = process.env[config.clientIdEnv];
  if (!clientId) {
    return NextResponse.json({ error: "provider_not_configured" }, { status: 500 });
  }

  // Use NEXTAUTH_URL for consistent redirect URIs across environments
  const baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: "NEXTAUTH_URL not configured" }, { status: 500 });
  }
  const redirectUri = `${baseUrl}${config.redirectPath}`;

  const orgId = (session as any).organizationId || "";

  const authUrl = new URL(config.authUrl);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", config.scopes);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", orgId);

  // Apply provider-specific extra params (e.g., response_mode for Microsoft)
  if (config.extraParams) {
    for (const [key, value] of Object.entries(config.extraParams)) {
      authUrl.searchParams.set(key, value);
    }
  }

  // PKCE support (required by Google, recommended for all)
  if (config.usePkce) {
    const codeVerifier = randomBytes(32).toString("base64url");
    const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");

    authUrl.searchParams.set("code_challenge", codeChallenge);
    authUrl.searchParams.set("code_challenge_method", "S256");

    // Store code_verifier in a secure HTTP-only cookie for the callback to use
    const cookieStore = await cookies();
    cookieStore.set(`pkce_${providerKey}`, codeVerifier, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });
  }

  return NextResponse.redirect(authUrl.toString());
}
