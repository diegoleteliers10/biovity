"use client"

import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EditableCard } from "./EditableCard"
import { emptyLanguage, LEVEL_OPTIONS, useProfileContext } from "./profile-context"

export function LanguagesForm() {
  const { resume, resumeFormData, isEditing, handleResumeArrayChange } = useProfileContext()

  return (
    <EditableCard>
      <CardContent className="pl-0">
        {isEditing ? (
          <div className="space-y-4">
            {(resumeFormData.languages.length > 0
              ? resumeFormData.languages
              : [emptyLanguage()]
            ).map((lang, i) => (
              <div key={lang.id ?? `lang-new-${i}`} className="flex gap-2 items-center">
                <Input
                  value={lang.name ?? lang.language ?? ""}
                  onChange={(e) =>
                    handleResumeArrayChange("languages", (arr) => {
                      const next = [...arr]
                      next[i] = { ...next[i], name: e.target.value }
                      return next
                    })
                  }
                  placeholder="Idioma"
                  className="flex-1"
                />
                <select
                  value={lang.level ?? ""}
                  onChange={(e) =>
                    handleResumeArrayChange("languages", (arr) => {
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
                    handleResumeArrayChange("languages", (arr) => arr.filter((_, j) => j !== i))
                  }
                  aria-label="Eliminar"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                handleResumeArrayChange("languages", (arr) => [...arr, emptyLanguage()])
              }
            >
              Agregar idioma
            </Button>
          </div>
        ) : (resume?.languages?.length ?? 0) > 0 ? (
          <div className="flex flex-wrap gap-2">
            {(resume?.languages ?? []).map((lang, _i) => (
              <span
                key={`lang-display-${lang.name ?? lang.language}`}
                className="h-7 rounded-md border border-border bg-muted/50 px-3"
              >
                {lang.name ?? lang.language}
                {lang.level && <span className="ml-1.5 text-muted-foreground">({lang.level})</span>}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Indica los idiomas que dominas y tu nivel</p>
        )}
      </CardContent>
    </EditableCard>
  )
}
