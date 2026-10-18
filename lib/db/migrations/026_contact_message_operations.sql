-- Add an owned, auditable workflow to existing contact inquiries.
-- Next.js owns this table's schema and the submitted contact fields.
-- NestJS owns the workflow fields and contact_message_events writes.

ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS status varchar(20) NOT NULL DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS assigned_admin_id uuid REFERENCES "user"(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS follow_up_at date,
  ADD COLUMN IF NOT EXISTS resolution_note text,
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolved_by_id uuid REFERENCES "user"(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'contact_messages_status_check'
      AND conrelid = 'contact_messages'::regclass
  ) THEN
    ALTER TABLE contact_messages
      ADD CONSTRAINT contact_messages_status_check
      CHECK (status IN ('open', 'in_progress', 'resolved'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'contact_messages_resolution_note_length_check'
      AND conrelid = 'contact_messages'::regclass
  ) THEN
    ALTER TABLE contact_messages
      ADD CONSTRAINT contact_messages_resolution_note_length_check
      CHECK (resolution_note IS NULL OR char_length(resolution_note) <= 4000);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS contact_messages_status_created_idx
  ON contact_messages (status, created_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_follow_up_idx
  ON contact_messages (follow_up_at)
  WHERE status <> 'resolved' AND follow_up_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS contact_messages_assignee_idx
  ON contact_messages (assigned_admin_id, status);

CREATE TABLE IF NOT EXISTS contact_message_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  message_id bigint NOT NULL REFERENCES contact_messages(id) ON DELETE CASCADE,
  actor_user_id uuid REFERENCES "user"(id) ON DELETE SET NULL,
  event_type varchar(30) NOT NULL,
  previous_status varchar(20),
  new_status varchar(20),
  previous_assigned_admin_id uuid,
  new_assigned_admin_id uuid,
  previous_follow_up_at date,
  new_follow_up_at date,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_message_events_message_created_idx
  ON contact_message_events (message_id, created_at DESC);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_message_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE contact_messages FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL ON TABLE contact_message_events FROM PUBLIC, anon, authenticated, service_role;

INSERT INTO migrations (timestamp, name)
SELECT 1737450000026, '026_contact_message_operations'
WHERE NOT EXISTS (
  SELECT 1 FROM migrations WHERE name = '026_contact_message_operations'
);
