import { describe, it, expect, vi } from "vitest";

// Mock prisma before importing audit
vi.mock("@/lib/db", () => ({
  prisma: {
    auditLog: {
      create: vi.fn().mockResolvedValue({ id: "test-audit-id" }),
    },
  },
}));

const { logAudit } = await import("@/lib/audit");
const { prisma } = await import("@/lib/db");

describe("audit", () => {
  describe("logAudit", () => {
    it("creates an audit log record", async () => {
      await logAudit({
        organizationId: "org-123",
        userId: "user-456",
        action: "oauth.connected",
        resource: "OAuthConnection",
        resourceId: "conn-789",
        metadata: { provider: "gmail" },
      });

      expect(prisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            organizationId: "org-123",
            userId: "user-456",
            action: "oauth.connected",
            resource: "OAuthConnection",
            resourceId: "conn-789",
          }),
        })
      );
    });

    it("does not crash if prisma throws", async () => {
      (prisma.auditLog.create as any).mockRejectedValueOnce(new Error("DB down"));

      // Should not throw
      await expect(
        logAudit({
          action: "user.login",
          resource: "User",
        })
      ).resolves.toBeUndefined();
    });
  });

  describe("sanitizeForAudit (via logAudit)", () => {
    const sensitiveFields: [string, any][] = [
      ["accessToken", "ya29.secret"],
      ["refreshToken", "1//refresh"],
      ["password", "mypassword"],
      ["passwordHash", "$2b$12$hash"],
      ["ssn", "123-45-6789"],
      ["socialSecurityNumber", "987654321"],
      ["driverLicenseNumber", "DL12345"],
      ["creditCardNumber", "4111111111111111"],
      ["accountNumber", "123456789"],
      ["routingNumber", "021000021"],
      ["taxId", "12-3456789"],
      ["dateOfBirth", "1990-01-15"],
      ["apiToken", "tok_123"],
      ["webhookSecret", "whsec_abc"],
    ];

    for (const [key, value] of sensitiveFields) {
      it(`redacts ${key} in metadata`, async () => {
        await logAudit({
          action: "credential.created",
          resource: "OAuthConnection",
          metadata: { [key]: value, safeField: "keep-me" },
        });

        const call = (prisma.auditLog.create as any).mock.calls.at(-1)[0];
        const metadata = call.data.metadata;
        expect(metadata[key]).toBe("[REDACTED]");
        expect(metadata.safeField).toBe("keep-me");
      });
    }

    it("preserves non-sensitive fields", async () => {
      await logAudit({
        action: "automation.activated",
        resource: "AutomationInstance",
        metadata: { recipeSlug: "renewal-campaign", engineType: "N8N", tier: "SPRINT" },
      });

      const call = (prisma.auditLog.create as any).mock.calls.at(-1)[0];
      const metadata = call.data.metadata;
      expect(metadata.recipeSlug).toBe("renewal-campaign");
      expect(metadata.engineType).toBe("N8N");
      expect(metadata.tier).toBe("SPRINT");
    });
  });
});
