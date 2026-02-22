-- Standardize user type and waitlist role to professional | organization
-- Run with: psql $DATABASE_URL -f lib/db/migrations/002_standardize_user_type_role.sql
--
-- Migrates existing data from legacy values (no data loss):
--   user.type: persona -> professional, organización -> organization
--   waitlist.role: empresa -> organization (professional already correct)
--
-- Step 1: Add new enum values to user_type_enum (must run before UPDATE)
-- PostgreSQL: new enum values must exist before use; IF NOT EXISTS avoids errors on re-run
ALTER TYPE user_type_enum ADD VALUE IF NOT EXISTS 'professional';
ALTER TYPE user_type_enum ADD VALUE IF NOT EXISTS 'organization';

-- Step 2: Drop waitlist check constraint, update data, re-add constraint
ALTER TABLE waitlist DROP CONSTRAINT IF EXISTS waitlist_role_check;
UPDATE waitlist SET role = 'organization' WHERE role = 'empresa';
ALTER TABLE waitlist ADD CONSTRAINT waitlist_role_check CHECK (role IN ('professional', 'organization'));

-- Step 3: Update user table (Better Auth)
UPDATE "user" SET type = 'professional' WHERE type = 'persona';
UPDATE "user" SET type = 'organization' WHERE type = 'organización';

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1737450000001, '002_standardize_user_type_role'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '002_standardize_user_type_role');
