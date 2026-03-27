import { describe, it, expect, beforeAll } from "vitest";

process.env.WEBHOOK_SECRET = "test-webhook-secret-32bytes-long";

const { signPayload, verifyWebhookSignature } = await import("@/lib/webhook-auth");

describe("webhook-auth", () => {
  const payload = '{"status":"success","data":{"client":"John Doe","policyId":"HO-123"}}';

  describe("signPayload", () => {
    it("returns a 64-char hex string (SHA-256)", () => {
      const sig = signPayload(payload);
      expect(sig).toMatch(/^[0-9a-f]{64}$/);
    });

    it("is deterministic (same input → same output)", () => {
      expect(signPayload(payload)).toBe(signPayload(payload));
    });

    it("produces different signatures for different payloads", () => {
      const sig1 = signPayload("payload-a");
      const sig2 = signPayload("payload-b");
      expect(sig1).not.toBe(sig2);
    });
  });

  describe("verifyWebhookSignature", () => {
    it("accepts a valid signature", () => {
      const sig = signPayload(payload);
      expect(verifyWebhookSignature(payload, sig)).toBe(true);
    });

    it("rejects null signature", () => {
      expect(verifyWebhookSignature(payload, null)).toBe(false);
    });

    it("rejects empty string signature", () => {
      expect(verifyWebhookSignature(payload, "")).toBe(false);
    });

    it("rejects wrong signature", () => {
      expect(verifyWebhookSignature(payload, "a".repeat(64))).toBe(false);
    });

    it("rejects tampered payload with valid signature from different payload", () => {
      const sig = signPayload(payload);
      const tampered = payload.replace("John Doe", "Jane Doe");
      expect(verifyWebhookSignature(tampered, sig)).toBe(false);
    });

    it("rejects non-hex signature", () => {
      expect(verifyWebhookSignature(payload, "not-hex-at-all")).toBe(false);
    });

    it("rejects signature with wrong length", () => {
      const sig = signPayload(payload);
      expect(verifyWebhookSignature(payload, sig.slice(0, 32))).toBe(false);
    });
  });
});
