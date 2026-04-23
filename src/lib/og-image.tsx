import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;

type Badge = {
  label: string;
  tone?: "blue" | "emerald";
};

type Stat = {
  value: string;
  label: string;
};

type Args = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Up to 3 stats rendered along the bottom. Mutually exclusive with badges. */
  stats?: Stat[];
  /** Small chips rendered along the bottom (e.g. category + read time). */
  badges?: Badge[];
  /**
   * Optional footer attribution line, e.g. "By Josh Kay, Founder" for team cards.
   */
  attribution?: string;
};

/**
 * Renders the shared OG card layout used across dynamic routes.
 * Satori constraints:
 *  - Every div with > 1 child needs explicit `display: flex`.
 *  - No `<br>` or inline <span> inside text divs — break layout into
 *    stacked divs if multi-line text is needed.
 *  - Sizes are in px and scale with the 1200x630 canvas.
 */
export function renderOgCard(args: Args) {
  const accent = "#34d399"; // emerald-400 — matches the A/B winner palette
  const secondary = "#60a5fa"; // blue-400

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 76px",
          background:
            "linear-gradient(135deg, #000000 0%, #0a0a0a 42%, #0b1a3a 100%)",
          color: "white",
          // Do not set fontFamily — Satori ships a default font with
          // next/og; naming `system-ui` on Vercel's runtime resolves
          // to nothing and can break rendering.
        }}
      >
        {/* Header: logo + brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 900,
              color: "#000",
            }}
          >
            R
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: -0.3,
            }}
          >
            RenewalEngineAI
          </div>
        </div>

        {/* Middle: eyebrow, title, subtitle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxWidth: 1048,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {args.eyebrow}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: args.title.length > 60 ? 56 : 68,
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: -1.5,
            }}
          >
            {args.title}
          </div>

          {args.subtitle && (
            <div
              style={{
                display: "flex",
                fontSize: 26,
                color: "#d4d4d4",
                lineHeight: 1.35,
              }}
            >
              {args.subtitle}
            </div>
          )}
        </div>

        {/* Footer: stats OR badges OR attribution */}
        {args.stats && args.stats.length > 0 && (
          <div style={{ display: "flex", gap: 52, flexWrap: "wrap" }}>
            {args.stats.map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  borderLeft: `4px solid ${accent}`,
                  paddingLeft: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 40,
                    fontWeight: 900,
                    color: "white",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 18,
                    color: "#a1a1aa",
                    maxWidth: 260,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {args.badges && args.badges.length > 0 && !args.stats && (
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {args.badges.map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  borderRadius: 999,
                  background: b.tone === "emerald" ? accent : secondary,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                {b.label}
              </div>
            ))}
            {args.attribution && (
              <div
                style={{
                  display: "flex",
                  fontSize: 20,
                  color: "#a1a1aa",
                  marginLeft: 12,
                }}
              >
                {args.attribution}
              </div>
            )}
          </div>
        )}

        {!args.stats && !args.badges && args.attribution && (
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#a1a1aa",
            }}
          >
            {args.attribution}
          </div>
        )}
      </div>
    ),
    OG_SIZE
  );
}
