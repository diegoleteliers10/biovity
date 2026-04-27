"use client"

import { Briefcase01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { ResumeExperience } from "@/lib/api/resumes"
import { cn } from "@/lib/utils"
import { EditableCard } from "./EditableCard"
import { emptyExperience, useProfileContext } from "./profile-context"

const SectionTitle = ({
  icon: Icon,
  title,
  className,
}: {
  icon: typeof Briefcase01Icon
  title: string
  className?: string
}) => (
  <div className={cn("flex items-center gap-2", className)}>
    <HugeiconsIcon icon={Icon} size={20} className="text-muted-foreground" />
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
  </div>
)

const getExpDisplay = (exp: ResumeExperience) => ({
  title: exp.title ?? exp.position ?? "",
  company: exp.company ?? "",
  start: exp.startYear ?? exp.startDate?.slice(0, 4) ?? "",
  end: exp.endYear ?? exp.endDate?.slice(0, 4) ?? "",
  current: exp.stillWorking ?? exp.current ?? false,
})

export function ExperienceForm() {
  const {
    resume,
    isSaving,
    editingSection,
    resumeFormData,
    handleEditSection,
    handleSaveSection,
    handleCancelSection,
    handleResumeArrayChange,
  } = useProfileContext()

  const isEditingExperience = editingSection === "experience"

  return (
    <EditableCard
      isEditing={isEditingExperience}
      onEdit={() => handleEditSection("experience")}
      onSave={() => handleSaveSection("experience")}
      onCancel={handleCancelSection}
      isSaving={isSaving}
    >
      <CardHeader className="pb-4">
        <SectionTitle icon={Briefcase01Icon} title="Experiencia laboral" />
      </CardHeader>
      <CardContent>
        {isEditingExperience ? (
          <div className="space-y-4">
            {(resumeFormData.experiences.length > 0
              ? resumeFormData.experiences
              : [emptyExperience()]
            ).map((exp, i) => (
              <div key={i} className="rounded-md border border-border p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="grid gap-2 flex-1 sm:grid-cols-2">
                    <Input
                      value={exp.title ?? exp.position ?? ""}
                      onChange={(e) =>
                        handleResumeArrayChange("experiences", (arr) => {
                          const next = [...arr]
                          next[i] = { ...next[i], title: e.target.value }
                          return next
                        })
                      }
                      placeholder="Cargo / Título"
                    />
                    <Input
                      value={exp.company ?? ""}
                      onChange={(e) =>
                        handleResumeArrayChange("experiences", (arr) => {
                          const next = [...arr]
                          next[i] = { ...next[i], company: e.target.value }
                          return next
                        })
                      }
                      placeholder="Empresa"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() =>
                      handleResumeArrayChange("experiences", (arr) => arr.filter((_, j) => j !== i))
                    }
                    aria-label="Eliminar"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={16} />
                  </Button>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                  <Input
                    value={exp.startYear ?? ""}
                    onChange={(e) =>
                      handleResumeArrayChange("experiences", (arr) => {
                        const next = [...arr]
                        next[i] = { ...next[i], startYear: e.target.value }
                        return next
                      })
                    }
                    placeholder="Año inicio"
                    className="w-24"
                  />
                  <Input
                    value={exp.endYear ?? ""}
                    onChange={(e) =>
                      handleResumeArrayChange("experiences", (arr) => {
                        const next = [...arr]
                        next[i] = { ...next[i], endYear: e.target.value }
                        return next
                      })
                    }
                    placeholder="Año fin"
                    className="w-24"
                    disabled={exp.stillWorking ?? exp.current}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={exp.stillWorking ?? exp.current ?? false}
                      onChange={(e) =>
                        handleResumeArrayChange("experiences", (arr) => {
                          const next = [...arr]
                          next[i] = {
                            ...next[i],
                            stillWorking: e.target.checked,
                            current: e.target.checked,
                          }
                          return next
                        })
                      }
                      className="rounded"
                    />
                    Actualidad
                  </label>
                </div>
                <textarea
                  value={exp.description ?? ""}
                  onChange={(e) =>
                    handleResumeArrayChange("experiences", (arr) => {
                      const next = [...arr]
                      next[i] = { ...next[i], description: e.target.value }
                      return next
                    })
                  }
                  placeholder="Descripción"
                  className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                handleResumeArrayChange("experiences", (arr) => [...arr, emptyExperience()])
              }
            >
              Agregar experiencia
            </Button>
          </div>
        ) : (resume?.experiences?.length ?? 0) > 0 ? (
          <ul className="space-y-6">
            {(resume?.experiences ?? []).map((exp, i) => {
              const d = getExpDisplay(exp)
              return (
                <li
                  key={i}
                  className="relative pl-6 before:absolute before:left-0 before:top-2 before:size-2 before:rounded-full before:bg-primary"
                >
                  <p className="font-medium text-foreground">{d.title || d.company}</p>
                  {d.company && <p className="text-sm text-muted-foreground">{d.company}</p>}
                  <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                    {d.start} — {d.current ? "Actualidad" : d.end || ""}
                  </p>
                  {exp.description && (
                    <p className="mt-2 text-sm text-muted-foreground text-pretty">
                      {exp.description}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">
            Agrega tu experiencia laboral para destacar tu perfil
          </p>
        )}
      </CardContent>
    </EditableCard>
  )
}
