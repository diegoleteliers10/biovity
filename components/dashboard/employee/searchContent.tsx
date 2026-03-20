"use client"

import {
  AirplaneLanding01Icon,
  Bookmark02Icon,
  Cash02Icon,
  Clock01Icon,
  FilterHorizontalIcon,
  GraduationScrollIcon,
  HeartAddIcon,
  LaptopIcon,
  LibraryIcon,
  Location05Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence } from "motion/react"
import * as m from "motion/react-m"
import { useRouter } from "next/navigation"
import { useQueryStates } from "nuqs"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Select } from "@/components/base/select/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { formatJobLocation, type Job, type JobBenefit } from "@/lib/api/jobs"
import { useJobsSearch } from "@/lib/api/use-jobs"
import { employeeSearchParsers } from "@/lib/parsers/employee-search"
import {
  formatFechaRelativa,
  formatSalarioRango,
  getFormatoBadgeColor,
  getModalidadBadgeColor,
} from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { useRemoveSavedJobMutation, useSavedJobsByUser, useSaveJobMutation } from "@/lib/api/use-saved-jobs"

function getJobModalidad(job: Job): string {
  const loc = job.location
  if (!loc) return "presencial"
  if (loc.isRemote) return "remoto"
  if (loc.isHybrid) return "hibrido"
  return "presencial"
}

function getBeneficioIcon(benefit: JobBenefit): IconSvgElement | null {
  const t = benefit.title.toLowerCase()
  if (/salud|médico|medico|dental|seguro/.test(t)) return HeartAddIcon
  if (/vacacion|vacation/.test(t)) return AirplaneLanding01Icon
  if (/formación|formacion|capacitación|aprendizaje|learning/.test(t)) return GraduationScrollIcon
  if (/equipo|laptop|remoto|equipment|teletrabajo/.test(t)) return LaptopIcon
  return LibraryIcon
}

const JOB_TYPES = [
  { id: "any", label: "Cualquier tipo" },
  { id: "Full-time", label: "Tiempo completo" },
  { id: "Part-time", label: "Medio tiempo" },
  { id: "Contrato", label: "Contrato" },
  { id: "Practica", label: "Prácticas" },
]

const EXPERIENCE_LEVELS = [
  { id: "any", label: "Cualquier nivel" },
  { id: "Entrante", label: "Entrante" },
  { id: "Junior", label: "Junior" },
  { id: "Mid-Senior", label: "Semi Senior" },
  { id: "Senior", label: "Senior" },
  { id: "Ejecutivo", label: "Ejecutivo" },
]

export const SearchContent = () => {
  const router = useRouter()
  const [urlState, setUrlState] = useQueryStates(employeeSearchParsers, {
    history: "push",
    shallow: false,
  })
  const { q: query, location, jobType, experience, remoteOnly } = urlState
  const [showAdvanced, setShowAdvanced] = useState(false)

  const { data: jobs, isLoading, error } = useJobsSearch(query.trim() || undefined)

  const filteredJobs = useMemo(() => {
    if (!jobs) return []
    let result = jobs

    const normalizedLocation = location.trim().toLowerCase()
    if (normalizedLocation) {
      result = result.filter((job) => {
        const loc = formatJobLocation(job.location).toLowerCase()
        return loc.includes(normalizedLocation)
      })
    }
    if (remoteOnly) {
      result = result.filter((job) => job.location?.isRemote)
    }
    if (jobType !== "any") {
      result = result.filter((job) => job.employmentType === jobType)
    }
    if (experience !== "any") {
      result = result.filter((job) => job.experienceLevel === experience)
    }
    return result
  }, [jobs, location, remoteOnly, jobType, experience])

  const handleSearch = useCallback(() => {}, [])

  const { useSession } = authClient
  const { data: session } = useSession()
  const userId = (session?.user as { id?: string })?.id ?? ""

  const { data: savedJobs, isLoading: savedJobsLoading } = useSavedJobsByUser(userId, {
    page: 1,
    limit: 200,
  })
  const [optimisticSavedMap, setOptimisticSavedMap] = useState<Record<string, boolean>>({})

  const savedJobIds = useMemo(() => {
    return new Set((savedJobs?.data ?? []).map((j) => j.jobId))
  }, [savedJobs])

  const isJobSaved = useCallback(
    (jobId: string) => {
      const optimisticValue = optimisticSavedMap[jobId]
      if (typeof optimisticValue === "boolean") return optimisticValue
      return savedJobIds.has(jobId)
    },
    [optimisticSavedMap, savedJobIds]
  )

  const saveMutation = useSaveJobMutation()
  const removeMutation = useRemoveSavedJobMutation()

  useEffect(() => {
    setOptimisticSavedMap((prev) => {
      const next: Record<string, boolean> = { ...prev }
      let changed = false
      for (const [jobId, optimisticValue] of Object.entries(prev)) {
        if (savedJobIds.has(jobId) === optimisticValue) {
          delete next[jobId]
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [savedJobIds])

  const handleClear = useCallback(() => {
    setUrlState({
      q: "",
      location: "",
      jobType: "any",
      experience: "any",
      remoteOnly: false,
    })
  }, [setUrlState])

  const handleSave = useCallback(
    (jobId: string) => {
      if (!userId) return

      const currentlySaved = isJobSaved(jobId)
      const nextSaved = !currentlySaved

      setOptimisticSavedMap((prev) => ({ ...prev, [jobId]: nextSaved }))

      if (currentlySaved) {
        removeMutation.mutate(
          { userId, jobId },
          {
            onError: () => {
              setOptimisticSavedMap((prev) => ({ ...prev, [jobId]: currentlySaved }))
            },
          }
        )
      } else {
        saveMutation.mutate(
          { userId, jobId },
          {
            onError: () => {
              setOptimisticSavedMap((prev) => ({ ...prev, [jobId]: currentlySaved }))
            },
          }
        )
      }
    },
    [isJobSaved, removeMutation, saveMutation, userId]
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-wide">Buscar Empleos</h1>
          <p className="text-muted-foreground text-sm">
            Encuentra oportunidades acorde a tus preferencias.
          </p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Buscador y filtros</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Refina tu búsqueda por palabra clave, ubicación y preferencias.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-muted-foreground hover:text-primary-foreground"
            >
              Limpiar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 lg:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Título, empresa o palabra clave"
                  value={query}
                  onChange={(e) => setUrlState({ q: e.target.value })}
                  aria-label="Buscar por palabra clave"
                />
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={24}
                  strokeWidth={1.5}
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
              </div>
            </div>
            <div className="flex-1">
              <Input
                placeholder="Ubicación (ciudad, país o remoto)"
                value={location}
                onChange={(e) => setUrlState({ location: e.target.value })}
                aria-label="Filtrar por ubicación"
              />
            </div>
            <div className="flex items-stretch gap-2">
              <Button onClick={handleSearch} aria-label="Buscar" className="px-5">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={24}
                  strokeWidth={1.5}
                  className="h-4 w-4"
                />
                Buscar
              </Button>
              <Button
                variant="outline"
                className="px-4"
                aria-label="Mostrar filtros avanzados"
                aria-expanded={showAdvanced}
                onClick={() => setShowAdvanced((v) => !v)}
              >
                <HugeiconsIcon
                  icon={FilterHorizontalIcon}
                  size={24}
                  strokeWidth={1.5}
                  className="h-4 w-4"
                />
              </Button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {showAdvanced && (
              <m.div
                key="advanced-filters"
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: -6,
                  scale: 0.97,
                  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                  opacity: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                  y: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
                  scale: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
                }}
                className="mt-4 rounded-lg border border-border/60 bg-card p-3"
              >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <Select
                    selectedKey={jobType}
                    onSelectionChange={(key) => setUrlState({ jobType: String(key) })}
                    items={JOB_TYPES}
                    placeholder="Tipo de empleo"
                    aria-label="Tipo de empleo"
                    size="md"
                  >
                    {(item) => (
                      <Select.Item id={item.id} textValue={item.label}>
                        {item.label}
                      </Select.Item>
                    )}
                  </Select>

                  <Select
                    selectedKey={experience}
                    onSelectionChange={(key) => setUrlState({ experience: String(key) })}
                    items={EXPERIENCE_LEVELS}
                    placeholder="Experiencia"
                    aria-label="Experiencia"
                    size="md"
                  >
                    {(item) => (
                      <Select.Item id={item.id} textValue={item.label}>
                        {item.label}
                      </Select.Item>
                    )}
                  </Select>

                  <div className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 px-3 py-2">
                    <span className="text-muted-foreground text-sm">Solo remoto</span>
                    <Checkbox
                      aria-label="Solo remoto"
                      checked={remoteOnly}
                      onChange={(e) => setUrlState({ remoteOnly: e.currentTarget.checked })}
                    />
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {isLoading ? "Cargando..." : `${filteredJobs.length} resultados`}
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-destructive text-sm">{error.message}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => {
            const salaryStr =
              job.salary?.min != null && job.salary?.max != null
                ? formatSalarioRango(job.salary.min, job.salary.max)
                : job.salary?.isNegotiable
                  ? "A convenir"
                  : "—"
            const locationStr = formatJobLocation(job.location) || "Sin especificar"
            const postedStr = job.createdAt ? formatFechaRelativa(new Date(job.createdAt)) : "—"
            const modalidad = getJobModalidad(job)
            const employmentTypeKey = job.employmentType.toLowerCase()
            const isSaved = isJobSaved(job.id)

            return (
              <Card
                key={job.id}
                onClick={() => router.push(`/dashboard/job/${job.id}`)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/30 bg-muted/20 transition-colors duration-200 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    router.push(`/dashboard/job/${job.id}`)
                  }
                }}
                aria-label={`Ver detalles de ${job.title}`}
              >
                <CardContent className="px-6 py-3">
                  <div className="flex flex-col gap-1.5">
                    {/* Header: Título y Fecha */}
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-xl flex-1 font-bold text-foreground tracking-tight">
                        {job.title}
                      </h2>
                      <div className="flex shrink-0 items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/90">
                          <HugeiconsIcon
                            icon={Clock01Icon}
                            size={16}
                            className="shrink-0 text-muted-foreground/80"
                          />
                          <span>{postedStr}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-md hover:bg-primary/10"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleSave(job.id)
                          }}
                          aria-label={isSaved ? `Quitar ${job.title} de guardados` : `Guardar ${job.title}`}
                          aria-pressed={isSaved}
                          disabled={!userId || saveMutation.isPending || removeMutation.isPending}
                        >
                          <HugeiconsIcon
                            icon={Bookmark02Icon}
                            size={24}
                            strokeWidth={1.5}
                            className={`h-4 w-4 ${isSaved ? "fill-current text-primary" : ""}`}
                          />
                        </Button>
                      </div>
                    </div>

                    {/* Segunda fila: Empresa | Ubicación, Beneficios, Salario */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <div className="flex min-w-0 shrink-0 items-center gap-2 text-sm text-muted-foreground/90">
                        <span className="truncate">{job.organization?.name ?? "Organización"}</span>
                        <span className="shrink-0 text-muted-foreground/60">|</span>
                        <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground/90">
                          <HugeiconsIcon
                            icon={Location05Icon}
                            size={18}
                            className="shrink-0 text-muted-foreground/80"
                          />
                          <span className="truncate">{locationStr}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-0 sm:shrink-0">
                        {job.benefits && job.benefits.length > 0 && (
                          <div className="flex items-center gap-2 sm:mr-5">
                            {job.benefits.map((beneficio) => {
                              const icon = getBeneficioIcon(beneficio)
                              if (!icon) return null
                              return (
                                <div
                                  key={beneficio.title}
                                  className="text-muted-foreground/90"
                                  title={beneficio.description ?? beneficio.title}
                                >
                                  <HugeiconsIcon
                                    icon={icon}
                                    size={16}
                                    className="text-muted-foreground/80"
                                  />
                                </div>
                              )
                            })}
                          </div>
                        )}

                        <div className="mt-1.5 flex min-w-0 items-center gap-1.5 font-semibold text-foreground text-sm sm:mt-0">
                          <HugeiconsIcon
                            icon={Cash02Icon}
                            size={18}
                            className="shrink-0 text-secondary"
                          />
                          <span className="min-w-0 break-words">{salaryStr}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tercera fila: Modalidad y Formato */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:mt-0">
                      <Badge className="shrink-0 border border-border/40 bg-muted/30 text-foreground/90 capitalize">
                        {modalidad === "hibrido" ? "Híbrido" : modalidad}
                      </Badge>
                      <Badge className="shrink-0 border border-border/40 bg-card text-muted-foreground capitalize">
                        {job.employmentType === "Full-time"
                          ? "Full Time"
                          : job.employmentType === "Part-time"
                            ? "Part Time"
                            : job.employmentType}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchContent
