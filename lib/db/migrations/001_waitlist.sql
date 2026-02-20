-- Waitlist table (Supabase Postgres best practices)
-- schema-primary-keys: bigint identity for sequential IDs
-- schema-lowercase-identifiers: snake_case
-- query-missing-indexes: index on email for UNIQUE lookups and duplicate checks
--
-- Run with: psql $DATABASE_URL -f lib/db/migrations/001_waitlist.sql
-- For existing tables: indexes and constraint blocks are idempotent (IF NOT EXISTS)

CREATE TABLE IF NOT EXISTS waitlist (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL,
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint for duplicate email prevention (API returns 409 on 23505)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'waitlist_email_key') THEN
    ALTER TABLE waitlist ADD CONSTRAINT waitlist_email_key UNIQUE (email);
  END IF;
END $$;

-- query-missing-indexes: index on email for fast lookups and UNIQUE enforcement
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);

-- Optional: index on role for filtering (e.g. admin dashboards)
CREATE INDEX IF NOT EXISTS waitlist_role_idx ON waitlist (role);

-- Register migration in migrations table (Better Auth / migration tracking)
INSERT INTO migrations (timestamp, name)
SELECT 1737450000000, '001_waitlist'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '001_waitlist');
