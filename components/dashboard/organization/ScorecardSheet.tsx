"use client"

import { StarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import {
  type Evaluation,
  useEvaluations,
  useUpsertEvaluationMutation,
} from "@/hooks/use-evaluations"
import { cn } from "@/lib/utils"

type RatingOption = {
  value: Evaluation["rating"]
  label: string
  color: string
}

const RATINGS: RatingOption[] = [
  { value: "positive", label: "Positivo", color: "text-emerald-600" },
  { value: "neutral", label: "Neutral", color: "text-muted-foreground" },
  { value: "negative", label: "Negativo", color: "text-rose-600" },
]

function RatingStars({
  value,
  onChange,
}: {
  value: Evaluation["rating"]
  onChange: (v: Evaluation["rating"]) => void
}) {
  const activeIndex = value === "positive" ? 2 : value === "neutral" ? 1 : 0

  return (
    <div className="flex items-center gap-1">
      {RATINGS.map((r, idx) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          className={cn(
            "rounded-md p-1.5 transition-colors hover:bg-muted",
            idx <= activeIndex ? r.color : "text-muted-foreground/40"
          )}
        >
          <HugeiconsIcon icon={StarIcon} size={20} />
        </button>
      ))}
      <span className={cn("ml-2 text-xs font-medium", RATINGS[activeIndex].color)}>
        {RATINGS[activeIndex].label}
      </span>
    </div>
  )
}

export function ScorecardSheet({
  applicationId,
  candidateName,
  children,
}: {
  applicationId: string
  candidateName: string
  children: React.ReactNode
}) {
  const { data: evaluations } = useEvaluations(applicationId)
  const upsertMutation = useUpsertEvaluationMutation(applicationId)

  const existing = evaluations?.[0]
  const [rating, setRating] = useState<Evaluation["rating"]>(existing?.rating ?? "neutral")
  const [notes, setNotes] = useState(existing?.notes ?? "")

  const handleSave = () => {
    upsertMutation.mutate({ rating, notes: notes.trim() || undefined }, { onSuccess: () => {} })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-lg">Evaluacion: {candidateName}</SheetTitle>
          <SheetDescription>Califica esta postulacion con una nota interna.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="rating" className="text-sm font-medium">
              Valoracion
            </label>
            <RatingStars value={rating} onChange={setRating} />
          </div>

          <div className="space-y-2">
            <label htmlFor="evaluation-notes" className="text-sm font-medium">
              Notas internas
            </label>
            <Textarea
              id="evaluation-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observaciones, fortalezas, debilidades..."
              className="min-h-[120px] resize-y"
            />
          </div>

          {existing && (
            <p className="text-xs text-muted-foreground">
              Ultima evaluacion: {new Date(existing.updated_at).toLocaleDateString("es-CL")}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={upsertMutation.isPending}
            >
              {upsertMutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
