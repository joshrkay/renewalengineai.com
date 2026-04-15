import { log } from "@/lib/logger";

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
    log.warn("[email] RESEND_API_KEY not set — email not sent:", subject);
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
    log.error("[email] Send failed:", res.status);
    throw new Error(`Email send failed: ${res.status}`);
  }
}

// ─── Email Templates ────────────────────────────────────────

export async function sendWelcomeEmail(
  email: string,
  name: string | null,
  tier: string,
  resetToken: string
): Promise<void> {
  const tierLabels: Record<string, string> = {
    AUDIT: "AI-Powered Renewal Audit",
    SPRINT: "Build & Launch",
    MANAGED: "Managed AI Operations",
  };

  const resetUrl = `${APP_URL}/set-password?token=${resetToken}`;

  await sendEmail({
    to: email,
    subject: `Welcome to RenewalEngineAI — Set Up Your Account`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #4f46e5; font-size: 24px; margin: 0;">RenewalEngineAI</h1>
        </div>

        <h2 style="color: #0a0a0a; font-size: 20px;">Welcome${name ? `, ${name}` : ""}!</h2>

        <p style="color: #525252; font-size: 16px; line-height: 1.6;">
          Your <strong>${tierLabels[tier] || tier}</strong> account has been created.
          Click the button below to set your password and access your dashboard.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}"
             style="display: inline-block; background: #4f46e5; color: white; padding: 14px 32px;
                    border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Set Your Password
          </a>
        </div>

        <p style="color: #a3a3a3; font-size: 14px; line-height: 1.5;">
          This link expires in 24 hours. If you did not make this purchase, please contact us immediately.
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
    subject: `${isError ? "Action Required" : "Update"}: ${recipeName} — ${isError ? "Error" : "Run Completed"}`,
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

export async function sendMastermindInviteNotification(
  email: string,
  name: string | null,
  source: string
): Promise<void> {
  const to = process.env.MASTERMIND_INVITES_TO || "josh@renewalengineai.com";

  await sendEmail({
    to,
    subject: `New Mastermind invite request — ${email}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #0a0a0a; font-size: 20px;">New Mastermind invite request</h2>
        <p style="color: #525252; font-size: 16px; line-height: 1.6;">
          A new prospect just asked to be invited to the AI Mastermind &amp; Community.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 15px;">
          <tr>
            <td style="padding: 8px 0; color: #737373;">Email</td>
            <td style="padding: 8px 0; color: #0a0a0a; font-weight: 600;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #737373;">Name</td>
            <td style="padding: 8px 0; color: #0a0a0a; font-weight: 600;">${name || "—"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #737373;">Source</td>
            <td style="padding: 8px 0; color: #0a0a0a; font-weight: 600;">${source}</td>
          </tr>
        </table>
        <p style="color: #a3a3a3; font-size: 13px;">
          Reach out within 24 hours. The full list lives in the MastermindInvite table.
        </p>
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
          The connection for your <strong>${provider}</strong> integration is expiring or has expired.
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
