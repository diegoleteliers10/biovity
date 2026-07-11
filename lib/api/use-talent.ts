"use client"

import { useQuery } from "@tanstack/react-query"
import { Result } from "better-result"
import { getResultErrorMessage } from "@/lib/result"
import { getUsers } from "./users"

export const talentKeys = {
  professionals: (page: number, filters?: TalentFilters) =>
    ["talent", "professionals", page, filters ?? {}] as const,
}

export type TalentFilters = {
  search?: string
  profession?: string
  city?: string
  country?: string
  experienceLevel?: string
  availability?: string
  skills?: string
  minExp?: number
  maxExp?: number
}

const PAGE_SIZE = 20

export function useProfessionalUsers(page: number = 1, filters?: TalentFilters | string) {
  const resolvedFilters = typeof filters === "string" ? { search: filters } : filters

  return useQuery({
    queryKey: talentKeys.professionals(page, resolvedFilters),
    queryFn: async () => {
      const result = await getUsers({
        page,
        limit: PAGE_SIZE,
        type: "professional",
        isActive: true,
        ...(resolvedFilters?.search?.trim() && { search: resolvedFilters.search.trim() }),
        ...(resolvedFilters?.profession?.trim() && {
          profession: resolvedFilters.profession.trim(),
        }),
        ...(resolvedFilters?.city?.trim() && { city: resolvedFilters.city.trim() }),
        ...(resolvedFilters?.country?.trim() && { country: resolvedFilters.country.trim() }),
        ...(resolvedFilters?.experienceLevel?.trim() && {
          experienceLevel: resolvedFilters.experienceLevel.trim(),
        }),
        ...(resolvedFilters?.availability?.trim() && {
          availability: resolvedFilters.availability.trim(),
        }),
        ...(resolvedFilters?.skills?.trim() && { skills: resolvedFilters.skills.trim() }),
        ...(resolvedFilters?.minExp &&
          resolvedFilters.minExp > 0 && { minExperience: resolvedFilters.minExp }),
        ...(resolvedFilters?.maxExp &&
          resolvedFilters.maxExp > 0 && { maxExperience: resolvedFilters.maxExp }),
      })
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
  })
}
