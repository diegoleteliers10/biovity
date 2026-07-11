-- application_evaluation table (candidate scorecard by recruiters)
-- Each recruiter can leave one evaluation per application.
--
-- Idempotent: safe to re-run. Run with: psql $DATABASE_URL -f lib/db/migrations/014_application_evaluation.sql

CREATE TYPE evaluation_rating AS ENUM ('positive', 'neutral', 'negative');

CREATE TABLE IF NOT EXISTS application_evaluation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES application(id) ON DELETE CASCADE,
  evaluator_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  rating evaluation_rating NOT NULL,
  notes text,
  skills_assessment jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_eval_app_evaluator UNIQUE (application_id, evaluator_id)
);

CREATE INDEX idx_app_eval_application ON application_evaluation(application_id);

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1754000000003, '014_application_evaluation'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '014_application_evaluation');
