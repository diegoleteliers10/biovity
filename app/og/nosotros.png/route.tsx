import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export async function GET() {
  const logoData = await readFile(join(process.cwd(), "public/logoIconBiovity.png"), "base64")
  const logoSrc = `data:image/png;base64,${logoData}`

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 25%, #ECFDF5 75%, #D1FAE5 100%)",
        position: "relative",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          left: "-50px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)",
          opacity: 0.2,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          right: "50px",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #60A5FA 0%, #22D3EE 100%)",
          opacity: 0.25,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "100px",
          right: "200px",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
          opacity: 0.2,
          filter: "blur(60px)",
        }}
      />

      {/* Official Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "36px",
          gap: "18px",
        }}
      >
        <img
          src={logoSrc}
          alt="Biovity Logo"
          width={80}
          height={80}
          style={{ display: "flex", width: 80, height: 80, objectFit: "contain" }}
        />
        <span
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "#111827",
            letterSpacing: "-0.03em",
          }}
        >
          Biovity
        </span>
      </div>

      {/* Main title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "900px",
        }}
      >
        <span
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            color: "#111827",
            lineHeight: 1.2,
          }}
        >
          Sobre Nosotros
        </span>
        <span
          style={{
            fontSize: "44px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #2563EB 0%, #22C55E 100%)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.3,
            marginTop: "12px",
          }}
        >
          Conectando el Talento Científico en Chile
        </span>
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontSize: "26px",
          color: "#4B5563",
          marginTop: "24px",
          maxWidth: "750px",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        La plataforma dedicada a potenciar la biotecnología, bioquímica, química y ciencias de la
        salud.
      </p>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <span style={{ fontSize: "24px", color: "#6B7280" }}>biovity.cl/nosotros</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  )
}
