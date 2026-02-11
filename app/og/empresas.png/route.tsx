import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
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

      {/* Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 24px",
          borderRadius: "100px",
          background: "rgba(255, 255, 255, 0.8)",
          marginBottom: "30px",
          border: "1px solid rgba(37, 99, 235, 0.2)",
        }}
      >
        <span style={{ fontSize: "24px", color: "#2563EB", fontWeight: "600" }}>Para Empresas</span>
      </div>

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #2563EB 0%, #22C55E 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "16px",
          }}
        >
          <span style={{ fontSize: "42px", color: "white", fontWeight: "bold" }}>B</span>
        </div>
        <span
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            color: "#111827",
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
          maxWidth: "1000px",
        }}
      >
        <span
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            color: "#111827",
            lineHeight: 1.2,
          }}
        >
          Conecta con el nuevo
        </span>
        <span
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #2563EB 0%, #22C55E 100%)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.2,
          }}
        >
          talento científico de Chile
        </span>
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontSize: "26px",
          color: "#4B5563",
          marginTop: "30px",
          maxWidth: "750px",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        ATS especializado para reclutar profesionales en biotecnología, bioquímica, química e
        ingeniería química
      </p>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: "60px",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "36px", fontWeight: "bold", color: "#111827" }}>+500</span>
          <span style={{ fontSize: "18px", color: "#6B7280" }}>profesionales</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "36px", fontWeight: "bold", color: "#111827" }}>+50</span>
          <span style={{ fontSize: "18px", color: "#6B7280" }}>especialidades</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "36px", fontWeight: "bold", color: "#111827" }}>100%</span>
          <span style={{ fontSize: "18px", color: "#6B7280" }}>enfocado en ciencias</span>
        </div>
      </div>

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
        <span style={{ fontSize: "24px", color: "#6B7280" }}>biovity.cl/empresas</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  )
}
