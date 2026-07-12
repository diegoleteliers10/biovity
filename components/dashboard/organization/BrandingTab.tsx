"use client"

import {
  Cancel01Icon,
  FloppyDiskIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useOrganization, useUpdateOrganizationMutation } from "@/lib/api/use-organization"

type BrandingTabProps = {
  organizationId: string
}

const INDUSTRY_OPTIONS = [
  "Biotecnología",
  "Bioquímica",
  "Química",
  "Farmacéutica",
  "Salud",
  "Ingeniería Química",
  "Agroindustria",
  "Alimentos y Bebidas",
  "Cosmética",
  "Medio Ambiente",
  "Investigación",
  "Educación",
  "Otros",
]

const SIZE_OPTIONS = [
  "1-10 empleados",
  "11-50 empleados",
  "51-200 empleados",
  "201-500 empleados",
  "501-1000 empleados",
  "1000+ empleados",
]

export function BrandingTab({ organizationId }: BrandingTabProps) {
  const { data: org, isLoading, isError } = useOrganization(organizationId)
  const updateMutation = useUpdateOrganizationMutation(organizationId)

  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    description: "",
    industry: "",
    size: "",
    logo: "",
  })

  const startEditing = useCallback(() => {
    if (org) {
      setForm({
        description: org.description ?? "",
        industry: org.industry ?? "",
        size: org.size ?? "",
        logo: org.logo ?? "",
      })
    }
    setIsEditing(true)
  }, [org])

  const handleSave = useCallback(async () => {
    await updateMutation.mutateAsync({
      description: form.description || undefined,
      industry: form.industry || undefined,
      size: form.size || undefined,
      logo: form.logo || undefined,
    })
    setIsEditing(false)
  }, [form, updateMutation])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (isError || !org) {
    return (
      <p className="text-sm text-muted-foreground">
        Error al cargar datos de la organización.
      </p>
    )
  }

  return (
    <div className="space-y-5">
      {isEditing ? (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Descripción</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe tu empresa..."
                rows={4}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Industria</label>
              <Select
                value={form.industry}
                onValueChange={(v) => setForm((p) => ({ ...p, industry: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona industria" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Tamaño de la empresa
                </label>
              <Select value={form.size} onValueChange={(v) => setForm((p) => ({ ...p, size: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona rango" />
                </SelectTrigger>
                <SelectContent>
                  {SIZE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <HugeiconsIcon icon={Cancel01Icon} size={16} /> Cancelar
              </Button>
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
                {updateMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Industria
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {org.industry ?? "No especificada"}
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Tamaño
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {org.size ?? "No especificado"}
                </p>
              </div>
            </div>
            {org.description && (
              <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Descripción
                </p>
                <p className="mt-1 text-sm text-pretty text-foreground">{org.description}</p>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={startEditing}>
              Editar branding
            </Button>
          </>
        )}
    </div>
  )
}
