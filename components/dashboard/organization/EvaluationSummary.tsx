import type { Evaluation } from "@/hooks/use-evaluations"
import { evaluationRatingLabels, latestEvaluationByApplication } from "@/lib/evaluations"
import { formatDateChilean } from "@/lib/utils"

export function EvaluationSummary({
  evaluations,
  mode = "compact",
}: {
  evaluations: Evaluation[]
  mode?: "compact" | "detail"
}) {
  const applicationId = evaluations[0]?.application_id
  const latest = applicationId
    ? latestEvaluationByApplication(evaluations).get(applicationId)
    : undefined
  if (!latest) return <p className="text-xs text-muted-foreground">Sin evaluar</p>
  const label =
    latest.rating === "positive"
      ? "Recomendado para avanzar"
      : latest.rating === "negative"
        ? "Recomendado descartar"
        : "Con dudas por resolver"
  const disagreement = new Set(evaluations.map((item) => item.rating)).size > 1
  return (
    <div className="space-y-1 text-xs">
      <p
        className={
          latest.rating === "positive"
            ? "font-medium text-secondary-soft"
            : "font-medium text-foreground"
        }
      >
        {label}
      </p>
      <p className="text-muted-foreground">
        {latest.evaluator_name || "Reclutador"}, {formatDateChilean(latest.updated_at, "d MMM")}
      </p>
      {evaluations.length > 1 && (
        <p className="text-muted-foreground">
          {evaluations.length} evaluadores{disagreement ? ", opiniones distintas" : ""}
        </p>
      )}
      {mode === "detail" &&
        evaluations.map((evaluation) => (
          <details key={evaluation.id} className="border-t border-border/30 pt-2">
            <summary className="min-h-9 cursor-pointer py-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {evaluation.evaluator_name || "Reclutador"}:{" "}
              {evaluationRatingLabels[evaluation.rating]}
            </summary>
            <div className="space-y-2 pb-2 text-muted-foreground">
              <p>
                {evaluation.skills_assessment.context === "initial_interview"
                  ? "Entrevista inicial"
                  : evaluation.skills_assessment.context === "technical_interview"
                    ? "Entrevista técnica"
                    : evaluation.skills_assessment.context === "final_review"
                      ? "Evaluación final"
                      : evaluation.skills_assessment.context === "cv_review"
                        ? "Revisión de CV"
                        : "Sin contexto registrado"}
              </p>
              <dl className="space-y-1">
                {[
                  ["Competencias y experiencia", "technical"],
                  ["Colaboración", "cultural"],
                  ["Condiciones y disponibilidad", "expectations"],
                ].map(([label, key]) => (
                  <div key={key} className="flex flex-wrap justify-between gap-2">
                    <dt>{label}</dt>
                    <dd>
                      {Number(evaluation.skills_assessment[key]) > 0
                        ? `${evaluation.skills_assessment[key]}/5`
                        : "No evaluado"}
                    </dd>
                  </div>
                ))}
              </dl>
              {evaluation.skills_assessment.tags && (
                <p>{evaluation.skills_assessment.tags.split(",").join(", ")}</p>
              )}
              {evaluation.notes && (
                <p className="whitespace-pre-wrap break-words text-foreground">
                  {evaluation.notes}
                </p>
              )}
              <p>{formatDateChilean(evaluation.updated_at, "d MMM yyyy HH:mm")}</p>
            </div>
          </details>
        ))}
    </div>
  )
}
