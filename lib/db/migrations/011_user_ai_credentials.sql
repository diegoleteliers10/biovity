-- Migration: BYOK AI credentials (encrypted at rest, one active credential per user)
-- Stores provider/model/encrypted API key so users can bring their own model.
-- Plaintext key is never stored; only ciphertext + iv + auth tag (AES-256-GCM).

CREATE TABLE IF NOT EXISTS user_ai_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  provider VARCHAR(32) NOT NULL,
  model_id VARCHAR(128) NOT NULL,
  api_key_ciphertext TEXT NOT NULL,
  api_key_iv TEXT NOT NULL,
  api_key_auth_tag TEXT NOT NULL,
  key_preview VARCHAR(8) NOT NULL,
  label VARCHAR(64),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One active credential per user
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_ai_cred_user_active
  ON user_ai_credentials(user_id) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_user_ai_cred_user_id
  ON user_ai_credentials(user_id);

-- Register migration
INSERT INTO migrations (timestamp, name)
SELECT 1754000000000, '011_user_ai_credentials'
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = '011_user_ai_credentials');
