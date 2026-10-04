import { Result as R, type Result } from "better-result"
import { z } from "zod"
import {
  JEV_DAILY_ANALYSIS_LIMIT,
  JEV_LEASE_SECONDS,
  JEV_MAX_ATTEMPTS,
  JEV_MINIMUM_DATA_SUFFICIENCY,
  JEV_MODEL_VERSION,
  JEV_PROFILE_SNAPSHOT_RETENTION_DAYS,
  JEV_RUBRIC_VERSION,
} from "@/lib/ai/decision/constants"
import type {
  CandidateAssessmentInput,
  ClaimedAssessment,
  JevAssessment,
  ScoreDetails,
} from "@/lib/ai/decision/types"
import { pool } from "@/lib/db"
import { DbError } from "@/lib/errors"

const DbScoreSchema = z.object({
  applicationId: z.string(),
  candidateId: z.string(),
  revisionId: z.string(),
  status: z.enum(["pending", "processing", "ready", "insufficient", "failed"]),
  score: z.number().nullable(),
  label: z.enum(["Bajo", "Regular", "Bueno", "Excelente"]).nullable(),
  confidence: z.number().nullable(),
  sufficiency: z.number().nullable(),
  distribution: z.record(z.string(), z.number()).nullable(),
  perQuestion: z.record(z.string(), z.unknown()).nullable(),
  explanationStatus: z.enum(["pending", "processing", "ready", "failed", "expired"]),
  errorCode: z.string().nullable(),
  updatedAt: z
    .date()
    .or(z.string())
    .transform((value) => new Date(value).toISOString()),
})

const DbClaimSchema = z.object({
  revisionId: z.string(),
  applicationId: z.string(),
  candidateId: z.string(),
  jobId: z.string(),
  organizationId: z.string(),
  requestedBy: z.string(),
  fingerprint: z.string(),
  jobSnapshot: z.record(z.string(), z.unknown()),
  candidateSnapshot: z.record(z.string(), z.unknown()),
  leaseToken: z.string(),
  attempts: z.number(),
})

const DbExplainSchema = z.object({
  revisionId: z.string(),
  jobId: z.string(),
  jobSnapshot: z.record(z.string(), z.unknown()),
  candidateSnapshot: z.record(z.string(), z.unknown()),
  score: z.number(),
  confidence: z.number(),
  sufficiency: z.number(),
  distribution: z.record(z.string(), z.number()),
  perQuestion: z.record(z.string(), z.unknown()),
})

export type AssessmentReservation = {
  accepted: boolean
  queued: number
}

export type ExplainInput = z.infer<typeof DbExplainSchema>

export async function enqueueCandidateAssessments(
  organizationId: string,
  assessments: CandidateAssessmentInput[]
): Promise<Result<AssessmentReservation, DbError>> {
  const connection = await R.tryPromise({
    try: () => pool.connect(),
    catch: (cause) => new DbError({ operation: "connect_enqueue_candidate_assessments", cause }),
  })
  if (connection.isErr()) return R.err(connection.error)

  const client = connection.value
  const result = await R.tryPromise({
    try: async () => {
      await client.query("BEGIN")
      await client.query(
        `INSERT INTO application_ai_score_usage (organization_id, usage_date, analysis_count)
         VALUES ($1::uuid, current_date, 0)
         ON CONFLICT (organization_id, usage_date) DO NOTHING`,
        [organizationId]
      )
      const usageResult = await client.query<{ analysis_count: number }>(
        `SELECT analysis_count FROM application_ai_score_usage
         WHERE organization_id = $1::uuid AND usage_date = current_date
         FOR UPDATE`,
        [organizationId]
      )
      const usage = usageResult.rows[0]
      if (!usage) {
        await client.query("ROLLBACK")
        return { accepted: false, queued: 0 }
      }

      const requestedJson = JSON.stringify(
        assessments.map((assessment) => ({
          application_id: assessment.applicationId,
          candidate_id: assessment.candidateId,
          job_id: assessment.jobId,
          requested_by: assessment.requestedBy,
          fingerprint: assessment.fingerprint,
          job_snapshot: assessment.jobSnapshot,
          candidate_snapshot: assessment.candidateSnapshot,
        }))
      )
      const countResult = await client.query<{ count: number }>(
        `WITH requested AS (
           SELECT * FROM jsonb_to_recordset($1::jsonb) AS item(
             application_id uuid, fingerprint text
           )
         )
         SELECT count(*)::integer AS count
         FROM requested AS item
         WHERE NOT EXISTS (
           SELECT 1 FROM application_ai_score AS existing
           WHERE existing.application_id = item.application_id
             AND existing.engine_version = $2
             AND existing.rubric_version = $3
             AND existing.fingerprint = item.fingerprint
             AND existing.status <> 'failed'
         )`,
        [requestedJson, JEV_MODEL_VERSION, JEV_RUBRIC_VERSION]
      )
      const chargeCount = countResult.rows[0]?.count ?? 0
      if (usage.analysis_count + chargeCount > JEV_DAILY_ANALYSIS_LIMIT) {
        await client.query("ROLLBACK")
        return { accepted: false, queued: 0 }
      }

      if (chargeCount > 0) {
        await client.query(
          `UPDATE application_ai_score_usage
           SET analysis_count = analysis_count + $2
           WHERE organization_id = $1::uuid AND usage_date = current_date`,
          [organizationId, chargeCount]
        )
      }
      const queuedResult = await client.query(
        `INSERT INTO application_ai_score (
           organization_id, application_id, job_id, candidate_id, requested_by,
           engine_version, rubric_version, fingerprint, status,
           job_snapshot, candidate_snapshot, candidate_snapshot_expires_at
         )
         SELECT $1::uuid, item.application_id, item.job_id, item.candidate_id, item.requested_by,
           $3, $4, item.fingerprint, 'pending', item.job_snapshot, item.candidate_snapshot,
           now() + ($5 * interval '1 day')
         FROM jsonb_to_recordset($2::jsonb) AS item(
           application_id uuid, candidate_id uuid, job_id uuid, requested_by uuid,
           fingerprint text, job_snapshot jsonb, candidate_snapshot jsonb
         )
         ON CONFLICT (application_id, engine_version, rubric_version, fingerprint)
         DO UPDATE SET
           requested_by = EXCLUDED.requested_by,
           status = 'pending',
           attempts = 0,
           lease_token = NULL,
           lease_until = NULL,
           available_at = now(),
           error_code = NULL,
           job_snapshot = EXCLUDED.job_snapshot,
           candidate_snapshot = EXCLUDED.candidate_snapshot,
           candidate_snapshot_expires_at = EXCLUDED.candidate_snapshot_expires_at,
           explanation = NULL,
           per_question = NULL,
           explanation_status = 'pending',
           updated_at = now()
         WHERE application_ai_score.status = 'failed'
         RETURNING id`,
        [
          organizationId,
          requestedJson,
          JEV_MODEL_VERSION,
          JEV_RUBRIC_VERSION,
          JEV_PROFILE_SNAPSHOT_RETENTION_DAYS,
        ]
      )
      if (queuedResult.rowCount !== chargeCount) {
        await client.query(
          `UPDATE application_ai_score_usage
           SET analysis_count = analysis_count + $2
           WHERE organization_id = $1::uuid AND usage_date = current_date`,
          [organizationId, (queuedResult.rowCount ?? 0) - chargeCount]
        )
      }
      await client.query("COMMIT")
      return { accepted: true, queued: queuedResult.rowCount ?? 0 }
    },
    catch: (cause) => new DbError({ operation: "enqueue_candidate_assessments", cause }),
  })
  if (result.isErr()) {
    await R.tryPromise({ try: () => client.query("ROLLBACK"), catch: () => undefined })
  }
  client.release(result.isErr())
  return result
}

export async function listLatestCandidateAssessments(
  jobId: string
): Promise<Result<ScoreDetails[], DbError>> {
  return R.tryPromise({
    try: async () => {
      const result = await pool.query(
        `SELECT DISTINCT ON (application_id)
           application_id AS "applicationId",
           candidate_id AS "candidateId",
           id AS "revisionId",
           status,
           CASE WHEN status = 'insufficient' THEN NULL ELSE score::float8 END AS score,
           CASE WHEN status = 'insufficient' THEN NULL ELSE
             CASE
               WHEN score < 40 THEN 'Bajo'
               WHEN score < 60 THEN 'Regular'
               WHEN score < 80 THEN 'Bueno'
               WHEN score IS NOT NULL THEN 'Excelente'
             END
           END AS label,
           CASE WHEN status = 'insufficient' THEN NULL ELSE confidence::float8 END AS confidence,
           sufficiency::float8 AS sufficiency,
           distribution,
           per_question AS "perQuestion",
           explanation_status AS "explanationStatus",
           error_code AS "errorCode",
           updated_at AS "updatedAt"
         FROM application_ai_score
         WHERE job_id = $1 AND engine_version = $2 AND rubric_version = $3
         ORDER BY application_id, created_at DESC, updated_at DESC`,
        [jobId, JEV_MODEL_VERSION, JEV_RUBRIC_VERSION]
      )
      return result.rows.map((row) => DbScoreSchema.parse(row))
    },
    catch: (cause) => new DbError({ operation: "list_candidate_assessments", cause }),
  })
}

export async function claimCandidateAssessments(
  limit: number
): Promise<Result<ClaimedAssessment[], DbError>> {
  return R.tryPromise({
    try: async () => {
      await pool.query(
        `UPDATE application_ai_score
         SET status = 'failed', error_code = 'max_attempts_reached', updated_at = now(), lease_until = NULL
         WHERE attempts >= $1
           AND status IN ('pending', 'processing')
           AND (status = 'pending' OR lease_until < now())`,
        [JEV_MAX_ATTEMPTS]
      )
      const result = await pool.query(
        `WITH queue AS (
           SELECT id
           FROM application_ai_score
           WHERE ((status = 'pending' AND available_at <= now())
             OR (status = 'processing' AND lease_until < now()))
             AND attempts < $1
             AND (lease_until IS NULL OR lease_until < now())
           ORDER BY created_at
           FOR UPDATE SKIP LOCKED
           LIMIT $2
         )
         UPDATE application_ai_score AS assessment
         SET status = 'processing',
             attempts = assessment.attempts + 1,
             lease_token = gen_random_uuid(),
             lease_until = now() + ($3 * interval '1 second'),
             updated_at = now()
         FROM queue
         WHERE assessment.id = queue.id
         RETURNING
           assessment.id AS "revisionId",
           assessment.application_id AS "applicationId",
           assessment.candidate_id AS "candidateId",
           assessment.job_id AS "jobId",
           assessment.organization_id AS "organizationId",
           assessment.requested_by AS "requestedBy",
           assessment.fingerprint,
           assessment.job_snapshot AS "jobSnapshot",
           assessment.candidate_snapshot AS "candidateSnapshot",
           assessment.lease_token AS "leaseToken",
           assessment.attempts`,
        [JEV_MAX_ATTEMPTS, limit, JEV_LEASE_SECONDS]
      )
      return result.rows.map((row) => DbClaimSchema.parse(row))
    },
    catch: (cause) => new DbError({ operation: "claim_candidate_assessments", cause }),
  })
}

export async function finishCandidateAssessment(
  assessment: ClaimedAssessment,
  result: JevAssessment
): Promise<Result<boolean, DbError>> {
  return R.tryPromise({
    try: async () => {
      const status = result.sufficiency < JEV_MINIMUM_DATA_SUFFICIENCY ? "insufficient" : "ready"
      const updated = await pool.query(
        `UPDATE application_ai_score
         SET status = $3,
             score = $4,
             confidence = $5,
             sufficiency = $6,
             distribution = $7::jsonb,
             per_question = $8::jsonb,
             input_tokens = $9,
             output_tokens = $10,
             error_code = NULL,
             computed_at = now(),
             updated_at = now(),
             lease_until = NULL
         WHERE id = $1 AND lease_token = $2 AND status = 'processing'`,
        [
          assessment.revisionId,
          assessment.leaseToken,
          status,
          result.score,
          result.confidence,
          result.sufficiency,
          JSON.stringify(result.distribution),
          JSON.stringify(result.perQuestion),
          result.inputTokens,
          result.outputTokens,
        ]
      )
      return updated.rowCount === 1
    },
    catch: (cause) => new DbError({ operation: "finish_candidate_assessment", cause }),
  })
}

export async function failCandidateAssessment(
  assessment: ClaimedAssessment,
  errorCode: string
): Promise<Result<boolean, DbError>> {
  return R.tryPromise({
    try: async () => {
      const updated = await pool.query(
        `UPDATE application_ai_score
         SET status = CASE WHEN attempts >= $3 THEN 'failed' ELSE 'pending' END,
             error_code = $4,
             lease_until = NULL,
             available_at = now() + (attempts * interval '15 seconds'),
             updated_at = now()
         WHERE id = $1 AND lease_token = $2 AND status = 'processing'`,
        [assessment.revisionId, assessment.leaseToken, JEV_MAX_ATTEMPTS, errorCode]
      )
      return updated.rowCount === 1
    },
    catch: (cause) => new DbError({ operation: "fail_candidate_assessment", cause }),
  })
}

export async function getCandidateAssessmentForExplanation(
  revisionId: string,
  jobId: string
): Promise<Result<ExplainInput | null, DbError>> {
  return R.tryPromise({
    try: async () => {
      const result = await pool.query(
        `SELECT id AS "revisionId", job_id AS "jobId", job_snapshot AS "jobSnapshot",
           candidate_snapshot AS "candidateSnapshot", score::float8 AS score,
           confidence::float8 AS confidence, sufficiency::float8 AS sufficiency,
           distribution, per_question AS "perQuestion"
         FROM application_ai_score
           WHERE id = $1 AND job_id = $2 AND status IN ('ready', 'insufficient')
             AND candidate_snapshot <> '{}'::jsonb
             AND candidate_snapshot_expires_at > now()`,
        [revisionId, jobId]
      )
      return result.rows[0] ? DbExplainSchema.parse(result.rows[0]) : null
    },
    catch: (cause) => new DbError({ operation: "get_candidate_assessment_explanation", cause }),
  })
}

export async function claimCandidateExplanation(
  revisionId: string,
  jobId: string,
  retryFailed: boolean
): Promise<Result<string | null, DbError>> {
  return R.tryPromise({
    try: async () => {
      const result = await pool.query<{ leaseToken: string }>(
        `UPDATE application_ai_score
         SET explanation_status = 'processing',
             lease_token = gen_random_uuid(),
             lease_until = now() + interval '60 seconds',
             updated_at = now()
         WHERE id = $1 AND job_id = $2
           AND status IN ('ready', 'insufficient')
           AND (
             explanation_status = 'pending'
             OR ($3 AND explanation_status = 'failed')
             OR (explanation_status = 'processing' AND lease_until < now())
           )
         RETURNING lease_token AS "leaseToken"`,
        [revisionId, jobId, retryFailed]
      )
      return result.rows[0]?.leaseToken ?? null
    },
    catch: (cause) => new DbError({ operation: "claim_candidate_explanation", cause }),
  })
}

export async function finishCandidateExplanation(
  revisionId: string,
  leaseToken: string,
  explanation: Record<string, unknown>,
  model: string
): Promise<Result<boolean, DbError>> {
  return R.tryPromise({
    try: async () => {
      const result = await pool.query(
        `UPDATE application_ai_score
         SET explanation = $3::jsonb,
             explanation_status = 'ready',
             explanation_model = $4,
             explanation_prompt_version = 1,
             candidate_snapshot = '{}'::jsonb,
             per_question = NULL,
             lease_until = NULL,
             updated_at = now()
         WHERE id = $1 AND lease_token = $2 AND explanation_status = 'processing'`,
        [revisionId, leaseToken, JSON.stringify(explanation), model]
      )
      return result.rowCount === 1
    },
    catch: (cause) => new DbError({ operation: "finish_candidate_explanation", cause }),
  })
}

export async function failCandidateExplanation(
  revisionId: string,
  leaseToken: string
): Promise<Result<boolean, DbError>> {
  return R.tryPromise({
    try: async () => {
      const result = await pool.query(
        `UPDATE application_ai_score
         SET explanation_status = 'failed', error_code = 'explanation_failed',
             lease_until = NULL, updated_at = now()
         WHERE id = $1 AND lease_token = $2 AND explanation_status = 'processing'`,
        [revisionId, leaseToken]
      )
      return result.rowCount === 1
    },
    catch: (cause) => new DbError({ operation: "fail_candidate_explanation", cause }),
  })
}

export async function getStoredCandidateExplanation(
  revisionId: string,
  jobId: string
): Promise<
  Result<{ status: string; explanation: Record<string, unknown> | null } | null, DbError>
> {
  return R.tryPromise({
    try: async () => {
      const result = await pool.query(
        `SELECT explanation_status AS status, explanation
         FROM application_ai_score WHERE id = $1 AND job_id = $2`,
        [revisionId, jobId]
      )
      const row = result.rows[0]
      if (!row) return null
      const parsed = z
        .object({
          status: z.string(),
          explanation: z.record(z.string(), z.unknown()).nullable(),
        })
        .parse(row)
      return parsed
    },
    catch: (cause) => new DbError({ operation: "get_stored_candidate_explanation", cause }),
  })
}

export async function purgeExpiredCandidateSnapshots(): Promise<Result<number, DbError>> {
  return R.tryPromise({
    try: async () => {
      const result = await pool.query(
        `UPDATE application_ai_score
         SET candidate_snapshot = '{}'::jsonb,
             per_question = NULL,
             explanation = NULL,
             explanation_status = 'expired',
             lease_until = NULL,
             updated_at = now()
         WHERE (candidate_snapshot <> '{}'::jsonb OR per_question IS NOT NULL OR explanation IS NOT NULL)
           AND candidate_snapshot_expires_at <= now()`
      )
      return result.rowCount ?? 0
    },
    catch: (cause) => new DbError({ operation: "purge_expired_candidate_snapshots", cause }),
  })
}
