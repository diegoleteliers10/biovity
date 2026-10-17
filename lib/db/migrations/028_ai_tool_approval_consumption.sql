CREATE TABLE IF NOT EXISTS ai_tool_approval_consumptions (
  tool_call_id text PRIMARY KEY,
  actor_id text NOT NULL,
  organization_id text NOT NULL,
  tool_name text NOT NULL,
  input_hash char(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ai_tool_approval_consumptions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE ai_tool_approval_consumptions FROM PUBLIC, anon, authenticated, service_role;

INSERT INTO migrations (timestamp, name)
SELECT 1737450000028, '028_ai_tool_approval_consumption'
WHERE NOT EXISTS (
  SELECT 1 FROM migrations WHERE name = '028_ai_tool_approval_consumption'
);
