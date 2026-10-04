"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Result } from "better-result"

async function mutationValue<T, E>(operation: Promise<Result<T, E>>): Promise<T> {
  const result = await operation
  return result.isOk() ? result.value : Promise.reject(result.error)
}

import {
  assignTag,
  createTag,
  deleteTag,
  getCandidateTags,
  getTags,
  unassignTag,
} from "@/lib/api/candidate-tags"

const tagsKey = ["candidate-tags"] as const

export function useCandidateTags(organizationId?: string) {
  return useQuery({
    queryKey: [...tagsKey, organizationId],
    queryFn: async () => {
      if (!organizationId) return []
      const result = await getTags(organizationId)
      return result.isOk() ? result.value : Promise.reject(result.error)
    },
    enabled: Boolean(organizationId),
  })
}

export function useCandidateTagList(candidateId?: string, organizationId?: string) {
  return useQuery({
    queryKey: [...tagsKey, "candidate", candidateId, organizationId],
    queryFn: async () => {
      if (!candidateId || !organizationId) return []
      const result = await getCandidateTags(candidateId, organizationId)
      return result.isOk() ? result.value : Promise.reject(result.error)
    },
    enabled: Boolean(candidateId && organizationId),
  })
}

export function useCreateTagMutation(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, color }: { name: string; color?: string }) =>
      mutationValue(createTag(organizationId, name, color)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKey })
    },
  })
}

export function useDeleteTagMutation(_organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tagId: string) => mutationValue(deleteTag(tagId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKey })
    },
  })
}

export function useAssignTagMutation(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tagId, candidateId }: { tagId: string; candidateId: string }) =>
      mutationValue(assignTag(tagId, candidateId)),
    onMutate: async ({ candidateId }) => {
      await queryClient.cancelQueries({
        queryKey: [...tagsKey, "candidate", candidateId, organizationId],
      })
      const previous = queryClient.getQueryData([
        ...tagsKey,
        "candidate",
        candidateId,
        organizationId,
      ])
      return { previous }
    },
    onSettled: (_data, _err, { candidateId }) => {
      queryClient.invalidateQueries({
        queryKey: [...tagsKey, "candidate", candidateId, organizationId],
      })
      queryClient.invalidateQueries({ queryKey: tagsKey })
    },
  })
}

export function useUnassignTagMutation(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tagId, candidateId }: { tagId: string; candidateId: string }) =>
      mutationValue(unassignTag(tagId, candidateId)),
    onMutate: async ({ candidateId }) => {
      await queryClient.cancelQueries({
        queryKey: [...tagsKey, "candidate", candidateId, organizationId],
      })
      const previous = queryClient.getQueryData([
        ...tagsKey,
        "candidate",
        candidateId,
        organizationId,
      ])
      return { previous }
    },
    onSettled: (_data, _err, { candidateId }) => {
      queryClient.invalidateQueries({
        queryKey: [...tagsKey, "candidate", candidateId, organizationId],
      })
      queryClient.invalidateQueries({ queryKey: tagsKey })
    },
  })
}
