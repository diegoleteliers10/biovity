"use client"

import { Cancel01Icon, Certificate01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditableCard } from "./EditableCard"
import { EmptyListState } from "./EmptyListState"
import { emptyCertification, useProfileContext } from "./profile-context"

export function CertificationsForm() {
  const { resume, resumeFormData, isEditing, handleResumeArrayChange } = useProfileContext()

  return (
    <EditableCard>
      {isEditing ? (
        <div className="space-y-3.5">
          {(resumeFormData.certifications.length > 0
            ? resumeFormData.certifications
            : [emptyCertification()]
          ).map((cert, i) => (
            <div
              key={cert.id ?? `cert-new-${i}`}
              className="rounded-lg border border-border/40 bg-surface-container-low/60 p-3.5 space-y-2.5"
            >
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
                  placeholder="Nombre de la certificación"
                  className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
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
                  placeholder="Emisor / Entidad"
                  className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm"
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
                  className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm"
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
                placeholder="Enlace de verificación (opcional)"
                className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 px-3 rounded-lg border border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-foreground transition-colors"
            onClick={() =>
              handleResumeArrayChange("certifications", (arr) => [...arr, emptyCertification()])
            }
          >
            Agregar certificación
          </Button>
        </div>
      ) : (resume?.certifications?.length ?? 0) > 0 ? (
        <ul className="space-y-2.5">
          {(resume?.certifications ?? []).map((cert) => (
            <li
              key={`cert-display-${cert.title ?? cert.name ?? ""}-${cert.company ?? cert.issuer ?? ""}`}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-1 border-b border-border/20 last:border-0"
            >
              <span className="text-sm font-medium text-foreground">{cert.title ?? cert.name}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {[cert.company ?? cert.issuer, cert.date].filter(Boolean).join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyListState
          icon={Certificate01Icon}
          message="Agrega certificaciones y cursos que hayas completado"
        />
      )}
    </EditableCard>
  )
}
