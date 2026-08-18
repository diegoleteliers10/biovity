import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { formatJobLocation, getJob } from "@/lib/api/jobs"
import { getOrganization } from "@/lib/api/organizations"
import { formatSalarioRango } from "@/lib/utils"

export async function GET(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  const [logoData, jobResult] = await Promise.all([
    readFile(join(process.cwd(), "public/logoIconBiovity.png"), "base64").catch(() => null),
    getJob(id).catch(() => null),
  ])

  const logoSrc = logoData ? `data:image/png;base64,${logoData}` : null

  const job = jobResult && "isOk" in jobResult && jobResult.isOk() ? jobResult.value : null

  const title = job?.title ?? "Oferta de Empleo en Biociencias"

  let organizationName = job?.organization?.name
  if (!organizationName && job?.organizationId) {
    const orgResult = await getOrganization(job.organizationId)
    if (orgResult.isOk()) organizationName = orgResult.value.name
  }
  organizationName = organizationName ?? "Biovity"

  const locationStr = formatJobLocation(job?.location) || "Chile"

  let salaryStr = "A convenir"
  if (job?.salary?.min != null && job?.salary?.max != null) {
    salaryStr = formatSalarioRango(job.salary.min, job.salary.max)
  }

  const categoryStr = job?.category ? job.category.toUpperCase() : "BIOTECNOLOGÍA Y CIENCIAS"

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",
        padding: "56px 64px",
        boxSizing: "border-box",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      {/* Background Subtle Gradient Blobs */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, rgba(37,99,235,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "-40px",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0) 70%)",
        }}
      />

      {/* Header Bar: Logo + Category Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {logoSrc && (
            <img
              src={logoSrc}
              alt="Biovity Logo"
              width={60}
              height={60}
              style={{ display: "flex", width: 60, height: 60, objectFit: "contain" }}
            />
          )}
          <span
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.03em",
            }}
          >
            Biovity
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 20px",
            borderRadius: 100,
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#2563eb",
              letterSpacing: "0.05em",
            }}
          >
            {categoryStr}
          </span>
        </div>
      </div>

      {/* Main Content: Title & Organization */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          margin: "auto 0",
          maxWidth: "1050px",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#64748b",
            }}
          >
            {organizationName}
          </span>
          <span style={{ fontSize: 22, color: "#cbd5e1" }}>•</span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#16a34a",
              background: "#f0fdf4",
              padding: "4px 12px",
              borderRadius: 6,
              border: "1px solid #bbf7d0",
            }}
          >
            Oferta Activa
          </span>
        </div>

        <span
          style={{
            fontSize: 54,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          {title}
        </span>

        {/* Feature Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
          {/* Location */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 12,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <span style={{ fontSize: 18 }}>📍</span>
            <span style={{ fontSize: 17, fontWeight: 600, color: "#334155" }}>{locationStr}</span>
          </div>

          {/* Salary */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 12,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <span style={{ fontSize: 18 }}>💰</span>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#059669" }}>{salaryStr}</span>
          </div>

          {/* Employment Type */}
          {job?.employmentType && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 12,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <span style={{ fontSize: 18 }}>💼</span>
              <span style={{ fontSize: 17, fontWeight: 600, color: "#334155" }}>
                {job.employmentType}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer & Live Indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          paddingTop: 24,
          borderTop: "1px solid #f1f5f9",
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 500, color: "#94a3b8" }}>
          Portal de Empleo Científico #1 en Chile
        </span>
      </div>

      {/* Bottom Accent Line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          display: "flex",
          background: "linear-gradient(90deg, #2563eb 0%, #16a34a 100%)",
        }}
      />
    </div>,
    {
      width: 1200,
      height: 630,
    }
  )
}
