import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "110px",
        }}
      >
        {/* Glass circle */}
        <div
          style={{
            width: "420px",
            height: "420px",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.35)",
            border: "3px solid rgba(255,255,255,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.4)",
          }}
        >
          {/* Baby face */}
          <div
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "150px",
              background: "linear-gradient(180deg, #fff5e6 0%, #ffe4cc 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              position: "relative",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            {/* Eyes */}
            <div style={{ display: "flex", gap: "60px", marginTop: "-20px" }}>
              {/* Left eye */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "22px",
                  background: "#3d2c2c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "8px",
                    background: "white",
                    marginTop: "-8px",
                    marginLeft: "8px",
                  }}
                />
              </div>
              {/* Right eye */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "22px",
                  background: "#3d2c2c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "8px",
                    background: "white",
                    marginTop: "-8px",
                    marginLeft: "8px",
                  }}
                />
              </div>
            </div>
            {/* Cheeks */}
            <div style={{ display: "flex", gap: "120px", marginTop: "10px" }}>
              <div
                style={{
                  width: "40px",
                  height: "26px",
                  borderRadius: "13px",
                  background: "rgba(255,154,158,0.4)",
                }}
              />
              <div
                style={{
                  width: "40px",
                  height: "26px",
                  borderRadius: "13px",
                  background: "rgba(255,154,158,0.4)",
                }}
              />
            </div>
            {/* Mouth - smile */}
            <div
              style={{
                width: "50px",
                height: "28px",
                borderRadius: "0 0 25px 25px",
                background: "#e88b8b",
                marginTop: "-4px",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
