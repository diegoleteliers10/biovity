import type { ApplicationStatus } from "@/lib/api/applications"
import type { Applicant } from "@/lib/types/dashboard"

export type PipelineBoardStage = {
  id: string
  name: string
  statusProjection: ApplicationStatus
  isArchived: boolean
}

export function resolveApplicantPipelineStageId(
  applicant: Applicant,
  stages: PipelineBoardStage[]
): string | null {
  if (applicant.pipelineStageId && stages.some((stage) => stage.id === applicant.pipelineStageId)) {
    return applicant.pipelineStageId
  }

  return stages.find((stage) => stage.statusProjection === applicant.stage)?.id ?? null
}

export function groupApplicantsByPipelineStage(
  applicants: Applicant[],
  stages: PipelineBoardStage[]
): Map<string, Applicant[]> {
  const grouped = new Map(stages.map((stage) => [stage.id, [] as Applicant[]]))

  for (const applicant of applicants) {
    const stageId = resolveApplicantPipelineStageId(applicant, stages)
    if (!stageId) continue
    grouped.get(stageId)?.push(applicant)
  }

  return grouped
}
