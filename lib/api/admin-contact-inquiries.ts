import { Result as R, type Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

export type ContactInquiryStatus = "open" | "in_progress" | "resolved"

export type ContactInquiry = {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string | null
  empresa: string
  mensaje: string
  isRead: boolean
  createdAt: string
  status: ContactInquiryStatus
  assignedAdminId: string | null
  assigneeName: string | null
  followUpAt: string | null
  resolutionNote: string | null
  resolvedAt: string | null
  updatedAt: string
}

export type ContactInquiryEvent = {
  id: number
  actorUserId: string | null
  actorName: string | null
  eventType: string
  previousStatus: ContactInquiryStatus | null
  newStatus: ContactInquiryStatus | null
  previousAssignedAdminId: string | null
  newAssignedAdminId: string | null
  previousFollowUpAt: string | null
  newFollowUpAt: string | null
  note: string | null
  createdAt: string
}

export type AdminOperator = { id: string; name: string; email: string }

export type ContactInquiryPage = {
  data: ContactInquiry[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ContactInquiryFilters = {
  page: number
  limit: number
  search: string
  status: ContactInquiryStatus | "all"
  assigneeId: string | "all"
  overdue: boolean
}

export type ContactInquiryUpdate = {
  status?: ContactInquiryStatus
  assignedAdminId?: string | null
  followUpAt?: string | null
  resolutionNote?: string | null
}

export async function getContactInquiries(
  filters: ContactInquiryFilters
): Promise<Result<ContactInquiryPage, ApiError | NetworkError>> {
  const query = new URLSearchParams()
  query.set("page", String(filters.page))
  query.set("limit", String(filters.limit))
  if (filters.search.trim()) query.set("search", filters.search.trim())
  if (filters.status !== "all") query.set("status", filters.status)
  if (filters.assigneeId !== "all" && filters.assigneeId !== "unassigned") {
    query.set("assigneeId", filters.assigneeId)
  }
  if (filters.assigneeId === "unassigned") query.set("unassigned", "true")
  if (filters.overdue) query.set("overdue", "true")
  return fetchJson<ContactInquiryPage>(`/api/admin/contact-operations?${query}`)
}

export async function getAllContactInquiries(
  filters: ContactInquiryFilters
): Promise<Result<ContactInquiry[], ApiError | NetworkError>> {
  const firstPage = await getContactInquiries({ ...filters, page: 1, limit: 50 })
  if (firstPage.isErr()) return R.err(firstPage.error)
  const inquiries = [...firstPage.value.data]
  for (let page = 2; page <= firstPage.value.totalPages; page += 1) {
    const result = await getContactInquiries({ ...filters, page, limit: 50 })
    if (result.isErr()) return R.err(result.error)
    inquiries.push(...result.value.data)
  }
  return R.ok(inquiries)
}

export async function getContactInquiryOperators(): Promise<
  Result<AdminOperator[], ApiError | NetworkError>
> {
  const result = await fetchJson<{ data: AdminOperator[] }>(
    "/api/admin/contact-operations/operators"
  )
  if (result.isErr()) return R.err(result.error)
  return R.ok(result.value.data)
}

export async function updateContactInquiry(
  id: number,
  update: ContactInquiryUpdate
): Promise<Result<ContactInquiry, ApiError | NetworkError>> {
  const result = await fetchJson<ContactInquiry>(`/api/admin/contact-operations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  })
  if (result.isErr()) return R.err(result.error)
  return R.ok(result.value)
}

export async function updateContactInquiryRead(
  id: number,
  isRead: boolean
): Promise<Result<{ success: true; isRead: boolean }, ApiError | NetworkError>> {
  return fetchJson<{ success: true; isRead: boolean }>(`/api/admin/contact/${id}/read`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isRead }),
  })
}

export async function getContactInquiryEvents(
  id: number
): Promise<Result<ContactInquiryEvent[], ApiError | NetworkError>> {
  const result = await fetchJson<{ data: ContactInquiryEvent[] }>(
    `/api/admin/contact-operations/${id}/events`
  )
  if (result.isErr()) return R.err(result.error)
  return R.ok(result.value.data)
}
