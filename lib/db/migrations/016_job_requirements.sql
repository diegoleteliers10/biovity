-- Add requiredSkills and minExperience columns to job table
--
-- Idempotent: safe to re-run. Run with: psql $DATABASE_URL -f lib/db/migrations/016_job_requirements.sql

DO $$ BEGIN
  ALTER TABLE job ADD COLUMN required_skills jsonb DEFAULT '[]'::jsonb;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE job ADD COLUMN min_experience int DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1754000000005, '016_job_requirements'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '016_job_requirements');
