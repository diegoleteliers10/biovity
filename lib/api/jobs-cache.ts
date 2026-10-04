import type { QueryClient } from "@tanstack/react-query"
import type { Job, JobsByOrganizationResponse } from "./jobs"

export function storeCreatedJob(client: QueryClient, organizationId: string, job: Job) {
  client.setQueryData<Job[]>(["jobs", organizationId], (jobs) =>
    jobs ? [job, ...jobs.filter((item) => item.id !== job.id)] : jobs
  )
  for (const [key, current] of client.getQueriesData<JobsByOrganizationResponse>({
    queryKey: ["jobs", "organization", organizationId],
  })) {
    if (!current || !matchesJob(job, key[5], key[6])) continue
    const exists = current.data.some((item) => item.id === job.id)
    const total = current.total + (exists ? 0 : 1)
    client.setQueryData(key, {
      ...current,
      data:
        current.page === 1
          ? [job, ...current.data.filter((item) => item.id !== job.id)].slice(0, current.limit)
          : current.data,
      total,
      totalPages: Math.ceil(total / current.limit),
    })
  }
  client.setQueryData(["jobs", "detail", job.id, "managed"], job)
}

export function storeUpdatedJob(client: QueryClient, organizationId: string, job: Job) {
  client.setQueryData<Job[]>(["jobs", organizationId], (jobs) =>
    jobs?.map((item) => (item.id === job.id ? job : item))
  )
  for (const [key, current] of client.getQueriesData<JobsByOrganizationResponse>({
    queryKey: ["jobs", "organization", organizationId],
  })) {
    if (!current) continue
    const exists = current.data.some((item) => item.id === job.id)
    if (!exists) continue
    const matches = matchesJob(job, key[5], key[6])
    const total = Math.max(0, current.total - (matches ? 0 : 1))
    client.setQueryData(key, {
      ...current,
      data: matches
        ? current.data.map((item) => (item.id === job.id ? job : item))
        : current.data.filter((item) => item.id !== job.id),
      total,
      totalPages: Math.ceil(total / current.limit),
    })
  }
  client.setQueryData(["jobs", "detail", job.id, "managed"], job)
}

export function storeDeletedJob(client: QueryClient, organizationId: string, id: string) {
  client.setQueryData<Job[]>(["jobs", organizationId], (jobs) =>
    jobs?.filter((job) => job.id !== id)
  )
  for (const [key, current] of client.getQueriesData<JobsByOrganizationResponse>({
    queryKey: ["jobs", "organization", organizationId],
  })) {
    if (!current) continue
    const total = Math.max(0, current.total - (current.data.some((job) => job.id === id) ? 1 : 0))
    client.setQueryData(key, {
      ...current,
      data: current.data.filter((job) => job.id !== id),
      total,
      totalPages: Math.ceil(total / current.limit),
    })
  }
  client.removeQueries({ queryKey: ["jobs", "detail", id] })
}

function matchesJob(job: Job, status: unknown, search: unknown): boolean {
  if (typeof status === "string" && status && job.status !== status) return false
  const term = typeof search === "string" ? search.trim().toLowerCase() : ""
  return !term || `${job.title} ${job.description ?? ""}`.toLowerCase().includes(term)
}
