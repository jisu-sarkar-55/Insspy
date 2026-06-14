CREATE TABLE IF NOT EXISTS trading_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  broker TEXT,
  account_type TEXT,
  starting_balance DECIMAL(18,4),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  account_id UUID REFERENCES trading_accounts(id),
  symbol TEXT NOT NULL,
  direction TEXT NOT NULL,
  entry_price DECIMAL(18,8),
  exit_price DECIMAL(18,8),
  stop_loss DECIMAL(18,8),
  take_profit DECIMAL(18,8),
  lot_size DECIMAL(18,4),
  entry_time TIMESTAMPTZ,
  exit_time TIMESTAMPTZ,
  pnl DECIMAL(18,4),
  commission DECIMAL(18,4) DEFAULT 0,
  swap DECIMAL(18,4) DEFAULT 0,
  net_pnl DECIMAL(18,4),
  strategy TEXT,
  tags TEXT[],
  notes TEXT,
  screenshot_url TEXT,
  confidence_before INT,
  fear_level INT,
  greed_level INT,
  followed_plan BOOLEAN,
  mistakes TEXT[],
  source TEXT DEFAULT 'manual',
  mt5_ticket TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  trade_ids UUID[],
  analysis_text TEXT,
  insights JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE trading_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own accounts" ON trading_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own trades" ON trades FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own analyses" ON ai_analyses FOR ALL USING (auth.uid() = user_id);
