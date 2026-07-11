-- Saved candidates (favorites) for organizations
--
-- Idempotent: safe to re-run. Run with: psql $DATABASE_URL -f lib/db/migrations/017_saved_candidate.sql

CREATE TABLE IF NOT EXISTS saved_candidate (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(organization_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_candidate_org ON saved_candidate(organization_id);
CREATE INDEX IF NOT EXISTS idx_saved_candidate_candidate ON saved_candidate(candidate_id);

INSERT INTO migrations (timestamp, name)
SELECT 1754000000006, '017_saved_candidate'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '017_saved_candidate');
