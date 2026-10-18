"use client"

import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EditableCard } from "./EditableCard"
import { EMPTY_PLACEHOLDER, emptySkill, LEVEL_OPTIONS, useProfileContext } from "./profile-context"

const seniorityLabels = {
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
  lead: "Lead",
  manager: "Manager",
} as const

const availabilityLabels = {
  immediate: "Disponible ahora",
  "2weeks": "En 2 semanas",
  "1month": "En 1 mes",
  open: "Abierto a ofertas",
} as const

export function PersonalForm() {
  const {
    isEditing,
    formData,
    profileData,
    resumeFormData,
    handleResumeArrayChange,
    handleInputChange,
  } = useProfileContext()

  const data = isEditing ? formData : profileData

  return (
    <EditableCard>
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="profile-bio" className="text-xs leading-4 font-medium text-foreground">
            Biografía
          </label>
          {isEditing ? (
            <textarea
              id="profile-bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="w-full min-h-[96px] rounded-lg border border-border/40 bg-surface-container-low px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none resize-none"
              placeholder="Cuéntanos sobre ti..."
            />
          ) : (
            <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
              {data.bio || EMPTY_PLACEHOLDER}
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="profile-experience-level"
              className="text-xs leading-4 font-medium text-foreground"
            >
              Nivel profesional
            </label>
            {isEditing ? (
              <Select
                value={formData.experienceLevel || "__unspecified"}
                onValueChange={(value) =>
                  handleInputChange("experienceLevel", value === "__unspecified" ? "" : value)
                }
              >
                <SelectTrigger
                  id="profile-experience-level"
                  className="h-9 w-full rounded-lg bg-surface-container-low text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__unspecified">Sin especificar</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid">Mid-level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">
                {data.experienceLevel ? seniorityLabels[data.experienceLevel] : EMPTY_PLACEHOLDER}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="profile-availability"
              className="text-xs leading-4 font-medium text-foreground"
            >
              Disponibilidad
            </label>
            {isEditing ? (
              <Select
                value={formData.availability || "__unspecified"}
                onValueChange={(value) =>
                  handleInputChange("availability", value === "__unspecified" ? "" : value)
                }
              >
                <SelectTrigger
                  id="profile-availability"
                  className="h-9 w-full rounded-lg bg-surface-container-low text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__unspecified">Sin especificar</SelectItem>
                  <SelectItem value="immediate">Disponible ahora</SelectItem>
                  <SelectItem value="2weeks">En 2 semanas</SelectItem>
                  <SelectItem value="1month">En 1 mes</SelectItem>
                  <SelectItem value="open">Abierto a ofertas</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">
                {data.availability ? availabilityLabels[data.availability] : EMPTY_PLACEHOLDER}
              </p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="space-y-2">
            <label
              htmlFor="profile-skills"
              className="text-xs leading-4 font-medium text-foreground block"
            >
              Habilidades
            </label>
            <div className="space-y-2.5">
              {(resumeFormData.skills.length > 0 ? resumeFormData.skills : [emptySkill()]).map(
                (skill, i) => (
                  <div key={skill.id ?? `skill-new-${i}`} className="flex gap-2 items-center">
                    <Input
                      value={skill.name}
                      onChange={(e) =>
                        handleResumeArrayChange("skills", (arr) => {
                          const next = [...arr]
                          next[i] = { ...next[i], name: e.target.value }
                          return next
                        })
                      }
                      placeholder="Nombre de la habilidad"
                      className="h-9 rounded-lg border-border/40 bg-surface-container-low text-xs sm:text-sm flex-1"
                    />
                    <Select
                      value={skill.level || "__unspecified"}
                      onValueChange={(value) =>
                        handleResumeArrayChange("skills", (arr) => {
                          const next = [...arr]
                          next[i] = {
                            ...next[i],
                            level: value === "__unspecified" ? undefined : value,
                          }
                          return next
                        })
                      }
                    >
                      <SelectTrigger className="h-9 w-32 shrink-0 rounded-lg bg-surface-container-low text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LEVEL_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value || "__unspecified"}
                            value={option.value || "__unspecified"}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      onClick={() =>
                        handleResumeArrayChange("skills", (arr) => arr.filter((_, j) => j !== i))
                      }
                      aria-label="Eliminar"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={16} />
                    </Button>
                  </div>
                )
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-lg border border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-foreground transition-colors"
                onClick={() => handleResumeArrayChange("skills", (arr) => [...arr, emptySkill()])}
              >
                Agregar habilidad
              </Button>
            </div>
          </div>
        )}
      </div>
    </EditableCard>
  )
}
