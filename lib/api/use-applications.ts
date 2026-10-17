"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { getResultErrorMessage } from "@/lib/result"
import type { ApplicationSourceChannel } from "@/lib/types/application-source"
import {
  type Application,
  type ApplicationStatus,
  type ApplicationStatusHistoryItem,
  createApplication,
  getApplicationDetail,
  getApplicationStatusHistory,
  getApplicationsByCandidate,
  getApplicationsByJob,
  getApplicationsByOrganization,
  reopenApplication,
  updateApplicationHiringPlan,
  updateApplicationPipelineStage,
  updateApplicationStatus,
} from "./applications"

export const applicationsKeys = {
  byJob: (jobId: string) => ["applications", "job", jobId] as const,
  byCandidate: (candidateId: string) => ["applications", "candidate", candidateId] as const,
  byOrganization: (organizationId: string) =>
    ["applications", "organization", organizationId] as const,
  detail: (applicationId: string) => ["applications", "detail", applicationId] as const,
}

export function useApplicationDetail(applicationId: string | undefined) {
  return useQuery({
    queryKey: applicationsKeys.detail(applicationId ?? ""),
    queryFn: async () => {
      if (!applicationId) return Promise.reject(new Error("Application ID required"))
      const result = await getApplicationDetail(applicationId)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    enabled: Boolean(applicationId),
  })
}

function getCreateApplicationErrorMessage(error: ApiError | NetworkError): string {
  const base = getResultErrorMessage(error)
  if (error._tag !== "ApiError") return base
  const body = error.body
  if (!body || typeof body !== "object") return base
  const details = body as { message?: unknown; error?: unknown }
  if (typeof details.message === "string" && details.message.trim()) return details.message
  if (typeof details.error === "string" && details.error.trim()) return details.error
  return base
}

export function useApplicationsByJob(jobId: string | undefined) {
  return useQuery({
    queryKey: applicationsKeys.byJob(jobId ?? ""),
    queryFn: async () => {
      if (!jobId) return Promise.reject(new Error("Job ID required"))
      const result = await getApplicationsByJob(jobId, { limit: 100 })
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    enabled: Boolean(jobId),
  })
}

export function useApplicationsByCandidate(candidateId: string | undefined) {
  return useQuery({
    queryKey: applicationsKeys.byCandidate(candidateId ?? ""),
    queryFn: async () => {
      if (!candidateId) return Promise.reject(new Error("Candidate ID required"))
      const result = await getApplicationsByCandidate(candidateId, { limit: 100 })
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    enabled: Boolean(candidateId),
  })
}

export function useCreateApplicationMutation(candidateId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      jobId: string
      coverLetter?: string
      salaryMin?: number
      salaryMax?: number
      salaryCurrency?: string
      availabilityDate?: string
      resumeUrl?: string
      sourceChannel?: Exclude<ApplicationSourceChannel, "unknown">
      distributionSourceId?: string
      answers?: { questionId: string; value: string }[]
    }) => {
      if (!candidateId?.trim()) {
        return Promise.reject(
          new Error("No se pudo identificar al candidato. Vuelve a iniciar sesión.")
        )
      }
      const result = await createApplication({ ...input, candidateId })
      if (!Result.isOk(result))
        return Promise.reject(new Error(getCreateApplicationErrorMessage(result.error)))
      return result.value
    },
    onSuccess: (data) => {
      void queryClient.cancelQueries({ queryKey: ["applications"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "metrics"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "fullMetrics"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "recentApplications"] })
      void queryClient.invalidateQueries({ queryKey: ["user", "metrics"] })
      void queryClient.invalidateQueries({ queryKey: ["jobs"] })

      if (!candidateId?.trim()) return
      queryClient.setQueryData<Application[]>(applicationsKeys.byCandidate(candidateId), (old) =>
        old ? [data, ...old.filter((app) => app.id !== data.id)] : [data]
      )
      void queryClient.invalidateQueries({ queryKey: ["applications"] })
    },
  })
}

export function useUpdateApplicationStatusMutation(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      id: string
      status: ApplicationStatus
      rejectionNote?: string
      rejectionReasonId?: string
    }) => {
      const result = await updateApplicationStatus(input)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onMutate: async ({ id, status }) => {
      const queryKey = applicationsKeys.byJob(jobId)
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Application[]>(queryKey)
      queryClient.setQueryData<Application[]>(queryKey, (current) =>
        current?.map((application) =>
          application.id === id ? { ...application, status } : application
        )
      )
      return { previous, queryKey }
    },
    onError: (_error, _input, context) => {
      if (context?.previous) queryClient.setQueryData(context.queryKey, context.previous)
    },
    onSuccess: (updatedApp) => {
      void queryClient.cancelQueries({ queryKey: ["applications"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "metrics"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "fullMetrics"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "recentApplications"] })
      void queryClient.invalidateQueries({ queryKey: ["user", "metrics"] })
      void queryClient.invalidateQueries({ queryKey: ["jobs"] })

      void queryClient.invalidateQueries({ queryKey: ["applications"] })
      void queryClient.invalidateQueries({
        queryKey: ["applications", "status-history", updatedApp.id],
      })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: applicationsKeys.byJob(jobId) })
    },
  })
}

export function useUpdateApplicationPipelineStageMutation(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      id: string
      stageId: string
      rejectionNote?: string
      rejectionReasonId?: string
    }) => {
      const result = await updateApplicationPipelineStage(input)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onMutate: async ({ id, stageId }) => {
      const queryKey = applicationsKeys.byJob(jobId)
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Application[]>(queryKey)
      queryClient.setQueryData<Application[]>(queryKey, (current) =>
        current?.map((application) =>
          application.id === id ? { ...application, pipelineStageId: stageId } : application
        )
      )
      return { previous, queryKey }
    },
    onError: (_error, _input, context) => {
      if (context?.previous) queryClient.setQueryData(context.queryKey, context.previous)
    },
    onSuccess: (updatedApp) => {
      void queryClient.invalidateQueries({ queryKey: ["applications"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "metrics"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "fullMetrics"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "recentApplications"] })
      void queryClient.invalidateQueries({
        queryKey: ["applications", "status-history", updatedApp.id],
      })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: applicationsKeys.byJob(jobId) })
    },
  })
}

export function useReopenApplicationMutation(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string; stageId: string; reason: string }) => {
      const result = await reopenApplication(input)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: (updatedApp) => {
      void queryClient.invalidateQueries({ queryKey: ["applications"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "metrics"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "fullMetrics"] })
      void queryClient.invalidateQueries({
        queryKey: ["applications", "status-history", updatedApp.id],
      })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: applicationsKeys.byJob(jobId) })
    },
  })
}

export function useUpdateApplicationHiringPlanMutation(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      id: string
      assigneeId?: string | null
      nextAction?: string | null
      targetDate?: string | null
    }) => {
      const result = await updateApplicationHiringPlan(input)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: (updatedApp) => {
      void queryClient.invalidateQueries({ queryKey: ["applications"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "metrics"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "fullMetrics"] })
      void queryClient.invalidateQueries({ queryKey: ["applications", "detail", updatedApp.id] })
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: applicationsKeys.byJob(jobId) })
    },
  })
}

export function useApplicationStatusHistory(applicationId: string) {
  return useQuery<ApplicationStatusHistoryItem[]>({
    queryKey: ["applications", "status-history", applicationId],
    queryFn: async () => {
      const result = await getApplicationStatusHistory(applicationId)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    enabled: Boolean(applicationId),
  })
}

export function useApplicationsByOrganization(
  organizationId: string | undefined,
  params?: { page?: number; limit?: number; includeAnswers?: boolean }
) {
  return useQuery({
    queryKey: [
      ...applicationsKeys.byOrganization(organizationId ?? ""),
      params?.page ?? 1,
      params?.limit ?? 100,
      params?.includeAnswers ? "with-answers" : "without-answers",
    ],
    queryFn: async () => {
      if (!organizationId) return Promise.reject(new Error("Organization ID required"))
      const result = await getApplicationsByOrganization(organizationId, {
        page: params?.page,
        limit: params?.limit ?? 100,
        includeAnswers: params?.includeAnswers,
      })
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    enabled: Boolean(organizationId),
  })
}
