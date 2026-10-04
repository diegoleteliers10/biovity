import { JEV_MINIMUM_DATA_SUFFICIENCY, JEV_SCORE_CRITERIA } from "./constants"

export function toCompatibilityScore(jevScore: number): number {
  const percentage = (jevScore / (JEV_SCORE_CRITERIA.length - 1)) * 100
  return Math.round(Math.min(100, Math.max(0, percentage)))
}

export function toCompatibilityLabel(score: number): "Bajo" | "Regular" | "Bueno" | "Excelente" {
  if (score < 40) return "Bajo"
  if (score < 60) return "Regular"
  if (score < 80) return "Bueno"
  return "Excelente"
}

export function hasSufficientData(sufficiency: number): boolean {
  return sufficiency >= JEV_MINIMUM_DATA_SUFFICIENCY
}
