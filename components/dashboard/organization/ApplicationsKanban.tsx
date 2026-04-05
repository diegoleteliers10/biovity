"use client"

import {
  DndContext,
  type DragEndEvent,
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
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Applicant, ApplicationStage } from "@/lib/types/dashboard"
import { cn } from "@/lib/utils"

const STAGES: { id: ApplicationStage; label: string; icon: typeof File02Icon }[] = [
  { id: "pendiente", label: "Pendiente", icon: File02Icon },
  { id: "entrevista", label: "Entrevista", icon: Message01Icon },
  { id: "oferta", label: "Oferta", icon: Calendar04Icon },
  { id: "contratado", label: "Contratado", icon: CheckmarkCircle02Icon },
  { id: "rechazado", label: "Rechazado", icon: Cancel01Icon },
]

function ApplicantCard({ applicant }: { applicant: Applicant }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: applicant.id,
    data: { applicant, stage: applicant.stage },
  })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined

  const handleMenuPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab touch-none border-border/60 py-4 active:cursor-grabbing",
        isDragging && "opacity-50 shadow-lg"
      )}
      {...listeners}
      {...attributes}
    >
      <CardContent className="relative px-4 py-0">
        <div className="flex items-start justify-between gap-2 pr-6">
          <div className="min-w-0 flex-1">
            <p className="font-medium leading-tight">{applicant.candidateName}</p>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{applicant.position}</p>
            <p className="mt-1 text-xs text-muted-foreground">Aplicó: {applicant.dateApplied}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 size-7 text-muted-foreground hover:text-foreground"
              onPointerDown={handleMenuPointerDown}
              onClick={(e) => e.stopPropagation()}
              aria-label="Más opciones"
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
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
}: {
  stage: (typeof STAGES)[number]
  applicants: Applicant[]
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-w-[220px] max-w-[220px] flex-col rounded-lg border bg-muted/30 p-3 transition-colors max-h-full overflow-hidden",
        isOver && "border-primary/50 bg-primary/5"
      )}
    >
      <div className="mb-3 flex items-center gap-2 shrink-0">
        <HugeiconsIcon
          icon={stage.icon}
          size={20}
          strokeWidth={1.5}
          className="text-muted-foreground"
        />
        <span className="font-medium text-sm">{stage.label}</span>
        <span className="tabular-nums text-muted-foreground text-xs">({applicants.length})</span>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {applicants.map((a) => (
          <ApplicantCard key={a.id} applicant={a} />
        ))}
      </div>
    </div>
  )
}

export function ApplicationsKanban({
  applicants: initialApplicants,
  onStatusChange,
}: {
  applicants: Applicant[]
  onStatusChange?: (applicationId: string, newStage: ApplicationStage) => void | Promise<void>
}) {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants)

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

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over?.id || typeof over.id !== "string") return
      const data = active.data.current as { applicant: Applicant } | undefined
      if (!data?.applicant) return

      // Resolve target stage: over.id can be column id (stage) or applicant id (when dropped on a card)
      let targetStage: ApplicationStage
      if (STAGES.some((s) => s.id === over.id)) {
        targetStage = over.id as ApplicationStage
      } else {
        const targetApplicant = applicants.find((a) => a.id === over.id)
        if (!targetApplicant) return
        targetStage = targetApplicant.stage
      }

      if (data.applicant.stage === targetStage) return

      setApplicants((prev) =>
        prev.map((a) => (a.id === data.applicant.id ? { ...a, stage: targetStage } : a))
      )
      onStatusChange?.(data.applicant.id, targetStage)
    },
    [applicants, onStatusChange]
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ height: "100%" }}>
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            applicants={applicantsByStage.get(stage.id) ?? []}
          />
        ))}
      </div>
    </DndContext>
  )
}
