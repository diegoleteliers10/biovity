"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
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
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
    enabled: Boolean(id),
  })
}

export function useCreateOrganizationMutation() {
  return useMutation({
    mutationFn: async (input: CreateOrganizationInput) => {
      const result = await createOrganization(input)
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
  })
}

export function useLinkUserToOrganizationMutation() {
  return useMutation({
    mutationFn: async ({ userId, organizationId }: { userId: string; organizationId: string }) => {
      const result = await linkUserToOrganization(userId, organizationId)
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
  })
}
