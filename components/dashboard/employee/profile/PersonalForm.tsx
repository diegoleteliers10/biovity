"use client"

import { Cancel01Icon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EditableCard } from "./EditableCard"
import { EMPTY_PLACEHOLDER, emptySkill, LEVEL_OPTIONS, useProfileContext } from "./profile-context"

export function PersonalForm() {
  const {
    editingSection,
    formData,
    profileData,
    resumeFormData,
    resume,
    handleEditSection,
    handleSaveSection,
    handleCancelSection,
    handleResumeArrayChange,
    handleInputChange,
    isSaving,
  } = useProfileContext()

  const isEditingPersonal = editingSection === "personal"
  const data = editingSection ? formData : profileData

  return (
    <EditableCard
      isEditing={isEditingPersonal}
      onEdit={() => handleEditSection("personal")}
      onSave={() => handleSaveSection("personal")}
      onCancel={handleCancelSection}
      isSaving={isSaving}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <HugeiconsIcon icon={UserIcon} size={18} />
          Información Personal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1.5">
          <label htmlFor="profile-bio" className="text-sm font-medium text-foreground">
            Biografía
          </label>
          {isEditingPersonal ? (
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

        <div className="space-y-1.5">
          <label htmlFor="profile-skills" className="text-sm font-medium text-foreground">
            Habilidades
          </label>
          {isEditingPersonal ? (
            <div className="space-y-3">
              {(resumeFormData.skills.length > 0 ? resumeFormData.skills : [emptySkill()]).map(
                (skill, i) => (
                  <div key={`skill-edit-${skill.name}`} className="flex gap-2 items-center">
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
                      className="h-9 rounded-md border border-input bg-background px-2 text-sm w-28"
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
          ) : (resume?.skills?.length ?? 0) > 0 ? (
            <div className="flex flex-wrap gap-2">
              {(resume?.skills ?? []).map((skill, _i) => {
                const name = typeof skill === "string" ? skill : skill.name
                const level = typeof skill === "string" ? undefined : skill.level
                return (
                  <span
                    key={`skill-display-${name}`}
                    className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {name}
                    {level && <span className="ml-1 text-muted-foreground">({level})</span>}
                  </span>
                )
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-pretty">{EMPTY_PLACEHOLDER}</p>
          )}
        </div>
      </CardContent>
    </EditableCard>
  )
}
