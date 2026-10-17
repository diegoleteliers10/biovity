import { Result } from "better-result"
import { z } from "zod"
import { ApiError, type NetworkError } from "@/lib/errors"
import { fetchApiData } from "@/lib/api/response"

export const applicationNoteSchema = z.object({
  id: z.string().uuid(),
  application_id: z.string().uuid(),
  author_id: z.string().uuid(),
  author_name: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  created_at: z.string(),
})

export type ApplicationNote = z.infer<typeof applicationNoteSchema>

function parseNotes(value: unknown): Result<ApplicationNote[], ApiError> {
  const parsed = z.array(applicationNoteSchema).safeParse(value)
  return parsed.success
    ? Result.ok(parsed.data)
    : Result.err(new ApiError({ status: 502, message: "Datos de notas inválidos" }))
}

export async function getApplicationNotes(
  applicationId: string
): Promise<Result<ApplicationNote[], ApiError | NetworkError>> {
  const searchParams = new URLSearchParams({ applicationId })
  const result = await fetchApiData<unknown>(`/api/v1/notes?${searchParams}`)
  if (result.isErr()) return Result.err(result.error)
  return parseNotes(result.value)
}

export async function addApplicationNote(input: {
  applicationId: string
  content: string
  tags?: string[]
}): Promise<Result<ApplicationNote, ApiError | NetworkError>> {
  const result = await fetchApiData<unknown>("/api/v1/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (result.isErr()) return Result.err(result.error)
  const parsed = applicationNoteSchema.safeParse(result.value)
  return parsed.success
    ? Result.ok(parsed.data)
    : Result.err(new ApiError({ status: 502, message: "Datos de nota inválidos" }))
}

export async function deleteApplicationNote(
  id: string
): Promise<Result<void, ApiError | NetworkError>> {
  const result = await fetchApiData<{ success: boolean }>(
    `/api/v1/notes/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  )
  return result.map(() => undefined)
}
