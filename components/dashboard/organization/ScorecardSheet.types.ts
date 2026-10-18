import type { ReactNode } from "react"
import type { Evaluation } from "@/hooks/use-evaluations"
import type { PipelineStage } from "@/lib/api/use-pipeline-stages"
import type { ApplicationStage } from "@/lib/types/dashboard"

export type ScorecardSheetProps = {
  applicationId: string
  canManageHiring: boolean | undefined
  candidateName: string
  candidateAvatar?: string | null
  candidateProfession?: string | null
  children: ReactNode
  applicationStatus?: ApplicationStage
  pipelineStageId?: string | null
  pipelineStages?: PipelineStage[]
  onStageChange?: (applicationId: string, stageId: string) => Promise<boolean>
  onStatusChange?:
    | ((applicationId: string, stage: ApplicationStage, rejectionNote?: string) => void)
    | ((
        applicationId: string,
        stage: ApplicationStage,
        rejectionNote?: string
      ) => boolean | Promise<boolean>)
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
