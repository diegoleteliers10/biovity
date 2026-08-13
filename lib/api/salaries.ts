import { Result as R, type Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type SalarySubmissionPayload = {
  profession: string
  industry: string
  experienceYears: number
  experienceLevel: "JUNIOR" | "MID" | "SENIOR" | "LEAD"
  educationLevel: "LICENCIATURA" | "MAGISTER" | "DOCTORADO" | "POSTDOC"
  region: string
  workMode: "PRESENCIAL" | "HIBRIDO" | "REMOTO"
  monthlySalaryClp: number
  annualBonusClp?: number
  benefits?: string[]
  skills?: string[]
}

export type SalarySubmissionResponse = {
  id: string
  profession: string
  industry: string
  experienceYears: number
  experienceLevel: "JUNIOR" | "MID" | "SENIOR" | "LEAD"
  educationLevel: "LICENCIATURA" | "MAGISTER" | "DOCTORADO" | "POSTDOC"
  region: string
  workMode: "PRESENCIAL" | "HIBRIDO" | "REMOTO"
  monthlySalaryClp: number
  annualBonusClp: number
  benefits: string[]
  skills: string[]
  isVerified: boolean
  createdAt: string
  percentile: number | null
  totalInSegment: number
}

export type SalaryStats = {
  count: number
  average: number
  median: number
  p25: number
  p75: number
  p90: number
}

export async function submitSalary(
  payload: SalarySubmissionPayload
): Promise<Result<SalarySubmissionResponse, ApiError | NetworkError>> {
  const result = await fetchJson<{ data: SalarySubmissionResponse }>(
    `${API_BASE}/api/v1/salaries/submissions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  )

  if (result.isErr()) return R.err(result.error)
  return R.ok(result.value.data)
}

export async function getSalaryStats(query: {
  profession?: string
  industry?: string
  region?: string
}): Promise<Result<SalaryStats, ApiError | NetworkError>> {
  const params = new URLSearchParams()
  if (query.profession) params.set("profession", query.profession)
  if (query.industry) params.set("industry", query.industry)
  if (query.region) params.set("region", query.region)

  const qs = params.toString()
  const result = await fetchJson<{ data: SalaryStats }>(
    `${API_BASE}/api/v1/salaries/stats${qs ? `?${qs}` : ""}`
  )

  if (result.isErr()) return R.err(result.error)
  return R.ok(result.value.data)
}
