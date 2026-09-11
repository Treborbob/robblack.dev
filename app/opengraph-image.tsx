import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { intro, person } from "@/lib/content";
import { currentVersion, yearsShipping } from "@/lib/version";

export const alt =
  "Rob Black. Shipping since 1999. Still on the latest version.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [bricolage, plexMono] = await Promise.all([
    readFile(path.join(process.cwd(), "app/fonts/bricolage-600.ttf")),
    readFile(path.join(process.cwd(), "app/fonts/plex-mono-500.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "#0f1219",
        color: "#e7e4dc",
        fontFamily: "Bricolage",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "Plex",
          fontSize: 22,
          letterSpacing: 2,
          color: "#8e96a6",
        }}
      >
        {person.name.toUpperCase()} / RELEASE NOTES
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 92,
          lineHeight: 1,
          letterSpacing: -3,
        }}
      >
        <div>{intro.headline[0]}</div>
        <div style={{ color: "#8e96a6" }}>{intro.headline[1]}</div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontFamily: "Plex",
          fontSize: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#f0b35b",
            color: "#0f1219",
            padding: "6px 16px",
            borderRadius: 10,
          }}
        >
          v{currentVersion()}
        </div>
        <div style={{ display: "flex", color: "#8e96a6" }}>
          {person.role} · {yearsShipping()} years in production ·{" "}
          {person.location.replace(/, UK$/, "")}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: bricolage, weight: 600, style: "normal" },
        { name: "Plex", data: plexMono, weight: 500, style: "normal" },
      ],
    },
  );
}
