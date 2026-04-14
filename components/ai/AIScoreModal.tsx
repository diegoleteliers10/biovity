"use client"

import { Cancel01Icon, CheckmarkCircle02Icon, Target02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { CandidateScore } from "@/app/api/ai/score-candidates/route"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog"
import type { JobOfferContext } from "@/lib/ai/types"
import { cn } from "@/lib/utils"

interface Props {
  score: CandidateScore
  jobOffer: JobOfferContext
  candidateName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AIScoreModal({ score, jobOffer, candidateName, open, onOpenChange }: Props) {
  const color =
    score.score >= 75
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : score.score >= 50
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-red-100 text-red-700 border-red-200"

  const recIcon =
    score.recommendation === "Avanzar"
      ? CheckmarkCircle02Icon
      : score.recommendation === "Evaluar"
        ? Target02Icon
        : Cancel01Icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium",
                color
              )}
            >
              <HugeiconsIcon icon={recIcon} size={12} />
              {score.score}% · {score.label}
            </span>
            <span className="text-muted-foreground text-base font-normal">de {candidateName}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Análisis IA basado en el perfil vs la oferta
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Job Offer Context */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Oferta analizada</p>
            <p className="text-sm font-semibold">{jobOffer.title}</p>
            <p className="text-xs text-muted-foreground">
              {jobOffer.area} · {jobOffer.modality}
            </p>
            {jobOffer.requiredSkills.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {jobOffer.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Recommendation */}
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <HugeiconsIcon icon={recIcon} size={18} className="text-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">{score.recommendation}</p>
              <p className="text-xs text-muted-foreground">
                {score.recommendation === "Avanzar"
                  ? "El candidato cumple con los requisitos y se recomienda proceder."
                  : score.recommendation === "Evaluar"
                    ? "El candidato tiene potencial pero hay gaps a considerar."
                    : "El candidato no cumple con los requisitos mínimos de la oferta."}
              </p>
            </div>
          </div>

          {/* Strengths */}
          {score.strengths.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
                Fortalezas
              </p>
              <ul className="space-y-1">
                {score.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gaps */}
          {score.gaps.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-amber-700 flex items-center gap-1">
                <HugeiconsIcon icon={Target02Icon} size={12} />
                Gaps a evaluar
              </p>
              <ul className="space-y-1">
                {score.gaps.map((g, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
