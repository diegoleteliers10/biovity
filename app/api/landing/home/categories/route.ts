import { NextResponse } from "next/server"
import { CATEGORIES_HOME } from "@/lib/data/home-data"
import { fetchJson } from "@/lib/result"

export const revalidate = 60

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function extractTotal(raw: unknown): number | null {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Record<string, unknown>

  const candidates: unknown[] = [
    obj.total,
    obj.count,
    (obj.meta && typeof obj.meta === "object" ? (obj.meta as Record<string, unknown>).total : null),
    (obj.pagination && typeof obj.pagination === "object"
      ? (obj.pagination as Record<string, unknown>).total
      : null),
  ]

  for (const c of candidates) {
    const n = toFiniteNumber(c)
    if (n != null) return n
  }

  return null
}

async function fetchJobsCountWithLimit(
  search: string,
  limit: number
): Promise<{ raw: unknown } | null> {
  const searchParams = new URLSearchParams()
  searchParams.set("status", "active")
  searchParams.set("search", search)
  searchParams.set("limit", String(limit))

  const url = `${API_BASE}/api/v1/jobs?${searchParams.toString()}`
  const result = await fetchJson<unknown>(url, { next: { revalidate } })
  if (result.isErr()) return null
  return { raw: result.value }
}

function extractArrayLength(raw: unknown): number | null {
  if (Array.isArray(raw)) return raw.length
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Record<string, unknown>
  const data = obj.data
  if (Array.isArray(data)) return data.length
  return null
}

async function fetchJobsCount(search: string): Promise<number | null> {
  const small = await fetchJobsCountWithLimit(search, 1)
  if (!small) return null

  const total = extractTotal(small.raw)
  if (total != null) return total

  const big = await fetchJobsCountWithLimit(search, 1000)
  if (!big) return null

  return extractArrayLength(big.raw)
}

export async function GET() {
  const countsEntries = await Promise.all(
    CATEGORIES_HOME.map(async (category) => {
      const count = await fetchJobsCount(category.title)
      return [category.id, count] as const
    })
  ).catch(() => [])

  const counts = Object.fromEntries(countsEntries)

  return NextResponse.json({ counts })
}
