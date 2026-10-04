"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import {
  addOrganizationMember,
  getOrganizationMembers,
  type OrganizationMemberRole,
  removeMember,
  transferOrganizationOwnership,
  updateMemberRole,
} from "@/lib/api/organization-members"
import { getResultErrorMessage } from "@/lib/result"

export const memberKeys = {
  list: (orgId: string) => ["org-members", orgId] as const,
}

export function useOrganizationMembers(organizationId: string | undefined) {
  return useQuery({
    queryKey: memberKeys.list(organizationId ?? ""),
    queryFn: async () => {
      if (!organizationId) return Promise.reject(new Error("Organization ID required"))
      const result = await getOrganizationMembers(organizationId)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    enabled: Boolean(organizationId),
  })
}

export function useAddMemberMutation(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { userId: string; role: OrganizationMemberRole }) => {
      const result = await addOrganizationMember(organizationId, input)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.list(organizationId) })
      queryClient.invalidateQueries({ queryKey: ["organization"] })
      queryClient.invalidateQueries({ queryKey: ["org"] })
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export function useUpdateMemberRoleMutation(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: OrganizationMemberRole }) => {
      const result = await updateMemberRole(organizationId, memberId, role)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.list(organizationId) })
      queryClient.invalidateQueries({ queryKey: ["organization"] })
      queryClient.invalidateQueries({ queryKey: ["org"] })
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export function useRemoveMemberMutation(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (memberId: string) => {
      const result = await removeMember(organizationId, memberId)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.list(organizationId) })
      queryClient.invalidateQueries({ queryKey: ["organization"] })
      queryClient.invalidateQueries({ queryKey: ["org"] })
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export function useTransferOwnershipMutation(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newOwnerUserId: string) => {
      const result = await transferOrganizationOwnership(organizationId, newOwnerUserId)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization", organizationId] })
      queryClient.invalidateQueries({ queryKey: memberKeys.list(organizationId) })
      queryClient.invalidateQueries({ queryKey: ["organization"] })
      queryClient.invalidateQueries({ queryKey: ["org"] })
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}
