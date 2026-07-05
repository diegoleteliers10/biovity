import { Result as R, type Result } from "better-result"
import type { ProviderId } from "@/lib/ai/byok/registry"
import { ApiError, type NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type AiCredentialMasked = {
  provider: ProviderId | null
  modelId: string | null
  keyPreview: string | null
  label: string | null
  hasCredential: boolean
}

export type AiCredentialListItem = {
  id: string
  provider: ProviderId
  modelId: string
  keyPreview: string
  label: string | null
  isActive: boolean
  createdAt: string
}

export type SaveAiCredentialInput = {
  provider: ProviderId
  modelId: string
  apiKey: string
  label?: string
}

type RawMasked = {
  provider?: ProviderId | null
  modelId?: string | null
  keyPreview?: string | null
  label?: string | null
  hasCredential?: boolean
}

function unwrap<T>(raw: unknown): T {
  if (raw && typeof raw === "object" && "data" in raw) {
    const inner = (raw as { data: unknown }).data
    if (inner && typeof inner === "object" && "data" in (inner as Record<string, unknown>)) {
      return (inner as { data: T }).data
    }
    return inner as T
  }
  return raw as T
}

function toMasked(raw: RawMasked, forceHas: boolean): AiCredentialMasked {
  return {
    provider: raw.provider ?? null,
    modelId: raw.modelId ?? null,
    keyPreview: raw.keyPreview ?? null,
    label: raw.label ?? null,
    hasCredential: forceHas || raw.hasCredential === true,
  }
}

function credentialUrl(organizationId: string): string {
  return `${API_BASE}/api/v1/organizations/${organizationId}/ai-credentials`
}

export async function getMaskedCredential(
  organizationId: string
): Promise<Result<AiCredentialMasked, ApiError | NetworkError>> {
  const result = await fetchJson<RawMasked>(credentialUrl(organizationId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
  if (result.isErr()) return R.err(result.error)
  return R.ok(toMasked(unwrap<RawMasked>(result.value), false))
}

export async function saveCredential(
  organizationId: string,
  input: SaveAiCredentialInput
): Promise<Result<AiCredentialMasked, ApiError | NetworkError>> {
  const result = await fetchJson<RawMasked>(credentialUrl(organizationId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  })
  if (result.isErr()) return R.err(result.error)
  return R.ok(toMasked(unwrap<RawMasked>(result.value), true))
}

export async function deleteCredential(
  organizationId: string
): Promise<Result<{ removed: boolean }, ApiError | NetworkError>> {
  return fetchJson<{ removed: boolean }>(credentialUrl(organizationId), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
}

export type ActiveCredential = {
  provider: ProviderId
  modelId: string
  apiKey: string
}

export async function getActiveCredentialDecrypted(
  organizationId: string
): Promise<Result<ActiveCredential, ApiError | NetworkError>> {
  const internalKey = process.env.INTERNAL_API_KEY
  if (!internalKey) {
    return R.err(
      new ApiError({
        status: 500,
        statusText: "Internal config missing",
        body: null,
        message: "INTERNAL_API_KEY is not configured",
      })
    )
  }

  const result = await fetchJson<ActiveCredential>(`${credentialUrl(organizationId)}/active`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-internal-key": internalKey,
    },
  })
  if (result.isErr()) return R.err(result.error)
  return R.ok(unwrap<ActiveCredential>(result.value))
}

export async function listCredentials(
  organizationId: string
): Promise<Result<AiCredentialListItem[], ApiError | NetworkError>> {
  const result = await fetchJson<AiCredentialListItem[]>(`${credentialUrl(organizationId)}/list`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
  if (result.isErr()) return R.err(result.error)
  return R.ok(unwrap<AiCredentialListItem[]>(result.value))
}

export async function activateCredential(
  organizationId: string,
  credentialId: string
): Promise<Result<AiCredentialMasked, ApiError | NetworkError>> {
  const result = await fetchJson<RawMasked>(
    `${credentialUrl(organizationId)}/${credentialId}/activate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  )
  if (result.isErr()) return R.err(result.error)
  return R.ok(toMasked(unwrap<RawMasked>(result.value), true))
}

export async function deleteCredentialById(
  organizationId: string,
  credentialId: string
): Promise<Result<{ removed: boolean }, ApiError | NetworkError>> {
  return fetchJson<{ removed: boolean }>(`${credentialUrl(organizationId)}/${credentialId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
}
