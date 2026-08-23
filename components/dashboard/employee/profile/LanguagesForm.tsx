"use client"

import { Cancel01Icon, LanguageSkillIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditableCard } from "./EditableCard"
import { EmptyListState } from "./EmptyListState"
import { emptyLanguage, LEVEL_OPTIONS, useProfileContext } from "./profile-context"

export function LanguagesForm() {
  const { resume, resumeFormData, isEditing, handleResumeArrayChange } = useProfileContext()

  return (
    <EditableCard>
      {isEditing ? (
        <div className="space-y-3">
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
                className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm flex-1"
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
                className="h-9 rounded-lg border border-border/40 bg-surface-container-lowest px-2.5 text-xs text-foreground focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none w-32 shrink-0"
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
            className="h-9 px-3 rounded-lg border border-border/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-foreground transition-colors"
            onClick={() =>
              handleResumeArrayChange("languages", (arr) => [...arr, emptyLanguage()])
            }
          >
            Agregar idioma
          </Button>
        </div>
      ) : (resume?.languages?.length ?? 0) > 0 ? (
        <div className="flex flex-wrap gap-2">
          {(resume?.languages ?? []).map((lang) => (
            <span
              key={`lang-display-${lang.name ?? lang.language}`}
              className="inline-flex h-7 items-center rounded-md bg-surface-container-highest px-2.5 text-xs font-medium text-foreground"
            >
              {lang.name ?? lang.language}
              {lang.level && (
                <span className="ml-1.5 font-normal text-muted-foreground">({lang.level})</span>
              )}
            </span>
          ))}
        </div>
      ) : (
        <EmptyListState
          icon={LanguageSkillIcon}
          message="Indica los idiomas que dominas y tu nivel"
        />
      )}
    </EditableCard>
  )
}
