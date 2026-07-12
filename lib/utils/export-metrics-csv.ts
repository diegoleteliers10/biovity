import type { OrganizationMetrics } from "@/lib/types/organization-metrics"
import type { UserMetrics } from "@/lib/types/user-metrics"

export function escapeCsvField(value: string | number): string {
  const str = String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function rowsToCsv(headers: string[], rows: (string | number)[][]): string {
  const lines = [headers.map(escapeCsvField).join(",")]
  for (const row of rows) {
    lines.push(row.map(escapeCsvField).join(","))
  }
  return lines.join("\n")
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function exportMetricsCsv(metrics: OrganizationMetrics, period: string) {
  const now = new Date().toISOString().slice(0, 10)
  const prefix = `metricas_${period}_${now}`

  const kpiHeaders = ["Metrica", "Valor"]
  const kpiRows: (string | number)[][] = [
    ["Ofertas activas", metrics.dashboard.activeJobs],
    ["Aplicaciones recibidas", metrics.pipeline.totalApplications],
    ["Tendencia de aplicaciones (%)", metrics.dashboard.applicationsTrend],
    ["Entrevistas este periodo", metrics.dashboard.interviewsThisPeriod],
    ["Tendencia de entrevistas (%)", metrics.dashboard.interviewsTrend],
    ["Tiempo medio de contratacion (dias)", metrics.avgHiringTimeDays],
    ["Tasa de conversion (%)", metrics.pipeline.conversionRate],
  ]
  downloadCsv(`${prefix}_kpis.csv`, rowsToCsv(kpiHeaders, kpiRows))

  const pipelineHeaders = ["Estado", "Cantidad"]
  const pipelineRows = Object.entries(metrics.pipeline.byStatus).map(([status, count]) => [
    statusLabels[status] ?? status,
    count,
  ])
  downloadCsv(`${prefix}_pipeline.csv`, rowsToCsv(pipelineHeaders, pipelineRows))

  if (metrics.topJobs.length > 0) {
    const jobsHeaders = ["Oferta", "Vistas", "Postulaciones", "Tasa de conversion (%)"]
    const jobsRows = metrics.topJobs.map((j) => [
      j.jobTitle,
      j.views,
      j.applications,
      j.applicationRate,
    ])
    downloadCsv(`${prefix}_ofertas.csv`, rowsToCsv(jobsHeaders, jobsRows))
  }

  if (metrics.geographicDistribution.length > 0) {
    const geoHeaders = ["Ciudad", "Cantidad", "Porcentaje (%)"]
    const geoRows = metrics.geographicDistribution.map((g) => [g.city, g.count, g.percentage])
    downloadCsv(`${prefix}_geografia.csv`, rowsToCsv(geoHeaders, geoRows))
  }
}

const statusLabels: Record<string, string> = {
  pendiente: "Pendiente",
  entrevista: "Entrevista",
  oferta: "Oferta",
  rechazado: "Rechazado",
  contratado: "Contratado",
  desistido: "Desistido",
}

export function exportUserMetricsCsv(metrics: UserMetrics, period: string) {
  const now = new Date().toISOString().slice(0, 10)
  const prefix = `mis_metricas_${period}_${now}`

  const kpiHeaders = ["Metrica", "Valor"]
  const kpiRows: (string | number)[][] = [
    ["Postulaciones totales", metrics.quickMetrics.totalApplications],
    ["Aplicaciones activas", metrics.quickMetrics.activeApplications],
    ["Tasa de respuesta (%)", metrics.quickMetrics.responseRate],
    ["Postulaciones ultimos 30 dias", metrics.kpis.applicationsLast30Days],
    ["Entrevistas (acumulado)", metrics.kpis.interviews],
    ["Ofertas (acumulado)", metrics.kpis.offers],
    ["Tiempo medio de respuesta (dias)", metrics.kpis.avgResponseTimeDays ?? "Sin datos"],
    ["Vistas de perfil", metrics.kpis.profileViews],
  ]
  downloadCsv(`${prefix}_kpis.csv`, rowsToCsv(kpiHeaders, kpiRows))

  if (metrics.applicationsTrend.length > 0) {
    const trendHeaders = ["Periodo", "Postulaciones"]
    const trendRows = metrics.applicationsTrend.map((p) => [p.date, p.applications])
    downloadCsv(`${prefix}_tendencia.csv`, rowsToCsv(trendHeaders, trendRows))
  }

  if (metrics.categoriesApplied.length > 0) {
    const catHeaders = ["Categoria", "Cantidad", "Porcentaje (%)"]
    const catRows = metrics.categoriesApplied.map((c) => [c.category, c.count, c.percentage])
    downloadCsv(`${prefix}_categorias.csv`, rowsToCsv(catHeaders, catRows))
  }
}
