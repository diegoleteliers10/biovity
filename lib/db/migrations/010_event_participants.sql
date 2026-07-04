-- event_participant table (event RSVP / multi-participant support)
-- Backs the accept/decline flow in chat EventMessageCard + calendar.
--
-- Uses the pre-existing enums participant_role_enum (organizer/attendee/guest)
-- and participant_status_enum (pending/accepted/declined) which were orphaned.
--
-- CONTRACT for the external NestJS backend (:3001):
--   POST /events          -> also seed organizer (role=organizer,status=accepted)
--                            and candidate (role=attendee,status=pending) rows.
--   PATCH /events/:id/participants/:userId {status} -> update status + notify.
--   GET /events/:id       -> return participants[] (EventWithParticipants).
--   GET /events?userId=   -> include events where user is a participant.
-- Full spec: docs/events-backend-plan.md
--
-- Idempotent: safe to re-run. Run with: psql $DATABASE_URL -f lib/db/migrations/010_event_participants.sql

CREATE TABLE IF NOT EXISTS event_participant (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  role participant_role_enum NOT NULL DEFAULT 'attendee',
  status participant_status_enum NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT event_participant_event_user_key UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_participant_user ON event_participant (user_id);
CREATE INDEX IF NOT EXISTS idx_event_participant_event ON event_participant (event_id);
CREATE INDEX IF NOT EXISTS idx_event_participant_pending
  ON event_participant (event_id) WHERE status = 'pending';

-- Backfill: seed participants from existing events (idempotent via UNIQUE)
INSERT INTO event_participant (event_id, user_id, role, status)
SELECT id, "organizerId", 'organizer', 'accepted' FROM event WHERE "organizerId" IS NOT NULL
ON CONFLICT (event_id, user_id) DO NOTHING;

INSERT INTO event_participant (event_id, user_id, role, status)
SELECT id, "candidateId", 'attendee', 'pending' FROM event WHERE "candidateId" IS NOT NULL
ON CONFLICT (event_id, user_id) DO NOTHING;

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1737450000009, '010_event_participants'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '010_event_participants');
