"use client"

import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditableCard } from "./EditableCard"
import { EMPTY_PLACEHOLDER, emptySkill, LEVEL_OPTIONS, useProfileContext } from "./profile-context"

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
                    <select
                      value={skill.level ?? ""}
                      onChange={(e) =>
                        handleResumeArrayChange("skills", (arr) => {
                          const next = [...arr]
                          next[i] = { ...next[i], level: e.target.value || undefined }
                          return next
                        })
                      }
                      className="h-9 rounded-lg border border-border/40 bg-surface-container-low px-2.5 text-xs text-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none w-32 shrink-0"
                    >
                      {LEVEL_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
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
