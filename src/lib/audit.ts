import { prisma } from "@/lib/db";

export type AuditAction =
  | "credential.created"
  | "credential.deleted"
  | "credential.accessed"
  | "credential.refreshed"
  | "credential.expired"
  | "automation.activated"
  | "automation.paused"
  | "automation.resumed"
  | "automation.deactivated"
  | "automation.run_started"
  | "automation.run_completed"
  | "automation.run_failed"
  | "oauth.connected"
  | "oauth.disconnected"
  | "oauth.token_refreshed"
  | "oauth.token_expired"
  | "user.created"
  | "user.login"
  | "user.password_reset"
  | "data.exported"
  | "data.deleted"
  | "mastermind_invite.submitted";

export async function logAudit(params: {
  organizationId?: string;
  userId?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        organizationId: params.organizationId || null,
        userId: params.userId || null,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId || null,
        metadata: sanitizeForAudit(params.metadata || {}),
        ipAddress: params.ipAddress || null,
      },
    });
  } catch (e) {
    // Audit logging should never crash the app
    console.error("[audit] Failed to write audit log:", (e as Error).message);
  }
}

function sanitizeForAudit(data: Record<string, any>): Record<string, any> {
  const sanitized = { ...data };
  const sensitiveKeys = [
    "password", "passwordhash", "accesstoken", "refreshtoken",
    "secret", "token", "ssn", "socialsecurity", "driverlicense",
    "creditcard", "accountnumber", "routingnumber", "taxid",
    "dateofbirth", "dob",
  ];

  for (const key of Object.keys(sanitized)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some((s) => lowerKey.includes(s))) {
      sanitized[key] = "[REDACTED]";
    }
  }

  return sanitized;
}
