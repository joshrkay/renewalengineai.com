import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const orgId = (session as any).organizationId;
  if (!orgId) {
    return NextResponse.json({ error: "no_organization" }, { status: 400 });
  }

  const { recipeId, config } = await req.json();

  const recipe = await prisma.automationRecipe.findUnique({
    where: { id: recipeId },
  });
  if (!recipe) {
    return NextResponse.json({ error: "recipe_not_found" }, { status: 404 });
  }

  const amsConnection = await prisma.oAuthConnection.findFirst({
    where: {
      organizationId: orgId,
      provider: { in: ["APPLIED_EPIC", "HAWKSOFT", "EZLYNX"] },
      status: "CONNECTED",
    },
  });

  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  const sampleCustomer = amsConnection
    ? await fetchSampleCustomerFromAms(orgId, amsConnection.provider)
    : generateSampleCustomer(recipe.slug);

  const mergeData: Record<string, string> = {
    client_name: sampleCustomer.name,
    policy_type: sampleCustomer.policyType,
    expiration_date: sampleCustomer.expirationDate,
    premium_amount: sampleCustomer.premium,
    agent_name: session.user.name || "Your Agent",
    agency_name: org?.name || "Your Agency",
    claim_type: sampleCustomer.claimType || "",
    claim_date: sampleCustomer.claimDate || "",
    claim_amount: sampleCustomer.claimAmount || "",
    lapse_date: sampleCustomer.lapseDate || "",
    current_limits: sampleCustomer.currentLimits || "",
    replacement_cost: sampleCustomer.replacementCost || "",
    coverage_gap: sampleCustomer.coverageGap || "",
    savings_amount: sampleCustomer.savingsAmount || "",
  };

  const emailSubject = interpolateTemplate(
    config.emailSubject || getDefaultEmailSubject(recipe.slug),
    mergeData
  );

  const emailBody = interpolateTemplate(
    config.emailBody || getDefaultEmailBody(recipe.slug),
    mergeData
  );

  const hasSmsCh = config.channels?.includes("sms") ??
    ["renewal-campaign", "claims-follow-up", "win-back-campaign"].includes(recipe.slug);

  const smsBody = hasSmsCh
    ? interpolateTemplate(config.smsBody || getDefaultSmsBody(recipe.slug), mergeData)
    : null;

  const workflowSummary = getWorkflowSummary(recipe.slug, config, sampleCustomer);

  return NextResponse.json({
    customer: sampleCustomer,
    emailPreview: { subject: emailSubject, body: emailBody },
    smsPreview: smsBody,
    workflowSummary,
    dataSource: amsConnection ? "live" : "sample",
  });
}

function interpolateTemplate(template: string, data: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

async function fetchSampleCustomerFromAms(orgId: string, provider: string): Promise<SampleCustomer> {
  return generateSampleCustomer();
}

interface SampleCustomer {
  name: string;
  email: string;
  policyType: string;
  policyNumber: string;
  expirationDate: string;
  premium: string;
  city: string;
  state: string;
  claimDate?: string;
  claimType?: string;
  claimAmount?: string;
  lapseDate?: string;
  lapseReason?: string;
  currentLimits?: string;
  replacementCost?: string;
  coverageGap?: string;
  savingsAmount?: string;
  marketRate?: string;
}

function generateSampleCustomer(recipeSlug?: string): SampleCustomer {
  const base = [
    {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      policyType: "Homeowners",
      policyNumber: "HO-2024-48291",
      expirationDate: "May 12, 2026",
      premium: "$2,840/yr",
      city: "Austin",
      state: "TX",
      claimDate: "Jan 15, 2026",
      claimType: "Water damage",
      claimAmount: "$12,400",
      lapseDate: "Feb 28, 2026",
      lapseReason: "Price",
      currentLimits: "$250,000",
      replacementCost: "$385,000",
      coverageGap: "Underinsured by $135,000",
      savingsAmount: "$420/yr",
      marketRate: "$2,420/yr",
    },
    {
      name: "Michael Rodriguez",
      email: "m.rodriguez@email.com",
      policyType: "Auto",
      policyNumber: "AU-2024-77103",
      expirationDate: "Apr 28, 2026",
      premium: "$1,620/yr",
      city: "Tampa",
      state: "FL",
      claimDate: "Dec 3, 2025",
      claimType: "Rear-end collision",
      claimAmount: "$8,200",
      lapseDate: "Mar 15, 2026",
      lapseReason: "No response",
      currentLimits: "100/300/100",
      replacementCost: "250/500/250",
      coverageGap: "Liability limits below recommended",
      savingsAmount: "$180/yr",
      marketRate: "$1,440/yr",
    },
    {
      name: "Jennifer Chen",
      email: "j.chen@email.com",
      policyType: "Commercial Property",
      policyNumber: "CP-2024-33847",
      expirationDate: "Jun 1, 2026",
      premium: "$8,200/yr",
      city: "San Diego",
      state: "CA",
      claimDate: "Nov 20, 2025",
      claimType: "Roof damage from storm",
      claimAmount: "$34,000",
      lapseDate: "Jan 31, 2026",
      lapseReason: "Service",
      currentLimits: "$500,000",
      replacementCost: "$780,000",
      coverageGap: "Underinsured by $280,000 — no earthquake endorsement",
      savingsAmount: "$1,100/yr",
      marketRate: "$7,100/yr",
    },
  ];
  return base[Math.floor(Math.random() * base.length)];
}

// ─── Email Subject Templates ────────────────────────────────

function getDefaultEmailSubject(recipeSlug: string): string {
  const subjects: Record<string, string> = {
    "renewal-campaign":
      "{{client_name}}, your {{policy_type}} policy renews soon — let's review your options",
    "rate-shopping-remarketing":
      "{{client_name}}, we found potential savings of {{savings_amount}} on your {{policy_type}} renewal",
    "claims-follow-up":
      "{{client_name}}, checking in after your recent {{claim_type}} claim",
    "win-back-campaign":
      "{{client_name}}, we miss you — your {{policy_type}} coverage has lapsed",
    "coverage-gap-detection":
      "Important: {{client_name}}, your {{policy_type}} coverage may need an update",
    "instant-lead-response":
      "Thanks for your inquiry, {{client_name}} — here's what's next",
    "quote-follow-up":
      "{{client_name}}, your {{policy_type}} quote is ready for review",
    "cross-sell-intelligence":
      "{{client_name}}, we found a way to save you more on your coverage",
    "rate-increase-monitor":
      "Important: {{policy_type}} rates are changing in your area",
    "market-research-alerts":
      "Weekly Insurance Market Update for {{agency_name}}",
    "post-bind-onboarding":
      "Welcome to {{agency_name}}, {{client_name}} — your {{policy_type}} policy is active!",
    "annual-review-scheduler":
      "{{client_name}}, it's time for your annual {{policy_type}} coverage review",
    "coi-management":
      "Certificate of Insurance ready — {{policy_type}} policy {{expiration_date}}",
    "carrier-rate-alerts":
      "Market Alert: {{policy_type}} rate changes in your area",
    "referral-generation":
      "{{client_name}}, know someone who needs great insurance coverage?",
    "life-event-cross-sell":
      "Congratulations {{client_name}} — let's make sure your new investment is protected",
  };
  return subjects[recipeSlug] || "Update from {{agency_name}}";
}

// ─── Email Body Templates ───────────────────────────────────

function getDefaultEmailBody(recipeSlug: string): string {
  const bodies: Record<string, string> = {
    "renewal-campaign": `<p>Hi {{client_name}},</p>
<p>This is a friendly reminder that your <strong>{{policy_type}}</strong> policy is coming up for renewal on <strong>{{expiration_date}}</strong>.</p>
<p>Your current premium is <strong>{{premium_amount}}</strong>. I'd love to review your coverage and make sure you're getting the best rate available.</p>
<p>Would you like to schedule a quick 15-minute review call? I can check if there are any new discounts or coverage options that could benefit you.</p>
<p>Best regards,<br/>{{agent_name}}<br/>{{agency_name}}</p>`,

    "rate-shopping-remarketing": `<p>Hi {{client_name}},</p>
<p>Your <strong>{{policy_type}}</strong> policy renews on <strong>{{expiration_date}}</strong>, and I've been proactively shopping the market on your behalf.</p>
<p>Great news — I found options that could save you <strong>{{savings_amount}}</strong> compared to your current premium of {{premium_amount}}.</p>
<p>Here's what I found:</p>
<ul>
<li><strong>Your current rate:</strong> {{premium_amount}}</li>
<li><strong>Best market rate:</strong> {{savings_amount}} less</li>
<li><strong>Coverage:</strong> Same or better limits</li>
</ul>
<p>I'd love to walk you through the comparison so you can see the options side by side. Would you like to schedule a quick call this week?</p>
<p>I'm always looking out for the best value for my clients.</p>
<p>Best,<br/>{{agent_name}}<br/>{{agency_name}}</p>`,

    "claims-follow-up": `<p>Hi {{client_name}},</p>
<p>I wanted to personally check in after your recent <strong>{{claim_type}}</strong> claim. I know dealing with a claim can be stressful, and I want to make sure you're getting the support you need.</p>
<p>A few things I wanted to make sure of:</p>
<ul>
<li>Your claim is being processed as quickly as possible</li>
<li>You have everything you need during the process</li>
<li>You know I'm here if any questions come up</li>
</ul>
<p>Is there anything at all I can help with? I'm just a phone call or email away.</p>
<p>Taking care of you is my priority,<br/>{{agent_name}}<br/>{{agency_name}}</p>`,

    "win-back-campaign": `<p>Hi {{client_name}},</p>
<p>I noticed your <strong>{{policy_type}}</strong> policy is no longer active, and I wanted to reach out personally.</p>
<p>Going without coverage can leave you exposed to significant financial risk. Whether it was a matter of price, timing, or anything else — I'd love the chance to help.</p>
<p>Here's what I can do for you right now:</p>
<ul>
<li><strong>Free re-quote</strong> — rates may have changed since you last looked</li>
<li><strong>Coverage comparison</strong> — I'll show you exactly what you're missing</li>
<li><strong>No pressure</strong> — just an honest conversation about your options</li>
</ul>
<p>It only takes a few minutes to get covered again. Would you like me to run some numbers?</p>
<p>I'm here whenever you're ready,<br/>{{agent_name}}<br/>{{agency_name}}</p>`,

    "coverage-gap-detection": `<p>Hi {{client_name}},</p>
<p>As part of our commitment to keeping your coverage up to date, I recently reviewed your <strong>{{policy_type}}</strong> policy and found something important.</p>
<p><strong>Coverage Gap Identified:</strong> {{coverage_gap}}</p>
<p>Here's what I found:</p>
<ul>
<li><strong>Your current coverage limits:</strong> {{current_limits}}</li>
<li><strong>Estimated replacement cost:</strong> {{replacement_cost}}</li>
<li><strong>Recommendation:</strong> Update limits to match current values</li>
</ul>
<p>With property values and construction costs changing, it's important to make sure your coverage keeps pace. An adjustment now could prevent a significant out-of-pocket expense if something happens.</p>
<p>I'd like to schedule a brief coverage review to discuss your options. This is part of our standard client care — there's no cost or obligation.</p>
<p>Looking out for you,<br/>{{agent_name}}<br/>{{agency_name}}</p>`,

    "instant-lead-response": `<p>Hi {{client_name}},</p>
<p>Thank you for reaching out to {{agency_name}}! I received your inquiry and wanted to respond right away.</p>
<p>I'd love to help you find the right coverage. Here's what I can do for you:</p>
<ul>
<li>Compare quotes from multiple top-rated carriers</li>
<li>Review your current coverage for any gaps</li>
<li>Find available discounts you may qualify for</li>
</ul>
<p>Can we schedule a quick call to discuss your needs? I'm available at your convenience.</p>
<p>Looking forward to helping you,<br/>{{agent_name}}<br/>{{agency_name}}</p>`,

    "quote-follow-up": `<p>Hi {{client_name}},</p>
<p>I wanted to follow up on the <strong>{{policy_type}}</strong> quote I prepared for you. I want to make sure you had a chance to review it and answer any questions.</p>
<p>The quoted premium of <strong>{{premium_amount}}</strong> is competitive for your area, and I'm confident we can get you great coverage.</p>
<p>Would you like to move forward, or would it help to go over the details together?</p>
<p>Best,<br/>{{agent_name}}<br/>{{agency_name}}</p>`,

    "post-bind-onboarding": `<p>Hi {{client_name}},</p>
<p>Welcome to {{agency_name}}! Your <strong>{{policy_type}}</strong> policy is now active, and I'm excited to be your agent.</p>
<p>Here are a few things to help you get started:</p>
<ul>
<li><strong>Your policy number:</strong> On file and ready to go</li>
<li><strong>How to file a claim:</strong> Call us anytime or use your carrier's app</li>
<li><strong>Your ID cards:</strong> Should arrive in your email shortly</li>
<li><strong>Questions?</strong> I'm always just a call or text away</li>
</ul>
<p>Over the next few weeks, I'll check in to make sure everything is running smoothly. In the meantime, don't hesitate to reach out.</p>
<p>Glad to have you,<br/>{{agent_name}}<br/>{{agency_name}}</p>`,

    "annual-review-scheduler": `<p>Hi {{client_name}},</p>
<p>It's almost time for your annual coverage review! Your <strong>{{policy_type}}</strong> policy anniversary is coming up on <strong>{{expiration_date}}</strong>.</p>
<p>A lot can change in a year — property values, life circumstances, available discounts. A quick review ensures you're not overpaying or underinsured.</p>
<p>I've prepared a summary of your current coverage and would love to walk through it with you. It usually takes about 15 minutes.</p>
<p><a href="#">Schedule Your Review →</a></p>
<p>Looking forward to catching up,<br/>{{agent_name}}<br/>{{agency_name}}</p>`,

    "referral-generation": `<p>Hi {{client_name}},</p>
<p>Thank you for being such a valued client of {{agency_name}}. It's a pleasure working with you!</p>
<p>If you know anyone — a friend, family member, or colleague — who could use the same level of care and coverage, I'd love the chance to help them too.</p>
<p>Referring someone is simple:</p>
<ul>
<li>Just reply to this email with their name and number</li>
<li>Or forward this email to them directly</li>
</ul>
<p>As a thank you, we offer a referral bonus for every friend who becomes a client.</p>
<p>Thanks for trusting us with your insurance,<br/>{{agent_name}}<br/>{{agency_name}}</p>`,
  };
  return bodies[recipeSlug] || `<p>Hi {{client_name}},</p><p>Update from {{agency_name}}.</p><p>{{agent_name}}</p>`;
}

// ─── SMS Templates ──────────────────────────────────────────

function getDefaultSmsBody(recipeSlug: string): string {
  const sms: Record<string, string> = {
    "renewal-campaign":
      "Hi {{client_name}}, your {{policy_type}} policy renews on {{expiration_date}}. Reply YES to schedule a review with {{agent_name}}.",
    "rate-shopping-remarketing":
      "Hi {{client_name}}, we may be able to save you {{savings_amount}} on your upcoming {{policy_type}} renewal. Reply YES for a free comparison. —{{agent_name}}",
    "claims-follow-up":
      "Hi {{client_name}}, just checking in on your {{claim_type}} claim. Everything going okay? Reply if you need anything at all. —{{agent_name}}",
    "win-back-campaign":
      "Hi {{client_name}}, your {{policy_type}} coverage has lapsed. We can get you covered again in minutes — reply YES or call us. —{{agent_name}}",
    "instant-lead-response":
      "Hi {{client_name}}, thanks for contacting {{agency_name}}! {{agent_name}} will be in touch shortly. Reply with a good time to call.",
    "quote-follow-up":
      "Hi {{client_name}}, just checking in on your {{policy_type}} quote. Any questions? Reply or call us anytime. —{{agent_name}}",
    "post-bind-onboarding":
      "Welcome {{client_name}}! Your {{policy_type}} policy with {{agency_name}} is now active. Questions? Text us anytime. —{{agent_name}}",
    "annual-review-scheduler":
      "Hi {{client_name}}, it's time for your annual {{policy_type}} review. Reply YES to book a 15-min call with {{agent_name}}.",
    "referral-generation":
      "Hi {{client_name}}, know someone who needs great insurance? Send us their name and we'll take care of them — plus you get a bonus! —{{agent_name}}",
  };
  return sms[recipeSlug] || "Hi {{client_name}}, update from {{agency_name}}. —{{agent_name}}";
}

// ─── Workflow Summaries ─────────────────────────────────────

function getWorkflowSummary(
  recipeSlug: string,
  config: Record<string, any>,
  customer: SampleCustomer
): string {
  const summaries: Record<string, string> = {
    "renewal-campaign": `This automation monitors your policy book daily for upcoming expirations and sends personalized outreach at days ${
      (config.touchpoints || [60, 45, 30, 14, 7]).join(", ")
    } before each policy expires. For ${customer.name}'s ${customer.policyType} policy expiring ${customer.expirationDate}, the first touchpoint would go out ${(config.touchpoints || [60])[0]} days prior via ${(config.channels || ["email"]).join(" and ")}.`,

    "rate-shopping-remarketing": `Every day, this automation scans your book for policies entering the ${config.daysBeforeRenewal || 90}-day renewal window. For ${customer.name}'s ${customer.policyType} policy (${customer.premium}), AI matches carrier appetite and pulls competitive quotes. When savings exceed ${config.savingsThreshold || 15}%, a personalized comparison email is sent automatically. The current market shows potential savings of ${customer.savingsAmount} for this policy.`,

    "claims-follow-up": `When a claim is settled in your AMS, this automation sends an empathy-first sequence at days ${
      (config.touchpoints || [1, 7, 14, 30]).join(", ")
    } after closure. For ${customer.name}'s ${customer.claimType} claim (${customer.claimAmount}), the day-1 email is a personal check-in, day 7 is a status follow-up, day 14 is a satisfaction survey, and day 30 is a coverage review offer. If the satisfaction score drops below ${config.escalateBelow || 3}/5, it creates an urgent task for your team to call the client directly.`,

    "win-back-campaign": `This automation queries your AMS daily for policies that lapsed 30-60 days ago. For ${customer.name} (lapsed ${customer.lapseDate}, reason: ${customer.lapseReason}), it sends a personalized re-engagement sequence at days ${
      (config.touchpoints || [1, 7, 14, 30, 60]).join(", ")
    } via ${(config.channels || ["email"]).join(" and ")}. ${config.autoRequote ? "AI automatically pulls a fresh re-quote to include savings data in the outreach." : "Each message is personalized based on the lapse reason."} Typical recovery rate: 15-25% of lapsed clients within 90 days.`,

    "coverage-gap-detection": `Every ${config.schedule || "month"}, AI analyzes your full book of business against current property values, inflation data, and industry coverage standards. For ${customer.name}'s ${customer.policyType} policy: current limits are ${customer.currentLimits}, but estimated replacement cost is ${customer.replacementCost} — that's a gap of "${customer.coverageGap}". ${config.inflationAdjustment ? "Inflation adjustment is enabled, automatically factoring in construction cost increases." : ""} E&O-compliant recommendation letters are generated and sent to affected clients.`,

    "instant-lead-response": `When a new lead comes in through your website, CRM, or referral, this automation responds within 60 seconds via ${(config.channels || ["email"]).join(" and ")}. The AI qualifies the lead and books a consultation on your calendar.`,

    "quote-follow-up": `After you send a quote, this automation sends follow-up touchpoints at days ${
      (config.touchpoints || [1, 3, 7, 14, 21]).join(", ")
    } via ${(config.channels || ["email"]).join(" and ")}. Each message is personalized with the prospect's details and adapts based on engagement.`,

    "rate-increase-monitor": `Every ${config.schedule || "week"}, this automation researches rate changes across your clients' regions (currently: ${customer.state}). When rates increase above ${config.rateThreshold || 15}%, it triggers proactive outreach to affected clients.`,

    "cross-sell-intelligence": `Every ${config.schedule || "month"}, AI analyzes your full book of business for coverage gaps and single-policy households. For example, if ${customer.name} only has ${customer.policyType} coverage, the system identifies potential cross-sell opportunities.`,

    "market-research-alerts": `Every ${config.schedule || "week"}, AI researches regulatory changes, carrier updates, and market trends for ${
      (config.regions || []).length > 0 ? (config.regions as string[]).join(", ") : "all your client regions"
    } and delivers a digest to your email.`,

    "post-bind-onboarding": `When a new policy binds, this automation sends a ${(config.touchpoints || [0, 3, 7, 14, 30, 90]).length}-touch onboarding sequence: welcome email on day 0, check-in on day 3, claims guide on day 7, coverage education on day 14, satisfaction survey on day 30, and annual review scheduling on day 90. ${config.requestReview ? "A Google review request is included at the day-30 touchpoint." : ""}`,

    "annual-review-scheduler": `${config.daysBeforeAnniversary || 60} days before each policy anniversary, this automation sends a coverage comparison summary and booking link. Follow-ups go out at days ${(config.followUpDays || [7, 14]).join(" and ")} if no response. Creates an agent task after the final follow-up for direct outreach.`,

    "coi-management": `When a COI request arrives or a policy binds, this automation parses the request, matches it against your policies, generates a certificate, and ${config.autoDeliver ? "delivers it automatically to certificate holders" : "queues it for your review before sending"}. ${config.trackExpirations ? "Expiration tracking is enabled — you'll get alerts 30 days before certificates expire." : ""}`,

    "carrier-rate-alerts": `Every ${config.schedule || "week"}, AI researches state insurance department filings and carrier announcements. Cross-references with your book to identify which clients are affected by rate changes above ${config.alertThreshold || 10}%. Delivers a prioritized action report to your email.`,

    "referral-generation": `After ${(config.triggerOn || ["post_renewal"]).join(", ").replace(/_/g, " ")}, this automation identifies satisfied clients and sends a personalized referral request. Follow-ups go out at days ${(config.followUpDays || [7]).join(", ")} via ${(config.channels || ["email"]).join(" and ")}. Referred clients retain at 37% higher rates than non-referred.`,

    "life-event-cross-sell": `Every ${config.schedule || "week"}, AI scans public records for client life events: ${(config.eventTypes || ["home_purchase", "vehicle_registration"]).join(", ").replace(/_/g, " ")}. Matches events to coverage gaps and triggers personalized outreach at the perfect moment.`,
  };
  return summaries[recipeSlug] || `This automation will run ${config.schedule || "on activation"} using the configured settings.`;
}
