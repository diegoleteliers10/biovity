import type { ApplicationStatus } from "@/lib/api/applications"

const CHILE_DATE = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Santiago",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

function chileCalendarDate(date: Date): string {
  const parts = CHILE_DATE.formatToParts(date)
  const values = new Map(parts.map((part) => [part.type, part.value]))
  return `${values.get("year")}-${values.get("month")}-${values.get("day")}`
}

export function isHiringPlanOverdue(
  targetDate: string | null | undefined,
  status: ApplicationStatus,
  today = chileCalendarDate(new Date())
): boolean {
  if (!targetDate || ["contratado", "rechazado", "desistido"].includes(status)) return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) return false
  const parsed = new Date(`${targetDate}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== targetDate)
    return false
  return targetDate < today
}

export function getStageAgeDays(
  stageChangedAt: string | null | undefined,
  today = new Date()
): number | null {
  if (!stageChangedAt) return null
  const startedAt = new Date(stageChangedAt)
  if (Number.isNaN(startedAt.getTime())) return null
  const startDate = chileCalendarDate(startedAt)
  const currentDate = chileCalendarDate(today)
  return Math.max(
    0,
    Math.floor(
      (Date.parse(`${currentDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 86_400_000
    )
  )
}
