"use client"

import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Loading01Icon,
  SparklesIcon,
  StarIcon,
  Tag01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
import { cn, formatDateChilean } from "@/lib/utils"

type RatingOption = {
  value: Evaluation["rating"]
  title: string
  subtitle: string
  color: string
  activeBg: string
  icon: typeof CheckmarkCircle02Icon
}

const DECISIONS: RatingOption[] = [
  {
    value: "positive",
    title: "Avanzar",
    subtitle: "Recomendado",
    color: "text-emerald-700 dark:text-emerald-300",
    activeBg: "bg-emerald-500/10 border-emerald-500/50 ring-2 ring-emerald-500/20",
    icon: CheckmarkCircle02Icon,
  },
  {
    value: "neutral",
    title: "Evaluar",
    subtitle: "Con dudas",
    color: "text-amber-700 dark:text-amber-300",
    activeBg: "bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/20",
    icon: Clock01Icon,
  },
  {
    value: "negative",
    title: "Descartar",
    subtitle: "No recomendado",
    color: "text-rose-700 dark:text-rose-300",
    activeBg: "bg-rose-500/10 border-rose-500/50 ring-2 ring-rose-500/20",
    icon: Cancel01Icon,
  },
]

const QUICK_TAGS = [
  "Experiencia relevante",
  "Excelente comunicación",
  "Disponibilidad inmediata",
  "Formación destacada",
  "Pretensión salarial alta",
  "Falta experiencia específica",
  "Requiere relocalización",
]

function getCandidateInitials(name: string | undefined): string {
  if (!name?.trim()) return "?"
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function DimensionalRating({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (val: number) => void
}) {
  const [hoverVal, setHoverVal] = useState<number | null>(null)
  const current = hoverVal ?? value
  const labels = ["Insuficiente", "Bajo", "Aceptable", "Bueno", "Excelente"]

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-border/15 bg-surface-container-low hover:bg-surface-container-lowest transition-colors">
      <span className="text-xs font-semibold text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1" onMouseLeave={() => setHoverVal(null)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverVal(star)}
              onClick={() => onChange(star)}
              className="p-1 rounded-md hover:scale-110 transition-transform focus:outline-none cursor-pointer"
              aria-label={`Calificar ${star} estrellas para ${label}`}
            >
              <HugeiconsIcon
                icon={StarIcon}
                size={18}
                className={cn(
                  "transition-colors",
                  star <= current ? "text-amber-400 fill-amber-400" : "text-muted-foreground/25"
                )}
              />
            </button>
          ))}
        </div>
        <span className="text-[11px] font-medium text-muted-foreground min-w-[70px] text-right">
          {current > 0 ? labels[current - 1] : "Sin evaluar"}
        </span>
      </div>
    </div>
  )
}

export function ScorecardSheet({
  applicationId,
  candidateName,
  candidateAvatar,
  candidateProfession,
  children,
}: {
  applicationId: string
  candidateName: string
  candidateAvatar?: string | null
  candidateProfession?: string | null
  children: React.ReactNode
}) {
  const { data: evaluations } = useEvaluations(applicationId)
  const upsertMutation = useUpsertEvaluationMutation(applicationId)

  const existing = evaluations?.[0]
  const [rating, setRating] = useState<Evaluation["rating"]>("positive")
  const [notes, setNotes] = useState("")
  const [technical, setTechnical] = useState(0)
  const [cultural, setCultural] = useState(0)
  const [expectations, setExpectations] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (existing) {
      setRating(existing.rating ?? "positive")
      setNotes(existing.notes ?? "")
      const sa = existing.skills_assessment ?? {}
      setTechnical(Number(sa.technical) || 0)
      setCultural(Number(sa.cultural) || 0)
      setExpectations(Number(sa.expectations) || 0)
      if (sa.tags) {
        setSelectedTags(sa.tags.split(",").filter(Boolean))
      }
    }
  }, [existing])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSave = () => {
    const skillsAssessment: Record<string, string> = {
      technical: String(technical),
      cultural: String(cultural),
      expectations: String(expectations),
      tags: selectedTags.join(","),
    }

    upsertMutation.mutate(
      { rating, notes: notes.trim() || undefined, skillsAssessment },
      {
        onSuccess: () => {
          toast.success("Evaluación guardada correctamente")
          setOpen(false)
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Error al guardar evaluación")
        },
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full p-0 gap-0 border-l border-border/20 bg-background shadow-2xl overflow-hidden">
        {/* Header */}
        <SheetHeader className="border-b border-border/10 bg-gradient-to-r from-secondary/5 via-muted/20 to-transparent p-6 text-left shrink-0">
          <Badge
            variant="outline"
            className="w-fit mb-2.5 gap-1.5 text-xs text-secondary border-secondary/30 bg-secondary/10 font-medium px-2.5 py-0.5"
          >
            <HugeiconsIcon icon={SparklesIcon} size={13} />
            Scorecard de Selección
          </Badge>
          <div className="flex items-center gap-3.5 mt-1">
            <Avatar className="size-12 border border-border/20 shadow-xs shrink-0">
              {candidateAvatar && <AvatarImage src={candidateAvatar} alt={candidateName} />}
              <AvatarFallback className="bg-secondary/10 text-secondary font-semibold text-sm">
                {getCandidateInitials(candidateName)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 min-w-0">
              <SheetTitle className="text-lg font-bold text-foreground truncate">
                {candidateName}
              </SheetTitle>
              <p className="text-xs text-muted-foreground truncate">
                {candidateProfession ?? "Candidato"}
              </p>
            </div>
          </div>
          <SheetDescription className="text-xs text-muted-foreground mt-2">
            Registra tu calificación, puntuaciones por competencia y observaciones internas.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Decisión General */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dictamen de Selección
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {DECISIONS.map((d) => {
                const active = rating === d.value
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setRating(d.value)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150 cursor-pointer",
                      active
                        ? d.activeBg
                        : "border-border/20 bg-surface-container-low text-muted-foreground hover:border-border/40 hover:bg-surface-container-lowest"
                    )}
                  >
                    <HugeiconsIcon
                      icon={d.icon}
                      size={20}
                      className={cn("mb-1", active ? d.color : "text-muted-foreground")}
                    />
                    <span
                      className={cn(
                        "text-xs font-semibold block",
                        active ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {d.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {d.subtitle}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Calificación por Criterios */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Evaluación por Criterios
            </label>
            <div className="space-y-2">
              <DimensionalRating
                label="Fit Técnico & Experiencia"
                value={technical}
                onChange={setTechnical}
              />
              <DimensionalRating
                label="Fit Cultural & Actitud"
                value={cultural}
                onChange={setCultural}
              />
              <DimensionalRating
                label="Pretensión & Condiciones"
                value={expectations}
                onChange={setExpectations}
              />
            </div>
          </div>

          {/* Tags Rápidos */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <HugeiconsIcon icon={Tag01Icon} size={14} />
              <span>Etiquetas de Feedback</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((tag) => {
                const selected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                      selected
                        ? "bg-secondary/15 text-secondary border-secondary/30 shadow-2xs"
                        : "bg-surface-container-low text-muted-foreground border-border/15 hover:border-border/30 hover:text-foreground"
                    )}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notas Internas */}
          <div className="space-y-2.5">
            <label htmlFor="evaluation-notes" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notas e Impresiones Internas
            </label>
            <Textarea
              id="evaluation-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escribe aquí observaciones clave de la entrevista, fortalezas, debilidades o preguntas para la siguiente ronda..."
              className="min-h-[110px] text-sm resize-y rounded-xl border border-border/20 bg-background focus-visible:ring-secondary/20"
            />
          </div>

          {/* Última edición */}
          {existing && (
            <p className="text-[11px] text-muted-foreground border-t border-border/10 pt-3">
              Última evaluación registrada por <span className="font-medium text-foreground">{existing.evaluator_name || "reclutador"}</span> el{" "}
              {formatDateChilean(existing.updated_at, "d MMM yyyy HH:mm")}
            </p>
          )}
        </div>

        {/* Footer */}
        <SheetFooter className="border-t border-border/10 bg-background p-4 flex items-center justify-between gap-3 shrink-0 sm:justify-between">
          <SheetClose asChild>
            <Button variant="ghost" size="sm" type="button" className="h-9 px-3">
              Cancelar
            </Button>
          </SheetClose>
          <Button
            type="button"
            onClick={handleSave}
            disabled={upsertMutation.isPending}
            className="h-9 px-5 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium text-xs rounded-lg shadow-xs"
          >
            {upsertMutation.isPending ? (
              <>
                <HugeiconsIcon icon={Loading01Icon} size={15} className="mr-1.5 animate-spin" />
                Guardando…
              </>
            ) : (
              "Guardar evaluación"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
