"use client"

import { Cancel01Icon, Globe02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EditableCard } from "./EditableCard"
import { emptyLanguage, LEVEL_OPTIONS, useProfileContext } from "./profile-context"

const SectionTitle = ({ icon: Icon, title }: { icon: typeof Globe02Icon; title: string }) => (
  <div className="flex items-center gap-2">
    <HugeiconsIcon icon={Icon} size={20} className="text-muted-foreground" />
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
  </div>
)

export function LanguagesForm() {
  const {
    resume,
    resumeFormData,
    isSaving,
    editingSection,
    handleEditSection,
    handleSaveSection,
    handleCancelSection,
    handleResumeArrayChange,
  } = useProfileContext()

  const isEditingLanguages = editingSection === "languages"

  return (
    <EditableCard
      isEditing={isEditingLanguages}
      onEdit={() => handleEditSection("languages")}
      onSave={() => handleSaveSection("languages")}
      onCancel={handleCancelSection}
      isSaving={isSaving}
    >
      <CardHeader className="pb-4">
        <SectionTitle icon={Globe02Icon} title="Idiomas" />
      </CardHeader>
      <CardContent>
        {isEditingLanguages ? (
          <div className="space-y-4">
            {(resumeFormData.languages.length > 0
              ? resumeFormData.languages
              : [emptyLanguage()]
            ).map((lang, i) => (
              <div
                key={`lang-edit-${lang.name ?? lang.language ?? ""}`}
                className="flex gap-2 items-center"
              >
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
                className="rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm"
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
