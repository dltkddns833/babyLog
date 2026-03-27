import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #c084fc 0%, #f9a8d4 50%, #93c5fd 100%)",
          borderRadius: "38px",
        }}
      >
        {/* Glass circle */}
        <div
          style={{
            width: "148px",
            height: "148px",
            borderRadius: "36px",
            background: "rgba(255,255,255,0.35)",
            border: "2px solid rgba(255,255,255,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.4)",
          }}
        >
          {/* Baby face */}
          <div
            style={{
              width: "105px",
              height: "105px",
              borderRadius: "53px",
              background: "linear-gradient(180deg, #fff5e6 0%, #ffe4cc 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {/* Eyes */}
            <div style={{ display: "flex", gap: "22px", marginTop: "-6px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "8px",
                  background: "#3d2c2c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background: "white",
                    marginTop: "-3px",
                    marginLeft: "3px",
                  }}
                />
              </div>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "8px",
                  background: "#3d2c2c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background: "white",
                    marginTop: "-3px",
                    marginLeft: "3px",
                  }}
                />
              </div>
            </div>
            {/* Cheeks */}
            <div style={{ display: "flex", gap: "42px", marginTop: "4px" }}>
              <div
                style={{
                  width: "14px",
                  height: "9px",
                  borderRadius: "5px",
                  background: "rgba(255,154,158,0.4)",
                }}
              />
              <div
                style={{
                  width: "14px",
                  height: "9px",
                  borderRadius: "5px",
                  background: "rgba(255,154,158,0.4)",
                }}
              />
            </div>
            {/* Mouth */}
            <div
              style={{
                width: "18px",
                height: "10px",
                borderRadius: "0 0 9px 9px",
                background: "#e88b8b",
                marginTop: "-1px",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
