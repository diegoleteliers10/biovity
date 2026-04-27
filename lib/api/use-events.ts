"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { getResultErrorMessage } from "@/lib/result"
import type { CreateEventInput, EventStatus, EventType, UpdateEventInput } from "@/lib/types/events"
import {
  addEventParticipant,
  createEvent,
  createEventNote,
  deleteEvent,
  getEventById,
  getEventNotes,
  getEvents,
  removeEventParticipant,
  updateEvent,
} from "./events"

export const eventsKeys = {
  all: ["events"] as const,
  list: (filters?: Record<string, unknown>) => ["events", "list", filters] as const,
  detail: (id: string) => ["events", "detail", id] as const,
  notes: (eventId: string) => ["events", "notes", eventId] as const,
}

export function useEvents(filters?: {
  userId?: string
  organizerId?: string
  type?: EventType
  status?: EventStatus
  from?: string
  to?: string
  page?: number
  limit?: number
}) {
  const query = useQuery({
    queryKey: eventsKeys.list(filters),
    queryFn: async () => {
      const result = await getEvents(filters)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
  })

  return {
    events: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? 1,
    limit: query.data?.limit ?? 10,
    totalPages: query.data?.totalPages ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useEvent(id: string | undefined) {
  const query = useQuery({
    queryKey: eventsKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) throw new Error("Event ID required")
      const result = await getEventById(id)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(id),
  })

  return {
    event: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateEventInput) => {
      const result = await createEvent(input)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.all })
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateEventInput }) => {
      const result = await updateEvent(id, input)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (data) => {
      queryClient.setQueryData(eventsKeys.detail(data.id), data)
      queryClient.invalidateQueries({ queryKey: eventsKeys.all })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteEvent(id)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.all })
    },
  })
}

export function useAddEventParticipant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      eventId,
      userId,
      role,
    }: {
      eventId: string
      userId: string
      role?: "attendee" | "guest"
    }) => {
      const result = await addEventParticipant(eventId, userId, role)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (data) => {
      queryClient.setQueryData(eventsKeys.detail(data.id), data)
    },
  })
}

export function useRemoveEventParticipant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      const result = await removeEventParticipant(eventId, userId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: eventsKeys.detail(variables.eventId) })
    },
  })
}

export function useEventNotes(eventId: string | undefined) {
  const query = useQuery({
    queryKey: eventsKeys.notes(eventId ?? ""),
    queryFn: async () => {
      if (!eventId) throw new Error("Event ID required")
      const result = await getEventNotes(eventId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(eventId),
  })

  return {
    notes: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useCreateEventNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      eventId,
      authorId,
      content,
    }: {
      eventId: string
      authorId: string
      content: string
    }) => {
      const result = await createEventNote(eventId, authorId, content)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: eventsKeys.notes(variables.eventId) })
    },
  })
}
