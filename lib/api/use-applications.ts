"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createApplication,
  getApplicationsByCandidate,
  getApplicationsByJob,
  updateApplicationStatus,
  type Application,
  type ApplicationStatus,
} from "./applications"

export const applicationsKeys = {
  byJob: (jobId: string) => ["applications", "job", jobId] as const,
  byCandidate: (candidateId: string) => ["applications", "candidate", candidateId] as const,
}

export function useApplicationsByJob(jobId: string | undefined) {
  return useQuery({
    queryKey: applicationsKeys.byJob(jobId ?? ""),
    queryFn: async () => {
      if (!jobId) throw new Error("Job ID required")
      const result = await getApplicationsByJob(jobId, { limit: 100 })
      if ("error" in result) throw new Error(result.error)
      return result.data
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
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
    enabled: Boolean(candidateId),
  })
}

export function useCreateApplicationMutation(candidateId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const result = await createApplication(jobId, candidateId)
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationsKeys.byCandidate(candidateId) })
    },
  })
}

export function useUpdateApplicationStatusMutation(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const result = await updateApplicationStatus(id, status)
      if ("error" in result) throw new Error(result.error)
      return result.data
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
