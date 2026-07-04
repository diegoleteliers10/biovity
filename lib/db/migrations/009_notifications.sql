-- notification table (notifications feature)
-- Backs app/api/notifications/* (this repo reads/writes via Supabase service-role).
--
-- CONTRACT for the external NestJS backend (:3001): INSERT rows here directly
-- (shared Supabase Postgres). Required: user_id, type, title. Optional: body,
-- link, data (jsonb). Full spec: docs/notifications-backend-plan.md
--
-- schema-primary-keys: uuid (gen_random_uuid)
-- Security: RLS DISABLED; access only via service-role (server-side auth).
-- NOT in supabase_realtime publication (polling-based, see use-notifications.ts).
-- Idempotent: safe to re-run.
-- Run with: psql $DATABASE_URL -f lib/db/migrations/009_notifications.sql

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('application', 'interview', 'message', 'job_alert', 'system');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS notification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  type notification_type NOT NULL DEFAULT 'system',
  title varchar NOT NULL,
  body text,
  link text,
  data jsonb DEFAULT '{}',
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notification_user_unread
  ON notification (user_id) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notification_user_created
  ON notification (user_id, created_at DESC);

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1737450000008, '009_notifications'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '009_notifications');
