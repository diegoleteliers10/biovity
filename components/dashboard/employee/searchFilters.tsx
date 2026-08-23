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
    <Card className="rounded-xl border-border/50 bg-surface-container-lowest shadow-none">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle>Buscador y filtros</CardTitle>
          <Button
            variant="ghost"
            onClick={onClear}
            className="h-9 rounded-md px-3 text-muted-foreground hover:text-foreground"
          >
            Limpiar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 rounded-lg border border-border/40 bg-surface-container-low p-3 lg:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Título, empresa o palabra clave"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                aria-label="Buscar por palabra clave"
                className="pl-8"
              />
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                strokeWidth={1.5}
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
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
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{
                duration: 0.15,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="mt-3 rounded-lg border border-border/40 bg-surface-container-lowest p-3 shadow-none"
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

                <label className="flex h-7 cursor-pointer select-none items-center justify-between gap-3 rounded-md border border-border/40 bg-surface-container-lowest px-2.5 transition-colors duration-150 hover:bg-surface-container-highest/40 has-[:checked]:border-primary/30">
                  <span className="truncate text-xs leading-4 font-medium text-foreground">
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
