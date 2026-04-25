"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { getResultErrorMessage } from "@/lib/result"
import {
  type Application,
  type ApplicationStatus,
  createApplication,
  getApplicationsByCandidate,
  getApplicationsByJob,
  getApplicationsByOrganization,
  updateApplicationStatus,
} from "./applications"

export const applicationsKeys = {
  byJob: (jobId: string) => ["applications", "job", jobId] as const,
  byCandidate: (candidateId: string) => ["applications", "candidate", candidateId] as const,
  byOrganization: (organizationId: string) =>
    ["applications", "organization", organizationId] as const,
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
      if (!jobId) throw new Error("Job ID required")
      const result = await getApplicationsByJob(jobId, { limit: 100 })
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(jobId),
  })
}

export function useApplicationsByCandidate(candidateId: string | undefined) {
  return useQuery({
    queryKey: applicationsKeys.byCandidate(candidateId ?? ""),
    queryFn: async () => {
      if (!candidateId) throw new Error("Candidate ID required")
      const result = await getApplicationsByCandidate(candidateId, { limit: 100 })
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
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
      answers?: { questionId: string; value: string }[]
    }) => {
      if (!candidateId?.trim()) {
        throw new Error("No se pudo identificar al candidato. Vuelve a iniciar sesión.")
      }
      const result = await createApplication({ ...input, candidateId })
      if (!Result.isOk(result)) throw new Error(getCreateApplicationErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      if (!candidateId?.trim()) return
      queryClient.invalidateQueries({ queryKey: applicationsKeys.byCandidate(candidateId) })
    },
  })
}

export function useUpdateApplicationStatusMutation(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const result = await updateApplicationStatus(id, status)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (updatedApp) => {
      queryClient.setQueryData<Application[]>(applicationsKeys.byJob(jobId), (old) => {
        if (!old) return old
        return old.map((app) =>
          app.id === updatedApp.id ? { ...app, status: updatedApp.status } : app
        )
      })
    },
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
      if (!organizationId) throw new Error("Organization ID required")
      const result = await getApplicationsByOrganization(organizationId, {
        page: params?.page,
        limit: params?.limit ?? 100,
        includeAnswers: params?.includeAnswers,
      })
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(organizationId),
  })
}
