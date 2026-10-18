import { NextResponse } from "next/server"
import type { ApiError, NetworkError } from "@/lib/errors"

export const ADMIN_API_BASE =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export function responsePayload(value: unknown): unknown {
  if (!value || typeof value !== "object") return value
  const root = value as Record<string, unknown>
  const data = root.data
  if (Array.isArray(data)) return root
  if (!data || typeof data !== "object") return value
  const nested = data as Record<string, unknown>
  if (Array.isArray(nested.data) || "total" in nested) return nested
  return data
}

export function apiErrorResponse(error: ApiError | NetworkError) {
  const status = error._tag === "ApiError" ? error.status : 502
  return NextResponse.json({ error: error.message }, { status })
}
