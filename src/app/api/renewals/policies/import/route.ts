import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTenantDb } from "@/lib/db";

interface CsvRow {
  clientName: string;
  clientEmail: string;
  policyNumber: string;
  policyType: string;
  carrier?: string;
  premiumAmount?: string;
  expiresAt: string;
  notes?: string;
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""])) as unknown as CsvRow;
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const orgId = (session as any)?.organizationId;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const text = await file.text();
  const rows = parseCsv(text);

  if (rows.length === 0) {
    return NextResponse.json({ error: "No valid rows found" }, { status: 400 });
  }

  const REQUIRED = ["clientName", "clientEmail", "policyNumber", "policyType", "expiresAt"];
  const invalid = rows.filter((r) => REQUIRED.some((f) => !r[f as keyof CsvRow]));
  if (invalid.length > 0) {
    return NextResponse.json(
      { error: `${invalid.length} row(s) missing required fields`, invalid },
      { status: 400 }
    );
  }

  const tenantDb = getTenantDb(orgId);
  const created = await Promise.all(
    rows.map((row) =>
      tenantDb.policy.create({
        data: {
          organizationId: orgId,
          clientName: row.clientName,
          clientEmail: row.clientEmail,
          policyNumber: row.policyNumber,
          policyType: row.policyType,
          carrier: row.carrier || null,
          premiumAmount: row.premiumAmount ? parseFloat(row.premiumAmount) : null,
          expiresAt: new Date(row.expiresAt),
          notes: row.notes || null,
        },
      })
    )
  );

  return NextResponse.json({ imported: created.length, policies: created }, { status: 201 });
}
