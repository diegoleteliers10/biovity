import { type ClassValue, clsx } from "clsx"
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns"
import { es } from "date-fns/locale"
import { toZonedTime } from "date-fns-tz"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Date Formatting (Chile Timezone) ---
export const TIMEZONE_CL = "America/Santiago"

/** Parses a date (Date, string, or number) and returns a Date in America/Santiago timezone. */
export function getChileanDate(date: Date | string | number = new Date()): Date {
  let d: Date
  if (typeof date === "string") {
    let safeDate = date.trim()
    if (safeDate.includes(" ") && !safeDate.includes("T")) {
      safeDate = safeDate.replace(" ", "T")
    }
    if (!/(Z|[+-]\d{2}(?::?\d{2})?)$/i.test(safeDate)) {
      safeDate += "Z"
    }
    d = new Date(safeDate)
  } else {
    d = new Date(date)
  }
  // Ensure invalid dates do not crash the app, return current date in that case
  if (isNaN(d.getTime())) return toZonedTime(new Date(), TIMEZONE_CL)
  return toZonedTime(d, TIMEZONE_CL)
}

/** Formats a date using date-fns format string, localized to Spanish and Chile Timezone. */
export function formatDateChilean(date: Date | string | number, formatStr: string = "PPP"): string {
  const zonedDate = getChileanDate(date)
  return format(zonedDate, formatStr, { locale: es })
}

/** Formats date and time: e.g., "25 de enero de 2025, 14:30" */
export function formatDateTimeChilean(date: Date | string | number): string {
  return formatDateChilean(date, "PPP, p")
}

/** Relative date for lists: "Hoy", "Ayer", "hace X días". */
export function formatFechaRelativa(fecha: Date | string | number): string {
  const zonedDate = getChileanDate(fecha)
  const today = getChileanDate(new Date())

  // Use custom logic for Hoy/Ayer if preferred, else fallback to distance
  if (isToday(zonedDate)) return "Hoy"
  if (isYesterday(zonedDate)) return "Ayer"

  return formatDistanceToNow(zonedDate, { locale: es, addSuffix: true })
}

/** Formats YYYY-MM as "ene 2020" for resume dates. */
export function formatMonthYear(dateStr: string): string {
  const [y, m] = dateStr.split("-").map(Number)
  if (!y || !m) return dateStr
  const date = new Date(y, m - 1, 1)
  return formatDateChilean(date, "MMM yyyy")
}

/** Parses YYYY-MM-DD as local date (avoids timezone off-by-one). */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("T")[0].split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

/** Converts a Date to YYYY-MM-DD for date-only fields. react-day-picker returns UTC midnight. */
export function dateToDateString(d: Date): string {
  const y = d.getUTCFullYear()
  const m = d.getUTCMonth() + 1
  const day = d.getUTCDate()
  return `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

/** Long locale date for detail pages (e.g. "25 de enero de 2025"). */
export function formatFechaLarga(fecha: Date | string | number): string {
  return formatDateChilean(fecha, "PPP")
}

// --- Formatting (Single Responsibility: one concern per function) ---

/** Formats value as CLP thousands for Salarios charts (e.g. "2.550.000"). */
export function formatCurrencyCLP(value: number): string {
  return `$${value.toLocaleString("es-CL")}.000`
}

/** Formats raw CLP amounts (e.g. "800.000"). */
export function formatAmountCLP(value: number): string {
  return `$${new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`
}

/** Formats salary range for Trabajos (e.g. "$2.500.000 - $3.500.000"). */
export function formatSalarioRango(min: number, max: number): string {
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  return `$${formatNumber(min)} - $${formatNumber(max)}`
}

/** Tailwind classes for modalidad badge (Trabajos). */
export function getModalidadBadgeColor(modalidad: string): string {
  switch (modalidad) {
    case "remoto":
      return "bg-green-100 text-green-800"
    case "hibrido":
      return "bg-blue-100 text-blue-800"
    case "presencial":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

/** Tailwind classes for formato badge (Trabajos). */
export function getFormatoBadgeColor(formato: string): string {
  switch (formato) {
    case "full-time":
      return "bg-indigo-100 text-indigo-800"
    case "part-time":
      return "bg-cyan-100 text-cyan-800"
    case "contrato":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
