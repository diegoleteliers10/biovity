-- Migration: Create ai_interaction_logs table for audit logging
-- This table stores AI interaction records for security auditing and abuse detection

CREATE TABLE IF NOT EXISTS ai_interaction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  input_hash VARCHAR(64) NOT NULL,
  output_summary VARCHAR(200),
  tools_called JSONB DEFAULT '[]',
  flagged BOOLEAN DEFAULT FALSE,
  duration_ms INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_ai_interaction_logs_user_id ON ai_interaction_logs(user_id);

-- Index for flagged interactions
CREATE INDEX IF NOT EXISTS idx_ai_interaction_logs_flagged ON ai_interaction_logs(flagged);

-- Index for time-range queries
CREATE INDEX IF NOT EXISTS idx_ai_interaction_logs_timestamp ON ai_interaction_logs(timestamp DESC);

-- Index for endpoint queries
CREATE INDEX IF NOT EXISTS idx_ai_interaction_logs_endpoint ON ai_interaction_logs(endpoint);