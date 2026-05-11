"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useQuestionForm } from "@/hooks/use-question-form"
import {
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useOrgJobQuestions,
  usePublishQuestionMutation,
  useUnpublishQuestionMutation,
  useUpdateQuestionMutation,
} from "@/lib/api/use-job-questions"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"
import { QuestionCard } from "./QuestionCard"
import { QuestionFormDialog } from "./QuestionFormDialog"
import { QuestionsEmptyState } from "./QuestionsEmptyState"
import { QuestionsErrorState } from "./QuestionsErrorState"
import { QuestionsHeader } from "./QuestionsHeader"
import { QuestionsListSkeleton } from "./QuestionsListSkeleton"

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

  const sortedQuestions = Array.isArray(questions)
    ? questions.toSorted((a, b) => a.orderIndex - b.orderIndex)
    : undefined

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const {
    formData,
    setFormData,
    dialogOpen,
    setDialogOpen,
    editingQuestion,
    openCreate,
    openEdit,
    buildPayload,
  } = useQuestionForm()

  const handleSubmit = async () => {
    const payload = buildPayload(formData)

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
        Cargando organización…
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <QuestionsHeader onAdd={openCreate} />

      {isLoading ? (
        <QuestionsListSkeleton />
      ) : isError ? (
        <QuestionsErrorState error={error} />
      ) : !sortedQuestions || sortedQuestions.length === 0 ? (
        <QuestionsEmptyState />
      ) : (
        <div className="space-y-2">
          {sortedQuestions.map((question, index) => (
            <QuestionCard
              key={question.id ?? `q-${index}`}
              question={question}
              onEdit={openEdit}
              onDelete={(id) => setDeleteConfirmId(id)}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
            />
          ))}
        </div>
      )}

      <QuestionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingQuestion={editingQuestion}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
