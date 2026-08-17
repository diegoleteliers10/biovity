import { Result as R, type Result } from "better-result"
import { ApiError, DbError, NetworkError } from "@/lib/errors"

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? ""

/**
 * Browser calls go same-origin (`/api/v1/...`) so the Better Auth session
 * cookie flows to the API through the Next.js rewrite (see next.config.ts).
 */
function resolveApiUrl(input: RequestInfo): RequestInfo {
  if (typeof input !== "string") return input
  if (typeof window === "undefined" || !API_ORIGIN) return input
  return input.startsWith(API_ORIGIN) ? input.slice(API_ORIGIN.length) || "/" : input
}

/**
 * Server-side calls authenticate with the shared internal key accepted by
 * the API's SessionAuthGuard. The key never reaches the browser bundle.
 */
function withServerAuth(init?: RequestInit): RequestInit {
  if (typeof window !== "undefined") return init ?? {}
  const key = process.env.INTERNAL_API_KEY
  if (!key) return init ?? {}
  const headers = new Headers(init?.headers)
  headers.set("x-internal-key", key)
  return { ...init, headers }
}

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
    try: () => fetch(resolveApiUrl(input), withServerAuth(init)),
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
    try: () => fetch(resolveApiUrl(input), withServerAuth(init)),
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
