import { type Result as ApiResult, Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

type BackendResponse<T> = T | { data: T }

function isEnvelope<T>(value: BackendResponse<T>): value is { data: T } {
  return value !== null && typeof value === "object" && "data" in value
}

export async function fetchApiData<T>(
  url: string,
  init?: RequestInit
): Promise<ApiResult<T, ApiError | NetworkError>> {
  const result = await fetchJson<BackendResponse<T>>(url, init)
  if (result.isErr()) return Result.err(result.error)
  return Result.ok(isEnvelope(result.value) ? result.value.data : result.value)
}
