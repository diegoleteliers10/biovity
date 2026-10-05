import { ArrowDown01Icon, CheckmarkCircle02Icon, Target02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { evidenceHighlightParts, explanationPlainText } from "@/lib/ai/decision/explanation-text"
import type { ScoreExplanation } from "@/lib/ai/decision/types"

export function ScoreExplanationSummary({
  score,
  reason,
}: {
  score: number | null
  reason?: string
}) {
  return (
    <section className="space-y-3 pb-1">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-5xl font-semibold tracking-tight tabular-nums">
          {score === null ? "Sin score" : `${score}%`}
        </p>
        <p className="text-sm text-muted-foreground">Compatibilidad con la oferta</p>
      </div>
      {score !== null && (
        <div
          role="img"
          aria-label={`Compatibilidad con la oferta: ${score}%`}
          className="h-1.5 overflow-hidden rounded-full bg-muted/50"
        >
          <div
            className="h-full rounded-full bg-secondary-soft"
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
      )}
      {reason && (
        <p className="text-sm leading-relaxed text-foreground">{explanationPlainText(reason)}</p>
      )}
    </section>
  )
}

export function ScoreExplanationView({ explanation }: { explanation: ScoreExplanation }) {
  return (
    <div className="space-y-6">
      <EvidenceGroup
        kind="strength"
        items={explanation.strengths}
        format={explanation.evidenceFormat ?? "html"}
      />
      <EvidenceGroup
        kind="gap"
        items={explanation.gaps}
        format={explanation.evidenceFormat ?? "html"}
      />

      {explanation.strengths.length === 0 && explanation.gaps.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No hay citas disponibles para esta evaluación.
        </p>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-4 text-xs">
        <span className="font-medium">Sugerencia: {explanation.recommendation}</span>
        <span className="text-muted-foreground">Requiere revisión humana</span>
      </footer>
    </div>
  )
}

function EvidenceGroup({
  kind,
  items,
  format,
}: {
  kind: "strength" | "gap"
  format: "plain-text" | "html"
  items: ScoreExplanation["strengths"]
}) {
  if (items.length === 0) return null
  const isStrength = kind === "strength"
  const title = isStrength ? "Coincidencias" : "Por revisar"
  const source = "Evidencia citada"
  return (
    <section className="space-y-3" aria-label={title}>
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <HugeiconsIcon
          icon={isStrength ? CheckmarkCircle02Icon : Target02Icon}
          size={17}
          className={isStrength ? "text-secondary-soft" : "text-muted-foreground"}
        />
        {title}
        <span className="text-xs font-normal tabular-nums text-muted-foreground">
          {items.length}
        </span>
      </h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={`${item.text}:${item.evidence}`}
            className="min-w-0 rounded-xl bg-surface-container-low p-4 sm:p-5"
          >
            <div className="flex flex-col-reverse items-start gap-2 sm:flex-row sm:justify-between sm:gap-4">
              <p className="break-words text-sm font-semibold leading-relaxed">
                {explanationPlainText(item.text)}
              </p>
              <span
                className={
                  isStrength
                    ? "shrink-0 rounded-full bg-secondary-container px-2.5 py-1 text-xs font-medium text-on-secondary-container"
                    : "shrink-0 rounded-full bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground"
                }
              >
                {isStrength ? "Coincidencia" : "Por confirmar"}
              </span>
            </div>
            <p className="mt-1.5 line-clamp-2 break-words text-sm leading-relaxed text-muted-foreground">
              {isStrength ? (
                <HighlightedEvidence value={item.evidence} claim={item.text} format={format} />
              ) : format === "plain-text" ? (
                item.evidence
              ) : (
                explanationPlainText(item.evidence)
              )}
            </p>
            <details className="group mt-2">
              <summary className="flex min-h-11 w-fit cursor-pointer items-center gap-1.5 rounded-md py-1 text-xs font-medium text-secondary-soft underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="group-open:rotate-180" />
                <span className="group-open:hidden">Ver cita completa</span>
                <span className="hidden group-open:inline">Ocultar cita</span>
              </summary>
              <div className="mt-1 border-t border-border/30 pt-3">
                <p className="mb-1 text-xs font-medium text-muted-foreground">{source}</p>
                <blockquote className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {format === "plain-text" ? item.evidence : explanationPlainText(item.evidence)}
                </blockquote>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  )
}

function HighlightedEvidence({
  value,
  claim,
  format,
}: {
  value: string
  claim: string
  format: "plain-text" | "html"
}) {
  return evidenceHighlightParts({
    text: value,
    claim,
    format,
  }).map((part) =>
    part.highlighted ? (
      <mark
        key={`${part.start}:${part.text}`}
        className="rounded-sm bg-secondary-container px-0.5 text-on-secondary-container"
      >
        {part.text}
      </mark>
    ) : (
      <span key={`${part.start}:${part.text}`}>{part.text}</span>
    )
  )
}
