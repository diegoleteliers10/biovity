"use client"

import { Award01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { EditableCard } from "./EditableCard"
import { emptyCertification, useProfileContext } from "./profile-context"

const SectionTitle = ({
  icon: Icon,
  title,
  className,
}: {
  icon: typeof Award01Icon
  title: string
  className?: string
}) => (
  <div className={cn("flex items-center gap-2", className)}>
    <HugeiconsIcon icon={Icon} size={20} className="text-muted-foreground" />
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
  </div>
)

export function CertificationsForm() {
  const { resume, resumeFormData, handleResumeArrayChange, editingSection, handleEditSection, handleSaveSection, handleCancelSection, isSaving } = useProfileContext()

  const isEditingCertifications = editingSection === "certifications"

  return (
    <EditableCard
      isEditing={isEditingCertifications}
      onEdit={() => handleEditSection("certifications")}
      onSave={() => handleSaveSection("certifications")}
      onCancel={handleCancelSection}
      isSaving={isSaving}
    >
      <CardHeader className="pb-4">
        <SectionTitle icon={Award01Icon} title="Certificaciones" />
      </CardHeader>
      <CardContent>
        {isEditingCertifications ? (
          <div className="space-y-4">
            {(resumeFormData.certifications.length > 0
              ? resumeFormData.certifications
              : [emptyCertification()]
            ).map((cert, i) => (
              <div key={i} className="rounded-md border border-border p-4 space-y-2">
                <div className="flex justify-between gap-2">
                  <Input
                    value={cert.title ?? cert.name ?? ""}
                    onChange={(e) =>
                      handleResumeArrayChange("certifications", (arr) => {
                        const next = [...arr]
                        next[i] = { ...next[i], title: e.target.value }
                        return next
                      })
                    }
                    placeholder="Nombre"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleResumeArrayChange("certifications", (arr) =>
                        arr.filter((_, j) => j !== i)
                      )
                    }
                    aria-label="Eliminar"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={16} />
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    value={cert.company ?? cert.issuer ?? ""}
                    onChange={(e) =>
                      handleResumeArrayChange("certifications", (arr) => {
                        const next = [...arr]
                        next[i] = { ...next[i], company: e.target.value }
                        return next
                      })
                    }
                    placeholder="Emisor / Empresa"
                  />
                  <Input
                    value={cert.date ?? ""}
                    onChange={(e) =>
                      handleResumeArrayChange("certifications", (arr) => {
                        const next = [...arr]
                        next[i] = { ...next[i], date: e.target.value }
                        return next
                      })
                    }
                    placeholder="Fecha (YYYY-MM)"
                  />
                </div>
                <Input
                  value={cert.link ?? ""}
                  onChange={(e) =>
                    handleResumeArrayChange("certifications", (arr) => {
                      const next = [...arr]
                      next[i] = { ...next[i], link: e.target.value }
                      return next
                    })
                  }
                  placeholder="Enlace (opcional)"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                handleResumeArrayChange("certifications", (arr) => [
                  ...arr,
                  emptyCertification(),
                ])
              }
            >
              Agregar certificación
            </Button>
          </div>
        ) : (resume?.certifications?.length ?? 0) > 0 ? (
          <ul className="space-y-3">
            {(resume?.certifications ?? []).map((cert, i) => (
              <li
                key={i}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
              >
                <span className="font-medium text-foreground">{cert.title ?? cert.name}</span>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {[cert.company ?? cert.issuer, cert.date].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">
            Agrega certificaciones y cursos que hayas completado
          </p>
        )}
      </CardContent>
    </EditableCard>
  )
}
