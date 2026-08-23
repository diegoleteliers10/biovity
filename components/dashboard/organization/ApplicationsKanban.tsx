"use client"

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  KeyboardSensor,
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
  CheckmarkCircleIcon,
  CircleIcon,
  File02Icon,
  Message01Icon,
  MoreHorizontalIcon,
  StarIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { AIScoreBadge, AIScoreBadgeSkeleton } from "@/components/ai/AIScoreBadge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  onViewProfile?: (candidateId: string) => void
  onViewDetail?: (applicationId: string) => void
  onMessage?: (candidateId: string) => void
  isSelected?: boolean
  selectionMode?: boolean
  onToggleSelection?: (id: string) => void
}

function ApplicantCard({
  applicant,
  getScore,
  isAnalyzing: analyzing,
  jobOffer: _jobOffer,
  onScoreClick,
  onViewProfile,
  onViewDetail,
  onMessage,
  isSelected,
  selectionMode,
  onToggleSelection,
}: ApplicantCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: applicant.id,
    data: { applicant, stage: applicant.stage },
    disabled: selectionMode,
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
        "cursor-grab touch-none border-border/50 py-3.5 active:cursor-grabbing transition-colors duration-150 relative",
        isDragging && "opacity-50 border-primary/50",
        selectionMode && isSelected && "border-primary/50 bg-primary/5"
      )}
      {...listeners}
      {...attributes}
    >
      <CardContent className="relative px-3.5 py-0">
        {/* 3 dots menu button */}
        <div className="absolute top-0.5 right-1 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onPointerDown={handleMenuPointerDown}
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-md text-muted-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                aria-label="Más opciones"
              >
                <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-44"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuItem
                onSelect={() => onViewProfile?.(applicant.candidateId)}
                className="cursor-pointer"
              >
                <HugeiconsIcon icon={UserIcon} size={16} />
                Ver información del postulante
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onViewDetail?.(applicant.id)}
                className="cursor-pointer"
              >
                <HugeiconsIcon icon={File02Icon} size={16} />
                Ver detalle de aplicación
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onMessage?.(applicant.candidateId)}
                className="cursor-pointer"
              >
                <HugeiconsIcon icon={Message01Icon} size={16} />
                Enviar mensaje
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-start gap-3 pr-6">
          {/* Avatar / Selection Trigger */}
          <div
            className="relative shrink-0 cursor-pointer group/avatar"
            onClick={(e) => {
              if (selectionMode) {
                e.stopPropagation()
                onToggleSelection?.(applicant.id)
              } else {
                onViewProfile?.(applicant.candidateId)
              }
            }}
          >
            <Avatar
              className={cn(
                "size-10 transition-all border",
                selectionMode && isSelected
                  ? "ring-2 ring-primary border-primary"
                  : "border-border/30"
              )}
            >
              {applicant.avatar && (
                <AvatarImage src={applicant.avatar} alt={applicant.candidateName} />
              )}
              <AvatarFallback className="bg-secondary/10 text-secondary font-semibold text-xs">
                {applicant.candidateName
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Checkmark overlay badge on Avatar */}
            {selectionMode && (
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-background transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/20"
                )}
              >
                <HugeiconsIcon icon={CheckmarkCircleIcon} size={12} />
              </div>
            )}
          </div>

          {/* Candidate details */}
          <div className="flex flex-1 flex-col gap-1.5 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-sm leading-snug truncate text-foreground">
                  {applicant.candidateName}
                </p>
                {applicant.isSaved && (
                  <HugeiconsIcon
                    icon={StarIcon}
                    size={12}
                    className="shrink-0 text-amber-500 fill-amber-500"
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{applicant.position}</p>
            </div>

            {/* AI Score Badge - Placed cleanly underneath candidate role */}
            {(scoreEntry || analyzing) && (
              <div className="mt-0.5">
                {scoreEntry ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onScoreClick?.(applicant.candidateId)
                    }}
                    className="inline-block animate-in fade-in duration-300 hover:opacity-90 cursor-pointer"
                  >
                    <AIScoreBadge score={scoreEntry.score} />
                  </button>
                ) : (
                  <AIScoreBadgeSkeleton />
                )}
              </div>
            )}

            {/* Tags */}
            {applicant.tags && applicant.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-0.5">
                {applicant.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                    style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Metadata Footer */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground mt-1 pt-1 border-t border-border/10">
              <span>Aplicó: {applicant.dateApplied}</span>
              {applicant.salaryMin != null && (
                <span className="truncate font-mono">
                  ${applicant.salaryMin.toLocaleString("es-CL")}
                  {applicant.salaryMax != null
                    ? ` - $${applicant.salaryMax.toLocaleString("es-CL")}`
                    : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function KanbanColumn({
  stage,
  applicants,
  getScore,
  isAnalyzing,
  onScoreClick,
  onViewProfile,
  onViewDetail,
  onMessage,
  selectedIds,
  selectionMode,
  onToggleSelection,
}: {
  stage: (typeof STAGES)[number]
  applicants: Applicant[]
  getScore?: (candidateId: string) => ScoreEntry | undefined
  isAnalyzing?: boolean
  jobOffer?: JobOfferContext
  onScoreClick?: (candidateId: string) => void
  onViewProfile?: (candidateId: string) => void
  onViewDetail?: (applicationId: string) => void
  onMessage?: (candidateId: string) => void
  selectedIds?: Set<string>
  selectionMode?: boolean
  onToggleSelection?: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-w-[220px] max-w-[220px] lg:min-w-[250px] lg:max-w-[250px] flex-col rounded-xl border bg-muted/20 p-2.5 lg:p-3 transition-colors h-full max-h-full min-h-0 snap-start shrink-0 overflow-hidden",
        isOver && "border-primary/50 bg-primary/5"
      )}
    >
      <div className="mb-2 lg:mb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 lg:gap-2">
          <HugeiconsIcon
            icon={stage.icon}
            size={16}
            strokeWidth={1.5}
            className="text-muted-foreground lg:size-5"
          />
          <span className="text-xs leading-4 font-medium text-foreground">{stage.label}</span>
        </div>
        <span className="tabular-nums text-muted-foreground text-xs bg-surface-container-highest px-2 py-0.5 rounded-md font-medium">
          {applicants.length}
        </span>
      </div>
      <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto pr-1">
        {applicants.map((a) => (
          <ApplicantCard
            key={a.id}
            applicant={a}
            getScore={getScore}
            isAnalyzing={isAnalyzing}
            onScoreClick={onScoreClick}
            onViewProfile={onViewProfile}
            onViewDetail={onViewDetail}
            onMessage={onMessage}
            isSelected={selectedIds?.has(a.id) ?? false}
            selectionMode={selectionMode}
            onToggleSelection={onToggleSelection}
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
  onViewProfile,
  onViewDetail,
  onMessage,
  selectionMode,
  selectedIds,
  onToggleSelection,
  onClearSelection: _onClearSelection,
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
  onViewProfile?: (candidateId: string) => void
  onViewDetail?: (applicationId: string) => void
  onMessage?: (candidateId: string) => void
  selectionMode?: boolean
  selectedIds?: Set<string>
  onToggleSelection?: (id: string) => void
  onClearSelection?: () => void
}) {
  const [activeApplicant, setActiveApplicant] = useState<Applicant | null>(null)

  const applicantsByStage = useMemo(() => {
    const map = new Map<ApplicationStage, Applicant[]>()
    for (const s of STAGES) {
      map.set(s.id, [])
    }
    for (const a of initialApplicants) {
      const list = map.get(a.stage) ?? []
      list.push(a)
      map.set(a.stage, list)
    }
    return map
  }, [initialApplicants])

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
        const targetApplicant = initialApplicants.find((a) => a.id === over.id)
        if (!targetApplicant) return
        targetStage = targetApplicant.stage
      }

      if (data.applicant.stage === targetStage) return

      const previousStage = data.applicant.stage

      const stageLabel = STAGES.find((s) => s.id === targetStage)?.label ?? targetStage
      toast.success(`Movido a ${stageLabel}`, {
        description: `${data.applicant.candidateName} -> ${stageLabel}`,
        action: {
          label: "Deshacer",
          onClick: () => onStatusChange?.(data.applicant.id, previousStage),
        },
      })

      if (targetStage === "entrevista" || targetStage === "contratado") {
        const eventType = targetStage === "entrevista" ? "interview" : "onboarding"
        onStatusChange?.(data.applicant.id, targetStage)
        onCreateEvent?.(data.applicant, eventType)
        return
      }

      onStatusChange?.(data.applicant.id, targetStage)
    },
    [onStatusChange, onCreateEvent, initialApplicants.find]
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  )

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {/* Desktop: horizontal scroll, Mobile: vertical stack or smaller cards */}
      <div className="flex h-full min-h-0 w-full gap-3 overflow-x-auto overflow-y-hidden pb-1 snap-x snap-mandatory lg:snap-none">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            applicants={applicantsByStage.get(stage.id) ?? []}
            getScore={getScore}
            isAnalyzing={isAnalyzing}
            jobOffer={jobOffer}
            onScoreClick={onScoreClick}
            onViewProfile={onViewProfile}
            onViewDetail={onViewDetail}
            onMessage={onMessage}
            selectedIds={selectedIds}
            selectionMode={selectionMode}
            onToggleSelection={onToggleSelection}
          />
        ))}
      </div>
      <DragOverlay>
        {activeApplicant ? (
          <div className="cursor-grabbing rotate-2 opacity-90">
            <Card className="border-2 border-primary">
              <CardContent className="relative p-4">
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
