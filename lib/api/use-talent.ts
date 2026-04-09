"use client"

import { useQuery } from "@tanstack/react-query"
import { Result } from "better-result"
import { getResultErrorMessage } from "@/lib/result"
import { getUsers } from "./users"

export const talentKeys = {
  professionals: (page: number, search?: string) =>
    ["talent", "professionals", page, search ?? ""] as const,
}

const PAGE_SIZE = 20

export function useProfessionalUsers(page: number = 1, search?: string) {
  return useQuery({
    queryKey: talentKeys.professionals(page, search),
    queryFn: async () => {
      const result = await getUsers({
        page,
        limit: PAGE_SIZE,
        type: "professional",
        isActive: true,
        ...(search?.trim() && { search: search.trim() }),
      })
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
  })
}
