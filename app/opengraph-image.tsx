import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const alt = "Biovity - Portal de Empleo en Biotecnología y Ciencias en Chile"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const [logoData, illustrationData] = await Promise.all([
    readFile(join(process.cwd(), "public/logoIconBiovity.png"), "base64"),
    readFile(join(process.cwd(), "public/images/ilustrationOG.png"), "base64"),
  ])

  const logoSrc = `data:image/png;base64,${logoData}`
  const illustrationSrc = `data:image/png;base64,${illustrationData}`

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left: Content section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "55%",
          height: "100%",
          padding: "60px 56px",
          boxSizing: "border-box",
        }}
      >
        {/* Logo section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {/* next/image not supported in ImageResponse - must use img for OG generation */}
          <img
            src={logoSrc}
            alt="Biovity"
            width={86}
            height={86}
            style={{ display: "flex", width: 64, height: 64 }}
          />
          <span
            style={{
              fontSize: 52,
              fontFamily: "font-sans",
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            Biovity
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: "#64748b",
              letterSpacing: "0.01em",
            }}
          >
            El mejor portal de empleo para
          </span>
          <span
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Bio-ciencias en Chile
          </span>
        </div>

        {/* Pills with keywords */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 32,
          }}
        >
          {["Biotecnología", "Bioquímica", "Química", "Bioinformática", "Salud"].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 16px",
                borderRadius: 100,
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#475569",
                  letterSpacing: "0.01em",
                }}
              >
                {tag}
              </span>
            </div>
          ))}
        </div>

        {/* URL with accent */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: "auto",
            padding: "12px 20px",
            borderRadius: 100,
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            alignSelf: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px rgba(34,197,94,0.5)",
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#2563EB",
              letterSpacing: "0.02em",
            }}
          >
            biovity.vercel.app
          </span>
        </div>
      </div>

      {/* Right: Illustration section */}
      <div
        style={{
          display: "flex",
          width: "45%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          position: "relative",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 40,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 40,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0) 70%)",
          }}
        />

        {/* Main illustration */}
        <div
          style={{
            display: "flex",
            width: 480,
            height: 480,
            borderRadius: 40,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 8px 24px rgba(37,99,235,0.12)",
            border: "2px solid #ffffff",
          }}
        >
          {/* next/image not supported in ImageResponse - must use img for OG generation */}
          <img
            src={illustrationSrc}
            alt=""
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          display: "flex",
          background: "linear-gradient(90deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)",
        }}
      />
    </div>,
    { ...size }
  )
}
