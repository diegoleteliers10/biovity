"use client"

import { Cancel01Icon, Mortarboard01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ResumeEducation } from "@/lib/api/resumes"
import { EditableCard } from "./EditableCard"
import { EmptyListState } from "./EmptyListState"
import { emptyEducation, useProfileContext } from "./profile-context"

const getEduDisplay = (edu: ResumeEducation) => ({
  title: edu.title ?? edu.degree ?? "",
  institute: edu.institute ?? edu.institution ?? "",
  start: edu.startYear ?? edu.startDate?.slice(0, 4) ?? "",
  end: edu.endYear ?? edu.endDate?.slice(0, 4) ?? "",
  current: edu.stillStudying ?? false,
})

export function EducationForm() {
  const { resume, isEditing, resumeFormData, handleResumeArrayChange } = useProfileContext()

  return (
    <EditableCard>
      {isEditing ? (
        <div className="space-y-3.5">
          {(resumeFormData.education.length > 0
            ? resumeFormData.education
            : [emptyEducation()]
          ).map((edu, i) => (
            <div
              key={edu.id ?? `edu-new-${i}`}
              className="rounded-lg border border-border/40 bg-surface-container-low/60 p-3.5 space-y-3"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="grid gap-2 flex-1 sm:grid-cols-2">
                  <Input
                    value={edu.title ?? edu.degree ?? ""}
                    onChange={(e) =>
                      handleResumeArrayChange("education", (arr) => {
                        const next = [...arr]
                        next[i] = { ...next[i], title: e.target.value }
                        return next
                      })
                    }
                    placeholder="Título / Carrera"
                    className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm"
                  />
                  <Input
                    value={edu.institute ?? edu.institution ?? ""}
                    onChange={(e) =>
                      handleResumeArrayChange("education", (arr) => {
                        const next = [...arr]
                        next[i] = { ...next[i], institute: e.target.value }
                        return next
                      })
                    }
                    placeholder="Institución"
                    className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                  onClick={() =>
                    handleResumeArrayChange("education", (arr) => arr.filter((_, j) => j !== i))
                  }
                  aria-label="Eliminar"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} />
                </Button>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <Input
                  value={edu.startYear ?? ""}
                  onChange={(e) =>
                    handleResumeArrayChange("education", (arr) => {
                      const next = [...arr]
                      next[i] = { ...next[i], startYear: e.target.value }
                      return next
                    })
                  }
                  placeholder="Año inicio"
                  className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm w-28"
                />
                <Input
                  value={edu.endYear ?? ""}
                  onChange={(e) =>
                    handleResumeArrayChange("education", (arr) => {
                      const next = [...arr]
                      next[i] = { ...next[i], endYear: e.target.value }
                      return next
                    })
                  }
                  placeholder="Año fin"
                  className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm w-28"
                  disabled={edu.stillStudying}
                />
                <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={edu.stillStudying ?? false}
                    onChange={(e) =>
                      handleResumeArrayChange("education", (arr) => {
                        const next = [...arr]
                        next[i] = { ...next[i], stillStudying: e.target.checked }
                        return next
                      })
                    }
                    className="size-4 rounded border-border/40 text-secondary focus:ring-secondary/20"
                  />
                  En curso
                </label>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 px-3 rounded-lg border border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-foreground transition-colors"
            onClick={() =>
              handleResumeArrayChange("education", (arr) => [...arr, emptyEducation()])
            }
          >
            Agregar formación
          </Button>
        </div>
      ) : (resume?.education?.length ?? 0) > 0 ? (
        <ul className="space-y-4">
          {(resume?.education ?? []).map((edu) => {
            const d = getEduDisplay(edu)
            return (
              <li
                key={`edu-display-${d.title}-${d.institute}`}
                className="relative pl-5 before:absolute before:left-0 before:top-2 before:size-2 before:rounded-full before:bg-secondary"
              >
                <p className="text-sm font-medium text-foreground">{d.title}</p>
                {d.institute && <p className="text-xs text-muted-foreground">{d.institute}</p>}
                <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                  {d.start} – {d.current ? "En curso" : d.end || ""}
                </p>
              </li>
            )
          })}
        </ul>
      ) : (
        <EmptyListState
          icon={Mortarboard01Icon}
          message="Agrega tu formación académica"
        />
      )}
    </EditableCard>
  )
}
