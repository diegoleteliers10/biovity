import { Result as R, type Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, fetchNoContent } from "@/lib/result"
import type {
  CreateEventInput,
  Event,
  EventFilters,
  EventNote,
  EventWithParticipants,
  PaginatedEventsResponse,
  UpdateEventInput,
} from "@/lib/types/events"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export async function getEvents(
  filters?: EventFilters
): Promise<Result<PaginatedEventsResponse, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (filters?.userId) searchParams.set("userId", filters.userId)
  if (filters?.organizerId) searchParams.set("organizerId", filters.organizerId)
  if (filters?.type) searchParams.set("type", filters.type)
  if (filters?.status) searchParams.set("status", filters.status)
  if (filters?.from) searchParams.set("from", filters.from)
  if (filters?.to) searchParams.set("to", filters.to)
  if (filters?.page != null) searchParams.set("page", String(filters.page))
  if (filters?.limit != null) searchParams.set("limit", String(filters.limit))

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/events${query ? `?${query}` : ""}`

  return fetchJson<PaginatedEventsResponse>(url)
}

export async function getEventById(
  id: string
): Promise<Result<EventWithParticipants, ApiError | NetworkError>> {
  return fetchJson<EventWithParticipants>(`${API_BASE}/api/v1/events/${id}`)
}

export async function createEvent(
  input: CreateEventInput
): Promise<Result<Event, ApiError | NetworkError>> {
  return fetchJson<Event>(`${API_BASE}/api/v1/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}

export async function updateEvent(
  id: string,
  input: UpdateEventInput
): Promise<Result<EventWithParticipants, ApiError | NetworkError>> {
  return fetchJson<EventWithParticipants>(`${API_BASE}/api/v1/events/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}

export async function deleteEvent(id: string): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(`${API_BASE}/api/v1/events/${id}`, {
    method: "DELETE",
  })
}

export async function addEventParticipant(
  eventId: string,
  userId: string,
  role: "attendee" | "guest" = "attendee"
): Promise<Result<EventWithParticipants, ApiError | NetworkError>> {
  return fetchJson<EventWithParticipants>(`${API_BASE}/api/v1/events/${eventId}/participants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, role }),
  })
}

export async function removeEventParticipant(
  eventId: string,
  userId: string
): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(`${API_BASE}/api/v1/events/${eventId}/participants/${userId}`, {
    method: "DELETE",
  })
}

export async function getEventNotes(
  eventId: string
): Promise<Result<EventNote[], ApiError | NetworkError>> {
  return fetchJson<EventNote[]>(`${API_BASE}/api/v1/events/${eventId}/notes`)
}

export async function createEventNote(
  eventId: string,
  authorId: string,
  content: string
): Promise<Result<EventNote, ApiError | NetworkError>> {
  return fetchJson<EventNote>(`${API_BASE}/api/v1/events/${eventId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, authorId }),
  })
}
