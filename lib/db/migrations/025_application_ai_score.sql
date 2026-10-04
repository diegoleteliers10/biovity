-- Jev compatibility score revisions and per-organization daily request limits.
-- Run with: psql $DATABASE_URL -f lib/db/migrations/025_application_ai_score.sql

CREATE TABLE IF NOT EXISTS application_ai_score (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  application_id uuid NOT NULL REFERENCES application(id) ON DELETE CASCADE,
  job_id uuid NOT NULL,
  candidate_id uuid NOT NULL,
  requested_by uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  engine_version text NOT NULL,
  rubric_version integer NOT NULL,
  fingerprint varchar(64) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'processing', 'ready', 'insufficient', 'failed')),
  available_at timestamptz NOT NULL DEFAULT now(),
  score numeric(5, 2),
  confidence numeric(5, 4),
  sufficiency numeric(5, 4),
  distribution jsonb,
  per_question jsonb,
  job_snapshot jsonb NOT NULL,
  candidate_snapshot jsonb NOT NULL,
  candidate_snapshot_expires_at timestamptz NOT NULL,
  explanation jsonb,
  explanation_status text NOT NULL DEFAULT 'pending'
    CHECK (explanation_status IN ('pending', 'processing', 'ready', 'failed', 'expired')),
  explanation_model text,
  explanation_prompt_version integer,
  attempts integer NOT NULL DEFAULT 0,
  lease_token uuid,
  lease_until timestamptz,
  error_code text,
  input_tokens integer,
  output_tokens integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  computed_at timestamptz,
  UNIQUE (application_id, engine_version, rubric_version, fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_application_ai_score_latest
  ON application_ai_score (job_id, application_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_application_ai_score_queue
  ON application_ai_score (status, available_at, lease_until, created_at)
  WHERE status IN ('pending', 'processing');

CREATE INDEX IF NOT EXISTS idx_application_ai_score_snapshot_expiry
  ON application_ai_score (candidate_snapshot_expires_at)
  WHERE status IN ('ready', 'insufficient') AND candidate_snapshot <> '{}'::jsonb;

CREATE TABLE IF NOT EXISTS application_ai_score_usage (
  organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  usage_date date NOT NULL DEFAULT current_date,
  analysis_count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (organization_id, usage_date)
);

ALTER TABLE application_ai_score ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_ai_score_usage ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON application_ai_score, application_ai_score_usage FROM PUBLIC, anon, authenticated;

INSERT INTO migrations (timestamp, name)
SELECT 1791064891000, '025_application_ai_score'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '025_application_ai_score');
