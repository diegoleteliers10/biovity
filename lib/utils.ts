import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Formatting (Single Responsibility: one concern per function) ---

/** Formats value as CLP thousands for Salarios charts (e.g. "2.550.000"). */
export function formatCurrencyCLP(value: number): string {
  return `$${value.toLocaleString("es-CL")}.000`
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

/** Relative date for lists: "Hoy", "Ayer", "hace X días". */
export function formatFechaRelativa(fecha: Date): string {
  const ahora = new Date()
  const diffTime = ahora.getTime() - fecha.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "Hoy"
  if (diffDays === 1) return "Ayer"
  if (diffDays < 7) return `hace ${diffDays} días`
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`
  return `hace ${Math.floor(diffDays / 30)} meses`
}

/** Long locale date for detail pages (e.g. "25 de enero de 2025"). */
export function formatFechaLarga(fecha: Date): string {
  return new Date(fecha).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
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
