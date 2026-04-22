import { describe, it, expect, vi, beforeEach } from "vitest";

// Capture console output
const consoleSpy = {
  log: vi.spyOn(console, "log").mockImplementation(() => {}),
  warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
  error: vi.spyOn(console, "error").mockImplementation(() => {}),
};

const { log } = await import("@/lib/logger");

describe("logger", () => {
  beforeEach(() => {
    consoleSpy.log.mockClear();
    consoleSpy.warn.mockClear();
    consoleSpy.error.mockClear();
  });

  describe("email redaction", () => {
    it("redacts email addresses", () => {
      log.info("User john.doe@agency.com logged in");
      const output = consoleSpy.log.mock.calls[0][1];
      expect(output).not.toContain("john.doe@agency.com");
      expect(output).toContain("[EMAIL]");
    });

    it("redacts multiple emails in one message", () => {
      log.info("from: a@b.com to: c@d.com");
      const output = consoleSpy.log.mock.calls[0][1];
      expect(output).not.toContain("a@b.com");
      expect(output).not.toContain("c@d.com");
    });
  });

  describe("SSN redaction", () => {
    it("redacts hyphenated SSN (XXX-XX-XXXX)", () => {
      log.error("SSN: 123-45-6789");
      const output = consoleSpy.error.mock.calls[0][1];
      expect(output).not.toContain("123-45-6789");
      expect(output).toContain("[SSN]");
    });

    it("redacts 9-digit SSN", () => {
      log.error("SSN: 123456789");
      const output = consoleSpy.error.mock.calls[0][1];
      expect(output).not.toContain("123456789");
    });
  });

  describe("token redaction", () => {
    it("redacts access tokens in JSON", () => {
      log.error('{"accessToken":"ya29.secret_value"}');
      const output = consoleSpy.error.mock.calls[0][1];
      expect(output).not.toContain("ya29.secret_value");
      expect(output).toContain("[REDACTED]");
    });

    it("redacts refresh tokens in JSON", () => {
      log.error('{"refresh_token":"1//0dxxx"}');
      const output = consoleSpy.error.mock.calls[0][1];
      expect(output).not.toContain("1//0dxxx");
    });

    it("redacts Bearer tokens", () => {
      log.warn("Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.payload.sig");
      const output = consoleSpy.warn.mock.calls[0][1];
      expect(output).not.toContain("eyJhbGci");
      expect(output).toContain("Bearer [REDACTED]");
    });
  });

  describe("API key redaction", () => {
    it("redacts Stripe live keys", () => {
      log.error("Key: sk_live_TESTONLY000");
      const output = consoleSpy.error.mock.calls[0][1];
      expect(output).not.toContain("TESTONLY000");
      expect(output).toContain("sk_live_[REDACTED]");
    });

    it("redacts Stripe test keys", () => {
      log.error("Key: sk_test_abc123");
      const output = consoleSpy.error.mock.calls[0][1];
      expect(output).not.toContain("abc123");
    });

    it("redacts webhook secrets", () => {
      log.error("whsec_abc123def456");
      const output = consoleSpy.error.mock.calls[0][1];
      expect(output).not.toContain("abc123def456");
    });

    it("redacts Resend keys", () => {
      log.error("re_abc123def456");
      const output = consoleSpy.error.mock.calls[0][1];
      expect(output).not.toContain("abc123def456");
    });
  });

  describe("complex scenarios", () => {
    it("redacts multiple PII types in one message", () => {
      log.error('Failed for john@test.com SSN 123-45-6789 token sk_test_secret');
      const output = consoleSpy.error.mock.calls[0][1];
      expect(output).not.toContain("john@test.com");
      expect(output).not.toContain("123-45-6789");
      expect(output).not.toContain("sk_test_secret");
    });

    it("handles Error objects", () => {
      log.error(new Error("Token ya29.secret failed"));
      const output = consoleSpy.error.mock.calls[0][1];
      // Error messages go through redaction too
      expect(output).not.toContain("ya29.secret");
    });

    it("handles objects with sensitive fields", () => {
      log.info({ email: "test@test.com", status: "ok" });
      const output = consoleSpy.log.mock.calls[0][1];
      expect(output).not.toContain("test@test.com");
    });

    it("passes through safe strings unchanged", () => {
      log.info("Processing 42 records for org_abc123");
      const output = consoleSpy.log.mock.calls[0][1];
      expect(output).toContain("Processing 42 records for org_abc123");
    });
  });
});
