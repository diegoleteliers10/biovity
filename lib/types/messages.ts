/**
 * Message types for the dashboard messaging system
 */

export type MessageSender = "user" | "recruiter"

export interface Message {
  id: number
  text: string
  time: string
  sender: MessageSender
  isRead: boolean
}

export interface RecruiterInfo {
  name: string
  company: string
  position: string
  avatar: string
  isOnline: boolean
}

export interface Conversation {
  id: number
  recruiter: RecruiterInfo
  lastMessage: {
    text: string
    time: string
    isRead: boolean
    sender: MessageSender
  }
  unreadCount: number
  jobTitle: string
  status: string
  statusColor: string
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[]
}

export interface MessagesData {
  conversations: Conversation[]
  activeConversation: {
    id: number
    recruiter: RecruiterInfo
    jobTitle: string
    messages: Message[]
  }
}
