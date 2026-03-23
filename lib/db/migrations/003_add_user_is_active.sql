-- Add isActive column to user table for deactivation logic (BIO-27)
-- Run with: psql $DATABASE_URL -f lib/db/migrations/003_add_user_is_active.sql
--
-- Default true for existing users; inactive users cannot sign in.

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true;

-- Backfill: ensure existing users are active
UPDATE "user" SET "isActive" = true WHERE "isActive" IS NULL;

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1737450000002, '003_add_user_is_active'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '003_add_user_is_active');
