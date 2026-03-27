import { auth } from "@/lib/auth";
import { getTenantDb } from "@/lib/db";
import { IntegrationCard } from "@/components/dashboard/IntegrationCard";

const AVAILABLE_INTEGRATIONS = [
  {
    provider: "GMAIL",
    name: "Gmail",
    description: "Send email campaigns and follow-ups via Gmail",
    category: "Email",
  },
  {
    provider: "OUTLOOK",
    name: "Microsoft Outlook",
    description: "Send email campaigns and follow-ups via Outlook",
    category: "Email",
  },
  {
    provider: "HUBSPOT",
    name: "HubSpot",
    description: "Sync contacts, deals, and pipeline data",
    category: "CRM",
  },
  {
    provider: "SALESFORCE",
    name: "Salesforce",
    description: "Sync contacts, opportunities, and pipeline data",
    category: "CRM",
  },
  {
    provider: "TWILIO",
    name: "Twilio",
    description: "Send SMS, voice calls, and automated phone outreach",
    category: "Phone & SMS",
  },
  {
    provider: "APPLIED_EPIC",
    name: "Applied Epic",
    description: "Connect your Applied Epic AMS for policy and renewal data",
    category: "AMS",
  },
  {
    provider: "HAWKSOFT",
    name: "HawkSoft",
    description: "Connect your HawkSoft AMS for policy and renewal data",
    category: "AMS",
  },
  {
    provider: "EZLYNX",
    name: "EZLynx",
    description: "Connect your EZLynx AMS for policy and renewal data",
    category: "AMS",
  },
];

export default async function IntegrationsPage() {
  const session = await auth();
  const orgId = (session as any)?.organizationId;

  const connections = orgId
    ? await getTenantDb(orgId).oAuthConnection.findMany({
        where: {},
      })
    : [];

  const connectionMap = new Map(connections.map((c) => [c.provider, c]));

  const categories = [...new Set(AVAILABLE_INTEGRATIONS.map((i) => i.category))];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-black">Integrations</h1>
        <p className="text-neutral-600 mt-1">
          Connect your tools to power your automation recipes
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-bold text-black mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AVAILABLE_INTEGRATIONS.filter((i) => i.category === category).map(
              (integration) => (
                <IntegrationCard
                  key={integration.provider}
                  integration={integration}
                  connection={connectionMap.get(integration.provider as any)}
                />
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
