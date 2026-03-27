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
  // ─── NEW: Top 10 Insurance Retention AI Flows ───────────
  {
    slug: "rate-shopping-remarketing",
    name: "Rate Shopping & Re-Marketing",
    description:
      "Proactively re-quote clients 90 days before renewal. AI matches carrier appetite, compares rates, and sends personalized savings report before the client shops on their own.",
    category: "Retention",
    requiredIntegrations: ["ams", "email", "crm"],
    minimumTier: "MANAGED",
    engineType: "HYBRID",
    config: {
      schedule: "daily",
      daysBeforeRenewal: 90,
      savingsThreshold: 15,
    },
  },
  {
    slug: "claims-follow-up",
    name: "Claims Follow-Up & Satisfaction Recovery",
    description:
      "Automated empathy sequence after a claim: day 1 support email, day 7 status update, day 14 satisfaction survey, escalation on low scores, and post-settlement coverage review.",
    category: "Retention",
    requiredIntegrations: ["ams", "email", "sms"],
    minimumTier: "SPRINT",
    engineType: "N8N",
    config: {
      touchpoints: [1, 7, 14, 30],
      channels: ["email", "sms"],
      escalateBelow: 3,
    },
  },
  {
    slug: "win-back-campaign",
    name: "Win-Back Campaigns for Lapsed Policies",
    description:
      "AI analyzes why clients left (price, claims, service), generates personalized win-back offers, and runs multi-touch re-engagement. Recovers 15-25% of lapsed clients within 90 days.",
    category: "Retention",
    requiredIntegrations: ["ams", "email", "sms", "crm"],
    minimumTier: "MANAGED",
    engineType: "HYBRID",
    config: {
      touchpoints: [1, 7, 14, 30, 60],
      channels: ["email", "sms"],
      autoRequote: true,
    },
  },
  {
    slug: "life-event-cross-sell",
    name: "Life Event Cross-Sell Detection",
    description:
      "Weekly scan of public records for client life events: home purchases, vehicle registrations, business formations. Triggers personalized cross-sell outreach at the perfect moment.",
    category: "Growth",
    requiredIntegrations: ["crm", "email"],
    minimumTier: "MANAGED",
    engineType: "LANGGRAPH",
    config: {
      schedule: "weekly",
      eventTypes: ["home_purchase", "vehicle_registration", "business_formation", "marriage"],
    },
  },
  {
    slug: "coverage-gap-detection",
    name: "Coverage Gap & Underinsured Detection",
    description:
      "Monthly AI analysis of your full book against current property values, inflation, and industry standards. Flags underinsured clients and generates E&O-compliant recommendation letters.",
    category: "Retention",
    requiredIntegrations: ["ams", "email"],
    minimumTier: "MANAGED",
    engineType: "HYBRID",
    config: {
      schedule: "monthly",
      analysisDepth: "full",
      inflationAdjustment: true,
    },
  },
  {
    slug: "post-bind-onboarding",
    name: "Post-Bind Client Onboarding",
    description:
      "Automated 90-day onboarding sequence after a new policy: welcome email, claims guide, coverage review, cross-sell suggestion, satisfaction check-in, and Google review request.",
    category: "Operations",
    requiredIntegrations: ["ams", "email", "sms"],
    minimumTier: "SPRINT",
    engineType: "N8N",
    config: {
      touchpoints: [0, 3, 7, 14, 30, 90],
      channels: ["email", "sms"],
      requestReview: true,
    },
  },
  {
    slug: "annual-review-scheduler",
    name: "Annual Account Review Scheduler",
    description:
      "60 days before policy anniversary, sends coverage comparison and books a review call. Follows up via SMS and creates agent tasks on no-response. Pre-populates review agenda.",
    category: "Operations",
    requiredIntegrations: ["ams", "email", "sms", "crm"],
    minimumTier: "SPRINT",
    engineType: "N8N",
    config: {
      daysBeforeAnniversary: 60,
      followUpDays: [7, 14],
      channels: ["email", "sms"],
    },
  },
  {
    slug: "coi-management",
    name: "Automated COI Management",
    description:
      "Parses incoming COI requests, matches against policies, auto-generates certificates, and tracks expirations. Reduces turnaround from 24-48 hours to under 5 minutes.",
    category: "Operations",
    requiredIntegrations: ["ams", "email"],
    minimumTier: "SPRINT",
    engineType: "N8N",
    config: {
      autoDeliver: false,
      trackExpirations: true,
    },
  },
  {
    slug: "carrier-rate-alerts",
    name: "Carrier Rate Change & Market Hardening Alerts",
    description:
      "Weekly AI research of state insurance department filings and carrier announcements. Cross-references with your book to show which clients are affected and recommends proactive actions.",
    category: "Market Intelligence",
    requiredIntegrations: ["email"],
    minimumTier: "MANAGED",
    engineType: "LANGGRAPH",
    config: {
      schedule: "weekly",
      regions: [],
      alertThreshold: 10,
    },
  },
  {
    slug: "referral-generation",
    name: "Referral Generation from Happy Customers",
    description:
      "Identifies satisfied clients after renewals, positive surveys, and reviews. Sends personalized referral requests with easy-share links. Referred clients retain at 37% higher rates.",
    category: "Growth",
    requiredIntegrations: ["email", "crm", "sms"],
    minimumTier: "SPRINT",
    engineType: "N8N",
    config: {
      triggerOn: ["post_renewal", "high_nps", "positive_review"],
      channels: ["email", "sms"],
      followUpDays: [7],
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
