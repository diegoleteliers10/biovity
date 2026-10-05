import type { ReactNode } from "react"
import type { Evaluation } from "@/hooks/use-evaluations"
import type { ApplicationStage } from "@/lib/types/dashboard"

export type ScorecardSheetProps = {
  applicationId: string
  candidateName: string
  candidateAvatar?: string | null
  candidateProfession?: string | null
  children: ReactNode
  applicationStatus?: ApplicationStage
  onStatusChange?: (applicationId: string, stage: ApplicationStage) => Promise<void> | void
  onScheduleInterview?: () => void
  onSendMessage?: () => void
}

export type EvaluationDraft = {
  rating: Evaluation["rating"] | null
  context: string
  technical: string
  cultural: string
  expectations: string
  notes: string
  tags: string[]
}

export type EvaluationLoaderProps = ScorecardSheetProps & {
  onDirtyChange: (dirty: boolean) => void
  onSavingChange: (saving: boolean) => void
  onClose: () => void
}
export type EvaluationEditorProps = EvaluationLoaderProps & {
  evaluations: Evaluation[]
  evaluatorId: string
  refreshError: boolean
}
