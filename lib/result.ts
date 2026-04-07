import { Result, Result as R } from "better-result"
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
  let res: Response
  try {
    res = await fetch(input, init)
  } catch (err) {
    return R.err(
      new NetworkError({
        message: err instanceof Error ? err.message : "Network error",
        cause: err,
      })
    )
  }

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

export { getErrorMessage, getResultErrorMessage, fetchJson }
export { ApiError, DbError, NetworkError }
