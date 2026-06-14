CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT 'MT5 Sync',
  last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own API keys" ON api_keys FOR ALL USING (auth.uid() = user_id);
