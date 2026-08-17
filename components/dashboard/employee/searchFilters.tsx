"use client"

import {
  AirplaneLanding01Icon,
  FilterHorizontalIcon,
  GraduationScrollIcon,
  HeartAddIcon,
  LaptopIcon,
  LibraryIcon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence } from "motion/react"
import * as m from "motion/react-m"
import { useCallback } from "react"
import { Select } from "@/components/base/select/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

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

export function getBeneficioIcon(benefit: { title: string }): IconSvgElement | null {
  const t = benefit.title.toLowerCase()
  if (/salud|médico|medico|dental|seguro/.test(t)) return HeartAddIcon
  if (/vacacion|vacation/.test(t)) return AirplaneLanding01Icon
  if (/formación|formacion|capacitación|aprendizaje|learning/.test(t)) return GraduationScrollIcon
  if (/equipo|laptop|remoto|equipment|teletrabajo/.test(t)) return LaptopIcon
  return LibraryIcon
}

interface SearchFiltersProps {
  query: string
  location: string
  jobType: string
  experience: string
  remoteOnly: boolean
  showAdvanced: boolean
  onQueryChange: (q: string) => void
  onLocationChange: (location: string) => void
  onJobTypeChange: (jobType: string) => void
  onExperienceChange: (experience: string) => void
  onRemoteOnlyChange: (remoteOnly: boolean) => void
  onShowAdvancedChange: (show: boolean) => void
  onClear: () => void
}

export function SearchFilters({
  query,
  location,
  jobType,
  experience,
  remoteOnly,
  showAdvanced,
  onQueryChange,
  onLocationChange,
  onJobTypeChange,
  onExperienceChange,
  onRemoteOnlyChange,
  onShowAdvancedChange,
  onClear,
}: SearchFiltersProps) {
  const handleSearch = useCallback(() => {}, [])

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Buscador y filtros</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Refina tu búsqueda por palabra clave, ubicación y preferencias.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={onClear}
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
                onChange={(e) => onQueryChange(e.target.value)}
                aria-label="Buscar por palabra clave"
                className="bg-white"
              />
              <HugeiconsIcon
                icon={Search01Icon}
                size={24}
                strokeWidth={1.5}
                className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
            </div>
          </div>
          <div className="flex-1">
            <Input
              placeholder="Ubicación (ciudad, país o remoto)"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              aria-label="Filtrar por ubicación"
              className="bg-white"
            />
          </div>
          <div className="flex items-stretch gap-2">
            <Button onClick={handleSearch} aria-label="Buscar" className="px-5">
              <HugeiconsIcon icon={Search01Icon} size={24} strokeWidth={1.5} className="size-4" />
              Buscar
            </Button>
            <Button
              variant="outline"
              className="px-4"
              aria-label="Mostrar filtros avanzados"
              aria-expanded={showAdvanced}
              onClick={() => onShowAdvancedChange(!showAdvanced)}
            >
              <HugeiconsIcon
                icon={FilterHorizontalIcon}
                size={24}
                strokeWidth={1.5}
                className="size-4"
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
                  onSelectionChange={(key) => onJobTypeChange(String(key))}
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
                  onSelectionChange={(key) => onExperienceChange(String(key))}
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

                <label className="flex h-7 cursor-pointer select-none items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/20 px-2.5 transition-colors hover:bg-muted/40 has-[:checked]:border-primary/30">
                  <span className="truncate text-[13px] leading-4 font-medium text-foreground">
                    Solo remoto
                  </span>
                  <input
                    type="checkbox"
                    checked={remoteOnly}
                    onChange={(e) => onRemoteOnlyChange(e.target.checked)}
                    aria-label="Solo remoto"
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden
                    className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input bg-background transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring/30"
                  >
                    {remoteOnly && (
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        strokeWidth={2}
                        className="size-3 text-primary-foreground"
                      />
                    )}
                  </span>
                </label>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
