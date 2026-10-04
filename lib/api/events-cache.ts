import type { QueryClient } from "@tanstack/react-query"
import { z } from "zod"
import type { Event, PaginatedEventsResponse } from "@/lib/types/events"

const FiltersSchema = z
  .object({
    organizerId: z.string().optional(),
    userId: z.string().optional(),
    organizationId: z.string().optional(),
    type: z.string().optional(),
    status: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
  })
  .default({})

export function storeCalendarEvent(client: QueryClient, event: Event, organizationId?: string) {
  for (const [key, page] of client.getQueriesData<PaginatedEventsResponse>({
    queryKey: ["events", "list"],
  })) {
    if (!page) continue
    const parsed = FiltersSchema.safeParse(key[2])
    if (!parsed.success) continue
    const filters = parsed.data
    const exists = page.data.some((row) => row.id === event.id)
    const belongs =
      (!filters.organizerId || filters.organizerId === event.organizerId) &&
      (!filters.userId ||
        filters.userId === event.organizerId ||
        filters.userId === event.candidateId ||
        exists) &&
      (!filters.organizationId || filters.organizationId === organizationId || exists)
    const matches =
      belongs &&
      (!filters.type || filters.type === event.type) &&
      (!filters.status || filters.status === event.status) &&
      (!filters.from || Date.parse(event.startAt) >= Date.parse(filters.from)) &&
      (!filters.to || Date.parse(event.startAt) <= Date.parse(filters.to))
    if (!exists && !matches) continue
    const total = Math.max(0, page.total + (matches && !exists ? 1 : !matches && exists ? -1 : 0))
    const rows = page.data.filter((row) => row.id !== event.id)
    if (matches && (page.page === 1 || exists)) rows.push(event)
    rows.sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt))
    client.setQueryData(key, {
      ...page,
      data: rows.slice(0, page.limit),
      total,
      totalPages: Math.ceil(total / page.limit),
    })
  }
}

export function removeCalendarEvent(client: QueryClient, id: string) {
  client.setQueriesData<PaginatedEventsResponse>({ queryKey: ["events", "list"] }, (page) => {
    if (!page?.data.some((row) => row.id === id)) return page
    const total = Math.max(0, page.total - 1)
    return {
      ...page,
      data: page.data.filter((row) => row.id !== id),
      total,
      totalPages: Math.ceil(total / page.limit),
    }
  })
  client.removeQueries({ queryKey: ["events", "detail", id], exact: true })
}
