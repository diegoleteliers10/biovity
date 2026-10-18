/**
 * Event types for calendar and scheduling system
 */

export type EventType = "interview" | "task_deadline" | "announcement" | "onboarding"
export type EventStatus = "scheduled" | "completed" | "cancelled"
export type EventCalendarProvider = "biovity" | "google"
export type ParticipantRole = "organizer" | "attendee" | "guest"
export type ParticipantStatus = "pending" | "accepted" | "declined"

export type Event = {
  id: string
  title: string
  description?: string
  type: EventType
  timeZone?: string
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

export type EventParticipantStatusHistory = {
  eventId: string
  userId: string
  entries: Array<{
    id: string
    fromStatus: ParticipantStatus
    toStatus: ParticipantStatus
    changedAt: string
  }>
}

export type EventChangeField =
  | "title"
  | "description"
  | "type"
  | "timeZone"
  | "startAt"
  | "endAt"
  | "location"
  | "meetingUrl"
  | "calendarProvider"
  | "status"

export type EventChangeHistory = {
  eventId: string
  entries: Array<{
    id: string
    actorUserId: string | null
    action: "updated" | "cancelled"
    changes: Partial<Record<EventChangeField, { from: string | null; to: string | null }>>
    createdAt: string
  }>
}

export type CreateEventInput = {
  title: string
  description?: string
  type: EventType
  calendarProvider?: EventCalendarProvider
  timeZone?: string
  startAt: string
  endAt?: string
  location?: string
  meetingUrl?: string
  organizerId: string
  organizationId?: string
  candidateId?: string
  applicationId?: string
  interviewerIds?: string[]
  interviewerAssignments?: Array<{ userId: string; roleId: string }>
}

export type UpdateEventInput = {
  title?: string
  description?: string
  type?: EventType
  calendarProvider?: EventCalendarProvider
  timeZone?: string
  startAt?: string
  endAt?: string
  location?: string
  meetingUrl?: string
  status?: EventStatus
}

export type EventFilters = {
  organizationId?: string
  applicationId?: string
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
