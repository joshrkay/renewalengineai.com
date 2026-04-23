/**
 * Unified analytics wrapper for GA4 + server-side Measurement Protocol.
 *
 * Goals:
 * - Call sites stay simple: `trackEvent('lead_submit', { source })`.
 * - Missing `NEXT_PUBLIC_GA_MEASUREMENT_ID` = no-op (safe for preview deploys).
 * - Server-side events reuse the visitor's GA4 `client_id` when available so
 *   purchase attribution flows back to the originating session.
 */

export type AnalyticsEvent =
  | { name: "lead_submit"; params: { source: string } }
  | {
      name: "begin_checkout";
      params: { plan: string; value: number; currency: "USD" };
    }
  | {
      name: "purchase";
      params: {
        transaction_id: string;
        plan: string;
        value: number;
        currency: "USD";
      };
    }
  | { name: "book_audit_click"; params: { cta_location: string } }
  | { name: "course_view"; params: { course_slug: string } };

type GtagFn = (
  command: "event" | "config" | "set" | "consent" | "js",
  targetOrEventName: string | Date,
  params?: Record<string, unknown>
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

/**
 * Fire a client-side GA4 event. No-ops when GA4 isn't loaded.
 */
export function trackEvent<E extends AnalyticsEvent>(
  name: E["name"],
  params: E["params"]
) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/**
 * Read the GA4 `client_id` from the `_ga` cookie header.
 * Format: `GA1.1.<client_id>.<timestamp>` — we return the client_id portion.
 * Returns undefined when no cookie is present.
 */
export function readGaClientIdFromCookie(
  cookieHeader: string | null | undefined
): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(/(?:^|;\s*)_ga=([^;]+)/);
  if (!match) return undefined;
  const parts = match[1].split(".");
  if (parts.length < 4) return undefined;
  return `${parts[2]}.${parts[3]}`;
}

type ServerEventPayload = {
  name: "purchase" | "lead_submit";
  params: Record<string, string | number | boolean>;
  clientId: string;
  userId?: string;
};

/**
 * Send a server-side event via the GA4 Measurement Protocol.
 * Used from Stripe webhooks and other server-only hooks.
 * Returns true when the request was dispatched (not necessarily accepted).
 */
export async function trackServerEvent(
  event: ServerEventPayload
): Promise<boolean> {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const apiSecret = process.env.GA_API_SECRET;
  if (!measurementId || !apiSecret) return false;

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(
    measurementId
  )}&api_secret=${encodeURIComponent(apiSecret)}`;

  const body = {
    client_id: event.clientId,
    user_id: event.userId,
    events: [{ name: event.name, params: event.params }],
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}
