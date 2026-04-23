import type { NextRequest } from "next/server"
import { z } from "zod"
import { generateText, model } from "@/lib/ai/provider"
import { sanitizeInput } from "@/lib/ai/sanitize"
import type { CandidateContext, JobOfferContext } from "@/lib/ai/types"

const CandidateScoreSchema = z.object({
  candidateId: z.string(),
  score: z.number().min(1).max(100),
  label: z.enum(["Excelente", "Bueno", "Regular", "Bajo"]),
  reason: z.string().max(500),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  recommendation: z.enum(["Avanzar", "Evaluar", "Descartar"]),
})

const BatchScoreResultSchema = z.object({
  scores: z.array(CandidateScoreSchema),
})

export type CandidateScore = z.infer<typeof CandidateScoreSchema>

export type BatchScoreResult = z.infer<typeof BatchScoreResultSchema>

function safeParseBatchScore(raw: string): BatchScoreResult | null {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()

  if (!cleaned.startsWith("{")) return null

  try {
    const parsed = JSON.parse(cleaned)
    const normalized = Array.isArray(parsed) ? { scores: parsed } : parsed
    const validated = BatchScoreResultSchema.parse(normalized)
    return validated
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const { candidates, jobOffer }: { candidates: { id: string; data: CandidateContext }[]; jobOffer: JobOfferContext } = await req.json()

  if (!candidates?.length || !jobOffer) {
    return new Response("Bad request", { status: 400 })
  }

  sanitizeInput(JSON.stringify({ candidates, jobOffer }), "batch-scorer")

  const candidatesInput = candidates
    .map(
      (c, i) => `
 ${i + 1}. ID: ${c.id}
   Nombre: ${c.data.name}
   Educación: ${c.data.education}
   Skills: ${(c.data.skills ?? []).join(", ")}
   Años de experiencia: ${c.data.yearsOfExperience}
   Bio: ${c.data.bio ?? "—"}
   Experiencia laboral: ${(c.data.experiences ?? []).join(" | ") || "—"}
   Certificaciones: ${(c.data.certifications ?? []).join(", ") || "—"}
   Idiomas: ${(c.data.languages ?? []).join(", ") || "—"}
   CV URL: ${c.data.resumeUrl ?? "No disponible"}
  `
    )
    .join("\n")

  const systemPrompt = [
    "Eres un sistema de scoring de candidatos experto en recursos humanos.",
    "Responde ÚNICAMENTE con JSON válido en español, sin markdown ni texto extra.",
    'IMPORTANTE: el JSON debe ser un objeto con clave "scores" que contenga un array, NUNCA un array directo.',
    "No uses palabras en chino, japonés ni otros idiomas.",
    `Formato exacto requerido: {"scores":[{"candidateId":"<id>","score":<1-100>,"label":"<Excelente|Bueno|Regular|Bajo>","reason":"<explicación corta>","strengths":["<fortaleza 1>","<fortaleza 2>"],"gaps":["<gap 1>","<gap 2>"],"recommendation":"<Avanzar|Evaluar|Descartar>"}]}`,
    "Cada candidato DEBE tener los 7 campos: candidateId, score, label, reason, strengths (array), gaps (array), recommendation.",
    "strengths y gaps NUNCA vacío. Cada array debe tener al menos 1 elemento.",
  ].join(" ")

  const { text } = await generateText({
    model,
    system: systemPrompt,
    prompt: `
JOB OFFER:
Título: ${jobOffer.title}
Descripción: ${jobOffer.description}
Skills requeridos: ${(jobOffer.requiredSkills ?? []).join(", ")}
Experiencia mínima: ${jobOffer.minExperience} años
Área: ${jobOffer.area ?? "—"}


CANDIDATOS:
${candidatesInput}

Para cada candidato, analiza en español:
1. Coincidencia de skills entre los requeridos y los del candidato
2. Años de experiencia vs mínimo requerido
3. Relevancia de educación y especialización
4. Bio vs requerimientos del puesto

Devuelve un array JSON con scoring para CADA candidato listado arriba. Usa el ID exacto para candidateId. Cada strength y gap debe ser una oración completa y descriptiva en español (no frases cortas). Incluye un campo "reason" con una explicación de 1-2 oraciones de por qué se dio ese puntaje en relación directa al job offer. No omitas ningún candidato. Toda la respuesta debe ser en español.
`.trim(),
  })

  const raw = text ?? "{}"
  const validated = safeParseBatchScore(raw)

  if (!validated) {
    const fallback: BatchScoreResult = {
      scores: candidates.map((c) => ({
        candidateId: c.id,
        score: 50,
        label: "Regular" as const,
        reason: "Análisis no disponible. Por favor intenta nuevamente.",
        strengths: c.data.bio ? ["Perfil con experiencia relevante"] : ["Información del perfil incompleta"],
        gaps: c.data.bio ? ["Se requiere revisión adicional del perfil"] : ["Falta información del candidato"],
        recommendation: "Evaluar" as const,
      })),
    }
    return Response.json(fallback)
  }

  return Response.json(validated)
}