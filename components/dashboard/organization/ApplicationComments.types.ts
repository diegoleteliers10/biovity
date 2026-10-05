import type { Evaluation } from "@/hooks/use-evaluations"
import type { ApplicationNote } from "@/hooks/use-notes"

export type ApplicationComment =
  | {
      kind: "note"
      id: string
      content: string
      author: string
      date: string
      note: ApplicationNote
    }
  | {
      kind: "evaluation"
      id: string
      content: string
      author: string
      date: string
      evaluation: Evaluation
    }
