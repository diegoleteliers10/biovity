-- Organization table
-- Backs app/api/register/organization/route.ts (this repo writes here directly via pool).
--
-- NOTE: schema-primary-keys: uuid (uuid_generate_v4), already bootstrapped in Supabase.
-- FK "subscriptionId" -> subscription (subscription owned by the :3001 backend).
-- Idempotent: safe to re-run (table already exists in production).
--
-- Run with: psql $DATABASE_URL -f lib/db/migrations/007_organization.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS organization (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name varchar NOT NULL,
  website varchar NOT NULL,
  phone varchar,
  address json,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "subscriptionId" uuid UNIQUE,
  CONSTRAINT organization_pkey PRIMARY KEY (id)
);

ALTER TABLE organization
  DROP CONSTRAINT IF EXISTS "FK_3fd71a83430ba84e0de5aa5495f";
ALTER TABLE organization
  ADD CONSTRAINT "FK_3fd71a83430ba84e0de5aa5495f"
  FOREIGN KEY ("subscriptionId") REFERENCES subscription(id);

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1737450000006, '007_organization'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '007_organization');
