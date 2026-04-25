"use client"

import { useMutation, useQuery, type useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { getResultErrorMessage } from "@/lib/result"
import {
  type CreateQuestionInput,
  createQuestion,
  deleteQuestion,
  getQuestionsByJob,
  type JobQuestion,
  publishQuestion,
  type ReorderQuestionItem,
  reorderQuestions,
  type UpdateQuestionInput,
  unpublishQuestion,
  updateQuestion,
} from "./job-questions"

export const jobQuestionsKeys = {
  byOrgJob: (orgId: string, jobId: string) =>
    ["job-questions", "org", orgId, "job", jobId] as const,
}

export function useOrgJobQuestions(orgId: string | undefined, jobId: string | undefined) {
  const safeOrgId = orgId ?? ""
  const safeJobId = jobId ?? ""
  return useQuery({
    queryKey: jobQuestionsKeys.byOrgJob(safeOrgId, safeJobId),
    queryFn: async () => {
      if (!safeJobId) throw new Error("Job ID required")
      const result = await getQuestionsByJob(safeJobId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(safeJobId),
  })
}

export function useCreateQuestionMutation(
  queryClient: ReturnType<typeof useQueryClient>,
  orgId: string,
  jobId: string
) {
  return useMutation({
    mutationFn: async (input: CreateQuestionInput) => {
      const result = await createQuestion(orgId, jobId, input)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (newQuestion) => {
      queryClient.setQueryData<JobQuestion[]>(jobQuestionsKeys.byOrgJob(orgId, jobId), (old) => {
        if (!old) return [newQuestion]
        const withoutNew = old.filter((q) => q.id !== newQuestion.id)
        return [...withoutNew, newQuestion].sort((a, b) => a.orderIndex - b.orderIndex)
      })
    },
  })
}

export function useUpdateQuestionMutation(
  queryClient: ReturnType<typeof useQueryClient>,
  orgId: string,
  jobId: string
) {
  return useMutation({
    mutationFn: async ({ id, ...input }: { id: string } & UpdateQuestionInput) => {
      const result = await updateQuestion(id, input)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<JobQuestion[]>(jobQuestionsKeys.byOrgJob(orgId, jobId), (old) =>
        old?.map((q) => (q.id === updated.id ? updated : q))
      )
    },
  })
}

export function useDeleteQuestionMutation(
  queryClient: ReturnType<typeof useQueryClient>,
  orgId: string,
  jobId: string
) {
  return useMutation({
    mutationFn: async (questionId: string) => {
      const result = await deleteQuestion(questionId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<JobQuestion[]>(jobQuestionsKeys.byOrgJob(orgId, jobId), (old) =>
        old?.filter((q) => q.id !== deletedId)
      )
    },
  })
}

export function usePublishQuestionMutation(
  queryClient: ReturnType<typeof useQueryClient>,
  orgId: string,
  jobId: string
) {
  return useMutation({
    mutationFn: async (questionId: string) => {
      const result = await publishQuestion(questionId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (_, questionId) => {
      queryClient.setQueryData<JobQuestion[]>(jobQuestionsKeys.byOrgJob(orgId, jobId), (old) =>
        old?.map((q) => (q.id === questionId ? { ...q, status: "published" as const } : q))
      )
    },
  })
}

export function useUnpublishQuestionMutation(
  queryClient: ReturnType<typeof useQueryClient>,
  orgId: string,
  jobId: string
) {
  return useMutation({
    mutationFn: async (questionId: string) => {
      const result = await unpublishQuestion(questionId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (_, questionId) => {
      queryClient.setQueryData<JobQuestion[]>(jobQuestionsKeys.byOrgJob(orgId, jobId), (old) =>
        old?.map((q) => (q.id === questionId ? { ...q, status: "draft" as const } : q))
      )
    },
  })
}

export function useReorderQuestionsMutation(
  queryClient: ReturnType<typeof useQueryClient>,
  orgId: string,
  jobId: string
) {
  return useMutation({
    mutationFn: async (items: ReorderQuestionItem[]) => {
      const result = await reorderQuestions(orgId, jobId, items)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobQuestionsKeys.byOrgJob(orgId, jobId) })
    },
  })
}
