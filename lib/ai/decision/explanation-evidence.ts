import { z } from "zod"
import { explanationPlainText } from "./explanation-text"
import type { ScoreExplanation } from "./types"

const EvidenceItemSchema = z.object({
  text: z.string().trim().min(1).max(240),
  evidenceId: z.string().trim().min(1),
})

export const GeneratedExplanationSchema = z.object({
  reason: z.string().trim().min(1).max(1200),
  strengths: z.array(EvidenceItemSchema).max(5),
  gaps: z.array(EvidenceItemSchema).max(5),
  recommendation: z.enum(["Avanzar", "Evaluar", "Descartar"]),
})

function sourceExcerpts(value: unknown): string[] {
  if (typeof value === "string") {
    const excerpts: string[] = []
    let remaining = explanationPlainText(value)
    while (remaining.length > 0) {
      const window = remaining.slice(0, 240)
      const boundary = remaining.length > 240 ? window.lastIndexOf(" ") : window.length
      const length = boundary > 0 ? boundary : window.length
      excerpts.push(remaining.slice(0, length))
      remaining = remaining.slice(length).trimStart()
    }
    return excerpts
  }
  if (Array.isArray(value)) return value.flatMap(sourceExcerpts)
  if (value && typeof value === "object") return Object.values(value).flatMap(sourceExcerpts)
  return []
}

export function buildEvidenceCatalog(job: unknown, candidate: unknown): Map<string, string> {
  return new Map([
    ...sourceExcerpts(job).map((excerpt, index): [string, string] => [`job.${index}`, excerpt]),
    ...sourceExcerpts(candidate).map((excerpt, index): [string, string] => [
      `candidate.${index}`,
      excerpt,
    ]),
  ])
}

export function resolveExplanationEvidence(
  generated: z.infer<typeof GeneratedExplanationSchema>,
  catalog: Map<string, string>
): ScoreExplanation | null {
  const strengths: ScoreExplanation["strengths"] = []
  const gaps: ScoreExplanation["gaps"] = []
  for (const item of generated.strengths) {
    const evidence = catalog.get(item.evidenceId)
    if (!evidence || !item.evidenceId.startsWith("candidate.")) return null
    strengths.push({ text: item.text, evidence })
  }
  for (const item of generated.gaps) {
    const evidence = catalog.get(item.evidenceId)
    if (!evidence || !item.evidenceId.startsWith("job.")) return null
    gaps.push({ text: item.text, evidence })
  }
  return {
    evidenceFormat: "plain-text",
    reason: generated.reason,
    strengths,
    gaps,
    recommendation: generated.recommendation,
  }
}
