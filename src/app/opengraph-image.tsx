import { ImageResponse } from "next/og";

export const alt = "Arcure Pharma - Your Trusted Online Pharmacy in Pakistan";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #166534 0%, #16a34a 50%, #4ade80 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "96px",
            height: "96px",
            borderRadius: "24px",
            background: "rgba(255,255,255,0.2)",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "white",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "72px",
            fontWeight: 800,
            color: "white",
            letterSpacing: "-1px",
            textShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          Arcure Pharma
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "28px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.9)",
            marginTop: "16px",
            letterSpacing: "0.05em",
          }}
        >
          Your Trusted Online Pharmacy in Pakistan
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "20px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.75)",
            marginTop: "12px",
          }}
        >
          Quality medicated products • Fast doorstep delivery
        </div>
      </div>
    ),
    size
  );
}