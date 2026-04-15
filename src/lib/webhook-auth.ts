import { createHmac, timingSafeEqual } from "crypto";
import { log } from "@/lib/logger";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

export function signPayload(payload: string): string {
  return createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("hex");
}

export function verifyWebhookSignature(
  payload: string,
  signature: string | null
): boolean {
  if (!WEBHOOK_SECRET) {
    log.warn("[webhook] WEBHOOK_SECRET not set — skipping verification in development");
    return process.env.NODE_ENV === "development";
  }

  if (!signature) return false;

  const expected = signPayload(payload);

  // Use timing-safe comparison to prevent timing attacks
  try {
    return timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}
