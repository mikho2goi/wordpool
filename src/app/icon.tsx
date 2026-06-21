import { ImageResponse } from "next/og";

// Route segment config
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Generated favicon — white "T" on the app's indigo→fuchsia gradient
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
          fontSize: 22,
          fontWeight: 800,
          color: "#ffffff",
          borderRadius: 7,
          background: "linear-gradient(135deg, #4f46e5 0%, #a21caf 100%)",
        }}
      >
        T
      </div>
    ),
    { ...size }
  );
}
