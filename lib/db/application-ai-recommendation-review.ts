import { Result as R, type Result } from "better-result"
import { z } from "zod"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

const RecommendationSchema = z.enum(["Avanzar", "Evaluar", "Descartar"])

const ReviewSchema = z.object({
  id: z.string().uuid(),
  actionId: z.string().uuid(),
  revisionId: z.string().uuid(),
  reviewerId: z.string().uuid().nullable(),
  reviewerName: z.string(),
  aiRecommendation: RecommendationSchema,
  decision: RecommendationSchema,
  reason: z.string().nullable(),
  createdAt: z
    .date()
    .or(z.string())
    .transform((value) => new Date(value).toISOString()),
})
const ScopedReviewSchema = ReviewSchema.extend({
  jobId: z.string().uuid(),
  organizationId: z.string().uuid(),
})

export type AIRecommendation = z.infer<typeof RecommendationSchema>
export type AIRecommendationReview = z.infer<typeof ReviewSchema>

export type ReviewWriteResult =
  | { status: "created"; review: AIRecommendationReview }
  | { status: "duplicate"; review: AIRecommendationReview }
  | { status: "conflict" }
  | { status: "not_found" }
  | { status: "reason_required" }

export async function listAIRecommendationReviews(input: {
  revisionId: string
  jobId: string
  organizationId: string
}): Promise<Result<AIRecommendationReview[] | null, DbError>> {
  return R.tryPromise({
    try: async () => {
      const result = await pool.query(
        `SELECT review.id, review.action_id AS "actionId", review.revision_id AS "revisionId",
           review.reviewer_id AS "reviewerId", review.reviewer_name AS "reviewerName",
           review.ai_recommendation AS "aiRecommendation", review.human_decision AS decision,
           review.reason, review.created_at AS "createdAt"
         FROM application_ai_recommendation_review AS review
         JOIN application_ai_score AS score ON score.id = review.revision_id
         WHERE review.revision_id = $1::uuid AND score.job_id = $2::uuid
           AND score.organization_id = $3::uuid
         ORDER BY review.created_at DESC, review.id DESC`,
        [input.revisionId, input.jobId, input.organizationId]
      )
      if (result.rowCount === 0) {
        const revision = await pool.query(
          `SELECT 1 FROM application_ai_score
           WHERE id = $1::uuid AND job_id = $2::uuid AND organization_id = $3::uuid`,
          [input.revisionId, input.jobId, input.organizationId]
        )
        if (!revision.rowCount) return null
      }
      return z.array(ReviewSchema).parse(result.rows)
    },
    catch: (cause) => new DbError({ operation: "list_ai_recommendation_reviews", cause }),
  })
}

export async function writeAIRecommendationReview(input: {
  actionId: string
  revisionId: string
  jobId: string
  organizationId: string
  reviewerId: string
  reviewerName: string
  decision: AIRecommendation
  reason: string | null
}): Promise<Result<ReviewWriteResult, DbError>> {
  const connection = await R.tryPromise({
    try: () => pool.connect(),
    catch: (cause) => new DbError({ operation: "connect_write_ai_recommendation_review", cause }),
  })
  if (connection.isErr()) return R.err(connection.error)

  const client = connection.value
  const result = await R.tryPromise({
    try: async (): Promise<ReviewWriteResult> => {
      await client.query("BEGIN")
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [input.actionId])

      const priorResult = await client.query(
        `SELECT review.id, review.action_id AS "actionId", review.revision_id AS "revisionId",
           reviewer_id AS "reviewerId", reviewer_name AS "reviewerName",
           ai_recommendation AS "aiRecommendation", human_decision AS decision,
           review.reason, review.created_at AS "createdAt",
           score.job_id AS "jobId", score.organization_id AS "organizationId"
         FROM application_ai_recommendation_review AS review
         JOIN application_ai_score AS score ON score.id = review.revision_id
         WHERE review.action_id = $1::uuid`,
        [input.actionId]
      )
      const prior = priorResult.rows[0] ? ScopedReviewSchema.parse(priorResult.rows[0]) : null
      if (prior) {
        const identical =
          prior.jobId === input.jobId &&
          prior.organizationId === input.organizationId &&
          prior.revisionId === input.revisionId &&
          prior.reviewerId === input.reviewerId &&
          prior.decision === input.decision &&
          prior.reason === input.reason
        await client.query("COMMIT")
        return identical ? { status: "duplicate", review: prior } : { status: "conflict" }
      }

      const sourceResult = await client.query(
        `SELECT explanation->>'recommendation' AS recommendation
         FROM application_ai_score
         WHERE id = $1::uuid AND job_id = $2::uuid AND organization_id = $3::uuid
           AND status IN ('ready', 'insufficient') AND explanation_status = 'ready'
           AND explanation IS NOT NULL`,
        [input.revisionId, input.jobId, input.organizationId]
      )
      const source = sourceResult.rows[0]
      const sourceRecommendation = source
        ? RecommendationSchema.safeParse(source.recommendation)
        : null
      if (!sourceRecommendation?.success) {
        await client.query("ROLLBACK")
        return { status: "not_found" }
      }
      if (sourceRecommendation.data !== input.decision && !input.reason) {
        await client.query("ROLLBACK")
        return { status: "reason_required" }
      }

      const insertResult = await client.query(
        `INSERT INTO application_ai_recommendation_review (
           action_id, revision_id, reviewer_id, reviewer_name,
           ai_recommendation, human_decision, reason
         ) VALUES ($1::uuid, $2::uuid, $3::uuid, $4, $5, $6, $7)
         RETURNING id, action_id AS "actionId", revision_id AS "revisionId",
           reviewer_id AS "reviewerId", reviewer_name AS "reviewerName",
           ai_recommendation AS "aiRecommendation", human_decision AS decision,
           reason, created_at AS "createdAt"`,
        [
          input.actionId,
          input.revisionId,
          input.reviewerId,
          input.reviewerName,
          sourceRecommendation.data,
          input.decision,
          input.reason,
        ]
      )
      await client.query("COMMIT")
      return { status: "created", review: ReviewSchema.parse(insertResult.rows[0]) }
    },
    catch: (cause) => new DbError({ operation: "write_ai_recommendation_review", cause }),
  })

  if (result.isErr()) {
    await R.tryPromise(() => client.query("ROLLBACK"))
  }
  client.release()
  return result
}
