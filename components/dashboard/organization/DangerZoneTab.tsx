"use client"

import { Building06Icon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  useOrganizationMembers,
  useTransferOwnershipMutation,
} from "@/lib/api/use-organization-members"
import { useDashboardSession } from "../DashboardSessionContext"

type DangerZoneTabProps = {
  organizationId: string
}

export function DangerZoneTab({ organizationId }: DangerZoneTabProps) {
  const session = useDashboardSession()
  const currentUserId = session?.user?.id

  const { data: members = [] } = useOrganizationMembers(organizationId)
  const transferMutation = useTransferOwnershipMutation(organizationId)

  const [transferTargetId, setTransferTargetId] = useState("")
  const [confirmDelete, setConfirmDelete] = useState("")

  const handleTransfer = useCallback(async () => {
    if (!transferTargetId) return
    if (!confirm("Seguro de transferir ownership? Esta accion no se puede revertir.")) return
    try {
      await transferMutation.mutateAsync(transferTargetId)
      setTransferTargetId("")
    } catch {
      // error handled by mutation
    }
  }, [transferTargetId, transferMutation])

  const otherMembers = members.filter((m) => m.userId !== currentUserId)

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 space-y-4 shadow-none">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <HugeiconsIcon icon={UserIcon} size={20} />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-sm text-foreground">Transferir ownership</p>
            <p className="text-xs text-muted-foreground text-pretty">
              Transfiere la propiedad de la organización a otro miembro. El miembro seleccionado
              será promovido a Admin.
            </p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0 space-y-1.5">
            <label
              htmlFor="transfer-owner"
              className="block text-xs leading-4 font-medium text-muted-foreground"
            >
              Seleccionar nuevo owner
            </label>
            <select
              id="transfer-owner"
              value={transferTargetId}
              onChange={(e) => setTransferTargetId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-input/20 px-2.5 text-[13px] leading-4 outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <option value="">Seleccionar miembro...</option>
              {otherMembers.map((m) => (
                <option key={m.id} value={m.userId}>
                  {m.user?.name ?? m.user?.email ?? "Unknown"}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <span aria-hidden className="invisible block text-xs leading-4 font-medium">
              Transferir
            </span>
            <Button
              variant="destructive"
              onClick={handleTransfer}
              disabled={!transferTargetId || transferMutation.isPending}
              className="h-9 w-full rounded-md px-3 sm:w-auto"
            >
              {transferMutation.isPending ? "Transfiriendo..." : "Transferir"}
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 space-y-4 shadow-none">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <HugeiconsIcon icon={Building06Icon} size={20} />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-sm text-foreground">Eliminar organización</p>
            <p className="text-xs text-muted-foreground text-pretty">
              Elimina permanentemente la organización y todos sus datos. Esta acción no se puede
              deshacer.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Escribe <strong>ELIMINAR</strong> para confirmar.
          </p>
          <div className="flex items-center gap-2">
            <Input
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder="ELIMINAR"
              className="h-9 max-w-[200px]"
            />
            <Button
              variant="destructive"
              disabled={confirmDelete !== "ELIMINAR"}
              onClick={() => {
                if (confirm("Seguro de eliminar la organizacion?")) {
                  window.location.href = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/v1/organizations/${organizationId}`
                }
              }}
              className="h-9 rounded-md px-3"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
