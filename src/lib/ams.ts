import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { log } from "@/lib/logger";

// ─── Normalized Data Types ──────────────────────────────────

export interface AmsClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface AmsPolicy {
  id: string;
  clientId: string;
  policyNumber: string;
  policyType: string;
  carrier: string;
  effectiveDate: string;
  expirationDate: string;
  premium: number;
  limits: string;
  deductible: string;
  status: string;
}

export interface AmsClaim {
  id: string;
  clientId: string;
  policyId: string;
  claimNumber: string;
  claimType: string;
  dateOfLoss: string;
  status: string;
  amount: number;
  description: string;
}

// ─── AMS API Clients ────────────────────────────────────────

async function fetchAppliedEpic(
  accessToken: string,
  endpoint: string,
  params?: Record<string, string>
): Promise<any> {
  const url = new URL(`https://api.myappliedproducts.com${endpoint}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error(`Applied Epic API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchHawkSoft(
  clientId: string,
  clientSecret: string,
  endpoint: string
): Promise<any> {
  const res = await fetch(`https://partner.hawksoft.app/v3${endpoint}`, {
    headers: {
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error(`HawkSoft API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchEzLynx(
  accessToken: string,
  endpoint: string
): Promise<any> {
  const res = await fetch(`https://api.ezlynx.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error(`EZLynx API ${res.status}: ${await res.text()}`);
  return res.json();
}

// ─── Data Fetchers (Provider-Agnostic) ──────────────────────

export async function getClientsForOrg(
  orgId: string,
  limit = 100
): Promise<AmsClient[]> {
  const { provider, credentials } = await getAmsCredentials(orgId);

  switch (provider) {
    case "APPLIED_EPIC": {
      const data = await fetchAppliedEpic(credentials.accessToken, "/client/v1/clients", {
        $top: String(limit),
      });
      return (data.value || data || []).map((c: any) => ({
        id: c.ClientId || c.id,
        firstName: c.FirstName || c.firstName || "",
        lastName: c.LastName || c.lastName || "",
        email: c.Email || c.email || "",
        phone: c.Phone || c.phone || "",
        address: c.Address1 || c.address || "",
        city: c.City || c.city || "",
        state: c.State || c.state || "",
        zip: c.ZipCode || c.zip || "",
      }));
    }

    case "HAWKSOFT": {
      const data = await fetchHawkSoft(credentials.clientId, credentials.clientSecret, "/clients");
      return (data.clients || data || []).slice(0, limit).map((c: any) => ({
        id: c.clientId || c.id,
        firstName: c.firstName || "",
        lastName: c.lastName || "",
        email: c.email || "",
        phone: c.phone || "",
        address: c.address || "",
        city: c.city || "",
        state: c.state || "",
        zip: c.zip || "",
      }));
    }

    case "EZLYNX": {
      const data = await fetchEzLynx(credentials.accessToken, "/applicants");
      return (data.applicants || data || []).slice(0, limit).map((c: any) => ({
        id: c.applicantId || c.id,
        firstName: c.firstName || "",
        lastName: c.lastName || "",
        email: c.email || "",
        phone: c.phone || "",
        address: c.address || "",
        city: c.city || "",
        state: c.state || "",
        zip: c.zip || "",
      }));
    }

    default:
      throw new Error(`Unsupported AMS provider: ${provider}`);
  }
}

export async function getPoliciesForOrg(
  orgId: string,
  filters?: { expiringWithinDays?: number; status?: string }
): Promise<AmsPolicy[]> {
  const { provider, credentials } = await getAmsCredentials(orgId);

  let policies: AmsPolicy[];

  switch (provider) {
    case "APPLIED_EPIC": {
      const params: Record<string, string> = {};
      if (filters?.expiringWithinDays) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() + filters.expiringWithinDays);
        params.$filter = `ExpirationDate le ${cutoff.toISOString().split("T")[0]}`;
      }
      const data = await fetchAppliedEpic(credentials.accessToken, "/policy/v1/policies", params);
      policies = (data.value || data || []).map(normalizePolicy);
      break;
    }

    case "HAWKSOFT": {
      const data = await fetchHawkSoft(credentials.clientId, credentials.clientSecret, "/policies");
      policies = (data.policies || data || []).map(normalizePolicy);
      break;
    }

    case "EZLYNX": {
      const data = await fetchEzLynx(credentials.accessToken, "/policies");
      policies = (data.policies || data || []).map(normalizePolicy);
      break;
    }

    default:
      throw new Error(`Unsupported AMS provider: ${provider}`);
  }

  // Client-side filtering for providers that don't support server-side filters
  if (filters?.expiringWithinDays) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + filters.expiringWithinDays);
    const today = new Date();
    policies = policies.filter((p) => {
      const exp = new Date(p.expirationDate);
      return exp >= today && exp <= cutoff;
    });
  }

  if (filters?.status) {
    policies = policies.filter((p) => p.status.toLowerCase() === filters.status!.toLowerCase());
  }

  return policies;
}

export async function getClaimsForOrg(
  orgId: string,
  filters?: { settledAfter?: string; status?: string }
): Promise<AmsClaim[]> {
  const { provider, credentials } = await getAmsCredentials(orgId);

  let claims: AmsClaim[];

  switch (provider) {
    case "APPLIED_EPIC": {
      const data = await fetchAppliedEpic(credentials.accessToken, "/claims/v1/claims");
      claims = (data.value || data || []).map(normalizeClaim);
      break;
    }

    case "HAWKSOFT": {
      const data = await fetchHawkSoft(credentials.clientId, credentials.clientSecret, "/claims");
      claims = (data.claims || data || []).map(normalizeClaim);
      break;
    }

    case "EZLYNX": {
      // EZLynx has limited claims API — return empty if not available
      claims = [];
      break;
    }

    default:
      throw new Error(`Unsupported AMS provider: ${provider}`);
  }

  if (filters?.settledAfter) {
    const after = new Date(filters.settledAfter);
    claims = claims.filter((c) => new Date(c.dateOfLoss) >= after);
  }

  if (filters?.status) {
    claims = claims.filter((c) => c.status.toLowerCase() === filters.status!.toLowerCase());
  }

  return claims;
}

// ─── Helpers ────────────────────────────────────────────────

async function getAmsCredentials(orgId: string) {
  const connection = await prisma.oAuthConnection.findFirst({
    where: {
      organizationId: orgId,
      provider: { in: ["APPLIED_EPIC", "HAWKSOFT", "EZLYNX"] },
      status: "CONNECTED",
    },
  });

  if (!connection) throw new Error("No AMS connected for this organization");

  const accessToken = decrypt(connection.accessToken);
  const refreshToken = connection.refreshToken ? decrypt(connection.refreshToken) : undefined;

  // HawkSoft uses basic auth — accessToken stores clientId, refreshToken stores clientSecret
  if (connection.provider === "HAWKSOFT") {
    return {
      provider: connection.provider,
      credentials: { clientId: accessToken, clientSecret: refreshToken || "" },
    };
  }

  return {
    provider: connection.provider,
    credentials: { accessToken, refreshToken },
  };
}

function normalizePolicy(raw: any): AmsPolicy {
  return {
    id: raw.PolicyId || raw.policyId || raw.id || "",
    clientId: raw.ClientId || raw.clientId || "",
    policyNumber: raw.PolicyNumber || raw.policyNumber || raw.number || "",
    policyType: raw.LineOfBusiness || raw.policyType || raw.type || raw.lobName || "",
    carrier: raw.CarrierName || raw.carrier || raw.carrierName || "",
    effectiveDate: raw.EffectiveDate || raw.effectiveDate || "",
    expirationDate: raw.ExpirationDate || raw.expirationDate || "",
    premium: parseFloat(raw.WrittenPremium || raw.premium || raw.annualPremium || "0"),
    limits: raw.Limits || raw.limits || raw.coverageLimits || "",
    deductible: raw.Deductible || raw.deductible || "",
    status: raw.Status || raw.status || raw.policyStatus || "Active",
  };
}

function normalizeClaim(raw: any): AmsClaim {
  return {
    id: raw.ClaimId || raw.claimId || raw.id || "",
    clientId: raw.ClientId || raw.clientId || "",
    policyId: raw.PolicyId || raw.policyId || "",
    claimNumber: raw.ClaimNumber || raw.claimNumber || raw.number || "",
    claimType: raw.ClaimType || raw.claimType || raw.type || raw.lossType || "",
    dateOfLoss: raw.DateOfLoss || raw.dateOfLoss || raw.lossDate || "",
    status: raw.Status || raw.status || raw.claimStatus || "",
    amount: parseFloat(raw.TotalIncurred || raw.amount || raw.reserveAmount || "0"),
    description: raw.Description || raw.description || raw.lossDescription || "",
  };
}
