-- chat + message tables (realtime messaging)
-- Back app/api/messages/route.ts and app/api/messages/[chatId]/route.ts (this repo).
--
-- schema-primary-keys: uuid (uuid_generate_v4)
-- query-missing-indexes: composites on (user, createdAt) + partial unread index
--
-- NOTE: already bootstrapped in Supabase; idempotent (safe to re-run).
-- Run with: psql $DATABASE_URL -f lib/db/migrations/008_chats_messages.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE message_type AS ENUM ('text', 'event', 'audio', 'image', 'file');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS chat (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  "recruiterId" uuid NOT NULL,
  "professionalId" uuid NOT NULL,
  "lastMessage" varchar,
  "unreadCountRecruiter" int NOT NULL DEFAULT 0,
  "unreadCountProfessional" int NOT NULL DEFAULT 0,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp,
  CONSTRAINT chat_pkey PRIMARY KEY (id),
  CONSTRAINT FK_chat_recruiter FOREIGN KEY ("recruiterId") REFERENCES "user"(id),
  CONSTRAINT FK_chat_professional FOREIGN KEY ("professionalId") REFERENCES "user"(id)
);

CREATE TABLE IF NOT EXISTS message (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  "chatId" uuid NOT NULL,
  "senderId" uuid NOT NULL,
  content text NOT NULL,
  "isRead" boolean NOT NULL DEFAULT false,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  type message_type DEFAULT 'text',
  content_type jsonb,
  CONSTRAINT message_pkey PRIMARY KEY (id),
  CONSTRAINT FK_message_chat FOREIGN KEY ("chatId") REFERENCES chat(id),
  CONSTRAINT FK_message_sender FOREIGN KEY ("senderId") REFERENCES "user"(id)
);

CREATE INDEX IF NOT EXISTS "idx_chat_professionalId_createdAt"
  ON chat ("professionalId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_chat_recruiterId_createdAt"
  ON chat ("recruiterId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_message_chatId_createdAt"
  ON message ("chatId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_message_senderId_createdAt"
  ON message ("senderId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_message_chat_unread
  ON message ("chatId") WHERE ("isRead" = false);

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1737450000007, '008_chats_messages'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '008_chats_messages');
