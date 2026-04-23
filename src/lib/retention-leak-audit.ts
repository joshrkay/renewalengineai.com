/**
 * Retention Leak Audit — shared math + constants.
 *
 * Used by both the public form component (client) and the POST route
 * (server) so displayed numbers and persisted numbers always agree.
 *
 * All dollar outputs are in USD commission dollars, assuming a ~12%
 * commission rate on gross premium — the same assumption used in the
 * ROI calculator so the two tools tell a consistent story.
 */

export const COMMISSION_RATE = 0.12;
export const TARGET_RETENTION_PCT = 95;
export const THREE_POINT_LIFT = 3;
export const MAX_POLICY_COUNT = 100_000;
export const MAX_AVG_PREMIUM = 1_000_000;

export const AMS_OPTIONS = [
  { value: "APPLIED_EPIC", label: "Applied Epic" },
  { value: "HAWKSOFT", label: "HawkSoft" },
  { value: "EZLYNX", label: "EZLynx" },
  { value: "OTHER_AMS", label: "Another AMS" },
  { value: "NO_AMS", label: "Not yet on an AMS" },
] as const;

export const AMS_VALUES = AMS_OPTIONS.map((o) => o.value) as readonly string[];

export type AmsValue = (typeof AMS_OPTIONS)[number]["value"];

export function amsLabel(value: string): string {
  return AMS_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export type LeakInputs = {
  policyCount: number;
  currentRetention: number;
  avgPremium: number;
};

export type LeakOutputs = {
  policiesLapsingAnnually: number;
  annualLeakage: number;
  threePointRecovery: number;
  targetRecovery: number;
  targetRetentionPct: number;
  improvedRetentionPct: number;
};

/**
 * Commission dollars leaking annually from policies that don't renew.
 * Returns 0 for inputs that are zero/negative; callers should validate
 * ranges before using the value in persistence.
 */
export function calculateAnnualLeakage(inputs: LeakInputs): number {
  const { policyCount, currentRetention, avgPremium } = inputs;
  if (policyCount <= 0 || avgPremium <= 0) return 0;
  const lapseRate = Math.max(0, Math.min(100, 100 - currentRetention)) / 100;
  const policiesLapsing = policyCount * lapseRate;
  return Math.round(policiesLapsing * avgPremium * COMMISSION_RATE);
}

/**
 * Full set of outputs for the form UI: leakage, 3-point recovery, and the
 * ceiling recovery if retention reaches TARGET_RETENTION_PCT.
 */
export function calculateLeakOutputs(inputs: LeakInputs): LeakOutputs {
  const { policyCount, currentRetention, avgPremium } = inputs;
  const annualLeakage = calculateAnnualLeakage(inputs);
  const lapseRate = Math.max(0, Math.min(100, 100 - currentRetention)) / 100;
  const policiesLapsingAnnually = Math.round(policyCount * lapseRate);

  const threePointRecovery = Math.round(
    policyCount * (THREE_POINT_LIFT / 100) * avgPremium * COMMISSION_RATE
  );

  const retentionGap = Math.max(0, TARGET_RETENTION_PCT - currentRetention);
  const targetRecovery = Math.round(
    policyCount * (retentionGap / 100) * avgPremium * COMMISSION_RATE
  );

  const improvedRetentionPct = Math.min(currentRetention + THREE_POINT_LIFT, 99);

  return {
    policiesLapsingAnnually,
    annualLeakage,
    threePointRecovery,
    targetRecovery,
    targetRetentionPct: TARGET_RETENTION_PCT,
    improvedRetentionPct,
  };
}
