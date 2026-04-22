import { auth } from "@/lib/auth";
import { getTenantDb } from "@/lib/db";
import { IntegrationsPageClient } from "@/components/dashboard/IntegrationsPageClient";

export default async function IntegrationsSettingsPage() {
  const session = await auth();
  const orgId = (session as any)?.organizationId;

  const connections = orgId
    ? await getTenantDb(orgId).oAuthConnection.findMany({ where: {} })
    : [];

  const connectionMap: Record<string, { id: string; status: string; provider: string }> = {};
  for (const c of connections) {
    connectionMap[c.provider] = { id: c.id, status: c.status, provider: c.provider };
  }

  return <IntegrationsPageClient connectionMap={connectionMap} />;
}
