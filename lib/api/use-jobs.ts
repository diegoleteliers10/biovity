"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { getResultErrorMessage } from "@/lib/result"
import {
  type CreateJobInput,
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByOrganization,
  type UpdateJobInput,
  updateJob,
} from "./jobs"

export const jobsKeys = {
  list: (organizationId?: string) => ["jobs", organizationId ?? ""] as const,
  byOrganization: (organizationId: string) => ["jobs", "organization", organizationId] as const,
  search: (params?: { search?: string; page?: number; category?: string }) =>
    ["jobs", "search", params?.search ?? "", params?.page ?? 1, params?.category ?? ""] as const,
  detail: (id: string) => ["jobs", "detail", id] as const,
}

export function useJobs(organizationId: string | undefined) {
  return useQuery({
    queryKey: jobsKeys.list(organizationId),
    queryFn: async () => {
      const result = await getJobs({ organizationId })
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      let jobs = result.value.data
      if (organizationId && jobs.length > 0) {
        jobs = jobs.filter((j) => j.organizationId === organizationId)
      }
      return jobs
    },
    enabled: Boolean(organizationId),
  })
}

export function useJobsByOrganization(
  organizationId: string | undefined,
  params?: { page?: number; limit?: number; status?: string; search?: string }
) {
  return useQuery({
    queryKey: [
      ...jobsKeys.byOrganization(organizationId ?? ""),
      params?.page ?? 1,
      params?.limit ?? 10,
    ],
    queryFn: async () => {
      if (!organizationId) throw new Error("Organization ID required")
      const result = await getJobsByOrganization(organizationId, {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        status: params?.status,
        search: params?.search,
      })
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(organizationId),
  })
}

export function useJobsSearch(params?: { search?: string; category?: string; page?: number }) {
  return useQuery({
    queryKey: jobsKeys.search(params),
    queryFn: async () => {
      const result = await getJobs({
        status: "active",
        limit: 100,
        ...(params?.search?.trim() && { search: params.search.trim() }),
        ...(params?.category && { category: params.category }),
        page: params?.page,
      })
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
  })
}

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: jobsKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) throw new Error("Job ID required")
      const result = await getJob(id)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(id),
  })
}

export function useCreateJobMutation(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<CreateJobInput, "organizationId">) => {
      const result = await createJob({ ...input, organizationId })
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.list(organizationId) })
      queryClient.invalidateQueries({ queryKey: jobsKeys.byOrganization(organizationId) })
    },
  })
}

export function useUpdateJobMutation(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateJobInput }) => {
      const result = await updateJob(id, input)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.list(organizationId) })
      queryClient.invalidateQueries({ queryKey: jobsKeys.byOrganization(organizationId) })
      queryClient.invalidateQueries({ queryKey: jobsKeys.detail(id) })
    },
  })
}

export function useDeleteJobMutation(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteJob(id)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.list(organizationId) })
      queryClient.invalidateQueries({ queryKey: jobsKeys.byOrganization(organizationId) })
    },
  })
}
