import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// OAuth configuration per provider
const OAUTH_CONFIG: Record<
  string,
  { authUrl: string; clientIdEnv: string; scopes: string; redirectPath: string }
> = {
  gmail: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    clientIdEnv: "GMAIL_CLIENT_ID",
    scopes: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly",
    redirectPath: "/api/integrations/gmail/callback",
  },
  outlook: {
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    clientIdEnv: "OUTLOOK_CLIENT_ID",
    scopes: "Mail.Send Mail.ReadWrite offline_access",
    redirectPath: "/api/integrations/outlook/callback",
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
  const config = OAUTH_CONFIG[provider.toLowerCase()];

  if (!config) {
    return NextResponse.json({ error: "unsupported_provider" }, { status: 400 });
  }

  const clientId = process.env[config.clientIdEnv];
  if (!clientId) {
    return NextResponse.json(
      { error: "provider_not_configured" },
      { status: 500 }
    );
  }

  const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const redirectUri = `${origin}${config.redirectPath}`;

  const authUrl = new URL(config.authUrl);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", config.scopes);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", (session as any).organizationId || "");

  return NextResponse.redirect(authUrl.toString());
}
