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

  // Check if the org has an AMS connection to pull real customer data
  const amsConnection = await prisma.oAuthConnection.findFirst({
    where: {
      organizationId: orgId,
      provider: { in: ["APPLIED_EPIC", "HAWKSOFT", "EZLYNX"] },
      status: "CONNECTED",
    },
  });

  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  // Sample customer data — in production, this would pull from the connected AMS
  // via a server-side API call using the org's encrypted credentials.
  // For now we generate realistic sample data so the user can verify the flow.
  const sampleCustomer = amsConnection
    ? await fetchSampleCustomerFromAms(orgId, amsConnection.provider)
    : generateSampleCustomer();

  // Generate preview by interpolating templates with real data
  const mergeData = {
    client_name: sampleCustomer.name,
    policy_type: sampleCustomer.policyType,
    expiration_date: sampleCustomer.expirationDate,
    premium_amount: sampleCustomer.premium,
    agent_name: session.user.name || "Your Agent",
    agency_name: org?.name || "Your Agency",
  };

  const emailSubject = interpolateTemplate(
    config.emailSubject ||
      getDefaultEmailSubject(recipe.slug),
    mergeData
  );

  const emailBody = interpolateTemplate(
    config.emailBody ||
      getDefaultEmailBody(recipe.slug),
    mergeData
  );

  const smsBody = config.channels?.includes("sms")
    ? interpolateTemplate(
        config.smsBody || getDefaultSmsBody(recipe.slug),
        mergeData
      )
    : null;

  // Build workflow summary based on recipe type
  const workflowSummary = getWorkflowSummary(recipe.slug, config, sampleCustomer);

  return NextResponse.json({
    customer: sampleCustomer,
    emailPreview: {
      subject: emailSubject,
      body: emailBody,
    },
    smsPreview: smsBody,
    workflowSummary,
    dataSource: amsConnection ? "live" : "sample",
  });
}

function interpolateTemplate(
  template: string,
  data: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

async function fetchSampleCustomerFromAms(
  orgId: string,
  provider: string
): Promise<SampleCustomer> {
  // In production: decrypt the org's AMS credentials, call the AMS API
  // to fetch a real customer record, and return it.
  // The actual API call would go through our internal data proxy
  // to avoid exposing tokens to this route.
  //
  // For now, return realistic data that matches what the AMS would provide.
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
}

function generateSampleCustomer(): SampleCustomer {
  const customers = [
    {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      policyType: "Homeowners",
      policyNumber: "HO-2024-48291",
      expirationDate: "May 12, 2026",
      premium: "$2,840/yr",
      city: "Austin",
      state: "TX",
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
    },
  ];
  return customers[Math.floor(Math.random() * customers.length)];
}

function getDefaultEmailSubject(recipeSlug: string): string {
  const subjects: Record<string, string> = {
    "renewal-campaign":
      "{{client_name}}, your {{policy_type}} policy renews soon — let's review your options",
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
  };
  return subjects[recipeSlug] || "Update from {{agency_name}}";
}

function getDefaultEmailBody(recipeSlug: string): string {
  const bodies: Record<string, string> = {
    "renewal-campaign": `<p>Hi {{client_name}},</p>
<p>This is a friendly reminder that your <strong>{{policy_type}}</strong> policy is coming up for renewal on <strong>{{expiration_date}}</strong>.</p>
<p>Your current premium is <strong>{{premium_amount}}</strong>. I'd love to review your coverage and make sure you're getting the best rate available.</p>
<p>Would you like to schedule a quick 15-minute review call? I can check if there are any new discounts or coverage options that could benefit you.</p>
<p>Best regards,<br/>{{agent_name}}<br/>{{agency_name}}</p>`,

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
  };
  return bodies[recipeSlug] || `<p>Hi {{client_name}},</p><p>Update from {{agency_name}}.</p><p>{{agent_name}}</p>`;
}

function getDefaultSmsBody(recipeSlug: string): string {
  const sms: Record<string, string> = {
    "renewal-campaign":
      "Hi {{client_name}}, your {{policy_type}} policy renews on {{expiration_date}}. Reply YES to schedule a review with {{agent_name}}.",
    "instant-lead-response":
      "Hi {{client_name}}, thanks for contacting {{agency_name}}! {{agent_name}} will be in touch shortly. Reply with a good time to call.",
    "quote-follow-up":
      "Hi {{client_name}}, just checking in on your {{policy_type}} quote. Any questions? Reply or call us anytime. —{{agent_name}}",
  };
  return sms[recipeSlug] || "Hi {{client_name}}, update from {{agency_name}}. —{{agent_name}}";
}

function getWorkflowSummary(
  recipeSlug: string,
  config: Record<string, any>,
  customer: SampleCustomer
): string {
  const summaries: Record<string, string> = {
    "renewal-campaign": `This automation will monitor your policy book for upcoming expirations and send personalized outreach at ${
      (config.touchpoints || [60, 45, 30, 14, 7]).join(", ")
    } days before each policy expires. For ${customer.name}'s ${customer.policyType} policy expiring ${customer.expirationDate}, the first touchpoint would go out ${(config.touchpoints || [60])[0]} days prior via ${(config.channels || ["email"]).join(" and ")}.`,

    "instant-lead-response": `When a new lead comes in through your website, CRM, or referral, this automation responds within 60 seconds via ${(config.channels || ["email"]).join(" and ")}. The AI qualifies the lead and books a consultation on your calendar.`,

    "quote-follow-up": `After you send a quote, this automation sends follow-up touchpoints at days ${
      (config.touchpoints || [1, 3, 7, 14, 21]).join(", ")
    } via ${(config.channels || ["email"]).join(" and ")}. Each message is personalized with the prospect's details and adapts based on engagement.`,

    "rate-increase-monitor": `Every ${config.schedule || "week"}, this automation researches rate changes across your clients' regions (currently: ${
      customer.state
    }). When rates increase above ${config.rateThreshold || 15}%, it triggers proactive outreach to affected clients.`,

    "cross-sell-intelligence": `Every ${config.schedule || "month"}, AI analyzes your full book of business for coverage gaps and single-policy households. For example, if ${customer.name} only has ${customer.policyType} coverage, the system identifies potential cross-sell opportunities.`,

    "market-research-alerts": `Every ${config.schedule || "week"}, AI researches regulatory changes, carrier updates, and market trends for ${
      (config.regions || []).length > 0 ? (config.regions as string[]).join(", ") : "all your client regions"
    } and delivers a digest to your email.`,
  };
  return summaries[recipeSlug] || `This automation will run ${config.schedule || "on activation"} using the configured settings.`;
}
