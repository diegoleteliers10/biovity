CREATE TABLE IF NOT EXISTS application_ai_recommendation_review (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id uuid NOT NULL UNIQUE,
  revision_id uuid NOT NULL REFERENCES application_ai_score(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES "user"(id) ON DELETE SET NULL,
  reviewer_name text NOT NULL CHECK (length(trim(reviewer_name)) BETWEEN 1 AND 120),
  ai_recommendation text NOT NULL
    CHECK (ai_recommendation IN ('Avanzar', 'Evaluar', 'Descartar')),
  human_decision text NOT NULL
    CHECK (human_decision IN ('Avanzar', 'Evaluar', 'Descartar')),
  reason text CHECK (reason IS NULL OR length(trim(reason)) BETWEEN 1 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ai_recommendation = human_decision OR reason IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_ai_recommendation_review_history
  ON application_ai_recommendation_review (revision_id, created_at DESC, id DESC);

ALTER TABLE application_ai_recommendation_review ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE application_ai_recommendation_review
  FROM PUBLIC, anon, authenticated, service_role;

INSERT INTO migrations (timestamp, name)
SELECT 1791800000031, '031_application_ai_recommendation_review'
WHERE NOT EXISTS (
  SELECT 1 FROM migrations WHERE name = '031_application_ai_recommendation_review'
);
