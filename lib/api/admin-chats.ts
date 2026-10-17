import type { Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

export type AdminChatParticipant = {
  id: string
  name: string
  email: string
}

export type AdminLegacyChatSummary = {
  id: string
  createdAt: string
  updatedAt: string | null
  recruiter: AdminChatParticipant
  professional: AdminChatParticipant
}

export type AdminLegacyChatMessage = {
  id: string
  senderId: string
  senderName: string
  content: string
  createdAt: string
}

export type AdminLegacyChatDetail = AdminLegacyChatSummary & {
  messages: AdminLegacyChatMessage[]
}

export type AdminVerifiedOrganization = {
  id: string
  name: string
}

export type AdminChatPage<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type AssignAdminChatOrganizationResult = {
  chatId: string
  organizationId: string
  assignedById: string
  assignedAt: string
}

export function buildAdminChatsUrl(input: { page: number; limit: number }): string {
  const query = new URLSearchParams({ page: String(input.page), limit: String(input.limit) })
  return `/api/admin/chats?${query}`
}

export function buildVerifiedOrganizationsUrl(input: {
  page: number
  limit: number
  search?: string
}): string {
  const query = new URLSearchParams({
    resource: "verified-organizations",
    page: String(input.page),
    limit: String(input.limit),
  })
  if (input.search?.trim()) query.set("search", input.search.trim())
  return `/api/admin/chats?${query}`
}

export function buildAdminChatReviewUrl(chatId: string): string {
  return `/api/admin/chats/${encodeURIComponent(chatId)}/organization`
}

export async function getAdminLegacyChats(input: {
  page: number
  limit: number
}): Promise<Result<AdminChatPage<AdminLegacyChatSummary>, ApiError | NetworkError>> {
  return fetchJson<AdminChatPage<AdminLegacyChatSummary>>(buildAdminChatsUrl(input))
}

export async function getAdminVerifiedOrganizations(input: {
  page: number
  limit: number
  search?: string
}): Promise<Result<AdminChatPage<AdminVerifiedOrganization>, ApiError | NetworkError>> {
  return fetchJson<AdminChatPage<AdminVerifiedOrganization>>(buildVerifiedOrganizationsUrl(input))
}

export async function getAdminLegacyChat(
  chatId: string
): Promise<Result<AdminLegacyChatDetail, ApiError | NetworkError>> {
  return fetchJson<AdminLegacyChatDetail>(buildAdminChatReviewUrl(chatId))
}

export async function assignAdminChatOrganization(
  chatId: string,
  organizationId: string
): Promise<Result<AssignAdminChatOrganizationResult, ApiError | NetworkError>> {
  return fetchJson<AssignAdminChatOrganizationResult>(buildAdminChatReviewUrl(chatId), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ organizationId }),
  })
}
