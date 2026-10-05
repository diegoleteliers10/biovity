import { CheckmarkCircle02Icon, Target02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ScoreExplanation } from "@/lib/ai/decision/types"

export function ScoreExplanationSummary({
  score,
  reason,
}: {
  score: number | null
  reason?: string
}) {
  return (
    <section className="space-y-3 rounded-xl bg-surface-container-low p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-4xl font-semibold tracking-tight tabular-nums">
          {score === null ? "Sin score" : `${score}%`}
        </p>
        <p className="text-sm text-muted-foreground">Compatibilidad con la oferta</p>
      </div>
      {reason && <p className="text-sm leading-relaxed text-foreground">{reason}</p>}
    </section>
  )
}

export function ScoreExplanationView({ explanation }: { explanation: ScoreExplanation }) {
  return (
    <div className="space-y-6">
      <EvidenceGroup kind="strength" items={explanation.strengths} />
      <EvidenceGroup kind="gap" items={explanation.gaps} />

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
}: {
  kind: "strength" | "gap"
  items: ScoreExplanation["strengths"]
}) {
  if (items.length === 0) return null
  const isStrength = kind === "strength"
  const title = isStrength ? "Coincidencias" : "Por revisar"
  const source = "Evidencia citada"
  return (
    <section className="space-y-2" aria-label={title}>
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <HugeiconsIcon
          icon={isStrength ? CheckmarkCircle02Icon : Target02Icon}
          size={17}
          className={isStrength ? "text-secondary-soft" : "text-muted-foreground"}
        />
        {title}
        <span className="ml-auto text-xs font-normal tabular-nums text-muted-foreground">
          {items.length}
        </span>
      </h3>
      <ul className="divide-y divide-border/30">
        {items.map((item) => (
          <li key={`${item.text}:${item.evidence}`} className="min-w-0 py-4 first:pt-2 last:pb-0">
            <p className="break-words text-sm font-medium leading-relaxed">{item.text}</p>
            <p className="mt-1.5 line-clamp-2 break-words text-sm leading-relaxed text-muted-foreground">
              {item.evidence}
            </p>
            <details className="group mt-2">
              <summary className="flex min-h-11 w-fit cursor-pointer items-center rounded-md py-1 text-xs font-medium text-secondary-soft underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="group-open:hidden">Ver cita completa</span>
                <span className="hidden group-open:inline">Ocultar cita</span>
              </summary>
              <div className="mt-2 rounded-lg bg-surface-container-low p-3">
                <p className="mb-1 text-xs font-medium text-muted-foreground">{source}</p>
                <blockquote className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {item.evidence}
                </blockquote>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  )
}
