import { Result as R, type Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, fetchNoContent } from "@/lib/result"
import { fetchApiData } from "./response"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type MessageTemplate = {
  id: string
  organizationId: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export type CreateMessageTemplateInput = {
  title: string
  content: string
}

export type UpdateMessageTemplateInput = Partial<CreateMessageTemplateInput>

const base = (orgId: string) => `${API_BASE}/api/v1/organizations/${orgId}/message-templates`

export async function getMessageTemplates(
  organizationId: string
): Promise<Result<MessageTemplate[], ApiError | NetworkError>> {
  const result = await fetchJson<unknown>(base(organizationId))
  if (result.isErr()) return R.err(result.error)
  const raw = result.value
  const value = raw && typeof raw === "object" && "data" in raw ? raw.data : raw
  const arr = Array.isArray(value) ? value : []
  return R.ok(arr as MessageTemplate[])
}

export async function createMessageTemplate(
  organizationId: string,
  input: CreateMessageTemplateInput
): Promise<Result<MessageTemplate, ApiError | NetworkError>> {
  return fetchApiData<MessageTemplate>(base(organizationId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}

export async function updateMessageTemplate(
  organizationId: string,
  id: string,
  input: UpdateMessageTemplateInput
): Promise<Result<MessageTemplate, ApiError | NetworkError>> {
  return fetchApiData<MessageTemplate>(`${base(organizationId)}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}

export async function deleteMessageTemplate(
  organizationId: string,
  id: string
): Promise<Result<void, ApiError | NetworkError>> {
  return fetchNoContent(`${base(organizationId)}/${id}`, { method: "DELETE" })
}
