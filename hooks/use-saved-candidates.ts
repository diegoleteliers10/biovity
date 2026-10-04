"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Result } from "better-result"

async function mutationValue<T, E>(operation: Promise<Result<T, E>>): Promise<T> {
  const result = await operation
  return result.isOk() ? result.value : Promise.reject(result.error)
}

import {
  getSavedCandidates,
  isCandidateSaved,
  saveCandidate,
  unsaveCandidate,
} from "@/lib/api/saved-candidates"

const savedCandidatesKey = ["saved-candidates"] as const

export function useSavedCandidates(organizationId?: string) {
  return useQuery({
    queryKey: [...savedCandidatesKey, organizationId],
    queryFn: async () => {
      if (!organizationId) return []
      const result = await getSavedCandidates(organizationId)
      return result.isOk() ? result.value : Promise.reject(result.error)
    },
    enabled: Boolean(organizationId),
  })
}

export function useIsCandidateSaved(organizationId?: string, candidateId?: string) {
  return useQuery({
    queryKey: [...savedCandidatesKey, "check", organizationId, candidateId],
    queryFn: async () => {
      if (!organizationId || !candidateId) return false
      const result = await isCandidateSaved(organizationId, candidateId)
      return result.isOk() ? result.value : Promise.reject(result.error)
    },
    enabled: Boolean(organizationId && candidateId),
  })
}

export function useSaveCandidateMutation(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (candidateId: string) => mutationValue(saveCandidate(organizationId, candidateId)),
    onMutate: async (candidateId) => {
      await queryClient.cancelQueries({
        queryKey: [...savedCandidatesKey, "check", organizationId, candidateId],
      })
      const previous = queryClient.getQueryData<boolean>([
        ...savedCandidatesKey,
        "check",
        organizationId,
        candidateId,
      ])
      queryClient.setQueryData([...savedCandidatesKey, "check", organizationId, candidateId], true)
      return { previous }
    },
    onError: (_err, candidateId, context) => {
      if (context?.previous === undefined) {
        queryClient.removeQueries({
          queryKey: [...savedCandidatesKey, "check", organizationId, candidateId],
          exact: true,
        })
        return
      }
      queryClient.setQueryData(
        [...savedCandidatesKey, "check", organizationId, candidateId],
        context.previous
      )
    },
    onSettled: (_data, _err, candidateId) => {
      queryClient.invalidateQueries({ queryKey: [...savedCandidatesKey, organizationId] })
      queryClient.invalidateQueries({
        queryKey: [...savedCandidatesKey, "check", organizationId, candidateId],
      })
    },
  })
}

export function useUnsaveCandidateMutation(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (candidateId: string) =>
      mutationValue(unsaveCandidate(organizationId, candidateId)),
    onMutate: async (candidateId) => {
      await queryClient.cancelQueries({
        queryKey: [...savedCandidatesKey, "check", organizationId, candidateId],
      })
      const previous = queryClient.getQueryData<boolean>([
        ...savedCandidatesKey,
        "check",
        organizationId,
        candidateId,
      ])
      queryClient.setQueryData([...savedCandidatesKey, "check", organizationId, candidateId], false)
      return { previous }
    },
    onError: (_err, candidateId, context) => {
      if (context?.previous === undefined) {
        queryClient.removeQueries({
          queryKey: [...savedCandidatesKey, "check", organizationId, candidateId],
          exact: true,
        })
        return
      }
      queryClient.setQueryData(
        [...savedCandidatesKey, "check", organizationId, candidateId],
        context.previous
      )
    },
    onSettled: (_data, _err, candidateId) => {
      queryClient.invalidateQueries({ queryKey: [...savedCandidatesKey, organizationId] })
      queryClient.invalidateQueries({
        queryKey: [...savedCandidatesKey, "check", organizationId, candidateId],
      })
    },
  })
}
