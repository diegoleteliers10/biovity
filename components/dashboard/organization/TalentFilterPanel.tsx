"use client"

import { Cancel01Icon, FilterIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TalentFilters } from "@/lib/api/use-talent"

const EXPERIENCE_LEVELS = [
  { value: "junior", label: "Junior (0-2 años)" },
  { value: "mid", label: "Mid-level (2-5 años)" },
  { value: "senior", label: "Senior (5+ años)" },
  { value: "lead", label: "Lead" },
  { value: "manager", label: "Manager" },
]

const AVAILABILITY_OPTIONS = [
  { value: "immediate", label: "Disponible ahora" },
  { value: "2weeks", label: "En 2 semanas" },
  { value: "1month", label: "En 1 mes" },
  { value: "open", label: "Abierto a ofertas" },
]

interface TalentFilterPanelProps {
  filters: TalentFilters
  onFiltersChange: (filters: Partial<TalentFilters>) => void
  onReset: () => void
}

export function TalentFilterPanel({ filters, onFiltersChange, onReset }: TalentFilterPanelProps) {
  const [open, setOpen] = useState(false)
  const [localSkills, setLocalSkills] = useState(filters.skills ?? "")

  const activeCount = [
    filters.profession,
    filters.city,
    filters.country,
    filters.experienceLevel,
    filters.availability,
    filters.skills,
    filters.minExp,
    filters.maxExp,
  ].filter(Boolean).length

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-2 relative" id="talent-filter-btn">
            <HugeiconsIcon icon={FilterIcon} size={14} strokeWidth={1.5} />
            Filtros
            {activeCount > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 h-5 min-w-5 px-1 text-[10px] font-bold"
              >
                {activeCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start" side="bottom">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filtros avanzados</h3>
            {activeCount > 0 && (
              <button
                type="button"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                onClick={() => {
                  setLocalSkills("")
                  onReset()
                }}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={12} />
                Limpiar
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Profesión / Rol</Label>
              <Input
                id="filter-profession"
                placeholder="ej: Desarrollador, Diseñador..."
                className="h-8 text-sm"
                value={filters.profession ?? ""}
                onChange={(e) => onFiltersChange({ profession: e.target.value || undefined })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Ciudad</Label>
                <Input
                  id="filter-city"
                  placeholder="Santiago..."
                  className="h-8 text-sm"
                  value={filters.city ?? ""}
                  onChange={(e) => onFiltersChange({ city: e.target.value || undefined })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">País</Label>
                <Input
                  id="filter-country"
                  placeholder="Chile..."
                  className="h-8 text-sm"
                  value={filters.country ?? ""}
                  onChange={(e) => onFiltersChange({ country: e.target.value || undefined })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Nivel de experiencia</Label>
              <Select
                value={filters.experienceLevel ?? ""}
                onValueChange={(v) => onFiltersChange({ experienceLevel: v || undefined })}
              >
                <SelectTrigger id="filter-exp-level" className="h-8 text-sm">
                  <SelectValue placeholder="Cualquier nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Cualquier nivel</SelectItem>
                  {EXPERIENCE_LEVELS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Disponibilidad</Label>
              <Select
                value={filters.availability ?? ""}
                onValueChange={(v) => onFiltersChange({ availability: v || undefined })}
              >
                <SelectTrigger id="filter-availability" className="h-8 text-sm">
                  <SelectValue placeholder="Cualquier disponibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Cualquier disponibilidad</SelectItem>
                  {AVAILABILITY_OPTIONS.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Habilidades (separadas por coma)</Label>
              <Input
                id="filter-skills"
                placeholder="React, TypeScript, Node.js..."
                className="h-8 text-sm"
                value={localSkills}
                onChange={(e) => setLocalSkills(e.target.value)}
                onBlur={() => onFiltersChange({ skills: localSkills.trim() || undefined })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onFiltersChange({ skills: localSkills.trim() || undefined })
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Exp. mínima (años)</Label>
                <Input
                  id="filter-min-exp"
                  type="number"
                  min={0}
                  max={30}
                  className="h-8 text-sm"
                  value={filters.minExp || ""}
                  onChange={(e) =>
                    onFiltersChange({ minExp: e.target.value ? Number(e.target.value) : undefined })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Exp. máxima (años)</Label>
                <Input
                  id="filter-max-exp"
                  type="number"
                  min={0}
                  max={30}
                  className="h-8 text-sm"
                  value={filters.maxExp || ""}
                  onChange={(e) =>
                    onFiltersChange({ maxExp: e.target.value ? Number(e.target.value) : undefined })
                  }
                />
              </div>
            </div>

            <Button className="w-full h-8 text-sm" onClick={() => setOpen(false)}>
              Aplicar filtros
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {filters.profession && (
            <FilterChip
              label={`Profesión: ${filters.profession}`}
              onRemove={() => onFiltersChange({ profession: undefined })}
            />
          )}
          {filters.city && (
            <FilterChip
              label={`Ciudad: ${filters.city}`}
              onRemove={() => onFiltersChange({ city: undefined })}
            />
          )}
          {filters.country && (
            <FilterChip
              label={`País: ${filters.country}`}
              onRemove={() => onFiltersChange({ country: undefined })}
            />
          )}
          {filters.experienceLevel && (
            <FilterChip
              label={
                EXPERIENCE_LEVELS.find((l) => l.value === filters.experienceLevel)?.label ??
                filters.experienceLevel
              }
              onRemove={() => onFiltersChange({ experienceLevel: undefined })}
            />
          )}
          {filters.availability && (
            <FilterChip
              label={
                AVAILABILITY_OPTIONS.find((a) => a.value === filters.availability)?.label ??
                filters.availability
              }
              onRemove={() => onFiltersChange({ availability: undefined })}
            />
          )}
          {filters.skills && (
            <FilterChip
              label={`Skills: ${filters.skills}`}
              onRemove={() => {
                setLocalSkills("")
                onFiltersChange({ skills: undefined })
              }}
            />
          )}
          {(filters.minExp || filters.maxExp) && (
            <FilterChip
              label={`Exp: ${filters.minExp ?? 0}–${filters.maxExp ?? "∞"} años`}
              onRemove={() => onFiltersChange({ minExp: undefined, maxExp: undefined })}
            />
          )}
        </div>
      )}
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-secondary/10 border border-secondary/20 px-2 py-0.5 text-xs text-secondary font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-destructive transition-colors"
        aria-label={`Quitar filtro ${label}`}
      >
        <HugeiconsIcon icon={Cancel01Icon} size={10} />
      </button>
    </span>
  )
}
