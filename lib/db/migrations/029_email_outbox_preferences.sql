ALTER TABLE email_outbox
  ADD COLUMN IF NOT EXISTS recipient_user_id uuid;

ALTER TABLE email_outbox
  DROP CONSTRAINT IF EXISTS email_outbox_status_check;

ALTER TABLE email_outbox
  ADD CONSTRAINT email_outbox_status_check
  CHECK (status IN ('pending', 'processing', 'sent', 'dead', 'suppressed'));

CREATE INDEX IF NOT EXISTS email_outbox_suppressed_idx
  ON email_outbox (created_at DESC)
  WHERE status = 'suppressed';

ALTER TABLE email_outbox ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE email_outbox FROM PUBLIC, anon, authenticated, service_role;

INSERT INTO migrations (timestamp, name)
SELECT 1737450000029, '029_email_outbox_preferences'
WHERE NOT EXISTS (
  SELECT 1 FROM migrations WHERE name = '029_email_outbox_preferences'
);
