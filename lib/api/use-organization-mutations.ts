"use client"

import { useMutation } from "@tanstack/react-query"
import {
  createOrganization,
  linkUserToOrganization,
  type CreateOrganizationInput,
} from "./organizations"

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
    mutationFn: async ({
      userId,
      organizationId,
    }: {
      userId: string
      organizationId: string
    }) => {
      const result = await linkUserToOrganization(userId, organizationId)
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
  })
}
