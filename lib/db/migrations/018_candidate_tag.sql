-- Candidate tags for organizations
--
-- Idempotent: safe to re-run. Run with: psql $DATABASE_URL -f lib/db/migrations/018_candidate_tag.sql

CREATE TABLE IF NOT EXISTS candidate_tag (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  name varchar(100) NOT NULL,
  color varchar(7) DEFAULT '#6366f1',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(organization_id, name)
);

CREATE TABLE IF NOT EXISTS candidate_tag_assignment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id uuid NOT NULL REFERENCES candidate_tag(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tag_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_candidate_tag_org ON candidate_tag(organization_id);
CREATE INDEX IF NOT EXISTS idx_candidate_tag_assignment_tag ON candidate_tag_assignment(tag_id);
CREATE INDEX IF NOT EXISTS idx_candidate_tag_assignment_candidate ON candidate_tag_assignment(candidate_id);

INSERT INTO migrations (timestamp, name)
SELECT 1754000000007, '018_candidate_tag'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '018_candidate_tag');
