-- Capsule progress and certificates tables
-- Security: RLS ENABLED; access only via service-role (server-side auth).
-- Run with: psql $DATABASE_URL -f lib/db/migrations/022_capsule_progress_certificates.sql

CREATE TABLE IF NOT EXISTS capsule_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  capsule_slug text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  quiz_passed boolean NOT NULL DEFAULT false,
  quiz_score integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint: one progress record per user per capsule
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'capsule_progress_user_slug_key') THEN
    ALTER TABLE capsule_progress ADD CONSTRAINT capsule_progress_user_slug_key UNIQUE (user_id, capsule_slug);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS capsule_progress_user_id_idx ON capsule_progress (user_id);
CREATE INDEX IF NOT EXISTS capsule_progress_capsule_slug_idx ON capsule_progress (capsule_slug);

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  capsule_slug text NOT NULL,
  capsule_title text NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now()
);

-- One certificate per user per capsule
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'certificates_user_slug_key') THEN
    ALTER TABLE certificates ADD CONSTRAINT certificates_user_slug_key UNIQUE (user_id, capsule_slug);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS certificates_user_id_idx ON certificates (user_id);
CREATE INDEX IF NOT EXISTS certificates_capsule_slug_idx ON certificates (capsule_slug);

-- Security: RLS (service-role only, no policies)
ALTER TABLE capsule_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1737450000220, '022_capsule_progress_certificates'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '022_capsule_progress_certificates');
