"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result as R } from "better-result"
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
      return R.isOk(result) ? result.value : []
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
      return R.isOk(result) ? result.value : []
    },
    enabled: Boolean(candidateId && organizationId),
  })
}

export function useCreateTagMutation(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, color }: { name: string; color?: string }) =>
      createTag(organizationId, name, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...tagsKey, organizationId] })
    },
  })
}

export function useDeleteTagMutation(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tagId: string) => deleteTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...tagsKey, organizationId] })
    },
  })
}

export function useAssignTagMutation(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tagId, candidateId }: { tagId: string; candidateId: string }) =>
      assignTag(tagId, candidateId),
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
      queryClient.invalidateQueries({ queryKey: [...tagsKey, organizationId] })
    },
  })
}

export function useUnassignTagMutation(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tagId, candidateId }: { tagId: string; candidateId: string }) =>
      unassignTag(tagId, candidateId),
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
      queryClient.invalidateQueries({ queryKey: [...tagsKey, organizationId] })
    },
  })
}
