export const candidateSeniorityValues = ["junior", "mid", "senior", "lead", "manager"] as const
export const candidateAvailabilityValues = ["immediate", "2weeks", "1month", "open"] as const

export type CandidateSeniority = (typeof candidateSeniorityValues)[number]
export type CandidateAvailability = (typeof candidateAvailabilityValues)[number]

export type TalentFilters = {
  search?: string
  profession?: string
  city?: string
  country?: string
  experienceLevel?: CandidateSeniority
  availability?: CandidateAvailability
  skills?: string
  minExp?: number
  maxExp?: number
}

export type TalentFilterValues = Omit<TalentFilters, "experienceLevel" | "availability"> & {
  experienceLevel?: string
  availability?: string
}

const talentFilterKeys = new Set([
  "search",
  "profession",
  "city",
  "country",
  "experienceLevel",
  "availability",
  "skills",
  "minExp",
  "maxExp",
])

export function parseTalentFilters(value: unknown): TalentFilters | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null

  const filters = value as Record<string, unknown>
  if (Object.keys(filters).some((key) => !talentFilterKeys.has(key))) return null

  const strings = ["search", "profession", "city", "country", "skills"] as const
  if (strings.some((key) => filters[key] !== undefined && typeof filters[key] !== "string"))
    return null
  if (
    filters.experienceLevel !== undefined &&
    !candidateSeniorityValues.includes(filters.experienceLevel as CandidateSeniority)
  )
    return null
  if (
    filters.availability !== undefined &&
    !candidateAvailabilityValues.includes(filters.availability as CandidateAvailability)
  )
    return null

  const minExp = filters.minExp
  const maxExp = filters.maxExp
  if (
    [minExp, maxExp].some(
      (years) =>
        years !== undefined &&
        (typeof years !== "number" || !Number.isInteger(years) || years < 0 || years > 50)
    )
  )
    return null
  if (typeof minExp === "number" && typeof maxExp === "number" && minExp > maxExp) return null

  return {
    search: filters.search as string | undefined,
    profession: filters.profession as string | undefined,
    city: filters.city as string | undefined,
    country: filters.country as string | undefined,
    experienceLevel: filters.experienceLevel as CandidateSeniority | undefined,
    availability: filters.availability as CandidateAvailability | undefined,
    skills: filters.skills as string | undefined,
    minExp: minExp as number | undefined,
    maxExp: maxExp as number | undefined,
  }
}
