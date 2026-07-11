"use client"

import {
  BookmarkAdd01Icon,
  BookmarkCheck01Icon,
  Delete01Icon,
  LayoutGridIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { JobTemplate } from "@/lib/api/job-templates"
import {
  useCreateJobTemplateMutation,
  useDeleteJobTemplateMutation,
  useJobTemplates,
} from "@/lib/api/use-job-templates"

interface SaveTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string
  formData: {
    title: string
    description: string
    employmentType: string
    experienceLevel: string
    city: string
    country: string
    workMode: string
    salaryMin: string
    salaryMax: string
    isNegotiable: boolean
    benefits: Array<{ tipo: string; title: string }>
    requiredSkills: string[]
    minExperience: number
    category: string
  }
  onSaved?: () => void
}

export function SaveTemplateDialog({
  open,
  onOpenChange,
  organizationId,
  formData,
  onSaved,
}: SaveTemplateDialogProps) {
  const [name, setName] = useState("")
  const createMutation = useCreateJobTemplateMutation(organizationId)

  const handleSave = async () => {
    if (!name.trim()) return
    await createMutation.mutateAsync({
      name: name.trim(),
      title: formData.title,
      description: formData.description,
      employmentType: formData.employmentType || undefined,
      experienceLevel: formData.experienceLevel || undefined,
      salary:
        formData.isNegotiable || formData.salaryMin || formData.salaryMax
          ? {
              min: formData.salaryMin ? Number(formData.salaryMin) : undefined,
              max: formData.salaryMax ? Number(formData.salaryMax) : undefined,
              currency: "CLP",
              period: "monthly",
              isNegotiable: formData.isNegotiable,
            }
          : undefined,
      location: {
        city: formData.city || undefined,
        country: formData.country || undefined,
        isRemote: formData.workMode === "remote",
        isHybrid: formData.workMode === "hybrid",
      },
      benefits: formData.benefits.length > 0 ? formData.benefits : undefined,
      requiredSkills: formData.requiredSkills.length > 0 ? formData.requiredSkills : undefined,
      minExperience: formData.minExperience > 0 ? formData.minExperience : undefined,
      category: formData.category || undefined,
    })
    setName("")
    onOpenChange(false)
    onSaved?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Guardar como plantilla</DialogTitle>
          <DialogDescription>
            Guarda los campos actuales para reutilizarlos en futuras ofertas.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="template-name">Nombre de la plantilla</Label>
          <Input
            id="template-name"
            placeholder="ej: Desarrollador Backend Senior"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleSave()
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || createMutation.isPending}>
            {createMutation.isPending ? "Guardando…" : "Guardar plantilla"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface LoadTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string
  onLoad: (template: JobTemplate) => void
}

export function LoadTemplateDialog({
  open,
  onOpenChange,
  organizationId,
  onLoad,
}: LoadTemplateDialogProps) {
  const { data: templates = [], isLoading } = useJobTemplates(organizationId)
  const deleteMutation = useDeleteJobTemplateMutation(organizationId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cargar plantilla</DialogTitle>
          <DialogDescription>
            Selecciona una plantilla para pre-rellenar el formulario.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-64 overflow-y-auto py-1 space-y-1">
          {isLoading && (
            <p className="text-sm text-muted-foreground py-4 text-center">Cargando plantillas…</p>
          )}
          {!isLoading && templates.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No tienes plantillas guardadas.
            </p>
          )}
          {templates.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 hover:bg-accent/5 transition-colors"
            >
              <button
                type="button"
                className="flex-1 text-left"
                onClick={() => {
                  onLoad(t)
                  onOpenChange(false)
                }}
              >
                <p className="text-sm font-medium text-foreground line-clamp-1">{t.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{t.title}</p>
              </button>
              <button
                type="button"
                aria-label="Eliminar plantilla"
                className="shrink-0 p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                onClick={() => deleteMutation.mutate(t.id)}
                disabled={deleteMutation.isPending}
              >
                <HugeiconsIcon icon={Delete01Icon} size={15} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface TemplatePanelButtonsProps {
  organizationId: string
  formData: SaveTemplateDialogProps["formData"]
  onLoad: (template: JobTemplate) => void
}

export function TemplatePanelButtons({
  organizationId,
  formData,
  onLoad,
}: TemplatePanelButtonsProps) {
  const [saveOpen, setSaveOpen] = useState(false)
  const [loadOpen, setLoadOpen] = useState(false)

  return (
    <>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1.5"
          onClick={() => setLoadOpen(true)}
        >
          <HugeiconsIcon icon={LayoutGridIcon} size={13} strokeWidth={1.5} />
          Plantillas
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1.5"
          onClick={() => setSaveOpen(true)}
        >
          <HugeiconsIcon icon={BookmarkAdd01Icon} size={13} strokeWidth={1.5} />
          Guardar
        </Button>
      </div>

      <SaveTemplateDialog
        open={saveOpen}
        onOpenChange={setSaveOpen}
        organizationId={organizationId}
        formData={formData}
      />
      <LoadTemplateDialog
        open={loadOpen}
        onOpenChange={setLoadOpen}
        organizationId={organizationId}
        onLoad={onLoad}
      />
    </>
  )
}
