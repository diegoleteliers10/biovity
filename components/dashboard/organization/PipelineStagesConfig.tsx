"use client"

import {
  AddCircleIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Delete03Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  type PipelineStage,
  useCreatePipelineStageMutation,
  useDeletePipelineStageMutation,
  usePipelineStages,
  useUpdatePipelineStageMutation,
} from "@/lib/api/use-pipeline-stages"

type PipelineStagesConfigProps = {
  jobId: string
}

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
]

export function PipelineStagesConfig({ jobId }: PipelineStagesConfigProps) {
  const [open, setOpen] = useState(false)
  const { data: stages = [], isLoading } = usePipelineStages(jobId)
  const createMutation = useCreatePipelineStageMutation(jobId)
  const updateMutation = useUpdatePipelineStageMutation(jobId)
  const deleteMutation = useDeletePipelineStageMutation(jobId)

  const [newName, setNewName] = useState("")
  const [newColor, setNewColor] = useState(COLORS[0])

  const handleAdd = useCallback(() => {
    if (!newName.trim()) return
    const maxOrder = stages.reduce((max, s) => Math.max(max, s.order), 0)
    createMutation.mutate(
      { name: newName.trim(), color: newColor, order: maxOrder + 1 },
      {
        onSuccess: () => {
          setNewName("")
          setNewColor(COLORS[0])
          toast.success("Etapa agregada")
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }, [newName, newColor, stages, createMutation])

  const handleMoveUp = useCallback(
    (stage: PipelineStage) => {
      const sorted = [...stages].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex((s) => s.id === stage.id)
      if (idx <= 0) return
      const prev = sorted[idx - 1]
      updateMutation.mutate({ id: stage.id, data: { order: prev.order } })
      updateMutation.mutate({ id: prev.id, data: { order: stage.order } })
    },
    [stages, updateMutation]
  )

  const handleMoveDown = useCallback(
    (stage: PipelineStage) => {
      const sorted = [...stages].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex((s) => s.id === stage.id)
      if (idx === -1 || idx >= sorted.length - 1) return
      const next = sorted[idx + 1]
      updateMutation.mutate({ id: stage.id, data: { order: next.order } })
      updateMutation.mutate({ id: next.id, data: { order: stage.order } })
    },
    [stages, updateMutation]
  )

  const handleDelete = useCallback(
    (stage: PipelineStage) => {
      if (stages.length <= 2) {
        toast.error("Debe haber al menos 2 etapas")
        return
      }
      deleteMutation.mutate(stage.id, {
        onSuccess: () => toast.success(`Etapa "${stage.name}" eliminada`),
        onError: (err) => toast.error(err.message),
      })
    },
    [stages.length, deleteMutation]
  )

  const handleColorChange = useCallback(
    (stage: PipelineStage, color: string) => {
      updateMutation.mutate({ id: stage.id, data: { color } })
    },
    [updateMutation]
  )

  const handleNameChange = useCallback(
    (stage: PipelineStage, name: string) => {
      updateMutation.mutate({ id: stage.id, data: { name } })
    },
    [updateMutation]
  )

  const sorted = [...stages].sort((a, b) => a.order - b.order)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HugeiconsIcon icon={Settings02Icon} size={14} className="mr-1" />
          Configurar etapas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Etapas del Pipeline</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">Cargando etapas...</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sorted.map((stage, index) => (
              <div
                key={stage.id}
                className="flex items-center gap-2 rounded-lg border border-border p-3"
              >
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(stage)}
                    disabled={index === 0}
                    className="size-4 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Subir"
                  >
                    <HugeiconsIcon icon={ArrowUp01Icon} size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(stage)}
                    disabled={index === sorted.length - 1}
                    className="size-4 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Bajar"
                  >
                    <HugeiconsIcon icon={ArrowDown01Icon} size={12} />
                  </button>
                </div>

                <div
                  className="size-6 shrink-0 rounded-full border"
                  style={{ backgroundColor: stage.color }}
                />

                <div className="flex flex-wrap gap-1">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleColorChange(stage, c)}
                      className={`size-4 rounded-full border transition-transform hover:scale-110 ${stage.color === c ? "ring-2 ring-offset-1 ring-foreground" : ""}`}
                      style={{ backgroundColor: c }}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>

                <Input
                  value={stage.name}
                  onChange={(e) => handleNameChange(stage, e.target.value)}
                  className="h-7 flex-1 text-sm"
                />

                <button
                  type="button"
                  onClick={() => handleDelete(stage)}
                  className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  aria-label="Eliminar etapa"
                >
                  <HugeiconsIcon icon={Delete03Icon} size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border p-3">
          <div
            className="size-6 shrink-0 rounded-full border"
            style={{ backgroundColor: newColor }}
          />
          <div className="flex flex-wrap gap-1">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNewColor(c)}
                className={`size-4 rounded-full border transition-transform hover:scale-110 ${newColor === c ? "ring-2 ring-offset-1 ring-foreground" : ""}`}
                style={{ backgroundColor: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre nueva etapa"
            className="h-7 flex-1 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd()
            }}
          />
          <Button
            size="xs"
            onClick={handleAdd}
            disabled={!newName.trim() || createMutation.isPending}
          >
            <HugeiconsIcon icon={AddCircleIcon} size={12} className="mr-1" />
            Agregar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
