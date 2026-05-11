"use client"

import { Cancel01Icon, Edit01Icon, GraduationScrollIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { ResumeEducation } from "@/lib/api/resumes"
import { cn } from "@/lib/utils"
import { emptyEducation, useProfileContext } from "./profile-context"

const getEduDisplay = (edu: ResumeEducation) => ({
  title: edu.title ?? edu.degree ?? "",
  institute: edu.institute ?? edu.institution ?? "",
  start: edu.startYear ?? edu.startDate?.slice(0, 4) ?? "",
  end: edu.endYear ?? edu.endDate?.slice(0, 4) ?? "",
  current: edu.stillStudying ?? false,
})

const SectionTitle = ({
  icon: Icon,
  title,
  className,
}: {
  icon: typeof GraduationScrollIcon
  title: string
  className?: string
}) => (
  <div className={cn("flex items-center gap-2", className)}>
    <HugeiconsIcon icon={Icon} size={20} className="text-muted-foreground" />
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
  </div>
)

const EditableCard = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  isSaving,
  children,
  className,
}: {
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
  children: React.ReactNode
  className?: string
}) => (
  <Card
    className={cn(
      "group relative bg-white border border-border/10 hover:bg-secondary/5 transition-colors duration-300",
      className
    )}
  >
    {!isEditing && (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={onEdit}
      >
        <HugeiconsIcon icon={Edit01Icon} size={16} />
      </Button>
    )}
    {children}
    {isEditing && (
      <div className="flex justify-end gap-2 p-4 pt-0">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" size="sm" onClick={onSave} disabled={isSaving}>
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    )}
  </Card>
)

export function EducationForm() {
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

  const isEditingEducation = editingSection === "education"

  return (
    <EditableCard
      isEditing={isEditingEducation}
      onEdit={() => handleEditSection("education")}
      onSave={() => handleSaveSection("education")}
      onCancel={handleCancelSection}
      isSaving={isSaving}
    >
      <CardHeader className="pb-4">
        <SectionTitle icon={GraduationScrollIcon} title="Formación académica" />
      </CardHeader>
      <CardContent>
        {isEditingEducation ? (
          <div className="space-y-4">
            {(resumeFormData.education.length > 0
              ? resumeFormData.education
              : [emptyEducation()]
            ).map((edu, i) => (
              <div
                key={`edu-edit-${edu.title ?? edu.degree ?? ""}-${edu.institute ?? edu.institution ?? ""}`}
                className="rounded-md border border-border p-4 space-y-3"
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
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
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
                    className="w-24"
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
                    className="w-24"
                    disabled={edu.stillStudying}
                  />
                  <label className="flex items-center gap-2 text-sm">
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
                      className="rounded"
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
              onClick={() =>
                handleResumeArrayChange("education", (arr) => [...arr, emptyEducation()])
              }
            >
              Agregar formación
            </Button>
          </div>
        ) : (resume?.education?.length ?? 0) > 0 ? (
          <ul className="space-y-6">
            {(resume?.education ?? []).map((edu, _i) => {
              const d = getEduDisplay(edu)
              return (
                <li
                  key={`edu-display-${d.title}-${d.institute}`}
                  className="relative pl-6 before:absolute before:left-0 before:top-2 before:size-2 before:rounded-full before:bg-primary"
                >
                  <p className="font-medium text-foreground">{d.title}</p>
                  {d.institute && <p className="text-sm text-muted-foreground">{d.institute}</p>}
                  <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                    {d.start} – {d.current ? "En curso" : d.end || ""}
                  </p>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">Agrega tu formación académica</p>
        )}
      </CardContent>
    </EditableCard>
  )
}
