import { z } from "zod"

const DANGEROUS_TAGS = [
  "<script>",
  "<iframe>",
  "<object>",
  "<embed>",
  "<form>",
  "javascript:",
  "onerror=",
  "onload=",
]
const SENSITIVE_PATTERNS = [
  /system\s*prompt/i,
  /confidential/i,
  /secret/i,
  /internal\s*(only|data|info)/i,
  / proprietary /i,
  /do\s*not\s*share/i,
]

export interface ValidationResult {
  valid: boolean
  violations: string[]
}

export function validateAIResponse(response: unknown, schema?: z.ZodSchema): ValidationResult {
  const violations: string[] = []

  if (typeof response === "string") {
    const upper = response.toLowerCase()
    for (const tag of DANGEROUS_TAGS) {
      if (upper.includes(tag.toLowerCase())) {
        violations.push(`Potentially dangerous tag detected: ${tag}`)
      }
    }
    for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.test(response)) {
        violations.push(`Sensitive pattern detected: ${pattern.source}`)
      }
    }
  }

  if (schema) {
    const parseResult = schema.safeParse(response)
    if (!parseResult.success) {
      violations.push(`Schema validation failed: ${parseResult.error.message}`)
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  }
}

export function createSafeResponse<T>(data: T, _fallback: unknown): unknown {
  return data
}

export const FitScoreSchema = z.object({
  score: z.number().min(1).max(100),
  label: z.enum(["Excelente", "Bueno", "Regular", "Bajo"]),
  reason: z.string().max(200),
})

export type FitScore = z.infer<typeof FitScoreSchema>

export const CandidateScoreSchema = z.object({
  candidateId: z.string(),
  score: z.number().min(1).max(100),
  label: z.enum(["Excelente", "Bueno", "Regular", "Bajo"]),
  reason: z.string().max(200),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  recommendation: z.enum(["Avanzar", "Evaluar", "Descartar"]),
})

export type CandidateScore = z.infer<typeof CandidateScoreSchema>

export const BatchScoreResultSchema = z.object({
  scores: z.array(CandidateScoreSchema),
})

export type BatchScoreResult = z.infer<typeof BatchScoreResultSchema>

export function validateScoreResponse(response: unknown): {
  valid: boolean
  data?: FitScore
  error?: string
} {
  const validation = validateAIResponse(response)
  if (!validation.valid) {
    return { valid: false, error: validation.violations.join("; ") }
  }

  const parseResult = FitScoreSchema.safeParse(response)
  if (!parseResult.success) {
    return { valid: false, error: parseResult.error.message }
  }

  return { valid: true, data: parseResult.data }
}

export function validateBatchScoreResponse(response: unknown): {
  valid: boolean
  data?: BatchScoreResult
  error?: string
} {
  const validation = validateAIResponse(response)
  if (!validation.valid) {
    return { valid: false, error: validation.violations.join("; ") }
  }

  const parseResult = BatchScoreResultSchema.safeParse(response)
  if (!parseResult.success) {
    return { valid: false, error: parseResult.error.message }
  }

  return { valid: true, data: parseResult.data }
}
