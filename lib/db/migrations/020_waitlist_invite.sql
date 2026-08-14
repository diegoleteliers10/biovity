-- Track when the waitlist "you've been selected / the waitlist opened" invite email was sent
-- Run with: psql $DATABASE_URL -f lib/db/migrations/020_waitlist_invite.sql
--
-- NULL = invite email not sent yet; timestamp = invite email sent at that time
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS invited_at timestamptz;

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1737450000020, '020_waitlist_invite'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '020_waitlist_invite');
