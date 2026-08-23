"use client"

import { Briefcase01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ResumeExperience } from "@/lib/api/resumes"
import { EditableCard } from "./EditableCard"
import { EmptyListState } from "./EmptyListState"
import { emptyExperience, useProfileContext } from "./profile-context"

const getExpDisplay = (exp: ResumeExperience) => ({
  title: exp.title ?? exp.position ?? "",
  company: exp.company ?? "",
  start: exp.startYear ?? exp.startDate?.slice(0, 4) ?? "",
  end: exp.endYear ?? exp.endDate?.slice(0, 4) ?? "",
  current: exp.stillWorking ?? exp.current ?? false,
})

export function ExperienceForm() {
  const { resume, isEditing, resumeFormData, handleResumeArrayChange } = useProfileContext()

  return (
    <EditableCard>
      {isEditing ? (
        <div className="space-y-3.5">
          {(resumeFormData.experiences.length > 0
            ? resumeFormData.experiences
            : [emptyExperience()]
          ).map((exp, i) => (
            <div
              key={exp.id ?? `exp-new-${i}`}
              className="rounded-lg border border-border/40 bg-surface-container-low/60 p-3.5 space-y-3"
            >
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
                    className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm"
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
                    className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
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
                  className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm w-28"
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
                  className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm w-28"
                  disabled={exp.stillWorking ?? exp.current}
                />
                <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer select-none">
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
                    className="size-4 rounded border-border/40 text-secondary focus:ring-secondary/20"
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
                placeholder="Descripción de responsabilidades y logros..."
                className="w-full min-h-[64px] rounded-lg border border-border/40 bg-surface-container-lowest px-3 py-2 text-xs sm:text-sm text-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none resize-none"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 px-3 rounded-lg border border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-foreground transition-colors"
            onClick={() =>
              handleResumeArrayChange("experiences", (arr) => [...arr, emptyExperience()])
            }
          >
            Agregar experiencia
          </Button>
        </div>
      ) : (resume?.experiences?.length ?? 0) > 0 ? (
        <ul className="space-y-4">
          {(resume?.experiences ?? []).map((exp) => {
            const d = getExpDisplay(exp)
            return (
              <li
                key={`exp-display-${d.title}-${d.company}`}
                className="relative pl-5 before:absolute before:left-0 before:top-2 before:size-2 before:rounded-full before:bg-secondary"
              >
                <p className="text-sm font-medium text-foreground">{d.title || d.company}</p>
                {d.company && <p className="text-xs text-muted-foreground">{d.company}</p>}
                <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                  {d.start} – {d.current ? "Actualidad" : d.end || ""}
                </p>
                {exp.description && (
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground text-pretty">
                    {exp.description}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <EmptyListState
          icon={Briefcase01Icon}
          message="Agrega tu experiencia laboral para destacar tu perfil"
        />
      )}
    </EditableCard>
  )
}
