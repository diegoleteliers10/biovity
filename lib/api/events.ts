import { Result } from "better-result"
import { type ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, fetchJsonWithSession, fetchNoContent } from "@/lib/result"
import type {
  CreateEventInput,
  Event,
  EventFilters,
  EventNote,
  EventWithParticipants,
  PaginatedEventsResponse,
  ParticipantStatus,
  UpdateEventInput,
} from "@/lib/types/events"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export async function getEvents(
  filters?: EventFilters,
  requestHeaders?: Headers
): Promise<Result<PaginatedEventsResponse, ApiError | NetworkError>> {
  const searchParams = new URLSearchParams()
  if (filters?.userId) searchParams.set("userId", filters.userId)
  if (filters?.organizationId) searchParams.set("organizationId", filters.organizationId)
  if (filters?.organizerId) searchParams.set("organizerId", filters.organizerId)
  if (filters?.type) searchParams.set("type", filters.type)
  if (filters?.status) searchParams.set("status", filters.status)
  if (filters?.from) searchParams.set("from", filters.from)
  if (filters?.to) searchParams.set("to", filters.to)
  if (filters?.page != null) searchParams.set("page", String(filters.page))
  if (filters?.limit != null) searchParams.set("limit", String(filters.limit))

  const query = searchParams.toString()
  const url = `${API_BASE}/api/v1/events${query ? `?${query}` : ""}`

  return requestHeaders
    ? fetchJsonWithSession<PaginatedEventsResponse>(url, requestHeaders)
    : fetchJson<PaginatedEventsResponse>(url)
}

export async function getEventById(
  id: string
): Promise<Result<EventWithParticipants, ApiError | NetworkError>> {
  const result = await fetchJson<{ data: EventWithParticipants }>(`${API_BASE}/api/v1/events/${id}`)
  if (result.isErr()) return Result.err(result.error)
  return Result.ok(result.value.data)
}

export async function createEvent(
  input: CreateEventInput,
  requestHeaders?: Headers
): Promise<Result<Event, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/events`
  const init: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }
  const result = requestHeaders
    ? await fetchJsonWithSession<{ data: Event }>(url, requestHeaders, init)
    : await fetchJson<{ data: Event }>(url, init)
  if (result.isErr()) return Result.err(result.error)
  return Result.ok(result.value.data)
}

export async function updateEvent(
  id: string,
  input: UpdateEventInput,
  requestHeaders?: Headers
): Promise<Result<EventWithParticipants, ApiError | NetworkError>> {
  const url = `${API_BASE}/api/v1/events/${id}`
  const init: RequestInit = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }
  const result = requestHeaders
    ? await fetchJsonWithSession<{ data: EventWithParticipants }>(url, requestHeaders, init)
    : await fetchJson<{ data: EventWithParticipants }>(url, init)
  if (result.isErr()) return Result.err(result.error)
  return Result.ok(result.value.data)
}

export async function deleteEvent(id: string): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(`${API_BASE}/api/v1/events/${id}`, {
    method: "DELETE",
  })
}

export async function updateParticipantStatus(
  eventId: string,
  userId: string,
  status: ParticipantStatus
): Promise<Result<EventWithParticipants, ApiError | NetworkError>> {
  const result = await fetchJson<{ data: EventWithParticipants }>(
    `${API_BASE}/api/v1/events/${eventId}/participants/${userId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  )
  if (result.isErr()) return Result.err(result.error)
  return Result.ok(result.value.data)
}

export async function getEventNotes(
  eventId: string
): Promise<Result<EventNote[], ApiError | NetworkError>> {
  const result = await fetchJson<{ data: EventNote[] }>(
    `${API_BASE}/api/v1/events/${eventId}/notes`
  )
  if (result.isErr()) return Result.err(result.error)
  return Result.ok(result.value.data)
}

export async function createEventNote(
  eventId: string,
  authorId: string,
  content: string
): Promise<Result<EventNote, ApiError | NetworkError>> {
  const result = await fetchJson<{ data: EventNote }>(
    `${API_BASE}/api/v1/events/${eventId}/notes`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, authorId }),
    }
  )
  if (result.isErr()) return Result.err(result.error)
  return Result.ok(result.value.data)
}

export async function getParticipantStatuses(
  eventIds: string[]
): Promise<Result<Record<string, ParticipantStatus>, ApiError | NetworkError>> {
  const base =
    typeof window !== "undefined"
      ? ""
      : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
  const res = await fetch(`${base}/api/events/participant-statuses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventIds }),
  })
  if (!res.ok) {
    return Result.err(
      new NetworkError({
        message: `HTTP ${res.status}`,
      })
    )
  }
  const json = (await res.json()) as { statuses: Record<string, string> }
  return Result.ok(json.statuses as Record<string, ParticipantStatus>)
}
