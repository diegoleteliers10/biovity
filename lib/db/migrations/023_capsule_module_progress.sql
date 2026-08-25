-- Per-module progress tracking for capsules
-- Security: RLS ENABLED; access only via service-role (server-side auth).
-- Run with: psql $DATABASE_URL -f lib/db/migrations/023_capsule_module_progress.sql

CREATE TABLE IF NOT EXISTS capsule_module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  capsule_slug text NOT NULL,
  module_index integer NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- One record per user per capsule per module
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'module_progress_user_slug_idx_key') THEN
    ALTER TABLE capsule_module_progress ADD CONSTRAINT module_progress_user_slug_idx_key UNIQUE (user_id, capsule_slug, module_index);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS capsule_module_progress_user_id_idx ON capsule_module_progress (user_id);
CREATE INDEX IF NOT EXISTS capsule_module_progress_capsule_slug_idx ON capsule_module_progress (capsule_slug);

-- Security: RLS (service-role only, no policies)
ALTER TABLE capsule_module_progress ENABLE ROW LEVEL SECURITY;

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1737450000230, '023_capsule_module_progress'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '023_capsule_module_progress');
