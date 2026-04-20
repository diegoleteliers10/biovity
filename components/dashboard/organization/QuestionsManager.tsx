"use client"

import {
  Add01Icon,
  Delete02Icon,
  Edit02Icon,
  Globe02Icon,
  MoreVerticalIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { JobQuestion, QuestionType } from "@/lib/api/job-questions"
import {
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useOrgJobQuestions,
  usePublishQuestionMutation,
  useUnpublishQuestionMutation,
  useUpdateQuestionMutation,
} from "@/lib/api/use-job-questions"
import { cn } from "@/lib/utils"

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "text", label: "Texto corto" },
  { value: "textarea", label: "Texto largo" },
  { value: "number", label: "Número" },
  { value: "select", label: "Selección única" },
  { value: "multiselect", label: "Selección múltiple" },
  { value: "boolean", label: "Sí/No" },
  { value: "date", label: "Fecha" },
]

type QuestionFormData = {
  label: string
  type: QuestionType
  required: boolean
  placeholder: string
  helperText: string
  options: string
}

const EMPTY_FORM: QuestionFormData = {
  label: "",
  type: "text",
  required: false,
  placeholder: "",
  helperText: "",
  options: "",
}

export function QuestionsManager({
  jobId,
  organizationId,
}: {
  jobId: string
  organizationId: string
}) {
  const orgId = organizationId

  const { data: questions, isLoading, isError, error } = useOrgJobQuestions(orgId, jobId)
  const queryClient = useQueryClient()
  const createMutation = useCreateQuestionMutation(queryClient, orgId, jobId)
  const updateMutation = useUpdateQuestionMutation(queryClient, orgId, jobId)
  const deleteMutation = useDeleteQuestionMutation(queryClient, orgId, jobId)
  const publishMutation = usePublishQuestionMutation(queryClient, orgId, jobId)
  const unpublishMutation = useUnpublishQuestionMutation(queryClient, orgId, jobId)

  // Sort questions by orderIndex
  const sortedQuestions = Array.isArray(questions)
    ? [...questions].sort((a, b) => a.orderIndex - b.orderIndex)
    : undefined

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<JobQuestion | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [formData, setFormData] = useState<QuestionFormData>(EMPTY_FORM)

  const openCreate = () => {
    setEditingQuestion(null)
    setFormData(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (question: JobQuestion) => {
    setEditingQuestion(question)
    setFormData({
      label: question.label,
      type: question.type,
      required: question.required,
      placeholder: question.placeholder ?? "",
      helperText: question.helperText ?? "",
      options: question.options?.join("\n") ?? "",
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    const payload = {
      label: formData.label.trim(),
      type: formData.type,
      required: formData.required,
      placeholder: formData.placeholder.trim() || undefined,
      helperText: formData.helperText.trim() || undefined,
      options:
        formData.type === "select" || formData.type === "multiselect"
          ? formData.options
              .split("\n")
              .map((o) => o.trim())
              .filter(Boolean)
          : undefined,
    }

    if (editingQuestion) {
      await updateMutation.mutateAsync({ id: editingQuestion.id, ...payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    setDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
    setDeleteConfirmId(null)
  }

  const handlePublish = async (id: string) => {
    await publishMutation.mutateAsync(id)
  }

  const handleUnpublish = async (id: string) => {
    await unpublishMutation.mutateAsync(id)
  }

  if (!orgId) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        Cargando organización...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Preguntas de postulación</h3>
          <p className="text-xs text-muted-foreground">
            Crea preguntas para que los candidatos respondan al aplicar
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <HugeiconsIcon icon={Add01Icon} size={14} />
          Agregar pregunta
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 py-10 text-center">
          <p className="text-sm text-destructive">
            Error al cargar preguntas. Verifica que el job exista.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {error instanceof Error ? error.message : "Intenta recargar la página"}
          </p>
        </div>
      ) : !sortedQuestions || sortedQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
          <HugeiconsIcon
            icon={Edit02Icon}
            size={32}
            strokeWidth={1.5}
            className="mb-2 h-8 w-8 text-muted-foreground"
          />
          <p className="text-sm text-muted-foreground">
            No hay preguntas configuradas para esta oferta.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Agrega preguntas para conocer mejor a los postulantes.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedQuestions.map((question, index) => (
            <div
              key={question.id ?? `q-${index}`}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {question.label}
                  </span>
                  {question.required && (
                    <span className="shrink-0 text-destructive text-xs">*</span>
                  )}
                  <Badge
                    variant="outline"
                    className="shrink-0 text-[10px] uppercase tracking-wider"
                  >
                    {question.type}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{question.status === "published" ? "Publicada" : "Borrador"}</span>
                  {question.options && question.options.length > 0 && (
                    <span>· {question.options.length} opciones</span>
                  )}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEdit(question)} className="gap-2">
                    <HugeiconsIcon icon={Edit02Icon} size={14} />
                    Editar
                  </DropdownMenuItem>
                  {question.status === "draft" ? (
                    <DropdownMenuItem onClick={() => handlePublish(question.id)} className="gap-2">
                      <HugeiconsIcon icon={Globe02Icon} size={14} />
                      Publicar
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => handleUnpublish(question.id)}
                      className="gap-2"
                    >
                      <HugeiconsIcon icon={Edit02Icon} size={14} />
                      Despublicar
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => setDeleteConfirmId(question.id)}
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={14} />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? "Editar pregunta" : "Nueva pregunta"}</DialogTitle>
            <DialogDescription>
              {editingQuestion
                ? "Modifica los detalles de la pregunta."
                : "Agrega una nueva pregunta para los postulantes."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="label">Pregunta</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="¿Cuál es tu experiencia previa?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de respuesta</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v as QuestionType })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(formData.type === "select" || formData.type === "multiselect") && (
              <div className="space-y-2">
                <Label htmlFor="options">Opciones (una por línea)</Label>
                <Textarea
                  id="options"
                  value={formData.options}
                  onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                  placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
                  rows={4}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={formData.placeholder}
                onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                placeholder="Ej: 5 años de experiencia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="helperText">Texto de ayuda</Label>
              <Textarea
                id="helperText"
                value={formData.helperText}
                onChange={(e) => setFormData({ ...formData, helperText: e.target.value })}
                placeholder="Esta pregunta nos ayudará a..."
                rows={2}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="h-4 w-4 rounded border-input accent-secondary"
              />
              <Label htmlFor="required" className="text-sm font-normal">
                Pregunta obligatoria
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.label.trim() || createMutation.isPending || updateMutation.isPending
              }
            >
              {editingQuestion ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar pregunta</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta pregunta? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteMutation.isPending}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
