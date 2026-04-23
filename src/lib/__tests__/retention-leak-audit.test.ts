import { describe, it, expect } from "vitest";
import {
  calculateAnnualLeakage,
  calculateLeakOutputs,
  COMMISSION_RATE,
  TARGET_RETENTION_PCT,
  THREE_POINT_LIFT,
  amsLabel,
  AMS_VALUES,
} from "@/lib/retention-leak-audit";

describe("retention-leak-audit", () => {
  describe("calculateAnnualLeakage", () => {
    it("computes commission leakage from lapse rate", () => {
      // 500 PIF × 15% lapse × $1,200 premium × 12% commission = $10,800
      const leak = calculateAnnualLeakage({
        policyCount: 500,
        currentRetention: 85,
        avgPremium: 1200,
      });
      expect(leak).toBe(10800);
    });

    it("returns 0 when policy count is zero", () => {
      expect(
        calculateAnnualLeakage({
          policyCount: 0,
          currentRetention: 85,
          avgPremium: 1200,
        })
      ).toBe(0);
    });

    it("returns 0 when avg premium is zero", () => {
      expect(
        calculateAnnualLeakage({
          policyCount: 500,
          currentRetention: 85,
          avgPremium: 0,
        })
      ).toBe(0);
    });

    it("clamps retention to 0-100 range", () => {
      // retention >100 should behave as 100 (no leakage)
      expect(
        calculateAnnualLeakage({
          policyCount: 500,
          currentRetention: 120,
          avgPremium: 1200,
        })
      ).toBe(0);
    });

    it("treats negative retention as 0 (100% lapse)", () => {
      // 500 × 100% × $1,200 × 12% = $72,000
      expect(
        calculateAnnualLeakage({
          policyCount: 500,
          currentRetention: -10,
          avgPremium: 1200,
        })
      ).toBe(72000);
    });
  });

  describe("calculateLeakOutputs", () => {
    it("returns the full output shape", () => {
      const outputs = calculateLeakOutputs({
        policyCount: 500,
        currentRetention: 85,
        avgPremium: 1200,
      });

      expect(outputs.annualLeakage).toBe(10800);
      expect(outputs.policiesLapsingAnnually).toBe(75);
      // 500 × 3% × $1,200 × 12% = $2,160
      expect(outputs.threePointRecovery).toBe(2160);
      // (95 - 85) × 500 × $1,200 × 12% / 100 = $7,200
      expect(outputs.targetRecovery).toBe(7200);
      expect(outputs.targetRetentionPct).toBe(TARGET_RETENTION_PCT);
      expect(outputs.improvedRetentionPct).toBe(85 + THREE_POINT_LIFT);
    });

    it("caps improvedRetentionPct at 99", () => {
      const outputs = calculateLeakOutputs({
        policyCount: 100,
        currentRetention: 98,
        avgPremium: 1000,
      });
      expect(outputs.improvedRetentionPct).toBe(99);
    });

    it("returns zero targetRecovery when already above target retention", () => {
      const outputs = calculateLeakOutputs({
        policyCount: 100,
        currentRetention: 97,
        avgPremium: 1000,
      });
      expect(outputs.targetRecovery).toBe(0);
    });
  });

  describe("constants", () => {
    it("uses the 12% commission rate that matches the ROI calculator", () => {
      expect(COMMISSION_RATE).toBe(0.12);
    });

    it("targets a 95% retention benchmark", () => {
      expect(TARGET_RETENTION_PCT).toBe(95);
    });
  });

  describe("amsLabel", () => {
    it("returns labels for known AMS values", () => {
      expect(amsLabel("APPLIED_EPIC")).toBe("Applied Epic");
      expect(amsLabel("HAWKSOFT")).toBe("HawkSoft");
      expect(amsLabel("EZLYNX")).toBe("EZLynx");
    });

    it("falls back to the raw value for unknown AMS", () => {
      expect(amsLabel("NEVER_HEARD_OF_IT")).toBe("NEVER_HEARD_OF_IT");
    });

    it("exposes the valid AMS values for route validation", () => {
      expect(AMS_VALUES).toContain("APPLIED_EPIC");
      expect(AMS_VALUES).toContain("HAWKSOFT");
      expect(AMS_VALUES).toContain("EZLYNX");
      expect(AMS_VALUES).toContain("OTHER_AMS");
      expect(AMS_VALUES).toContain("NO_AMS");
    });
  });
});
