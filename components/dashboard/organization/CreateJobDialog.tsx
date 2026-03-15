"use client"

import { Edit01Icon, FileAddIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Job, JobBenefitInput } from "@/lib/api/jobs"
import { useCreateJobMutation, useUpdateJobMutation } from "@/lib/api/use-jobs"

const BENEFIT_OPTIONS: JobBenefitInput[] = [
  { tipo: "salud", label: "Seguro de salud y dental" },
  { tipo: "vacaciones", label: "Vacaciones pagadas" },
  { tipo: "formacion", label: "Presupuesto para formación" },
  { tipo: "equipo", label: "Equipo y trabajo híbrido" },
  { tipo: "bonos", label: "Bonos por desempeño" },
  { tipo: "horario", label: "Horario flexible" },
  { tipo: "teletrabajo", label: "Teletrabajo" },
  { tipo: "estacionamiento", label: "Estacionamiento" },
  { tipo: "gimnasio", label: "Gimnasio o wellness" },
  { tipo: "almuerzo", label: "Almuerzo o colación" },
  { tipo: "transporte", label: "Bono transporte" },
  { tipo: "otro", label: "Otros beneficios" },
]

const EMPLOYMENT_TYPES = [
  { value: "Full-time", label: "Tiempo completo" },
  { value: "Part-time", label: "Medio tiempo" },
  { value: "Contrato", label: "Contrato" },
  { value: "Practica", label: "Práctica" },
] as const

const EXPERIENCE_LEVELS = [
  { value: "Entrante", label: "Entrante" },
  { value: "Junior", label: "Junior" },
  { value: "Mid-Senior", label: "Semi Senior" },
  { value: "Senior", label: "Senior" },
  { value: "Ejecutivo", label: "Ejecutivo" },
] as const

type CreateJobDialogProps = {
  organizationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  /** When provided, dialog opens in edit mode with this job's data */
  job?: Job | null
}

export function CreateJobDialog({ organizationId, open, onOpenChange, job }: CreateJobDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [employmentType, setEmploymentType] = useState<string>("")
  const [experienceLevel, setExperienceLevel] = useState<string>("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [isRemote, setIsRemote] = useState(false)
  const [salaryMin, setSalaryMin] = useState("")
  const [salaryMax, setSalaryMax] = useState("")
  const [benefits, setBenefits] = useState<JobBenefitInput[]>([])
  const benefitsAnchorRef = useComboboxAnchor()

  const createMutation = useCreateJobMutation(organizationId)
  const updateMutation = useUpdateJobMutation(organizationId)
  const isEdit = Boolean(job?.id)

  const resetForm = useCallback(() => {
    setTitle("")
    setDescription("")
    setEmploymentType("")
    setExperienceLevel("")
    setCity("")
    setCountry("")
    setIsRemote(false)
    setSalaryMin("")
    setSalaryMax("")
    setBenefits([])
  }, [])

  useEffect(() => {
    if (!open) return
    if (job) {
      setTitle(job.title)
      setDescription(job.description)
      setEmploymentType(job.employmentType)
      setExperienceLevel(job.experienceLevel)
      setCity(job.location?.city ?? "")
      setCountry(job.location?.country ?? "")
      setIsRemote(job.location?.isRemote ?? false)
      setSalaryMin(job.salary?.min != null ? String(job.salary.min) : "")
      setSalaryMax(job.salary?.max != null ? String(job.salary.max) : "")
      setBenefits(
        (job.benefits as { tipo?: string; title?: string }[] | undefined)
          ?.map(
            (b): JobBenefitInput =>
              b.tipo && b.title
                ? { tipo: b.tipo, label: b.title }
                : { tipo: "otro", label: b.title ?? "Otro" }
          )
          .filter((b) => b.label) ?? []
      )
    } else {
      resetForm()
    }
  }, [open, job, resetForm])

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) resetForm()
      onOpenChange(next)
    },
    [onOpenChange, resetForm]
  )

  const payload = {
    title: title.trim(),
    description: description.trim(),
    employmentType,
    experienceLevel,
    status: "active",
    location: {
      city: city.trim() || undefined,
      country: country.trim() || undefined,
      isRemote,
      isHybrid: false,
    },
    salary:
      salaryMin || salaryMax
        ? {
            min: salaryMin ? Number(salaryMin) : undefined,
            max: salaryMax ? Number(salaryMax) : undefined,
            currency: "CLP",
            period: "monthly",
            isNegotiable: false,
          }
        : undefined,
    benefits: benefits.length > 0 ? benefits : undefined,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !employmentType || !experienceLevel) return

    if (isEdit && job) {
      updateMutation.mutate(
        { id: job.id, input: payload },
        {
          onSuccess: () => {
            handleOpenChange(false)
          },
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          handleOpenChange(false)
        },
      })
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const canSubmit = title.trim() && description.trim() && employmentType && experienceLevel

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={isEdit ? Edit01Icon : FileAddIcon} size={20} />
            {isEdit ? "Editar oferta" : "Crear oferta"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifica los datos y guarda para actualizar la vacante."
              : "Completa los datos para publicar una nueva vacante."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="job-title">Título *</FieldLabel>
            <Input
              id="job-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Desarrollador Full Stack Senior"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="job-description">Descripción *</FieldLabel>
            <Textarea
              id="job-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el puesto, requisitos y responsabilidades..."
              rows={5}
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Tipo de contrato *</FieldLabel>
              <Select value={employmentType} onValueChange={setEmploymentType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Nivel de experiencia *</FieldLabel>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel>Ubicación</FieldLabel>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRemote}
                  onChange={(e) => setIsRemote(e.target.checked)}
                  className="rounded border-input"
                />
                <span className="text-sm">Trabajo remoto</span>
              </label>
              {!isRemote && (
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ciudad"
                  />
                  <Input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="País"
                  />
                </div>
              )}
            </div>
          </Field>

          <Field>
            <FieldLabel>Salario (opcional)</FieldLabel>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="Mín"
                min={0}
              />
              <span className="text-muted-foreground">—</span>
              <Input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="Máx"
                min={0}
              />
              <span className="text-muted-foreground text-xs shrink-0">CLP/mes</span>
            </div>
          </Field>

          <Field>
            <FieldLabel>Beneficios</FieldLabel>
            <Combobox
              multiple
              value={benefits}
              onValueChange={(v) => setBenefits((v as JobBenefitInput[]) ?? [])}
              items={BENEFIT_OPTIONS}
              isItemEqualToValue={(a, b) => a.tipo === b.tipo && a.label === b.label}
            >
              <ComboboxChips ref={benefitsAnchorRef} className="w-full">
                <ComboboxValue>
                  {(values: JobBenefitInput[]) => (
                    <>
                      {values.map((v) => (
                        <ComboboxChip key={v.tipo}>{v.label}</ComboboxChip>
                      ))}
                      <ComboboxChipsInput placeholder="Seleccionar beneficios..." />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={benefitsAnchorRef} className="w-(--anchor-width)">
                <ComboboxList>
                  {BENEFIT_OPTIONS.map((opt) => (
                    <ComboboxItem key={opt.tipo} value={opt}>
                      {opt.label}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
                <ComboboxEmpty>Sin resultados</ComboboxEmpty>
              </ComboboxContent>
            </Combobox>
          </Field>

          {(createMutation.isError || updateMutation.isError) && (
            <p className="text-destructive text-sm">
              {(createMutation.error ?? updateMutation.error)?.message}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? "Guardando..."
                  : "Creando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Crear oferta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
