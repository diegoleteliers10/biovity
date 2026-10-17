CREATE TABLE IF NOT EXISTS email_outbox_admin_retry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_outbox_id uuid NOT NULL,
  actor_user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
  previous_attempts integer NOT NULL CHECK (previous_attempts >= 0),
  previous_error text,
  retried_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_outbox_admin_retry_history_idx
  ON email_outbox_admin_retry (email_outbox_id, retried_at DESC, id DESC);

ALTER TABLE email_outbox_admin_retry ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE email_outbox_admin_retry
  FROM PUBLIC, anon, authenticated, service_role;

INSERT INTO migrations (timestamp, name)
SELECT 1737450000032, '032_email_outbox_admin_retry_audit'
WHERE NOT EXISTS (
  SELECT 1 FROM migrations WHERE name = '032_email_outbox_admin_retry_audit'
);
