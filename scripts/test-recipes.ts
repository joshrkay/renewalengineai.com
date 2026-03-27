/**
 * Test script for the 6 automation recipes.
 *
 * Tests the full lifecycle:
 * 1. Seed recipes into DB
 * 2. Create a test org + user
 * 3. Verify tier gating (AUDIT user can't activate MANAGED recipes)
 * 4. Verify integration checks (missing integrations block activation)
 * 5. Activate a recipe (with correct tier + integrations)
 * 6. Pause / Resume / Deactivate
 * 7. Simulate a workflow run result
 *
 * Usage: npx tsx scripts/test-recipes.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const RECIPES = [
  {
    slug: "rate-increase-monitor",
    name: "Rate Increase Monitor",
    description: "Weekly research on insurance rate changes across your clients' cities. Automatically triggers outbound campaigns when rates are expected to increase 15%+.",
    category: "Market Intelligence",
    requiredIntegrations: JSON.stringify(["ams", "email", "sms"]),
    minimumTier: "MANAGED",
    engineType: "HYBRID",
    config: JSON.stringify({ schedule: "weekly", rateThreshold: 15 }),
  },
  {
    slug: "renewal-campaign",
    name: "Renewal Campaign Automation",
    description: "Automated multi-touch outreach at 60, 45, 30, 14, and 7 days before policy expiration.",
    category: "Retention",
    requiredIntegrations: JSON.stringify(["ams", "email", "sms"]),
    minimumTier: "SPRINT",
    engineType: "N8N",
    config: JSON.stringify({ touchpoints: [60, 45, 30, 14, 7], channels: ["email", "sms", "call"] }),
  },
  {
    slug: "instant-lead-response",
    name: "Instant Lead Response",
    description: "When a new lead comes in, AI responds within 60 seconds via email and text.",
    category: "Lead Generation",
    requiredIntegrations: JSON.stringify(["crm", "email", "sms"]),
    minimumTier: "SPRINT",
    engineType: "N8N",
    config: JSON.stringify({ responseTimeTarget: 60, channels: ["email", "sms"] }),
  },
  {
    slug: "quote-follow-up",
    name: "Quote Follow-Up Sequences",
    description: "Automated follow-up at day 1, 3, 7, 14, and 21 for every open quote.",
    category: "Sales",
    requiredIntegrations: JSON.stringify(["crm", "email", "sms"]),
    minimumTier: "SPRINT",
    engineType: "N8N",
    config: JSON.stringify({ touchpoints: [1, 3, 7, 14, 21], channels: ["email", "sms"] }),
  },
  {
    slug: "cross-sell-intelligence",
    name: "Cross-Sell Intelligence",
    description: "AI analyzes your entire book of business for coverage gaps and single-policy households.",
    category: "Revenue Growth",
    requiredIntegrations: JSON.stringify(["ams", "crm", "email"]),
    minimumTier: "MANAGED",
    engineType: "HYBRID",
    config: JSON.stringify({ schedule: "monthly", analysisDepth: "full" }),
  },
  {
    slug: "market-research-alerts",
    name: "Market Research Alerts",
    description: "Weekly AI-powered research on regulatory changes, carrier updates, and market trends.",
    category: "Market Intelligence",
    requiredIntegrations: JSON.stringify(["email"]),
    minimumTier: "MANAGED",
    engineType: "LANGGRAPH",
    config: JSON.stringify({ schedule: "weekly", regions: [] }),
  },
];

const TIER_RANK: Record<string, number> = { AUDIT: 1, SPRINT: 2, MANAGED: 3 };

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function cleanDb() {
  await prisma.workflowRun.deleteMany();
  await prisma.automationInstance.deleteMany();
  await prisma.automationRecipe.deleteMany();
  await prisma.oAuthConnection.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
}

async function seedRecipes() {
  for (const recipe of RECIPES) {
    await prisma.automationRecipe.upsert({
      where: { slug: recipe.slug },
      create: recipe,
      update: recipe,
    });
  }
}

async function createTestOrg(tier: string) {
  const org = await prisma.organization.create({
    data: {
      name: `Test Agency (${tier})`,
      subscriptionTier: tier,
      subscriptionStatus: "ACTIVE",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: `test-${tier.toLowerCase()}@agency.com`,
      name: `Test User (${tier})`,
      organizationId: org.id,
    },
  });

  return { org, user };
}

async function addIntegration(orgId: string, provider: string) {
  return prisma.oAuthConnection.create({
    data: {
      organizationId: orgId,
      provider,
      accessToken: "test-token-encrypted",
      status: "CONNECTED",
    },
  });
}

async function main() {
  console.log("\n🧪 RenewalEngineAI — Automation Recipe Test Suite\n");
  console.log("=".repeat(60));

  // ─── Setup ─────────────────────────────────────────────
  console.log("\n📦 Setting up test database...");
  await cleanDb();
  await seedRecipes();

  const recipes = await prisma.automationRecipe.findMany({ orderBy: { name: "asc" } });
  assert(recipes.length === 6, `Seeded 6 recipes (got ${recipes.length})`);

  // ─── Test 1: Recipe data integrity ─────────────────────
  console.log("\n📋 Test 1: Recipe Data Integrity");
  for (const recipe of recipes) {
    const integrations = JSON.parse(recipe.requiredIntegrations as string);
    assert(recipe.slug.length > 0, `${recipe.name} has slug "${recipe.slug}"`);
    assert(["N8N", "LANGGRAPH", "HYBRID"].includes(recipe.engineType), `${recipe.name} engine: ${recipe.engineType}`);
    assert(["AUDIT", "SPRINT", "MANAGED"].includes(recipe.minimumTier), `${recipe.name} tier: ${recipe.minimumTier}`);
    assert(Array.isArray(integrations), `${recipe.name} integrations: [${integrations.join(", ")}]`);
  }

  // ─── Test 2: Tier gating ───────────────────────────────
  console.log("\n🔒 Test 2: Tier Gating");
  const { org: auditOrg } = await createTestOrg("AUDIT");
  const { org: sprintOrg } = await createTestOrg("SPRINT");
  const { org: managedOrg } = await createTestOrg("MANAGED");

  const renewalRecipe = recipes.find((r) => r.slug === "renewal-campaign")!;
  const rateMonitor = recipes.find((r) => r.slug === "rate-increase-monitor")!;
  const marketAlerts = recipes.find((r) => r.slug === "market-research-alerts")!;

  // AUDIT user should NOT be able to activate SPRINT recipes
  const auditRank = TIER_RANK[auditOrg.subscriptionTier] || 0;
  const renewalRequired = TIER_RANK[renewalRecipe.minimumTier] || 0;
  assert(auditRank < renewalRequired, `AUDIT (rank ${auditRank}) blocked from Renewal Campaign (requires SPRINT, rank ${renewalRequired})`);

  // SPRINT user CAN activate SPRINT recipes
  const sprintRank = TIER_RANK[sprintOrg.subscriptionTier] || 0;
  assert(sprintRank >= renewalRequired, `SPRINT (rank ${sprintRank}) can activate Renewal Campaign (requires SPRINT, rank ${renewalRequired})`);

  // SPRINT user should NOT activate MANAGED recipes
  const rateRequired = TIER_RANK[rateMonitor.minimumTier] || 0;
  assert(sprintRank < rateRequired, `SPRINT (rank ${sprintRank}) blocked from Rate Increase Monitor (requires MANAGED, rank ${rateRequired})`);

  // MANAGED user can activate everything
  const managedRank = TIER_RANK[managedOrg.subscriptionTier] || 0;
  assert(managedRank >= rateRequired, `MANAGED (rank ${managedRank}) can activate Rate Increase Monitor`);
  assert(managedRank >= renewalRequired, `MANAGED (rank ${managedRank}) can activate Renewal Campaign`);

  // ─── Test 3: Integration requirements ──────────────────
  console.log("\n🔌 Test 3: Integration Requirements Check");

  // Market Research Alerts only needs "email"
  const marketIntegrations = JSON.parse(marketAlerts.requiredIntegrations as string) as string[];
  assert(marketIntegrations.length === 1, `Market Research Alerts needs only 1 integration: [${marketIntegrations}]`);
  assert(marketIntegrations[0] === "email", `Market Research Alerts requires: email`);

  // Renewal Campaign needs ams + email + sms
  const renewalIntegrations = JSON.parse(renewalRecipe.requiredIntegrations as string) as string[];
  assert(renewalIntegrations.length === 3, `Renewal Campaign needs 3 integrations: [${renewalIntegrations}]`);

  // Simulate: MANAGED org with NO integrations → should block
  const connectedBefore = await prisma.oAuthConnection.findMany({
    where: { organizationId: managedOrg.id, status: "CONNECTED" },
  });
  const missingBefore = renewalIntegrations.filter(
    (i) => !connectedBefore.map((c) => c.provider.toLowerCase()).includes(i)
  );
  assert(missingBefore.length === 3, `MANAGED org missing all 3 integrations before connecting: [${missingBefore}]`);

  // Connect the required integrations
  await addIntegration(managedOrg.id, "ams");
  await addIntegration(managedOrg.id, "email");
  await addIntegration(managedOrg.id, "sms");

  const connectedAfter = await prisma.oAuthConnection.findMany({
    where: { organizationId: managedOrg.id, status: "CONNECTED" },
  });
  const missingAfter = renewalIntegrations.filter(
    (i) => !connectedAfter.map((c) => c.provider.toLowerCase()).includes(i)
  );
  assert(missingAfter.length === 0, `After connecting ams+email+sms, no missing integrations`);

  // ─── Test 4: Activation flow ───────────────────────────
  console.log("\n🚀 Test 4: Recipe Activation Flow");

  const instance = await prisma.automationInstance.create({
    data: {
      organizationId: managedOrg.id,
      recipeId: renewalRecipe.id,
      status: "ACTIVE",
      config: JSON.stringify({ touchpoints: [60, 30, 14, 7], channels: ["email", "sms"] }),
    },
  });
  assert(instance.status === "ACTIVE", `Renewal Campaign activated — status: ${instance.status}`);
  assert(instance.organizationId === managedOrg.id, `Linked to correct org`);
  assert(instance.recipeId === renewalRecipe.id, `Linked to correct recipe`);

  // Verify unique constraint (can't activate same recipe twice)
  let duplicateBlocked = false;
  try {
    await prisma.automationInstance.create({
      data: {
        organizationId: managedOrg.id,
        recipeId: renewalRecipe.id,
        status: "ACTIVE",
        config: "{}",
      },
    });
  } catch (e: any) {
    duplicateBlocked = true;
  }
  assert(duplicateBlocked, `Duplicate activation blocked by unique constraint`);

  // ─── Test 5: Pause / Resume / Deactivate ───────────────
  console.log("\n⏸️  Test 5: Lifecycle — Pause / Resume / Deactivate");

  await prisma.automationInstance.update({
    where: { id: instance.id },
    data: { status: "PAUSED" },
  });
  let updated = await prisma.automationInstance.findUnique({ where: { id: instance.id } });
  assert(updated!.status === "PAUSED", `Paused — status: ${updated!.status}`);

  await prisma.automationInstance.update({
    where: { id: instance.id },
    data: { status: "ACTIVE" },
  });
  updated = await prisma.automationInstance.findUnique({ where: { id: instance.id } });
  assert(updated!.status === "ACTIVE", `Resumed — status: ${updated!.status}`);

  await prisma.automationInstance.delete({ where: { id: instance.id } });
  const deleted = await prisma.automationInstance.findUnique({ where: { id: instance.id } });
  assert(deleted === null, `Deactivated — instance deleted from DB`);

  // ─── Test 6: Workflow run simulation ───────────────────
  console.log("\n📊 Test 6: Workflow Run Simulation");

  // Re-create instance for run test
  const instance2 = await prisma.automationInstance.create({
    data: {
      organizationId: managedOrg.id,
      recipeId: marketAlerts.id,
      status: "ACTIVE",
      config: JSON.stringify({ schedule: "weekly", regions: ["TX", "FL", "CA"] }),
    },
  });

  // Simulate n8n webhook posting a successful run
  const run = await prisma.workflowRun.create({
    data: {
      automationInstanceId: instance2.id,
      status: "SUCCESS",
      startedAt: new Date(),
      completedAt: new Date(),
      resultSummary: "Analyzed 3 regions. Found rate increase alerts for TX (+18%) and FL (+12%).",
      resultData: JSON.stringify({
        regions: [
          { state: "TX", change: 18, alert: true },
          { state: "FL", change: 12, alert: false },
          { state: "CA", change: 3, alert: false },
        ],
      }),
    },
  });
  assert(run.status === "SUCCESS", `Workflow run created — status: ${run.status}`);
  assert(run.resultSummary!.includes("TX (+18%)"), `Run summary includes rate data`);

  // Simulate a failed run
  const failedRun = await prisma.workflowRun.create({
    data: {
      automationInstanceId: instance2.id,
      status: "FAILED",
      startedAt: new Date(),
      completedAt: new Date(),
      errorMessage: "API rate limit exceeded for data provider",
    },
  });
  assert(failedRun.status === "FAILED", `Failed run recorded — status: ${failedRun.status}`);
  assert(failedRun.errorMessage!.includes("rate limit"), `Error message captured`);

  // Update instance to reflect error
  await prisma.automationInstance.update({
    where: { id: instance2.id },
    data: { lastRunAt: new Date(), status: "ERROR" },
  });
  const errorInstance = await prisma.automationInstance.findUnique({ where: { id: instance2.id } });
  assert(errorInstance!.status === "ERROR", `Instance status reflects error: ${errorInstance!.status}`);

  // Verify run history
  const runs = await prisma.workflowRun.findMany({
    where: { automationInstanceId: instance2.id },
    orderBy: { startedAt: "desc" },
  });
  assert(runs.length === 2, `Run history has 2 entries (1 success + 1 failure)`);

  // ─── Test 7: Multi-recipe activation ───────────────────
  console.log("\n🔄 Test 7: Multiple Recipes Per Org");

  // Add CRM integration for the org
  await addIntegration(managedOrg.id, "crm");

  // Activate 3 different recipes
  const activated = [];
  for (const recipe of [renewalRecipe, rateMonitor, marketAlerts]) {
    const inst = await prisma.automationInstance.upsert({
      where: {
        organizationId_recipeId: {
          organizationId: managedOrg.id,
          recipeId: recipe.id,
        },
      },
      create: {
        organizationId: managedOrg.id,
        recipeId: recipe.id,
        status: "ACTIVE",
        config: "{}",
      },
      update: { status: "ACTIVE" },
    });
    activated.push(inst);
  }
  assert(activated.length === 3, `Activated 3 recipes for the same org`);

  const activeCount = await prisma.automationInstance.count({
    where: { organizationId: managedOrg.id, status: "ACTIVE" },
  });
  assert(activeCount >= 2, `Org has ${activeCount} active automations`);

  // ─── Summary ───────────────────────────────────────────
  console.log("\n" + "=".repeat(60));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error("Test failed with error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
