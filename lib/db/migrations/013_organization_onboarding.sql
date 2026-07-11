-- organization_onboarding table (onboarding checklist persistence)
-- Tracks which onboarding steps an org has completed.
--
-- Idempotent: safe to re-run. Run with: psql $DATABASE_URL -f lib/db/migrations/013_organization_onboarding.sql

CREATE TABLE IF NOT EXISTS organization_onboarding (
  organization_id uuid PRIMARY KEY REFERENCES organization(id) ON DELETE CASCADE,
  steps_completed text[] NOT NULL DEFAULT '{}',
  dismissed boolean NOT NULL DEFAULT false,
  last_seen_step text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_org_onboarding_active
  ON organization_onboarding(organization_id) WHERE dismissed = false;

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1754000000002, '013_organization_onboarding'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '013_organization_onboarding');
