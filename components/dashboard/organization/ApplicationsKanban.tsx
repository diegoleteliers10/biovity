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
  File02Icon,
  Mail01Icon,
  Message01Icon,
  MoreHorizontalIcon,
  StarIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Result } from "better-result"
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
import type { Evaluation } from "@/hooks/use-evaluations"
import type { ScoreEntry } from "@/hooks/useKanbanAIScoring"
import type { JobOfferContext } from "@/lib/ai/types"
import { getStageAgeDays, isHiringPlanOverdue } from "@/lib/hiring-plan"
import {
  groupApplicantsByPipelineStage,
  type PipelineBoardStage,
  resolveApplicantPipelineStageId,
} from "@/lib/pipeline-stage-board"
import type { Applicant, ApplicationStage } from "@/lib/types/dashboard"
import { cn, formatDateChilean } from "@/lib/utils"
import { EvaluationSummary } from "./EvaluationSummary"

const DEFAULT_STAGES: PipelineBoardStage[] = [
  { id: "pendiente", name: "Pendiente", statusProjection: "pendiente", isArchived: false },
  { id: "entrevista", name: "Entrevista", statusProjection: "entrevista", isArchived: false },
  { id: "oferta", name: "Oferta", statusProjection: "oferta", isArchived: false },
  { id: "contratado", name: "Contratado", statusProjection: "contratado", isArchived: false },
  { id: "rechazado", name: "Rechazado", statusProjection: "rechazado", isArchived: false },
  { id: "desistido", name: "Desistido", statusProjection: "desistido", isArchived: false },
]

const TERMINAL_STATUSES: ReadonlySet<ApplicationStage> = new Set([
  "contratado",
  "rechazado",
  "desistido",
])

function getStageIcon(status: PipelineBoardStage["statusProjection"]) {
  switch (status) {
    case "entrevista":
      return Message01Icon
    case "oferta":
      return Calendar04Icon
    case "contratado":
      return CheckmarkCircle02Icon
    case "rechazado":
      return Cancel01Icon
    case "pendiente":
    case "desistido":
      return File02Icon
    default: {
      const exhaustive: never = status
      return exhaustive
    }
  }
}

type ApplicantCardProps = {
  applicant: Applicant
  getEvaluations?: (applicationId: string) => Evaluation[] | null
  getScore?: (applicationId: string) => ScoreEntry | undefined
  isAnalyzing?: boolean
  jobOffer?: JobOfferContext
  onScoreClick?: (applicationId: string) => void
  onViewProfile?: (candidateId: string) => void
  onViewDetail?: (applicationId: string) => void
  onMessage?: (candidateId: string) => void
  onSendOffer?: (applicant: Applicant) => void
  isSelected?: boolean
  selectionMode?: boolean
  onToggleSelection?: (id: string) => void
}

function ApplicantCard({
  applicant,
  getScore,
  getEvaluations,
  isAnalyzing: analyzing,
  jobOffer: _jobOffer,
  onScoreClick,
  onViewProfile,
  onViewDetail,
  onMessage,
  onSendOffer,
  isSelected,
  selectionMode,
  onToggleSelection,
}: ApplicantCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: applicant.id,
    data: { applicant, stage: applicant.stage },
    disabled: selectionMode || TERMINAL_STATUSES.has(applicant.stage),
  })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined

  const handleMenuPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
  }

  const scoreEntry = getScore ? getScore(applicant.id) : undefined
  const isOverdue = isHiringPlanOverdue(applicant.targetDate, applicant.stage)
  const stageAgeDays = getStageAgeDays(applicant.stageChangedAt)

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none border-border/50 py-3.5 transition-colors duration-150 relative",
        !TERMINAL_STATUSES.has(applicant.stage) && "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 border-primary/50",
        isOverdue && "border-destructive/60 bg-destructive/5",
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
              <DropdownMenuItem
                onSelect={() => onSendOffer?.(applicant)}
                disabled={TERMINAL_STATUSES.has(applicant.stage)}
                className="cursor-pointer"
              >
                <HugeiconsIcon icon={Mail01Icon} size={16} />
                Enviar carta de oferta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-start gap-3 pr-6">
          {/* Avatar / Selection Trigger */}
          <button
            type="button"
            aria-label={
              selectionMode
                ? `${isSelected ? "Quitar" : "Seleccionar"} a ${applicant.candidateName}`
                : `Ver perfil de ${applicant.candidateName}`
            }
            className="relative shrink-0 cursor-pointer group/avatar"
            onPointerDown={(e) => e.stopPropagation()}
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
          </button>

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
                    className="shrink-0 text-warning fill-warning"
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
                      onScoreClick?.(applicant.id)
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

            {getEvaluations && (
              <div className="mt-1 border-t border-border/20 pt-2">
                {getEvaluations(applicant.id) === null ? (
                  <p className="text-xs text-muted-foreground">Evaluación no disponible</p>
                ) : (
                  <EvaluationSummary evaluations={getEvaluations(applicant.id) ?? []} />
                )}
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
            {(applicant.assigneeId ||
              applicant.nextAction ||
              applicant.targetDate ||
              stageAgeDays !== null) && (
              <div
                className={cn(
                  "mt-1 space-y-0.5 text-[11px]",
                  isOverdue ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {applicant.assigneeId && (
                  <p>Responsable: {applicant.assigneeName ?? "Miembro no disponible"}</p>
                )}
                {applicant.nextAction && (
                  <p className="truncate">Próxima acción: {applicant.nextAction}</p>
                )}
                {applicant.targetDate && (
                  <p>
                    {isOverdue ? "Atrasada desde" : "Objetivo"}:{" "}
                    {formatDateChilean(new Date(`${applicant.targetDate}T12:00:00Z`), "d MMM")}
                  </p>
                )}
                {stageAgeDays !== null && <p>En etapa: {stageAgeDays} d</p>}
              </div>
            )}
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
  getEvaluations,
  isAnalyzing,
  onScoreClick,
  onViewProfile,
  onViewDetail,
  onMessage,
  onSendOffer,
  selectedIds,
  selectionMode,
  onToggleSelection,
}: {
  stage: PipelineBoardStage
  applicants: Applicant[]
  getEvaluations?: (applicationId: string) => Evaluation[] | null
  getScore?: (applicationId: string) => ScoreEntry | undefined
  isAnalyzing?: boolean
  jobOffer?: JobOfferContext
  onScoreClick?: (applicationId: string) => void
  onViewProfile?: (candidateId: string) => void
  onViewDetail?: (applicationId: string) => void
  onMessage?: (candidateId: string) => void
  onSendOffer?: (applicant: Applicant) => void
  selectedIds?: Set<string>
  selectionMode?: boolean
  onToggleSelection?: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id, disabled: stage.isArchived })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-w-[220px] max-w-[220px] lg:min-w-[250px] lg:max-w-[250px] flex-col rounded-xl border bg-muted/20 p-2.5 lg:p-3 transition-colors h-full max-h-full min-h-0 snap-start shrink-0 overflow-hidden",
        isOver && "border-primary/50 bg-primary/5",
        stage.isArchived && "border-dashed opacity-80"
      )}
    >
      <div className="mb-2 lg:mb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 lg:gap-2">
          <HugeiconsIcon
            icon={getStageIcon(stage.statusProjection)}
            size={16}
            strokeWidth={1.5}
            className="text-muted-foreground lg:size-5"
          />
          <span className="text-xs leading-4 font-medium text-foreground">{stage.name}</span>
        </div>
        {stage.isArchived && <span className="text-[10px] text-muted-foreground">Archivada</span>}
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
            getEvaluations={getEvaluations}
            isAnalyzing={isAnalyzing}
            onScoreClick={onScoreClick}
            onViewProfile={onViewProfile}
            onViewDetail={onViewDetail}
            onMessage={onMessage}
            onSendOffer={onSendOffer}
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

type StageChangeHandler = (applicationId: string, stageId: string) => boolean | Promise<boolean>

type StatusChangeHandler =
  | ((applicationId: string, stage: ApplicationStage, rejectionNote?: string) => void)
  | ((
      applicationId: string,
      stage: ApplicationStage,
      rejectionNote?: string
    ) => boolean | Promise<boolean>)

export function ApplicationsKanban({
  applicants: initialApplicants,
  stages: configuredStages,
  onStatusChange,
  onStageChange,
  onCreateEvent,
  getScore,
  getEvaluations,
  isAnalyzing,
  jobOffer,
  onScoreClick,
  onViewProfile,
  onViewDetail,
  onMessage,
  onSendOffer,
  selectionMode,
  selectedIds,
  onToggleSelection,
  onClearSelection: _onClearSelection,
}: {
  applicants: Applicant[]
  stages?: PipelineBoardStage[]
  onStatusChange?: StatusChangeHandler
  onStageChange?: StageChangeHandler
  /** Called when dragging to 'entrevista' or 'contratado' stages */
  onCreateEvent?: (applicant: Applicant, eventType: "interview" | "onboarding") => void
  /** Get score for a candidate */
  getEvaluations?: (applicationId: string) => Evaluation[] | null
  getScore?: (applicationId: string) => ScoreEntry | undefined
  isAnalyzing?: boolean
  jobOffer?: JobOfferContext
  onScoreClick?: (applicationId: string) => void
  onViewProfile?: (candidateId: string) => void
  onViewDetail?: (applicationId: string) => void
  onMessage?: (candidateId: string) => void
  onSendOffer?: (applicant: Applicant) => void
  selectionMode?: boolean
  selectedIds?: Set<string>
  onToggleSelection?: (id: string) => void
  onClearSelection?: () => void
}) {
  const [activeApplicant, setActiveApplicant] = useState<Applicant | null>(null)
  const stages = configuredStages ?? DEFAULT_STAGES

  const applicantsByStage = useMemo(
    () => groupApplicantsByPipelineStage(initialApplicants, stages),
    [initialApplicants, stages]
  )

  const handleDragStart = useCallback((event: DragEndEvent) => {
    const data = event.active.data.current as { applicant: Applicant } | undefined
    if (data?.applicant) {
      setActiveApplicant(data.applicant)
    }
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveApplicant(null)
      const { active, over } = event
      if (!over?.id || typeof over.id !== "string") return
      const data = active.data.current as { applicant: Applicant } | undefined
      if (!data?.applicant) return

      let targetStageId: string
      if (stages.some((stage) => stage.id === over.id)) {
        targetStageId = over.id
      } else {
        const targetApplicant = initialApplicants.find((a) => a.id === over.id)
        if (!targetApplicant) return
        const resolvedTargetId = resolveApplicantPipelineStageId(targetApplicant, stages)
        if (!resolvedTargetId) return
        targetStageId = resolvedTargetId
      }

      const targetStage = stages.find((stage) => stage.id === targetStageId)
      if (!targetStage || targetStage.isArchived) return
      if (targetStage.statusProjection === "rechazado") {
        toast.info("Usa la acción Rechazar para seleccionar el motivo.")
        return
      }

      const previousStageId = resolveApplicantPipelineStageId(data.applicant, stages)
      if (!previousStageId || previousStageId === targetStageId) return
      const previousStage = stages.find((stage) => stage.id === previousStageId)
      if (!previousStage) return

      const moveApplicant = (stage: PipelineBoardStage) =>
        onStageChange
          ? onStageChange(data.applicant.id, stage.id)
          : onStatusChange?.(data.applicant.id, stage.statusProjection)
      if (!onStageChange && !onStatusChange) return
      const result = await Result.tryPromise(() => Promise.resolve(moveApplicant(targetStage)))
      if (result.isErr() || result.value === false) {
        toast.error("No se pudo cambiar la etapa. Reintenta.")
        return
      }

      const stageLabel = targetStage.name
      toast.success(`Movido a ${stageLabel}`, {
        description: `${data.applicant.candidateName} -> ${stageLabel}`,
        action: previousStage.isArchived
          ? undefined
          : {
              label: "Deshacer",
              onClick: () => {
                void Promise.resolve(moveApplicant(previousStage)).then((saved) => {
                  if (saved === false) toast.error("No se pudo deshacer el cambio de etapa.")
                })
              },
            },
      })

      if (
        targetStage.statusProjection === "entrevista" ||
        targetStage.statusProjection === "contratado"
      ) {
        const eventType = targetStage.statusProjection === "entrevista" ? "interview" : "onboarding"
        onCreateEvent?.(data.applicant, eventType)
      }
    },
    [onStageChange, onStatusChange, onCreateEvent, initialApplicants, stages]
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
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            applicants={applicantsByStage.get(stage.id) ?? []}
            getScore={getScore}
            getEvaluations={getEvaluations}
            isAnalyzing={isAnalyzing}
            jobOffer={jobOffer}
            onScoreClick={onScoreClick}
            onViewProfile={onViewProfile}
            onViewDetail={onViewDetail}
            onMessage={onMessage}
            onSendOffer={onSendOffer}
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
