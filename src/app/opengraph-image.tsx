import { ImageResponse } from "next/og";

export const alt =
  "RenewalEngineAI — AI Automation for Insurance Agencies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #000000 0%, #0a0a0a 40%, #0b1a3a 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 900,
              color: "#000",
            }}
          >
            R
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
            RenewalEngineAI
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            AI That Runs Your Renewals, Leads &amp; Follow-Ups 24/7
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#d4d4d4",
              lineHeight: 1.3,
              maxWidth: 960,
            }}
          >
            Done-for-you AI automation for independent insurance agencies.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 48,
            fontSize: 24,
            color: "#e5e7eb",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 44, fontWeight: 900, color: "white" }}>
              391%
            </span>
            <span>More conversions</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 44, fontWeight: 900, color: "white" }}>
              15–20%
            </span>
            <span>Higher retention</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 44, fontWeight: 900, color: "white" }}>
              &lt;60s
            </span>
            <span>Lead response</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
