"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { getResultErrorMessage } from "@/lib/result"
import type {
  CreateEventInput,
  EventStatus,
  EventType,
  ParticipantStatus,
  UpdateEventInput,
} from "@/lib/types/events"
import {
  createEvent,
  createEventNote,
  deleteEvent,
  getEventById,
  getEventChangeHistory,
  getEventNotes,
  getEvents,
  getParticipantStatuses,
  getParticipantStatusHistory,
  updateEvent,
  updateParticipantStatus,
} from "./events"

import { removeCalendarEvent, storeCalendarEvent, storeParticipantStatus } from "./events-cache"

export const eventsKeys = {
  all: ["events"] as const,
  list: (filters?: Record<string, unknown>) => ["events", "list", filters] as const,
  detail: (id: string) => ["events", "detail", id] as const,
  notes: (eventId: string) => ["events", "notes", eventId] as const,
  statusHistory: (eventId: string, userId: string) =>
    ["events", "status-history", eventId, userId] as const,
  changeHistory: (eventId: string) => ["events", "change-history", eventId] as const,
}

export function useEvents(filters?: {
  userId?: string
  organizerId?: string
  organizationId?: string
  applicationId?: string
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
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
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
      if (!id) return Promise.reject(new Error("Event ID required"))
      const result = await getEventById(id)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
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
    onMutate: () => queryClient.cancelQueries({ queryKey: eventsKeys.all }),
    mutationFn: async (input: CreateEventInput) => {
      const result = await createEvent(input)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: (data, input) => {
      void queryClient.cancelQueries({ queryKey: eventsKeys.all })
      storeCalendarEvent(queryClient, data, input.organizationId)
      void queryClient.invalidateQueries({ queryKey: ["org", "upcomingInterviews"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "metrics"] })
      void queryClient.invalidateQueries({ queryKey: ["user", "metrics"] })

      void queryClient.invalidateQueries({ queryKey: eventsKeys.all })
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    onMutate: () => queryClient.cancelQueries({ queryKey: eventsKeys.all }),
    mutationFn: async ({ id, input }: { id: string; input: UpdateEventInput }) => {
      const result = await updateEvent(id, input)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: (data) => {
      void queryClient.cancelQueries({ queryKey: eventsKeys.all })
      void queryClient.invalidateQueries({ queryKey: ["org", "upcomingInterviews"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "metrics"] })
      void queryClient.invalidateQueries({ queryKey: ["user", "metrics"] })

      queryClient.setQueryData(eventsKeys.detail(data.id), data)
      void queryClient.invalidateQueries({ queryKey: eventsKeys.changeHistory(data.id) })
      storeCalendarEvent(queryClient, data)
      void queryClient.invalidateQueries({ queryKey: eventsKeys.all })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    onMutate: () => queryClient.cancelQueries({ queryKey: eventsKeys.all }),
    mutationFn: async (id: string) => {
      const result = await deleteEvent(id)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: (_data, id) => {
      void queryClient.cancelQueries({ queryKey: eventsKeys.all })
      removeCalendarEvent(queryClient, id)
      void queryClient.invalidateQueries({ queryKey: eventsKeys.changeHistory(id) })
      void queryClient.invalidateQueries({ queryKey: ["org", "upcomingInterviews"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "metrics"] })
      void queryClient.invalidateQueries({ queryKey: ["user", "metrics"] })

      void queryClient.invalidateQueries({ queryKey: eventsKeys.all })
    },
  })
}

export function useUpdateParticipantStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    onMutate: () => queryClient.cancelQueries({ queryKey: eventsKeys.all }),
    mutationFn: async ({
      eventId,
      userId,
      status,
    }: {
      eventId: string
      userId: string
      status: ParticipantStatus
    }) => {
      const result = await updateParticipantStatus(eventId, userId, status)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: async (data, variables) => {
      await queryClient.cancelQueries({ queryKey: ["events", "participant-statuses"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "upcomingInterviews"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "metrics"] })
      void queryClient.invalidateQueries({ queryKey: ["user", "metrics"] })

      queryClient.setQueryData(eventsKeys.detail(data.id), data)
      storeCalendarEvent(queryClient, data)
      void queryClient.invalidateQueries({ queryKey: eventsKeys.all })
      void queryClient.invalidateQueries({
        queryKey: eventsKeys.statusHistory(variables.eventId, variables.userId),
      })
      if (!storeParticipantStatus(queryClient, data, variables.userId)) {
        void queryClient.invalidateQueries({ queryKey: ["events", "participant-statuses"] })
      }
    },
  })
}

export function useEventNotes(eventId: string | undefined) {
  const query = useQuery({
    queryKey: eventsKeys.notes(eventId ?? ""),
    queryFn: async () => {
      if (!eventId) return Promise.reject(new Error("Event ID required"))
      const result = await getEventNotes(eventId)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
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

export function useParticipantStatusHistory(
  eventId: string | undefined,
  userId: string | undefined
) {
  const query = useQuery({
    queryKey: eventsKeys.statusHistory(eventId ?? "", userId ?? ""),
    queryFn: async () => {
      if (!eventId || !userId)
        return Promise.reject(new Error("Event and participant IDs required"))
      const result = await getParticipantStatusHistory(eventId, userId)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    enabled: Boolean(eventId && userId),
  })

  return {
    history: query.data?.entries ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}

export function useEventChangeHistory(eventId: string | undefined, enabled = true) {
  const query = useQuery({
    queryKey: eventsKeys.changeHistory(eventId ?? ""),
    queryFn: async () => {
      if (!eventId) return Promise.reject(new Error("Event ID required"))
      const result = await getEventChangeHistory(eventId)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    enabled: Boolean(eventId && enabled),
  })

  return {
    history: query.data?.entries ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}

export function useCreateEventNote() {
  const queryClient = useQueryClient()

  return useMutation({
    onMutate: () => queryClient.cancelQueries({ queryKey: eventsKeys.all }),
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
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["org", "upcomingInterviews"] })
      void queryClient.invalidateQueries({ queryKey: ["org", "metrics"] })
      void queryClient.invalidateQueries({ queryKey: ["user", "metrics"] })

      void queryClient.invalidateQueries({ queryKey: eventsKeys.notes(variables.eventId) })
    },
  })
}

export function useParticipantStatuses(eventIds: string[]) {
  const query = useQuery({
    queryKey: ["events", "participant-statuses", eventIds] as const,
    queryFn: async () => {
      const result = await getParticipantStatuses(eventIds)
      if (!Result.isOk(result))
        return Promise.reject(new Error(getResultErrorMessage(result.error)))
      return result.value
    },
    enabled: eventIds.length > 0,
    staleTime: 30_000,
  })

  return {
    statuses: query.data ?? {},
    isLoading: query.isLoading,
  }
}
