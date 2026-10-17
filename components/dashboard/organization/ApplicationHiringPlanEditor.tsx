"use client"

import { Result } from "better-result"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { OrganizationMember } from "@/lib/api/organization-members"
import { useUpdateApplicationHiringPlanMutation } from "@/lib/api/use-applications"

type HiringPlan = {
  assigneeId: string
  nextAction: string
  targetDate: string
}

export function ApplicationHiringPlanEditor({
  applicationId,
  jobId,
  assigneeId,
  nextAction,
  targetDate,
  members,
}: {
  applicationId: string
  jobId: string
  assigneeId?: string | null
  nextAction?: string | null
  targetDate?: string | null
  members: OrganizationMember[]
}) {
  const initial = {
    assigneeId: assigneeId ?? "",
    nextAction: nextAction ?? "",
    targetDate: targetDate ?? "",
  }
  const [savedPlan, setSavedPlan] = useState<HiringPlan>(initial)
  const [draft, setDraft] = useState<HiringPlan>(initial)
  const mutation = useUpdateApplicationHiringPlanMutation(jobId)
  const operators = members.filter(
    (member) => member.role === "admin" || member.role === "recruiter"
  )
  const currentAssigneeIsMissing =
    Boolean(draft.assigneeId) && !operators.some((member) => member.userId === draft.assigneeId)
  const isDirty =
    draft.assigneeId !== savedPlan.assigneeId ||
    draft.nextAction !== savedPlan.nextAction ||
    draft.targetDate !== savedPlan.targetDate

  async function save() {
    if (!isDirty || mutation.isPending) return
    const update: {
      id: string
      assigneeId?: string | null
      nextAction?: string | null
      targetDate?: string | null
    } = { id: applicationId }
    if (draft.assigneeId !== savedPlan.assigneeId) update.assigneeId = draft.assigneeId || null
    if (draft.nextAction !== savedPlan.nextAction)
      update.nextAction = draft.nextAction.trim() || null
    if (draft.targetDate !== savedPlan.targetDate) update.targetDate = draft.targetDate || null

    const result = await Result.tryPromise(() => mutation.mutateAsync(update))
    if (result.isErr()) {
      toast.error("No se pudo guardar el plan de seguimiento. Reintenta.")
      return
    }
    setSavedPlan(draft)
    toast.success("Plan de seguimiento guardado")
  }

  return (
    <section className="space-y-3 rounded-xl bg-surface-container-low p-4">
      <h3 className="text-xs font-medium">Plan de seguimiento</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-xs text-muted-foreground">
          Responsable
          <select
            value={draft.assigneeId}
            onChange={(event) =>
              setDraft((current) => ({ ...current, assigneeId: event.target.value }))
            }
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            disabled={mutation.isPending}
          >
            <option value="">Sin responsable</option>
            {currentAssigneeIsMissing && (
              <option value={draft.assigneeId} disabled>
                Responsable anterior no disponible
              </option>
            )}
            {operators.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.user?.name ?? member.user?.email ?? "Miembro"}
              </option>
            ))}
          </select>
        </label>
        <div className="space-y-1 text-xs text-muted-foreground sm:col-span-2">
          <label htmlFor="application-next-action">Próxima acción</label>
          <Input
            id="application-next-action"
            value={draft.nextAction}
            onChange={(event) =>
              setDraft((current) => ({ ...current, nextAction: event.target.value }))
            }
            maxLength={500}
            placeholder="Ej. Coordinar entrevista técnica"
            disabled={mutation.isPending}
          />
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <label htmlFor="application-target-date">Fecha objetivo</label>
          <Input
            id="application-target-date"
            type="date"
            value={draft.targetDate}
            onChange={(event) =>
              setDraft((current) => ({ ...current, targetDate: event.target.value }))
            }
            disabled={mutation.isPending}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => void save()} disabled={!isDirty || mutation.isPending}>
          {mutation.isPending ? "Guardando..." : "Guardar plan"}
        </Button>
      </div>
    </section>
  )
}
