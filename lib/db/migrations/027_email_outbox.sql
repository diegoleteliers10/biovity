-- Durable Next.js-owned queue for transactional and administrative email.
-- Message bodies can include short-lived verification and password reset links.

CREATE TABLE IF NOT EXISTS email_outbox (
  id uuid PRIMARY KEY,
  email_type varchar(40) NOT NULL,
  idempotency_key text UNIQUE,
  source_type varchar(40),
  source_id uuid,
  recipient_email text NOT NULL,
  from_email text NOT NULL,
  subject text NOT NULL,
  html text,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  status varchar(20) NOT NULL DEFAULT 'pending',
  attempts smallint NOT NULL DEFAULT 0,
  available_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz,
  provider_id text,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  CONSTRAINT email_outbox_status_check
    CHECK (status IN ('pending', 'processing', 'sent', 'dead')),
  CONSTRAINT email_outbox_attempts_check CHECK (attempts >= 0)
);

CREATE INDEX IF NOT EXISTS email_outbox_pending_idx
  ON email_outbox (available_at, created_at)
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS email_outbox_expired_lease_idx
  ON email_outbox (locked_at)
  WHERE status = 'processing';
CREATE INDEX IF NOT EXISTS email_outbox_dead_idx
  ON email_outbox (created_at DESC)
  WHERE status = 'dead';

ALTER TABLE email_outbox ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE email_outbox FROM PUBLIC, anon, authenticated, service_role;

INSERT INTO migrations (timestamp, name)
SELECT 1737450000027, '027_email_outbox'
WHERE NOT EXISTS (
  SELECT 1 FROM migrations WHERE name = '027_email_outbox'
);
