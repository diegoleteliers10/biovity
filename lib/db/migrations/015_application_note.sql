-- application_note table (internal recruiter notes per application)
--
-- Idempotent: safe to re-run. Run with: psql $DATABASE_URL -f lib/db/migrations/015_application_note.sql

CREATE TABLE IF NOT EXISTS application_note (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES application(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_app_note_application ON application_note(application_id, created_at DESC);

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1754000000004, '015_application_note'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '015_application_note');
