-- Align waitlist.id with the uuid column the application already assumes.
-- 001_waitlist.sql created waitlist.id as `bigint GENERATED ALWAYS AS IDENTITY`,
-- but the deployed table stores uuid. The admin waitlist API casts its bind
-- parameters to uuid ($1::uuid[]) and validates ids with a uuid schema, so a
-- database built from 001 alone cannot serve those routes.
--
-- This migration converts the column to uuid. Existing rows keep their email,
-- role, created_at and invited_at values. Their id values are regenerated:
-- bigint has no lossless cast to uuid. No foreign key references waitlist.id,
-- so nothing outside the table depends on the old values.
--
-- Idempotent: safe to re-run. No-op when the column is already uuid.
-- Wrapped in a transaction so a failed conversion does not register itself.
-- Run with: psql $DATABASE_URL -f lib/db/migrations/024_waitlist_id_uuid.sql

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'waitlist'
      AND column_name = 'id'
      AND data_type <> 'uuid'
  ) THEN
    -- DROP IDENTITY must run first: it owns the sequence and the column default
    ALTER TABLE waitlist ALTER COLUMN id DROP IDENTITY IF EXISTS;
    ALTER TABLE waitlist ALTER COLUMN id DROP DEFAULT;
    ALTER TABLE waitlist ALTER COLUMN id TYPE uuid USING gen_random_uuid();
    ALTER TABLE waitlist ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1737450000240, '024_waitlist_id_uuid'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '024_waitlist_id_uuid');

COMMIT;