"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

const _EMPTY_FORM: QuestionFormData = {
  label: "",
  type: "text",
  required: false,
  placeholder: "",
  helperText: "",
  options: "",
}

interface QuestionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingQuestion: JobQuestion | null
  formData: QuestionFormData
  onFormChange: (data: QuestionFormData) => void
  onSubmit: () => void
  isPending: boolean
}

export function QuestionFormDialog({
  open,
  onOpenChange,
  editingQuestion,
  formData,
  onFormChange,
  onSubmit,
  isPending,
}: QuestionFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => onFormChange({ ...formData, label: e.target.value })}
              placeholder="¿Cuál es tu experiencia previa?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de respuesta</Label>
            <Select
              value={formData.type}
              onValueChange={(v) => onFormChange({ ...formData, type: v as QuestionType })}
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
                onChange={(e) => onFormChange({ ...formData, options: e.target.value })}
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
              onChange={(e) => onFormChange({ ...formData, placeholder: e.target.value })}
              placeholder="Ej: 5 años de experiencia"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="helperText">Texto de ayuda</Label>
            <Textarea
              id="helperText"
              value={formData.helperText}
              onChange={(e) => onFormChange({ ...formData, helperText: e.target.value })}
              placeholder="Esta pregunta nos ayudará a..."
              rows={2}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="required"
              checked={formData.required}
              onChange={(e) => onFormChange({ ...formData, required: e.target.checked })}
              className="size-4 rounded border-input accent-secondary"
            />
            <Label htmlFor="required" className="text-sm font-normal">
              Pregunta obligatoria
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={!formData.label.trim() || isPending}>
            {editingQuestion ? "Guardar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
