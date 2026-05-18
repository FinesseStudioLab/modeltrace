import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ background: "#030712", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "40px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          {/* Large eye-in-hexagon logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{ display: "flex", width: "80px", height: "10px", background: "#7c3aed", borderRadius: "5px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", width: "12px", height: "42px", background: "#7c3aed", borderRadius: "4px" }} />
              {/* Eye iris */}
              <div style={{ display: "flex", width: "44px", height: "44px", background: "#7c3aed", borderRadius: "50%" }}>
                <div style={{ display: "flex", width: "22px", height: "22px", background: "#030712", borderRadius: "50%", margin: "auto" }}>
                  <div style={{ display: "flex", width: "10px", height: "10px", background: "#7c3aed", borderRadius: "50%", margin: "auto" }} />
                </div>
              </div>
              <div style={{ display: "flex", width: "12px", height: "42px", background: "#7c3aed", borderRadius: "4px" }} />
            </div>
            <div style={{ display: "flex", width: "80px", height: "10px", background: "#7c3aed", borderRadius: "5px" }} />
          </div>
          {/* Brand name */}
          <div style={{ display: "flex", color: "#7c3aed", fontSize: "18px", fontWeight: 900, letterSpacing: "0.18em", fontFamily: "sans-serif" }}>
            MODELTRACE
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
