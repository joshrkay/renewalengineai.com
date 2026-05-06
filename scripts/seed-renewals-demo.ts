/**
 * Demo seed script: creates realistic insurance agency renewal data.
 *
 * Usage:
 *   DATABASE_URL=<neon-url> ORG_ID=<your-org-id> npx ts-node scripts/seed-renewals-demo.ts
 *
 * Safe to run multiple times — skips policies with duplicate policyNumber per org.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ORG_ID = process.env.ORG_ID;
if (!ORG_ID) {
  console.error("ORG_ID env var required");
  process.exit(1);
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

const DEMO_POLICIES = [
  // Urgent — expiring ≤ 30 days
  {
    clientName: "Hartley Construction LLC",
    clientEmail: "mike.hartley@hartleyconstruction.com",
    policyNumber: "COM-2024-001",
    policyType: "Commercial",
    carrier: "Travelers",
    premiumAmount: 12400,
    expiresAt: daysFromNow(7),
    notes: "General liability + commercial auto bundle",
  },
  {
    clientName: "Sandra Okonkwo",
    clientEmail: "sokonkwo@gmail.com",
    policyNumber: "AUTO-2024-002",
    policyType: "Auto",
    carrier: "Progressive",
    premiumAmount: 1850,
    expiresAt: daysFromNow(12),
    notes: "Two vehicles — 2021 Honda CRV + 2019 Toyota Camry",
  },
  {
    clientName: "Blue Ridge Café",
    clientEmail: "owners@blueridgecafe.com",
    policyNumber: "COM-2024-003",
    policyType: "Commercial",
    carrier: "Hiscox",
    premiumAmount: 3200,
    expiresAt: daysFromNow(19),
    notes: "BOP policy — restaurant, 45 seats",
  },
  {
    clientName: "James & Carol Whitfield",
    clientEmail: "jwhitfield@outlook.com",
    policyNumber: "HOME-2024-004",
    policyType: "Home",
    carrier: "State Farm",
    premiumAmount: 2100,
    expiresAt: daysFromNow(24),
    notes: "3BR colonial, built 1998, $480k replacement value",
  },
  // Upcoming — 31–90 days
  {
    clientName: "Patel Medical Group",
    clientEmail: "billing@patelmedical.com",
    policyNumber: "COM-2024-005",
    policyType: "Commercial",
    carrier: "CNA",
    premiumAmount: 28500,
    expiresAt: daysFromNow(35),
    notes: "Professional liability (medical malpractice) + general liability",
  },
  {
    clientName: "Lena Kowalski",
    clientEmail: "lenakowalski.ins@gmail.com",
    policyNumber: "LIFE-2024-006",
    policyType: "Life",
    carrier: "Northwestern Mutual",
    premiumAmount: 4800,
    expiresAt: daysFromNow(42),
    notes: "20-year term, $750k, annual premium",
  },
  {
    clientName: "Riverside Auto Parts",
    clientEmail: "info@riversideauto.com",
    policyNumber: "COM-2024-007",
    policyType: "Commercial",
    carrier: "Hartford",
    premiumAmount: 6750,
    expiresAt: daysFromNow(55),
    notes: "Commercial property + business interruption",
  },
  {
    clientName: "The Reynolds Family",
    clientEmail: "dad.reynolds@gmail.com",
    policyNumber: "AUTO-2024-008",
    policyType: "Auto",
    carrier: "Allstate",
    premiumAmount: 3200,
    expiresAt: daysFromNow(61),
    notes: "Multi-car policy — 3 vehicles, teen driver added this year",
  },
  {
    clientName: "Sunrise Yoga Studio",
    clientEmail: "hello@sunriseyoga.com",
    policyNumber: "COM-2024-009",
    policyType: "Commercial",
    carrier: "Markel",
    premiumAmount: 1800,
    expiresAt: daysFromNow(68),
    notes: "Fitness studio liability + equipment coverage",
  },
  {
    clientName: "Marcus & Diane Chen",
    clientEmail: "mchen@chenfamily.net",
    policyNumber: "HOME-2024-010",
    policyType: "Home",
    carrier: "Chubb",
    premiumAmount: 5400,
    expiresAt: daysFromNow(74),
    notes: "High-value homeowners — $1.2M dwelling, jewelry rider",
  },
  {
    clientName: "Valley Tech Solutions",
    clientEmail: "cfo@valleytech.io",
    policyNumber: "COM-2024-011",
    policyType: "Commercial",
    carrier: "AIG",
    premiumAmount: 18200,
    expiresAt: daysFromNow(82),
    notes: "Cyber liability + E&O for SaaS company",
  },
  {
    clientName: "George Okafor",
    clientEmail: "gokafor@gmail.com",
    policyNumber: "UMBRELLA-2024-012",
    policyType: "Umbrella",
    carrier: "USAA",
    premiumAmount: 950,
    expiresAt: daysFromNow(88),
    notes: "$2M umbrella over auto + home",
  },
];

async function main() {
  console.log(`Seeding ${DEMO_POLICIES.length} demo renewal policies for org: ${ORG_ID}`);

  let created = 0;
  let skipped = 0;

  for (const p of DEMO_POLICIES) {
    const existing = await prisma.policy.findFirst({
      where: { organizationId: ORG_ID, policyNumber: p.policyNumber },
    });

    if (existing) {
      console.log(`  skip  ${p.policyNumber} — already exists`);
      skipped++;
      continue;
    }

    await prisma.policy.create({
      data: { ...p, organizationId: ORG_ID! },
    });

    console.log(`  ✓ created  ${p.policyNumber}  ${p.clientName}  (expires ${p.expiresAt.toLocaleDateString()})`);
    created++;
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
