"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetHeader } from "@/components/animate-ui/components/radix/sheet"
import { ConfirmDialog } from "@/components/dashboard/admin/ConfirmDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { AdminUser } from "@/lib/types/admin"
import { formatFechaRelativa } from "@/lib/utils"

interface UserDetailSheetProps {
  user: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdated: () => void
}

const TYPE_OPTIONS = [
  { value: "professional", label: "Profesional" },
  { value: "organization", label: "Organizacion" },
  { value: "admin", label: "Admin" },
]

export function UserDetailSheet({ user, open, onOpenChange, onUserUpdated }: UserDetailSheetProps) {
  const [name, setName] = useState(() => user?.name ?? "")
  const [type, setType] = useState(() => user?.type ?? "professional")
  const [saving, setSaving] = useState(false)
  const [confirmAdmin, setConfirmAdmin] = useState(false)
  const [confirmDiscard, setConfirmDiscard] = useState(false)

  const hasChanges = name !== (user?.name ?? "") || type !== (user?.type ?? "professional")
  const isEscalatingToAdmin = type === "admin" && user?.type !== "admin"

  const executeSave = useCallback(async () => {
    if (!user) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        toast.error((data as { error?: string })?.error ?? "Error al guardar")
        return
      }
      toast.success("Usuario actualizado")
      onUserUpdated()
      onOpenChange(false)
    } catch {
      toast.error("Error al guardar cambios")
    } finally {
      setSaving(false)
    }
  }, [user, name, type, onUserUpdated, onOpenChange])

  const handleSave = useCallback(() => {
    if (isEscalatingToAdmin) {
      setConfirmAdmin(true)
      return
    }
    executeSave()
  }, [isEscalatingToAdmin, executeSave])

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next && hasChanges) {
        setConfirmDiscard(true)
        return
      }
      onOpenChange(next)
    },
    [hasChanges, onOpenChange]
  )

  if (!user) return null

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md z-[120] flex flex-col">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary">
                {user.name?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold truncate">{user.name || "Sin nombre"}</h2>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Informacion
              </h3>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Email</label>
                <p className="text-sm">{user.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Estado</label>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Registrado</label>
                  <p className="text-sm">{formatFechaRelativa(user.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Editar
              </h3>

              <div className="space-y-1.5">
                <label htmlFor="edit-name" className="text-xs text-muted-foreground">
                  Nombre
                </label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={200}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="edit-type" className="text-xs text-muted-foreground">
                  Tipo de usuario
                </label>
                <select
                  id="edit-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/60 px-4 py-3">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={confirmAdmin}
        onOpenChange={(o) => setConfirmAdmin(o)}
        onConfirm={() => {
          setConfirmAdmin(false)
          executeSave()
        }}
        isPending={saving}
        title="Otorgar permisos de admin"
        description="Este usuario tendra acceso completo al panel de administracion. Confirma que deseas continuar."
        confirmLabel="Confirmar admin"
      />

      <ConfirmDialog
        open={confirmDiscard}
        onOpenChange={(o) => setConfirmDiscard(o)}
        onConfirm={() => {
          setConfirmDiscard(false)
          onOpenChange(false)
        }}
        isPending={false}
        title="Descartar cambios"
        description="Tienes cambios sin guardar. Se perderan si cierras sin guardar."
        confirmLabel="Descartar"
      />
    </>
  )
}
