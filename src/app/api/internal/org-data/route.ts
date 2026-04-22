import { NextRequest, NextResponse } from "next/server";
import { getClientsForOrg, getPoliciesForOrg, getClaimsForOrg } from "@/lib/ams";
import { log } from "@/lib/logger";

export async function POST(req: NextRequest) {
  // Internal API — secured by INTERNAL_API_KEY, only callable from n8n/LangGraph
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.INTERNAL_API_KEY}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { orgId, dataType, filters } = await req.json();

  if (!orgId || !dataType) {
    return NextResponse.json({ error: "orgId and dataType required" }, { status: 400 });
  }

  try {
    switch (dataType) {
      case "clients": {
        const clients = await getClientsForOrg(orgId, filters?.limit);
        return NextResponse.json({ data: clients, count: clients.length });
      }

      case "policies": {
        const policies = await getPoliciesForOrg(orgId, {
          expiringWithinDays: filters?.expiringWithinDays,
          status: filters?.status,
        });
        return NextResponse.json({ data: policies, count: policies.length });
      }

      case "claims": {
        const claims = await getClaimsForOrg(orgId, {
          settledAfter: filters?.settledAfter,
          status: filters?.status,
        });
        return NextResponse.json({ data: claims, count: claims.length });
      }

      case "policies_expiring": {
        const days = filters?.days || 60;
        const policies = await getPoliciesForOrg(orgId, { expiringWithinDays: days });
        return NextResponse.json({ data: policies, count: policies.length });
      }

      case "lapsed_policies": {
        const allPolicies = await getPoliciesForOrg(orgId, { status: "expired" });
        const daysAgo = filters?.daysAgo || 60;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysAgo);
        const lapsed = allPolicies.filter((p) => new Date(p.expirationDate) >= cutoff);
        return NextResponse.json({ data: lapsed, count: lapsed.length });
      }

      case "settled_claims": {
        const claims = await getClaimsForOrg(orgId, {
          status: "settled",
          settledAfter: filters?.since,
        });
        return NextResponse.json({ data: claims, count: claims.length });
      }

      default:
        return NextResponse.json({ error: `Unknown dataType: ${dataType}` }, { status: 400 });
    }
  } catch (e) {
    log.error("Internal org-data error:", (e as Error).message);
    return NextResponse.json({ error: "data_fetch_failed", message: (e as Error).message }, { status: 500 });
  }
}
