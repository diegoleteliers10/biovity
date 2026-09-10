import { readFile } from "node:fs/promises"
import { join } from "node:path"

export async function getOgLogoSrc(): Promise<string> {
  const logoData = await readFile(join(process.cwd(), "public/logoIconBiovity.png"), "base64")
  return `data:image/png;base64,${logoData}`
}

type OgStat = {
  value: string
  label: string
}

type OgTemplateProps = {
  logoSrc: string
  titleA: string
  titleB: string
  subtitle: string
  footer: string
  stats?: OgStat[]
}

export function OgTemplate({ logoSrc, titleA, titleB, subtitle, footer, stats }: OgTemplateProps) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ffffff 0%, #f3f3f5 55%, #e7f0ed 100%)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-50px",
          left: "-50px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #8483d4 0%, #b9b8e8 100%)",
          opacity: 0.28,
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
          background: "linear-gradient(135deg, #006b5e 0%, #7fb5ad 100%)",
          opacity: 0.22,
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
          background: "linear-gradient(135deg, #e2e2e4 0%, #f3f3f5 100%)",
          opacity: 0.9,
          filter: "blur(60px)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "36px",
          gap: "18px",
        }}
      >
        {/* biome-ignore lint/performance/noImgElement: next/image is not supported inside next/og ImageResponse */}
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
            color: "#00374a",
            letterSpacing: "-0.03em",
          }}
        >
          Biovity
        </span>
      </div>

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
            color: "#0f172a",
            lineHeight: 1.2,
          }}
        >
          {titleA}
        </span>
        <span
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #8483d4 0%, #006b5e 100%)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.2,
          }}
        >
          {titleB}
        </span>
      </div>

      <p
        style={{
          fontSize: "26px",
          color: "#71787d",
          marginTop: "30px",
          maxWidth: "750px",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {subtitle}
      </p>

      {stats && (
        <div
          style={{
            display: "flex",
            gap: "60px",
            marginTop: "40px",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "36px", fontWeight: "bold", color: "#0f172a" }}>
                {stat.value}
              </span>
              <span style={{ fontSize: "18px", color: "#71787d" }}>{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <span style={{ fontSize: "24px", color: "#71787d" }}>{footer}</span>
      </div>
    </div>
  )
}
