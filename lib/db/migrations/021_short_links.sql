-- short_link table (email verification short links)
-- Maps a short code to the full verification URL. One-time use: the row is
-- deleted when the redirect is served.
--
-- schema-primary-keys: text code (random, unguessable)
-- schema-lowercase-identifiers: snake_case
-- Security: RLS DISABLED; access only via service-role (server-side auth).
-- Idempotent: safe to re-run.
-- Run with: psql $DATABASE_URL -f lib/db/migrations/021_short_links.sql

CREATE TABLE IF NOT EXISTS short_link (
  code text PRIMARY KEY,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS short_link_created_at_idx ON short_link (created_at);

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1737450000020, '021_short_links'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '021_short_links');