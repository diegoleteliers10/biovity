-- short_link table (email verification short links)
-- Maps a short code to the full verification URL. One-time use: the row is
-- deleted when the redirect is served.
--
-- schema-primary-keys: text code (random, unguessable)
-- schema-lowercase-identifiers: snake_case
-- Security: RLS enabled; revoke Data API access. The server uses its private database connection.
-- Idempotent: safe to re-run.
-- Run with: psql $DATABASE_URL -f lib/db/migrations/021_short_links.sql

CREATE TABLE IF NOT EXISTS short_link (
  code text PRIMARY KEY,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS short_link_created_at_idx ON short_link (created_at);

ALTER TABLE public.short_link ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.short_link FROM PUBLIC, anon, authenticated, service_role;

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1737450000020, '021_short_links'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '021_short_links');
