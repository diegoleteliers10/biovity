-- Migration: re-scope BYOK credentials from user to organization
-- AI features belong to organizations; the org manager configures provider/model/key.
-- Table was empty at this point, so we rename + swap the key column safely.

ALTER TABLE user_ai_credentials RENAME TO organization_ai_credentials;

DROP INDEX IF EXISTS uq_user_ai_cred_user_active;
DROP INDEX IF EXISTS idx_user_ai_cred_user_id;

ALTER TABLE organization_ai_credentials DROP COLUMN user_id;
ALTER TABLE organization_ai_credentials ADD COLUMN organization_id VARCHAR(255) NOT NULL;

-- One active credential per organization
CREATE UNIQUE INDEX IF NOT EXISTS uq_org_ai_cred_active
  ON organization_ai_credentials(organization_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_org_ai_cred_organization_id
  ON organization_ai_credentials(organization_id);

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1754000000001, '012_organization_ai_credentials'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '012_organization_ai_credentials');
