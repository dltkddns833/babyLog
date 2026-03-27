import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "찬찬기록 - 성찬이 육아 대시보드";

export default function OGImage() {
  const imagePath = join(process.cwd(), "public", "baby.jpg");
  const imageData = readFileSync(imagePath);
  const base64 = `data:image/jpeg;base64,${imageData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fef7f0 0%, #f0f4ff 40%, #fdf0f7 100%)",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "150px",
            background: "rgba(196, 181, 253, 0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            left: "-40px",
            width: "240px",
            height: "240px",
            borderRadius: "120px",
            background: "rgba(249, 168, 212, 0.12)",
          }}
        />

        {/* Main card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "60px",
            padding: "60px 80px",
            background: "rgba(255, 255, 255, 0.75)",
            borderRadius: "40px",
            border: "2px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 8px 40px rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* Baby photo */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img
              src={base64}
              width={220}
              height={220}
              style={{
                borderRadius: "44px",
                objectFit: "cover",
                border: "4px solid rgba(255,255,255,0.8)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
            />
            {/* Hearts under photo */}
            <div style={{ display: "flex", gap: "8px", fontSize: "24px" }}>
              <span>💖</span>
              <span>💗</span>
              <span>💕</span>
            </div>
          </div>

          {/* Text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "72px",
                fontWeight: 700,
                background: "linear-gradient(90deg, #9333ea, #ec4899, #6366f1)",
                backgroundClip: "text",
                color: "transparent",
                lineHeight: 1.1,
              }}
            >
              찬찬기록
            </div>
            <div
              style={{
                fontSize: "28px",
                color: "#9ca3af",
                fontWeight: 500,
              }}
            >
              성찬이의 성장 기록
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              {["🍼 수유", "😴 수면", "🧷 기저귀"].map((tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "8px 20px",
                    background: "rgba(167, 139, 250, 0.1)",
                    borderRadius: "999px",
                    fontSize: "22px",
                    color: "#7c3aed",
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
