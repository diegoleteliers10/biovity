"use client"

import { useState } from "react"
import type { JobQuestion, QuestionType } from "@/lib/api/job-questions"

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

export function useQuestionForm() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<JobQuestion | null>(null)
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

  const buildPayload = (data: QuestionFormData) => ({
    label: data.label.trim(),
    type: data.type,
    required: data.required,
    placeholder: data.placeholder.trim() || undefined,
    helperText: data.helperText.trim() || undefined,
    options:
      data.type === "select" || data.type === "multiselect"
        ? data.options.split("\n").flatMap((o) => {
            const trimmed = o.trim()
            return trimmed ? [trimmed] : []
          })
        : undefined,
  })

  return {
    formData,
    setFormData,
    dialogOpen,
    setDialogOpen,
    editingQuestion,
    openCreate,
    openEdit,
    buildPayload,
    EMPTY_FORM,
  }
}

export type { QuestionFormData }
