import { Result as R } from "better-result"
import { fetchJson } from "@/lib/result"
import { getSupabaseAdmin } from "@/lib/supabase"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
const ALLOWED_BUCKETS = new Set([
  process.env.SUPABASE_CV_BUCKET ?? "biovity_cv",
  process.env.SUPABASE_STORAGE_BUCKET ?? "biovity_bucket",
])
const BATCH_SIZE = 20

type CleanupItem = { id: string; bucket: string; path: string; leaseToken: string }

function parseCleanupItems(value: unknown): CleanupItem[] | null {
  if (!value || typeof value !== "object" || !("items" in value) || !Array.isArray(value.items)) {
    return null
  }
  const rawItems: unknown[] = value.items
  const items: CleanupItem[] = []
  for (const item of rawItems) {
    if (
      !item ||
      typeof item !== "object" ||
      !("id" in item) ||
      !("bucket" in item) ||
      !("path" in item) ||
      !("leaseToken" in item) ||
      typeof item.id !== "string" ||
      typeof item.bucket !== "string" ||
      !ALLOWED_BUCKETS.has(item.bucket) ||
      typeof item.path !== "string" ||
      !item.path ||
      item.path.startsWith("/") ||
      item.path.includes("\\") ||
      item.path.includes("?") ||
      item.path.includes("#") ||
      item.path.split("/").some((segment) => !segment || segment === "." || segment === "..") ||
      /%(?:2e|2f|5c)/i.test(item.path) ||
      [...item.path].some((character) => {
        const code = character.charCodeAt(0)
        return code < 32 || code === 127
      }) ||
      typeof item.leaseToken !== "string"
    ) {
      return null
    }
    items.push({ id: item.id, bucket: item.bucket, path: item.path, leaseToken: item.leaseToken })
  }
  return items
}

async function updateCleanup(item: CleanupItem, action: "finish" | "fail", error?: string) {
  const body = action === "finish" ? { leaseToken: item.leaseToken } : { leaseToken: item.leaseToken, error }
  return fetchJson<unknown>(`${API_BASE}/api/v1/admin/cv-cleanup/${item.id}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

export async function processCvCleanup() {
  const claim = await fetchJson<unknown>(`${API_BASE}/api/v1/admin/cv-cleanup/claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit: BATCH_SIZE }),
  })
  if (claim.isErr()) return { status: "unavailable" as const, processed: 0 }

  const items = parseCleanupItems(claim.value)
  if (!items) return { status: "invalid_response" as const, processed: 0 }

  const admin = R.try(() => getSupabaseAdmin())
  if (admin.isErr()) return { status: "storage_unavailable" as const, processed: 0 }

  const results = await Promise.all(
    items.map(async (item) => {
      const removed = await R.tryPromise({
        try: () => admin.value.storage.from(item.bucket).remove([item.path]),
        catch: (cause) => cause,
      })
      const storageError = removed.isErr()
        ? (removed.error instanceof Error ? removed.error.message : "Storage deletion failed")
        : removed.value.error?.message
      const updated = await updateCleanup(item, storageError ? "fail" : "finish", storageError)
      return {
        id: item.id,
        status: updated.isErr() ? "leased" : storageError ? "retrying" : "completed",
      }
    })
  )

  return { status: "ok" as const, processed: results.length, results }
}
