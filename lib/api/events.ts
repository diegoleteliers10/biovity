import type {
  Event,
  EventWithParticipants,
  EventNote,
  CreateEventInput,
  UpdateEventInput,
  EventFilters,
  PaginatedEventsResponse,
} from "@/lib/types/events"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

function getErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback
  const d = data as Record<string, unknown>
  const msg = d.message
  if (Array.isArray(msg)) return msg.join(". ") || fallback
  if (typeof msg === "string") return msg
  if (typeof d.error === "string") return d.error
  return fallback
}

// ─── Events ─────────────────────────────────────────────────────────────────

export async function getEvents(
  filters?: EventFilters
): Promise<PaginatedEventsResponse | { error: string }> {
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

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al obtener eventos") }
  }

  return data as PaginatedEventsResponse
}

export async function getEventById(id: string): Promise<{ data: EventWithParticipants } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/events/${id}`)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al obtener el evento") }
  }

  return { data: data as EventWithParticipants }
}

export async function createEvent(
  input: CreateEventInput
): Promise<{ data: Event } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  let data: unknown
  try {
    data = await res.json()
  } catch {
    data = { message: res.statusText }
  }

  if (!res.ok) {
    const msg = (data as { message?: string })?.message ?? "Error al crear el evento"
    return { error: msg }
  }

  return { data: data as Event }
}

export async function updateEvent(
  id: string,
  input: UpdateEventInput
): Promise<{ data: EventWithParticipants } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al actualizar el evento") }
  }

  return { data: data as EventWithParticipants }
}

export async function deleteEvent(id: string): Promise<{ data: void } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/events/${id}`, {
      method: "DELETE",
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    return { error: getErrorMessage(data, "Error al eliminar el evento") }
  }

  return { data: undefined }
}

// ─── Participants ─────────────────────────────────────────────────────────────

export async function addEventParticipant(
  eventId: string,
  userId: string,
  role: "attendee" | "guest" = "attendee"
): Promise<{ data: EventWithParticipants } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/events/${eventId}/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al agregar participante") }
  }

  return { data: data as EventWithParticipants }
}

export async function removeEventParticipant(
  eventId: string,
  userId: string
): Promise<{ data: void } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/events/${eventId}/participants/${userId}`, {
      method: "DELETE",
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    return { error: getErrorMessage(data, "Error al eliminar participante") }
  }

  return { data: undefined }
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export async function getEventNotes(
  eventId: string
): Promise<{ data: EventNote[] } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/events/${eventId}/notes`)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al obtener notas") }
  }

  return { data: data as EventNote[] }
}

export async function createEventNote(
  eventId: string,
  authorId: string,
  content: string
): Promise<{ data: EventNote } | { error: string }> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/v1/events/${eventId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, authorId }),
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error de red" }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { error: getErrorMessage(data, "Error al crear nota") }
  }

  return { data: data as EventNote }
}
