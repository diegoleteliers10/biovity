"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export type ApplicationNote = {
  id: string
  application_id: string
  author_id: string
  author_name: string
  content: string
  tags: string[]
  created_at: string
}

const notesKey = (applicationId: string) => ["notes", applicationId] as const

export function useApplicationNotes(applicationId: string | undefined) {
  return useQuery({
    queryKey: notesKey(applicationId ?? ""),
    queryFn: async () => {
      if (!applicationId) return [] as ApplicationNote[]
      const res = await fetch(`/api/notes?applicationId=${applicationId}`)
      if (!res.ok) return [] as ApplicationNote[]
      return res.json() as Promise<ApplicationNote[]>
    },
    enabled: Boolean(applicationId),
    staleTime: 30 * 1000,
  })
}

export function useAddNoteMutation(applicationId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { content: string; tags?: string[] }) => {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, ...input }),
      })
      if (!res.ok) throw new Error("Failed to add note")
      return res.json() as Promise<ApplicationNote>
    },
    onSuccess: () => {
      if (applicationId) {
        queryClient.invalidateQueries({ queryKey: notesKey(applicationId) })
      }
    },
  })
}

export function useDeleteNoteMutation(applicationId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (noteId: string) => {
      const res = await fetch(`/api/notes?id=${noteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete note")
    },
    onSuccess: () => {
      if (applicationId) {
        queryClient.invalidateQueries({ queryKey: notesKey(applicationId) })
      }
    },
  })
}
