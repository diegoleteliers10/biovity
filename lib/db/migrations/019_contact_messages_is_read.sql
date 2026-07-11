-- Add is_read column to contact_messages for mark-as-read tracking
-- Idempotent: safe to re-run

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_messages' AND column_name = 'is_read'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN is_read BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS contact_messages_is_read_idx ON contact_messages (is_read);

INSERT INTO migrations (timestamp, name)
SELECT 1737450000019, '019_contact_messages_is_read'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '019_contact_messages_is_read');
