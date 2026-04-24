"use client"

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import {
  Calendar04Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  File02Icon,
  Message01Icon,
  MoreHorizontalIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { AIScoreBadge, AIScoreBadgeSkeleton } from "@/components/ai/AIScoreBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ScoreEntry } from "@/hooks/useKanbanAIScoring"
import type { JobOfferContext } from "@/lib/ai/types"
import type { Applicant, ApplicationStage } from "@/lib/types/dashboard"
import { cn } from "@/lib/utils"

const STAGES: { id: ApplicationStage; label: string; icon: typeof File02Icon }[] = [
  { id: "pendiente", label: "Pendiente", icon: File02Icon },
  { id: "entrevista", label: "Entrevista", icon: Message01Icon },
  { id: "oferta", label: "Oferta", icon: Calendar04Icon },
  { id: "contratado", label: "Contratado", icon: CheckmarkCircle02Icon },
  { id: "rechazado", label: "Rechazado", icon: Cancel01Icon },
]

type ApplicantCardProps = {
  applicant: Applicant
  getScore?: (candidateId: string) => ScoreEntry | undefined
  isAnalyzing?: boolean
  jobOffer?: JobOfferContext
  onScoreClick?: (candidateId: string) => void
}

function ApplicantCard({
  applicant,
  getScore,
  isAnalyzing: analyzing,
  jobOffer,
  onScoreClick,
}: ApplicantCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: applicant.id,
    data: { applicant, stage: applicant.stage },
  })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined

  const handleMenuPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
  }

  const scoreEntry = getScore ? getScore(applicant.candidateId) : undefined

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab touch-none border-border/60 py-4 active:cursor-grabbing active:scale-[0.99] transition-all duration-150",
        isDragging && "opacity-50 shadow-lg"
      )}
      {...listeners}
      {...attributes}
    >
      <CardContent className="relative px-4 py-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2 pr-6">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm leading-tight truncate">
                {applicant.candidateName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{applicant.position}</p>
            </div>
            <div>
              {scoreEntry ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onScoreClick?.(applicant.candidateId)
                  }}
                  className="animate-in fade-in duration-300"
                >
                  <AIScoreBadge score={scoreEntry.score} />
                </button>
              ) : analyzing ? (
                <AIScoreBadgeSkeleton />
              ) : null}
            </div>
          </div>
          <p className="text-xs text-muted-foreground/70">Aplicó: {applicant.dateApplied}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <HugeiconsIcon
              icon={MoreHorizontalIcon}
              className="absolute top-0 right-4 size-5 text-muted-foreground hover:text-foreground cursor-pointer"
              onPointerDown={handleMenuPointerDown}
              onClick={(e) => e.stopPropagation()}
              aria-label="Más opciones"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-40"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuItem onSelect={() => {}}>
              <HugeiconsIcon icon={UserIcon} size={16} />
              Ver información del postulante
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>
              <HugeiconsIcon icon={Message01Icon} size={16} />
              Enviar mensaje
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}

function KanbanColumn({
  stage,
  applicants,
  getScore,
  isAnalyzing,
  jobOffer,
  onScoreClick,
}: {
  stage: (typeof STAGES)[number]
  applicants: Applicant[]
  getScore?: (candidateId: string) => ScoreEntry | undefined
  isAnalyzing?: boolean
  jobOffer?: JobOfferContext
  onScoreClick?: (candidateId: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-w-[180px] max-w-[180px] lg:min-w-[220px] lg:max-w-[220px] flex-col rounded-lg border bg-muted/30 p-2.5 lg:p-3 transition-colors max-h-full snap-start shrink-0",
        isOver && "border-primary/50 bg-primary/5"
      )}
    >
      <div className="mb-2 lg:mb-3 flex items-center gap-1.5 lg:gap-2 shrink-0">
        <HugeiconsIcon
          icon={stage.icon}
          size={16}
          strokeWidth={1.5}
          className="text-muted-foreground lg:size-5"
        />
        <span className="font-medium text-xs lg:text-sm">{stage.label}</span>
        <span className="tabular-nums text-muted-foreground text-xs">({applicants.length})</span>
      </div>
      <div className="flex flex-col gap-2">
        {applicants.map((a) => (
          <ApplicantCard
            key={a.id}
            applicant={a}
            getScore={getScore}
            isAnalyzing={isAnalyzing}
            jobOffer={jobOffer}
            onScoreClick={onScoreClick}
          />
        ))}
      </div>
    </div>
  )
}

export type { Applicant, ApplicationStage }

export function ApplicationsKanban({
  applicants: initialApplicants,
  onStatusChange,
  onCreateEvent,
  getScore,
  isAnalyzing,
  jobOffer,
  onScoreClick,
}: {
  applicants: Applicant[]
  onStatusChange?: (applicationId: string, newStage: ApplicationStage) => void | Promise<void>
  /** Called when dragging to 'entrevista' or 'contratado' stages */
  onCreateEvent?: (applicant: Applicant, eventType: "interview" | "onboarding") => void
  /** Get score for a candidate */
  getScore?: (candidateId: string) => ScoreEntry | undefined
  isAnalyzing?: boolean
  jobOffer?: JobOfferContext
  onScoreClick?: (candidateId: string) => void
}) {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants)
  const [activeApplicant, setActiveApplicant] = useState<Applicant | null>(null)

  useEffect(() => {
    setApplicants(initialApplicants)
  }, [initialApplicants])

  const applicantsByStage = useMemo(() => {
    const map = new Map<ApplicationStage, Applicant[]>()
    for (const s of STAGES) {
      map.set(s.id, [])
    }
    for (const a of applicants) {
      const list = map.get(a.stage) ?? []
      list.push(a)
      map.set(a.stage, list)
    }
    return map
  }, [applicants])

  const handleDragStart = useCallback((event: DragEndEvent) => {
    const data = event.active.data.current as { applicant: Applicant } | undefined
    if (data?.applicant) {
      setActiveApplicant(data.applicant)
    }
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveApplicant(null)
      const { active, over } = event
      if (!over?.id || typeof over.id !== "string") return
      const data = active.data.current as { applicant: Applicant } | undefined
      if (!data?.applicant) return

      let targetStage: ApplicationStage
      if (STAGES.some((s) => s.id === over.id)) {
        targetStage = over.id as ApplicationStage
      } else {
        const targetApplicant = applicants.find((a) => a.id === over.id)
        if (!targetApplicant) return
        targetStage = targetApplicant.stage
      }

      if (data.applicant.stage === targetStage) return

      if (targetStage === "entrevista" || targetStage === "contratado") {
        const eventType = targetStage === "entrevista" ? "interview" : "onboarding"
        setApplicants((prev) =>
          prev.map((a) => (a.id === data.applicant.id ? { ...a, stage: targetStage } : a))
        )
        onStatusChange?.(data.applicant.id, targetStage)
        onCreateEvent?.(data.applicant, eventType)
        return
      }

      setApplicants((prev) =>
        prev.map((a) => (a.id === data.applicant.id ? { ...a, stage: targetStage } : a))
      )
      onStatusChange?.(data.applicant.id, targetStage)
    },
    [applicants, onStatusChange, onCreateEvent]
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {/* Desktop: horizontal scroll, Mobile: vertical stack or smaller cards */}
      <div
        className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 lg:overflow-visible snap-x snap-mandatory lg:snap-none"
        style={{ height: "100%" }}
      >
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            applicants={applicantsByStage.get(stage.id) ?? []}
            getScore={getScore}
            isAnalyzing={isAnalyzing}
            jobOffer={jobOffer}
            onScoreClick={onScoreClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeApplicant ? (
          <div className="cursor-grabbing rotate-2 opacity-90">
            <Card className="border-2 border-primary shadow-2xl">
              <CardContent className="relative px-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-tight">{activeApplicant.candidateName}</p>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {activeApplicant.position}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Aplicó: {activeApplicant.dateApplied}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
