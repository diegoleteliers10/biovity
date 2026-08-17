"use client"

import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
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
      <CardContent className="pl-0 space-y-6">
        <div className="space-y-1.5">
          <label htmlFor="profile-bio" className="text-xs leading-4 font-medium text-foreground">
            Biografía
          </label>
          {isEditing ? (
            <textarea
              id="profile-bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Cuéntanos sobre ti..."
            />
          ) : (
            <p className="text-muted-foreground text-pretty leading-relaxed">
              {data.bio || EMPTY_PLACEHOLDER}
            </p>
          )}
        </div>

        {isEditing && (
          <div className="space-y-1.5">
            <label
              htmlFor="profile-skills"
              className="text-xs leading-4 font-medium text-foreground"
            >
              Habilidades
            </label>
            <div className="space-y-3">
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
                      className="flex-1"
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
                      className="h-7 rounded-md border border-input bg-background px-2 w-28"
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
                onClick={() => handleResumeArrayChange("skills", (arr) => [...arr, emptySkill()])}
              >
                Agregar habilidad
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </EditableCard>
  )
}
