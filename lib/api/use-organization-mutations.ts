"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { Result } from "better-result"
import { getResultErrorMessage } from "@/lib/result"
import {
  type CreateOrganizationInput,
  createOrganization,
  getOrganization,
  linkUserToOrganization,
} from "./organizations"

export function useOrganization(id: string | undefined) {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: async () => {
      if (!id) throw new Error("Organization ID required")
      const result = await getOrganization(id)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(id),
  })
}

export function useCreateOrganizationMutation() {
  return useMutation({
    mutationFn: async (input: CreateOrganizationInput) => {
      const result = await createOrganization(input)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
  })
}

export function useLinkUserToOrganizationMutation() {
  return useMutation({
    mutationFn: async ({ userId, organizationId }: { userId: string; organizationId: string }) => {
      const result = await linkUserToOrganization(userId, organizationId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
  })
}
