import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Phool For Your Fool — Your Floral Wonderland";
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
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #FFB3BA 0%, #FFCBA4 50%, #FFD4A3 100%)",
          color: "#2E2A26",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 36, opacity: 0.8 }}>Your Floral</div>
        <div style={{ fontSize: 140, fontWeight: 700, lineHeight: 1.05 }}>
          Wonderland
        </div>
        <div style={{ marginTop: 30, fontSize: 28, opacity: 0.85 }}>
          Phool For Your Fool · phoolforyourfool.com
        </div>
      </div>
    ),
    size,
  );
}
