"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getApplicationNotes, addApplicationNote, deleteApplicationNote } from "@/lib/api/notes"

export type { ApplicationNote } from "@/lib/api/notes"

const notesKey = (applicationId: string) => ["notes", applicationId] as const

export function useApplicationNotes(applicationId: string | undefined) {
  const query = useQuery({
    queryKey: notesKey(applicationId ?? ""),
    queryFn: () =>
      applicationId
        ? getApplicationNotes(applicationId)
        : Promise.resolve(undefined),
    enabled: Boolean(applicationId),
    staleTime: 30 * 1000,
  })
  const result = query.data
  const error = result?.isErr() ? result.error : query.error
  return {
    ...query,
    data: result?.isOk() ? result.value : undefined,
    error,
    isError: Boolean(error),
  }
}

export function useAddNoteMutation(applicationId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { content: string; tags?: string[] }) =>
      applicationId
        ? addApplicationNote({ applicationId, ...input })
        : Promise.resolve(undefined),
    onSuccess: (result) => {
      if (applicationId && result?.isOk()) {
        return queryClient.invalidateQueries({ queryKey: notesKey(applicationId) })
      }
    },
  })
}

export function useDeleteNoteMutation(applicationId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (noteId: string) => deleteApplicationNote(noteId),
    onSuccess: (result) => {
      if (applicationId && result.isOk()) {
        return queryClient.invalidateQueries({ queryKey: notesKey(applicationId) })
      }
    },
  })
}
