import { Result as R, type Result } from "better-result"
import { ApiError, DbError, NetworkError } from "@/lib/errors"

function getErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback
  const d = data as Record<string, unknown>
  const msg = d.message
  if (Array.isArray(msg)) return msg.join(". ") || fallback
  if (typeof msg === "string") return msg
  if (typeof d.error === "string") return d.error
  return fallback
}

/** Extracts error message from ApiError | NetworkError union. */
function getResultErrorMessage(err: ApiError | NetworkError): string {
  return err.message
}

async function fetchJson<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<Result<T, ApiError | NetworkError>> {
  const resResult = await R.tryPromise({
    try: () => fetch(input, init),
    catch: (err) =>
      new NetworkError({
        message: err instanceof Error ? err.message : "Network error",
        cause: err,
      }),
  })

  if (resResult.isErr()) return R.err(resResult.error)

  const res = resResult.value
  let data: unknown

  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: getErrorMessage(data, `HTTP error ${res.status}`),
      })
    )
  }

  return R.ok(data as T)
}

async function fetchWithFallback<T>(
  primaryUrl: string,
  fallbackUrl: string,
  options?: RequestInit
): Promise<Result<T, ApiError | NetworkError>> {
  const primaryResult = await fetchJson<T>(primaryUrl, options)

  if (primaryResult.isOk()) return primaryResult

  const primaryError = primaryResult.error

  if (primaryError._tag === "ApiError" && primaryError.status !== 404) {
    return primaryResult
  }

  return fetchJson<T>(fallbackUrl, options)
}

async function fetchOk<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<Result<T, ApiError | NetworkError>> {
  return fetchJson<T>(input, init)
}

async function fetchNoContent(
  input: RequestInfo,
  init?: RequestInit
): Promise<Result<void, ApiError | NetworkError>> {
  const resResult = await R.tryPromise({
    try: () => fetch(input, init),
    catch: (err) =>
      new NetworkError({
        message: err instanceof Error ? err.message : "Network error",
        cause: err,
      }),
  })

  if (resResult.isErr()) return R.err(resResult.error)

  const res = resResult.value

  if (!res.ok) {
    let data: unknown
    try {
      data = await res.json()
    } catch {
      data = null
    }
    return R.err(
      new ApiError({
        status: res.status,
        statusText: res.statusText,
        body: data,
        message: getErrorMessage(data, `HTTP error ${res.status}`),
      })
    )
  }

  return R.ok(undefined)
}

export {
  ApiError,
  DbError,
  fetchJson,
  fetchNoContent,
  fetchOk,
  fetchWithFallback,
  getErrorMessage,
  getResultErrorMessage,
  NetworkError,
}
