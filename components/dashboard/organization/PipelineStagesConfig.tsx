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
import { useDashboardSession } from "@/components/dashboard/DashboardSessionContext"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type PipelineStage,
  useCreatePipelineStageMutation,
  useCreateRejectionReasonMutation,
  useDeletePipelineStageMutation,
  usePipelineStageRubric,
  usePipelineStages,
  useRejectionReasons,
  useReorderPipelineStagesMutation,
  useSavePipelineStageRubricMutation,
  useUpdatePipelineStageMutation,
  useUpdateRejectionReasonMutation,
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

const STATUS_PROJECTIONS: { value: PipelineStage["statusProjection"]; label: string }[] = [
  { value: "pendiente", label: "Pendiente · activa" },
  { value: "entrevista", label: "Entrevista · activa" },
  { value: "oferta", label: "Oferta · activa" },
  { value: "contratado", label: "Contratada · cierra" },
  { value: "rechazado", label: "Rechazada · cierra" },
  { value: "desistido", label: "Desistida · cierra" },
]

export function PipelineStagesConfig({ jobId }: PipelineStagesConfigProps) {
  const session = useDashboardSession()
  const organizationId = session?.user?.organizationId ?? ""
  const [open, setOpen] = useState(false)
  const { data: stages = [], isLoading } = usePipelineStages(jobId)
  const createMutation = useCreatePipelineStageMutation(jobId)
  const updateMutation = useUpdatePipelineStageMutation(jobId)
  const reorderMutation = useReorderPipelineStagesMutation(jobId)
  const deleteMutation = useDeletePipelineStageMutation(jobId)
  const { data: rejectionReasons = [], isLoading: reasonsLoading } =
    useRejectionReasons(organizationId)
  const createReasonMutation = useCreateRejectionReasonMutation(organizationId)
  const updateReasonMutation = useUpdateRejectionReasonMutation(organizationId)

  const [newName, setNewName] = useState("")
  const [newColor, setNewColor] = useState(COLORS[0])
  const [newStatusProjection, setNewStatusProjection] =
    useState<PipelineStage["statusProjection"]>("pendiente")
  const [newRejectionReason, setNewRejectionReason] = useState("")
  const sorted = [...stages].sort((a, b) => a.order - b.order)
  const activeStages = sorted.filter((stage) => !stage.isArchived)

  const handleAdd = useCallback(() => {
    if (!newName.trim()) return
    const maxOrder = stages.reduce((max, s) => Math.max(max, s.order), 0)
    createMutation.mutate(
      {
        name: newName.trim(),
        color: newColor,
        order: maxOrder + 1,
        statusProjection: newStatusProjection,
      },
      {
        onSuccess: () => {
          setNewName("")
          setNewColor(COLORS[0])
          setNewStatusProjection("pendiente")
          toast.success("Etapa agregada")
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }, [newName, newColor, newStatusProjection, stages, createMutation])

  const handleAddRejectionReason = useCallback(() => {
    if (!newRejectionReason.trim()) return
    createReasonMutation.mutate(newRejectionReason.trim(), {
      onSuccess: () => {
        setNewRejectionReason("")
        toast.success("Motivo de rechazo agregado")
      },
      onError: (error) => toast.error(error.message),
    })
  }, [createReasonMutation, newRejectionReason])

  const handleMoveUp = useCallback(
    (stage: PipelineStage) => {
      const reordered = [...activeStages]
      const idx = reordered.findIndex((s) => s.id === stage.id)
      if (idx <= 0) return
      ;[reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]]
      reorderMutation.mutate(
        reordered.map((item) => item.id),
        { onError: (error) => toast.error(error.message) }
      )
    },
    [activeStages, reorderMutation]
  )

  const handleMoveDown = useCallback(
    (stage: PipelineStage) => {
      const reordered = [...activeStages]
      const idx = reordered.findIndex((s) => s.id === stage.id)
      if (idx === -1 || idx >= reordered.length - 1) return
      ;[reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]]
      reorderMutation.mutate(
        reordered.map((item) => item.id),
        { onError: (error) => toast.error(error.message) }
      )
    },
    [activeStages, reorderMutation]
  )

  const handleDelete = useCallback(
    (stage: PipelineStage) => {
      if (stage.isArchived || stage.systemKey) return
      if (activeStages.length <= 2) {
        toast.error("Debe haber al menos 2 etapas")
        return
      }
      deleteMutation.mutate(stage.id, {
        onSuccess: () => toast.success(`Etapa "${stage.name}" eliminada`),
        onError: (err) => toast.error(err.message),
      })
    },
    [activeStages.length, deleteMutation]
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
            {sorted.map((stage) => {
              const activeIndex = activeStages.findIndex((item) => item.id === stage.id)
              const isFixed = stage.systemKey !== null
              return (
                <div key={stage.id} className="space-y-2">
                  <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(stage)}
                        disabled={stage.isArchived || activeIndex <= 0 || reorderMutation.isPending}
                        className="size-4 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                        aria-label="Subir"
                      >
                        <HugeiconsIcon icon={ArrowUp01Icon} size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(stage)}
                        disabled={
                          stage.isArchived ||
                          activeIndex === activeStages.length - 1 ||
                          reorderMutation.isPending
                        }
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
                          disabled={stage.isArchived || isFixed}
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
                      disabled={stage.isArchived || isFixed}
                    />

                    <span className="shrink-0 text-xs text-muted-foreground">
                      {
                        STATUS_PROJECTIONS.find((status) => status.value === stage.statusProjection)
                          ?.label
                      }
                    </span>

                    {stage.isArchived && (
                      <span className="text-xs text-muted-foreground">Archivada</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(stage)}
                      disabled={stage.isArchived || isFixed || activeStages.length <= 2}
                      className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      aria-label="Eliminar etapa"
                    >
                      <HugeiconsIcon icon={Delete03Icon} size={14} />
                    </button>
                  </div>
                  {!stage.isArchived && (
                    <details className="rounded-lg border border-border/40 px-3 py-2">
                      <summary className="cursor-pointer text-xs font-medium text-foreground">
                        Rúbrica de entrevista
                      </summary>
                      <PipelineStageRubricEditor stageId={stage.id} />
                    </details>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border p-3">
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
          <Select
            value={newStatusProjection}
            onValueChange={(value) => {
              const selected = STATUS_PROJECTIONS.find((status) => status.value === value)
              if (selected) setNewStatusProjection(selected.value)
            }}
          >
            <SelectTrigger className="h-9 w-[180px]" aria-label="Resultado de la etapa">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_PROJECTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="xs"
            onClick={handleAdd}
            disabled={!newName.trim() || createMutation.isPending}
          >
            <HugeiconsIcon icon={AddCircleIcon} size={12} className="mr-1" />
            Agregar
          </Button>
        </div>
        <section className="space-y-2 border-t border-border pt-3">
          <h3 className="text-xs font-medium">Motivos de rechazo</h3>
          {reasonsLoading ? (
            <p className="text-xs text-muted-foreground">Cargando motivos...</p>
          ) : rejectionReasons.length ? (
            <div className="max-h-36 space-y-2 overflow-y-auto">
              {rejectionReasons.map((reason) => (
                <div key={reason.id} className="flex items-center gap-2">
                  <Input
                    key={`${reason.id}-${reason.updatedAt}`}
                    defaultValue={reason.label}
                    maxLength={120}
                    className="h-8 flex-1 text-xs"
                    disabled={!reason.active || updateReasonMutation.isPending}
                    aria-label={`Editar motivo ${reason.label}`}
                    onBlur={(event) => {
                      const label = event.currentTarget.value.trim()
                      if (label && label !== reason.label) {
                        updateReasonMutation.mutate(
                          { id: reason.id, label },
                          { onError: (error) => toast.error(error.message) }
                        )
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    disabled={updateReasonMutation.isPending}
                    onClick={() =>
                      updateReasonMutation.mutate(
                        { id: reason.id, active: !reason.active },
                        { onError: (error) => toast.error(error.message) }
                      )
                    }
                  >
                    {reason.active ? "Desactivar" : "Reactivar"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Agrega el primer motivo.</p>
          )}
          <div className="flex items-center gap-2">
            <Input
              value={newRejectionReason}
              onChange={(event) => setNewRejectionReason(event.target.value)}
              maxLength={120}
              placeholder="Ej. No cumple requisitos técnicos"
              className="h-8 flex-1 text-xs"
              onKeyDown={(event) => {
                if (event.key === "Enter") handleAddRejectionReason()
              }}
            />
            <Button
              type="button"
              size="xs"
              onClick={handleAddRejectionReason}
              disabled={!newRejectionReason.trim() || createReasonMutation.isPending}
            >
              Agregar
            </Button>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  )
}

type RubricDraftCriterion = {
  id?: string
  draftKey: string
  label: string
  description: string
  roleIds: string[]
}

type RubricDraftRole = {
  id: string
  draftKey: string
  label: string
}

type RubricDraft = {
  roles: RubricDraftRole[]
  criteria: RubricDraftCriterion[]
}

function PipelineStageRubricEditor({ stageId }: { stageId: string }) {
  const query = usePipelineStageRubric(stageId)
  const saveMutation = useSavePipelineStageRubricMutation(stageId)
  const [draft, setDraft] = useState<RubricDraft | undefined>()
  const roles =
    draft?.roles ?? query.data?.roles.map((role) => ({ ...role, draftKey: role.id })) ?? []
  const criteria =
    draft?.criteria ??
    query.data?.criteria.map((criterion) => ({
      id: criterion.id,
      draftKey: criterion.id,
      label: criterion.label,
      description: criterion.description ?? "",
      roleIds: criterion.roleIds,
    })) ??
    []

  const updateCriterion = (draftKey: string, update: Partial<RubricDraftCriterion>) => {
    setDraft((current) => ({
      roles: current?.roles ?? roles,
      criteria: (current?.criteria ?? criteria).map((criterion) =>
        criterion.draftKey === draftKey ? { ...criterion, ...update } : criterion
      ),
    }))
  }

  const updateDraft = (update: Partial<RubricDraft>) => {
    setDraft((current) => ({ ...current, roles, criteria, ...update }))
  }

  const handleSave = () => {
    if (
      roles.some((role) => !role.label.trim()) ||
      criteria.some((criterion) => !criterion.label.trim())
    )
      return
    saveMutation.mutate(
      {
        roles: roles.map(({ id, label }) => ({ id, label: label.trim() })),
        criteria: criteria.map(({ id, label, description, roleIds }) => ({
          ...(id ? { id } : {}),
          label: label.trim(),
          ...(description.trim() ? { description: description.trim() } : {}),
          roleIds,
        })),
      },
      {
        onSuccess: (saved) => {
          setDraft({
            roles: saved.roles.map((role) => ({ ...role, draftKey: role.id })),
            criteria: saved.criteria.map((criterion) => ({
              id: criterion.id,
              draftKey: criterion.id,
              label: criterion.label,
              description: criterion.description ?? "",
              roleIds: criterion.roleIds,
            })),
          })
          toast.success("Rúbrica guardada")
        },
      }
    )
  }

  if (query.isLoading) {
    return <p className="pt-2 text-xs text-muted-foreground">Cargando rúbrica...</p>
  }
  if (query.isError || !query.data) {
    return <p className="pt-2 text-xs text-destructive">No se pudo cargar la rúbrica.</p>
  }

  return (
    <div className="space-y-2 pt-3">
      <fieldset className="space-y-2 rounded-md border border-border/40 p-2">
        <legend className="px-1 text-xs font-medium">Funciones de entrevista</legend>
        {roles.map((role) => (
          <div key={role.draftKey} className="flex items-center gap-2 text-xs">
            <Input
              value={role.label}
              maxLength={80}
              onChange={(event) =>
                updateDraft({
                  roles: roles.map((item) =>
                    item.draftKey === role.draftKey
                      ? { ...item, label: event.currentTarget.value }
                      : item
                  ),
                })
              }
              aria-label="Nombre de la función"
              disabled={role.id === "00000000-0000-4000-8000-000000000001"}
            />
            {role.id !== "00000000-0000-4000-8000-000000000001" && (
              <Button
                type="button"
                size="xs"
                variant="ghost"
                onClick={() =>
                  updateDraft({
                    roles: roles.filter((item) => item.draftKey !== role.draftKey),
                    criteria: criteria.map((criterion) => ({
                      ...criterion,
                      roleIds: criterion.roleIds.filter((id) => id !== role.id),
                    })),
                  })
                }
              >
                Quitar función
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          size="xs"
          variant="outline"
          onClick={() =>
            updateDraft({
              roles: [
                ...roles,
                { id: crypto.randomUUID(), draftKey: crypto.randomUUID(), label: "" },
              ],
            })
          }
        >
          Agregar función
        </Button>
      </fieldset>
      {criteria.length === 0 ? (
        <p className="text-xs text-muted-foreground">Esta etapa no tiene criterios.</p>
      ) : (
        criteria.map((criterion, index) => (
          <div
            key={criterion.draftKey}
            className="space-y-1 rounded-md border border-border/40 p-2"
          >
            <label
              htmlFor={`rubric-label-${criterion.draftKey}`}
              className="block space-y-1 text-xs"
            >
              <span>Criterio {index + 1}</span>
              <Input
                id={`rubric-label-${criterion.draftKey}`}
                value={criterion.label}
                maxLength={120}
                onChange={(event) =>
                  updateCriterion(criterion.draftKey, { label: event.currentTarget.value })
                }
                aria-label={`Nombre del criterio ${index + 1}`}
              />
            </label>
            <label
              htmlFor={`rubric-description-${criterion.draftKey}`}
              className="block space-y-1 text-xs"
            >
              <span>Descripción opcional</span>
              <textarea
                id={`rubric-description-${criterion.draftKey}`}
                className="min-h-14 w-full rounded-md border border-border/40 bg-background p-2"
                value={criterion.description}
                maxLength={1000}
                onChange={(event) =>
                  updateCriterion(criterion.draftKey, { description: event.currentTarget.value })
                }
                aria-label={`Descripción del criterio ${index + 1}`}
              />
            </label>
            <fieldset className="space-y-1 text-xs">
              <legend>Aplica a</legend>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={criterion.roleIds.length === 0}
                  onChange={() => updateCriterion(criterion.draftKey, { roleIds: [] })}
                  className="accent-primary"
                />
                Todas las funciones
              </label>
              {roles.map((role) => (
                <label key={role.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={criterion.roleIds.includes(role.id)}
                    onChange={(event) =>
                      updateCriterion(criterion.draftKey, {
                        roleIds: event.target.checked
                          ? [...criterion.roleIds, role.id]
                          : criterion.roleIds.filter((id) => id !== role.id),
                      })
                    }
                    className="accent-primary"
                  />
                  {role.label}
                </label>
              ))}
            </fieldset>
            <Button
              type="button"
              size="xs"
              variant="ghost"
              onClick={() =>
                updateDraft({
                  criteria: criteria.filter((item) => item.draftKey !== criterion.draftKey),
                })
              }
            >
              Quitar criterio
            </Button>
          </div>
        ))
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="xs"
          variant="outline"
          onClick={() =>
            updateDraft({
              criteria: [
                ...criteria,
                {
                  draftKey: crypto.randomUUID(),
                  label: "",
                  description: "",
                  roleIds: [],
                },
              ],
            })
          }
        >
          Agregar criterio
        </Button>
        <Button
          type="button"
          size="xs"
          onClick={handleSave}
          disabled={
            saveMutation.isPending ||
            roles.some((role) => !role.label.trim()) ||
            criteria.some((criterion) => !criterion.label.trim())
          }
        >
          {saveMutation.isPending ? "Guardando..." : "Guardar rúbrica"}
        </Button>
      </div>
      {saveMutation.isError && (
        <p className="text-xs text-destructive">No se pudo guardar la rúbrica.</p>
      )}
      {query.data.current_version_id && (
        <p className="text-xs text-muted-foreground">Versión {query.data.version}</p>
      )}
    </div>
  )
}
