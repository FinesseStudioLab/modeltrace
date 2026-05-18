import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ background: "#030712", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "7px" }}>
        {/* Eye inside hexagonal outline — audit + blockchain */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          {/* Hexagon top edge */}
          <div style={{ display: "flex", width: "16px", height: "3px", background: "#7c3aed", borderRadius: "1px" }} />
          {/* Middle row: eye */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <div style={{ display: "flex", width: "3px", height: "8px", background: "#7c3aed", borderRadius: "1px" }} />
            {/* Iris */}
            <div style={{ display: "flex", width: "8px", height: "8px", background: "#7c3aed", borderRadius: "50%" }}>
              <div style={{ display: "flex", width: "4px", height: "4px", background: "#030712", borderRadius: "50%", margin: "auto" }} />
            </div>
            <div style={{ display: "flex", width: "3px", height: "8px", background: "#7c3aed", borderRadius: "1px" }} />
          </div>
          {/* Hexagon bottom edge */}
          <div style={{ display: "flex", width: "16px", height: "3px", background: "#7c3aed", borderRadius: "1px" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
