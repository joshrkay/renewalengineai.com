import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const recipes = [
  {
    slug: "rate-increase-monitor",
    name: "Rate Increase Monitor",
    description:
      "Weekly research on insurance rate changes across your clients' cities. Automatically triggers outbound campaigns when rates are expected to increase 15%+.",
    category: "Market Intelligence",
    requiredIntegrations: ["ams", "email", "sms"],
    minimumTier: "MANAGED",
    engineType: "HYBRID",
    config: {
      schedule: "weekly",
      rateThreshold: 15,
    },
  },
  {
    slug: "renewal-campaign",
    name: "Renewal Campaign Automation",
    description:
      "Automated multi-touch outreach at 60, 45, 30, 14, and 7 days before policy expiration. Personalized emails, texts, and call reminders.",
    category: "Retention",
    requiredIntegrations: ["ams", "email", "sms"],
    minimumTier: "SPRINT",
    engineType: "N8N",
    config: {
      touchpoints: [60, 45, 30, 14, 7],
      channels: ["email", "sms", "call"],
    },
  },
  {
    slug: "instant-lead-response",
    name: "Instant Lead Response",
    description:
      "When a new lead comes in, AI responds within 60 seconds via email and text. Qualifies the lead and books a calendar appointment.",
    category: "Lead Generation",
    requiredIntegrations: ["crm", "email", "sms"],
    minimumTier: "SPRINT",
    engineType: "N8N",
    config: {
      responseTimeTarget: 60,
      channels: ["email", "sms"],
    },
  },
  {
    slug: "quote-follow-up",
    name: "Quote Follow-Up Sequences",
    description:
      "Automated follow-up at day 1, 3, 7, 14, and 21 for every open quote. Personalized with prospect details and coverage information.",
    category: "Sales",
    requiredIntegrations: ["crm", "email", "sms"],
    minimumTier: "SPRINT",
    engineType: "N8N",
    config: {
      touchpoints: [1, 3, 7, 14, 21],
      channels: ["email", "sms"],
    },
  },
  {
    slug: "cross-sell-intelligence",
    name: "Cross-Sell Intelligence",
    description:
      "AI analyzes your entire book of business for coverage gaps and single-policy households. Monthly reports with prioritized cross-sell opportunities.",
    category: "Revenue Growth",
    requiredIntegrations: ["ams", "crm", "email"],
    minimumTier: "MANAGED",
    engineType: "HYBRID",
    config: {
      schedule: "monthly",
      analysisDepth: "full",
    },
  },
  {
    slug: "market-research-alerts",
    name: "Market Research Alerts",
    description:
      "Weekly AI-powered research on regulatory changes, carrier updates, and market trends for your clients' regions. Delivered via email digest.",
    category: "Market Intelligence",
    requiredIntegrations: ["email"],
    minimumTier: "MANAGED",
    engineType: "LANGGRAPH",
    config: {
      schedule: "weekly",
      regions: [],
    },
  },
];

async function main() {
  console.log("Seeding automation recipes...");

  for (const recipe of recipes) {
    await prisma.automationRecipe.upsert({
      where: { slug: recipe.slug },
      create: recipe as any,
      update: {
        name: recipe.name,
        description: recipe.description,
        category: recipe.category,
        requiredIntegrations: recipe.requiredIntegrations,
        minimumTier: recipe.minimumTier as any,
        engineType: recipe.engineType as any,
        config: recipe.config,
      },
    });
    console.log(`  Seeded: ${recipe.name}`);
  }

  console.log("Done seeding.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
