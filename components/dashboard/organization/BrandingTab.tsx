"use client"

import { Upload01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  useOrganization,
  useUpdateOrganizationMutation,
  useUploadOrganizationLogoMutation,
} from "@/lib/api/use-organization"
import { FieldLabel } from "./SettingsUi"

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

function LogoTile({ logo, name }: { logo: string | null; name: string }) {
  if (logo) {
    return (
      <div className="grid size-[72px] shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-container-highest">
        <Image
          src={logo}
          alt={name}
          width={72}
          height={72}
          className="size-full object-cover"
          unoptimized
        />
      </div>
    )
  }
  return (
    <div className="grid size-[72px] shrink-0 place-items-center rounded-xl bg-primary text-3xl font-semibold text-primary-foreground">
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export function BrandingTab({ organizationId }: BrandingTabProps) {
  const { data: org, isLoading, isError } = useOrganization(organizationId)
  const updateMutation = useUpdateOrganizationMutation(organizationId)
  const uploadLogoMutation = useUploadOrganizationLogoMutation(organizationId)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleLogoChange = useCallback(
    (file: File) => {
      uploadLogoMutation.mutate(file, {
        onSuccess: (updatedOrg) => {
          setForm((prev) => ({ ...prev, logo: updatedOrg.logo ?? prev.logo }))
        },
      })
    },
    [uploadLogoMutation]
  )

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
    return <div className="h-40 animate-pulse rounded-xl bg-surface-container-highest/60" />
  }

  if (isError || !org) {
    return (
      <p className="text-sm text-muted-foreground">Error al cargar datos de la organización.</p>
    )
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-5">
          <LogoTile logo={form.logo || null} name={org.name} />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadLogoMutation.isPending}
            className="h-9 rounded-md px-3"
          >
            <HugeiconsIcon icon={Upload01Icon} size={15} strokeWidth={1.8} aria-hidden />
            {uploadLogoMutation.isPending ? "Subiendo..." : "Cambiar logo"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleLogoChange(file)
              e.target.value = ""
            }}
          />
          {uploadLogoMutation.isError && (
            <p className="text-sm text-destructive">
              {uploadLogoMutation.error?.message ?? "Error al subir el logo"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="brand-description">Descripción</FieldLabel>
          <Textarea
            id="brand-description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Describe tu empresa..."
            rows={4}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel htmlFor="brand-industry">Industria</FieldLabel>
            <Select
              value={form.industry}
              onValueChange={(v) => setForm((p) => ({ ...p, industry: v }))}
            >
              <SelectTrigger id="brand-industry" className="h-9 w-full">
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
          <div className="space-y-2">
            <FieldLabel htmlFor="brand-size">Tamaño de la empresa</FieldLabel>
            <Select value={form.size} onValueChange={(v) => setForm((p) => ({ ...p, size: v }))}>
              <SelectTrigger id="brand-size" className="h-9 w-full">
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
        </div>

        <div className="flex justify-end gap-2.5">
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            className="h-9 rounded-md px-3"
          >
            Cancelar
          </Button>
          <Button
            variant="secondary"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="h-9 rounded-md px-3"
          >
            {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-5">
        <LogoTile logo={org.logo} name={org.name} />
        <Button variant="secondary" onClick={startEditing} className="h-9 rounded-md px-3">
          Editar branding
        </Button>
      </div>

      <p className="max-w-[62ch] text-base leading-7 text-foreground text-pretty">
        {org.description || "Sin descripción."}
      </p>

      <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-xs leading-4 font-medium text-muted-foreground">Industria</p>
          <p className="mt-1 text-sm leading-6 text-foreground">
            {org.industry ?? "No especificada"}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-xs leading-4 font-medium text-muted-foreground">Tamaño</p>
          <p className="mt-1 text-sm leading-6 text-foreground">{org.size ?? "No especificado"}</p>
        </div>
      </div>
    </div>
  )
}
