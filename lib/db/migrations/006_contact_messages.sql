-- Contact messages table for the "Contacta con ventas" form on /empresas
-- (components/landing/empresas/CTAContacto.tsx)
--
-- schema-primary-keys: bigint identity for sequential IDs
-- schema-lowercase-identifiers: snake_case
-- query-missing-indexes: indexes on email and created_at for fast lookups
--
-- Run with: psql $DATABASE_URL -f lib/db/migrations/006_contact_messages.sql
-- Idempotent: safe to re-run

CREATE TABLE IF NOT EXISTS contact_messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre text NOT NULL,
  apellido text NOT NULL,
  email text NOT NULL,
  telefono text,
  empresa text NOT NULL,
  mensaje text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common queries (admin/CRM lookups)
CREATE INDEX IF NOT EXISTS contact_messages_email_idx ON contact_messages (email);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_empresa_idx ON contact_messages (empresa);

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1737450000005, '006_contact_messages'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '006_contact_messages');
