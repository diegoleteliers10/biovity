import type { Evaluation } from "@/hooks/use-evaluations"
import type { ApplicationNote } from "@/hooks/use-notes"
import type { ApplicationComment } from "./ApplicationComments.types"

export function applicationComments(
  notes: readonly ApplicationNote[],
  evaluations: readonly Evaluation[]
): ApplicationComment[] {
  const comments: ApplicationComment[] = notes.map((note) => ({
    kind: "note",
    id: `note:${note.id}`,
    content: note.content,
    author: note.author_name,
    date: note.created_at,
    note,
  }))
  for (const evaluation of evaluations) {
    if (!evaluation.notes?.trim()) continue
    comments.push({
      kind: "evaluation",
      id: `evaluation:${evaluation.id}`,
      content: evaluation.notes,
      author: evaluation.evaluator_name || "Reclutador",
      date: evaluation.updated_at,
      evaluation,
    })
  }
  return comments.sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date) || a.id.localeCompare(b.id)
  )
}
