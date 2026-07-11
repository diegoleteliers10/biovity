"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { getResultErrorMessage } from "@/lib/result"
import {
  type CreateJobTemplateInput,
  createJobTemplate,
  deleteJobTemplate,
  getJobTemplates,
  type JobTemplate,
  type UpdateJobTemplateInput,
  updateJobTemplate,
} from "./job-templates"

export const jobTemplatesKeys = {
  byOrg: (organizationId: string) => ["job-templates", "org", organizationId] as const,
}

export function useJobTemplates(organizationId: string | undefined) {
  const safeOrgId = organizationId ?? ""
  return useQuery({
    queryKey: jobTemplatesKeys.byOrg(safeOrgId),
    queryFn: async () => {
      if (!safeOrgId) return []
      const result = await getJobTemplates(safeOrgId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(safeOrgId),
  })
}

export function useCreateJobTemplateMutation(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateJobTemplateInput) => {
      const result = await createJobTemplate(organizationId, input)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (template) => {
      qc.setQueryData<JobTemplate[]>(jobTemplatesKeys.byOrg(organizationId), (old) =>
        old ? [template, ...old] : [template]
      )
    },
  })
}

export function useUpdateJobTemplateMutation(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateJobTemplateInput }) => {
      const result = await updateJobTemplate(organizationId, id, input)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (updated) => {
      qc.setQueryData<JobTemplate[]>(jobTemplatesKeys.byOrg(organizationId), (old) =>
        old?.map((t) => (t.id === updated.id ? updated : t))
      )
    },
  })
}

export function useDeleteJobTemplateMutation(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteJobTemplate(organizationId, id)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
    },
    onSuccess: (_, id) => {
      qc.setQueryData<JobTemplate[]>(jobTemplatesKeys.byOrg(organizationId), (old) =>
        old?.filter((t) => t.id !== id)
      )
    },
  })
}
