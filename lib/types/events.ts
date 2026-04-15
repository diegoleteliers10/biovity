/**
 * Event types for calendar and scheduling system
 */

export type EventType = "interview" | "task_deadline" | "announcement" | "onboarding"
export type EventStatus = "scheduled" | "completed" | "cancelled"
export type ParticipantRole = "organizer" | "attendee" | "guest"
export type ParticipantStatus = "pending" | "accepted" | "declined"

export type Event = {
  id: string
  title: string
  description?: string
  type: EventType
  startAt: string
  endAt?: string
  location?: string
  meetingUrl?: string
  status: EventStatus
  organizerId: string
  candidateId?: string
  applicationId?: string
  createdAt: string
  updatedAt: string
}

export type EventParticipant = {
  id: string
  eventId: string
  userId: string
  role: ParticipantRole
  status: ParticipantStatus
  joinedAt?: string
  createdAt: string
}

export type EventWithParticipants = Event & {
  participants: EventParticipant[]
}

export type EventNote = {
  id: string
  eventId: string
  authorId: string
  content: string
  createdAt: string
}

export type CreateEventInput = {
  title: string
  description?: string
  type: EventType
  startAt: string
  endAt?: string
  location?: string
  meetingUrl?: string
  organizerId: string
  organizationId?: string
  candidateId?: string
  applicationId?: string
}

export type UpdateEventInput = {
  title?: string
  description?: string
  type?: EventType
  startAt?: string
  endAt?: string
  location?: string
  meetingUrl?: string
  status?: EventStatus
}

export type EventFilters = {
  userId?: string
  organizerId?: string
  type?: EventType
  status?: EventStatus
  from?: string
  to?: string
  page?: number
  limit?: number
}

export type PaginatedEventsResponse = {
  data: Event[]
  total: number
  page: number
  limit: number
  totalPages: number
}
