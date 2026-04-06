/**
 * Message types for the dashboard messaging system
 */

export type MessageType = "text" | "event" | "audio" | "image" | "file"

// Content type schemas for different message types
export interface EventContentType {
  eventId: string
  title: string
  description?: string
  type: "interview" | "task_deadline" | "announcement" | "onboarding"
  startAt: string
  endAt?: string
  location?: string
  meetingUrl?: string
  status: "scheduled" | "completed" | "cancelled"
  participantStatus: "pending" | "accepted" | "declined"
  candidateName: string
  candidateAvatar?: string
}

export interface AudioContentType {
  url: string
  duration: number
  waveform?: number[]
}

export interface ImageContentType {
  url: string
  thumbnailUrl?: string
  width?: number
  height?: number
  alt?: string
}

export interface FileContentType {
  url: string
  name: string
  size: number
  mimeType: string
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  type: MessageType
  contentType: EventContentType | AudioContentType | ImageContentType | FileContentType | null
  isRead: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  recruiterId: string
  professionalId: string
  lastMessage: string
  unreadCountRecruiter: number
  unreadCountProfessional: number
  createdAt: string
  updatedAt: string
}

export interface Chat {
  id: string
  recruiterId: string
  professionalId: string
  unreadCountRecruiter: number
  unreadCountProfessional: number
  createdAt: string
  updatedAt: string
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[]
}
