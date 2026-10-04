import type { QueryClient } from "@tanstack/react-query"
import { z } from "zod"

const resourceQueries = {
  user: ["profile", "talent", "user", "org", "admin-users", "admin-stats"],
  resume: ["profile", "talent", "org", "fit-score", "jev-scores"],
  job: ["jobs", "applications", "org", "user", "saved-jobs", "admin-stats"],
  application: ["applications", "jobs", "org", "user", "jev-scores", "admin-stats"],
  event: ["events", "org", "user", "admin-stats"],
  event_participant: ["events", "org", "user"],
  event_note: ["events"],
  organization: ["organization", "org", "org-members", "admin-users", "admin-stats"],
  organization_member: ["organization", "org", "org-members", "profile"],
  saved_job: ["saved-jobs", "user"],
  job_alert: ["job-alerts"],
  saved_candidate: ["saved-candidates", "talent", "org"],
  candidate_tag: ["candidate-tags", "talent"],
  candidate_tag_assignment: ["candidate-tags", "talent"],
  pipeline_stage: ["pipelineStages", "applications", "org"],
  subscription: ["subscription", "organization", "org", "admin-stats"],
  job_question: ["job-questions"],
  job_template: ["job-templates"],
  message_template: ["message-templates"],
  activity_log: ["activity-logs", "org"],
  saved_search: ["saved-searches"],
  chat: ["chats", "chat", "org"],
  message: ["messages", "chats", "org"],
  notification: ["notifications"],
  application_note: ["notes"],
  application_evaluation: ["evaluations"],
  application_status_history: ["applications", "org", "user"],
  application_answer: ["applications"],
  application_ai_score: ["jev-scores"],
  capsule_progress: ["capsules", "capsule-progress"],
  organization_onboarding: ["onboarding"],
} as const

const ResourceEventSchema = z.object({
  resource: z.enum(
    Object.keys(resourceQueries) as [
      keyof typeof resourceQueries,
      ...(keyof typeof resourceQueries)[],
    ]
  ),
  id: z.string().uuid(),
  operation: z.enum(["insert", "update", "delete"]),
})

export function invalidateResource(client: QueryClient, payload: unknown) {
  const value =
    payload && typeof payload === "object" && "payload" in payload ? payload.payload : payload
  const parsed = ResourceEventSchema.safeParse(value)
  if (!parsed.success) return null
  for (const key of resourceQueries[parsed.data.resource]) {
    void client.invalidateQueries({ queryKey: [key] })
  }
  return parsed.data.resource
}

// A channel can reach SUBSCRIBED more than once in quick succession, and each
// connect asks for a full catch-up sweep. Coalesce those into one trailing
// sweep so a burst of connects refetches each mounted query once. The trailing
// edge always runs, so a reconnect after a real gap is never dropped.
const RECONCILE_COALESCE_MS = 1_000
const pendingReconciles = new WeakMap<QueryClient, ReturnType<typeof setTimeout>>()

const shouldReconcile = (queryKey: readonly unknown[]) =>
  !["realtime", "fit-score", "address-search"].includes(String(queryKey[0]))

export function reconcileDashboardResources(client: QueryClient) {
  const scheduled = pendingReconciles.get(client)
  if (scheduled) clearTimeout(scheduled)
  pendingReconciles.set(
    client,
    setTimeout(() => {
      pendingReconciles.delete(client)
      void client.invalidateQueries({ predicate: (query) => shouldReconcile(query.queryKey) })
    }, RECONCILE_COALESCE_MS)
  )
}
