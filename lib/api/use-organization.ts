"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { getResultErrorMessage } from "@/lib/result"
import { getOrganization, type UpdateOrganizationInput, updateOrganization } from "./organizations"

export const organizationKeys = {
  detail: (id: string) => ["organization", id] as const,
}

export function useOrganization(id: string | undefined) {
  return useQuery({
    queryKey: organizationKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) throw new Error("Organization ID required")
      const result = await getOrganization(id)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(id),
  })
}

export function useUpdateOrganizationMutation(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateOrganizationInput) => {
      const result = await updateOrganization(organizationId, input)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(organizationId) })
    },
  })
}
