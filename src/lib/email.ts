const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "RenewalEngineAI <noreply@renewalengineai.com>";
const APP_URL = process.env.NEXTAUTH_URL || "https://renewalengineai.com";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — email not sent:", { to, subject });
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[email] Send failed:", res.status, body);
    throw new Error(`Email send failed: ${res.status}`);
  }
}

// ─── Email Templates ────────────────────────────────────────

export async function sendWelcomeEmail(
  email: string,
  name: string | null,
  tier: string,
  tempPassword: string
): Promise<void> {
  const tierLabels: Record<string, string> = {
    AUDIT: "AI-Powered Renewal Audit",
    SPRINT: "Build & Launch",
    MANAGED: "Managed AI Operations",
  };

  await sendEmail({
    to: email,
    subject: `Welcome to RenewalEngineAI — Your ${tierLabels[tier] || tier} Account is Ready`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #4f46e5; font-size: 24px; margin: 0;">RenewalEngineAI</h1>
        </div>

        <h2 style="color: #0a0a0a; font-size: 20px;">Welcome${name ? `, ${name}` : ""}!</h2>

        <p style="color: #525252; font-size: 16px; line-height: 1.6;">
          Your <strong>${tierLabels[tier] || tier}</strong> account has been created.
          You can now log in to your dashboard to connect your tools and activate automation recipes.
        </p>

        <div style="background: #f5f5f5; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #737373;">Your login credentials:</p>
          <p style="margin: 0; font-size: 16px;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 8px 0 0 0; font-size: 16px;"><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${APP_URL}/login"
             style="display: inline-block; background: #4f46e5; color: white; padding: 14px 32px;
                    border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Log In to Your Dashboard
          </a>
        </div>

        <p style="color: #a3a3a3; font-size: 14px; line-height: 1.5;">
          Please change your password after your first login.
          If you have any questions, reply to this email or schedule a call with our team.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
        <p style="color: #a3a3a3; font-size: 12px;">RenewalEngineAI — AI Automation for Insurance Agencies</p>
      </div>
    `,
  });
}

export async function sendAutomationAlert(
  email: string,
  recipeName: string,
  status: "error" | "completed",
  details: string
): Promise<void> {
  const isError = status === "error";

  await sendEmail({
    to: email,
    subject: `${isError ? "⚠️" : "✅"} ${recipeName} — ${isError ? "Error" : "Run Completed"}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: ${isError ? "#dc2626" : "#16a34a"}; font-size: 20px;">
          ${recipeName} — ${isError ? "Error Detected" : "Run Completed"}
        </h2>

        <div style="background: ${isError ? "#fef2f2" : "#f0fdf4"}; border-radius: 12px; padding: 24px; margin: 24px 0;
                    border-left: 4px solid ${isError ? "#dc2626" : "#16a34a"};">
          <p style="margin: 0; color: #0a0a0a; font-size: 16px; line-height: 1.6;">
            ${details}
          </p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${APP_URL}/dashboard/automations"
             style="display: inline-block; background: #4f46e5; color: white; padding: 14px 32px;
                    border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 16px;">
            View in Dashboard
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
        <p style="color: #a3a3a3; font-size: 12px;">RenewalEngineAI — AI Automation for Insurance Agencies</p>
      </div>
    `,
  });
}

export async function sendTokenExpiryWarning(
  email: string,
  provider: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Action Required: Reconnect your ${provider} integration`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #d97706; font-size: 20px;">Your ${provider} connection needs attention</h2>

        <p style="color: #525252; font-size: 16px; line-height: 1.6;">
          The OAuth token for your <strong>${provider}</strong> integration is expiring soon or has expired.
          Please reconnect to keep your automations running.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${APP_URL}/dashboard/integrations"
             style="display: inline-block; background: #d97706; color: white; padding: 14px 32px;
                    border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Reconnect ${provider}
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
        <p style="color: #a3a3a3; font-size: 12px;">RenewalEngineAI — AI Automation for Insurance Agencies</p>
      </div>
    `,
  });
}
