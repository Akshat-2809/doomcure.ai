import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogAlt = "Doomcure — An antidote to doomscrolling.";

function Mark({ size, stroke = "#141414" }: { size: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect x="9" y="5" width="22" height="28" rx="6" fill="#7B61FF" stroke={stroke} strokeWidth="2" transform="rotate(-12 20 19)" />
      <rect x="9" y="7" width="22" height="28" rx="6" fill="#FF5B2E" stroke={stroke} strokeWidth="2" />
      <path d="M20 14 C20.6 18.6 21.4 19.4 26 20 C21.4 20.6 20.6 21.4 20 26 C19.4 21.4 18.6 20.6 14 20 C18.6 19.4 19.4 18.6 20 14 Z" fill="#141414" />
    </svg>
  );
}

/** Shared by opengraph-image and twitter-image. */
export function renderOgImage() {
  // Sync read keeps the image prerendered at build time (async fs would make it dynamic).
  const dela = readFileSync(join(process.cwd(), "assets/DelaGothicOne-Latin.ttf"));
  const card = { position: "absolute", width: 230, height: 290, borderRadius: 34, border: "4px solid #141414", boxShadow: "0 12px 0 #141414" } as const;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#FF5B2E", fontFamily: "Dela Gothic One", color: "#141414", overflow: "hidden" }}>
        {/* stacked cards, echoing the logo mark */}
        <div style={{ ...card, right: 120, top: 150, background: "#7B61FF", transform: "rotate(-12deg)" }} />
        <div style={{ ...card, right: 90, top: 170, background: "#FFC93C", transform: "rotate(6deg)" }} />
        <div style={{ ...card, right: 70, top: 190, background: "#F3F3EF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="110" height="110" viewBox="0 0 24 24"><path d="M12 3c.8 5.6 3.4 8.2 9 9-5.6.8-8.2 3.4-9 9-.8-5.6-3.4-8.2-9-9 5.6-.8 8.2-3.4 9-9z" fill="#141414" /></svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", width: 820 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Mark size={76} />
            <span style={{ fontSize: 50, letterSpacing: "-0.02em" }}>doomcure</span>
          </div>
          <div style={{ display: "flex", fontSize: 92, lineHeight: 0.95, letterSpacing: "-0.025em" }}>An antidote to doomscrolling.</div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: [{ name: "Dela Gothic One", data: dela, style: "normal", weight: 400 }] },
  );
}

export function renderAppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#F3F3EF" }}>
        <Mark size={150} />
      </div>
    ),
    { width: 180, height: 180 },
  );
}
