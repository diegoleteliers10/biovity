import type { NextRequest } from "next/server"
import { generateText, model } from "@/lib/ai/provider"
import type { CandidateContext, FitScoreResult, JobOfferContext } from "@/lib/ai/types"

export async function POST(req: NextRequest) {
  const {
    candidate,
    jobOffer,
  }: {
    candidate: CandidateContext
    jobOffer: JobOfferContext
  } = await req.json()

  const { text } = await generateText({
    model,
    system:
      "Eres un sistema de scoring de candidatos. Responde ÚNICAMENTE con JSON válido, sin markdown ni texto extra.",
    prompt: `
      Evalúa el fit de este candidato para el job offer.

      JOB: ${jobOffer.title} | Skills: ${jobOffer.requiredSkills.join(", ")} | Exp. mínima: ${jobOffer.minExperience}yr
      CANDIDATO: ${candidate.name} | Skills: ${candidate.skills.join(", ")} | Exp: ${candidate.yearsOfExperience}yr

      Responde con este JSON exacto:
      {"score": <1-100>, "label": "<Excelente|Bueno|Regular|Bajo>", "reason": "<máx 12 palabras>"}
    `,
  })

  const raw = text ?? "{}"

  try {
    const result: FitScoreResult = JSON.parse(raw.trim())
    return Response.json(result)
  } catch {
    return Response.json({ score: 50, label: "Regular", reason: "No se pudo calcular el score" })
  }
}
