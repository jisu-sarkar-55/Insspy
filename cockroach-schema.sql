-- ────────────────────────────────────────────────────────────────
-- CockroachDB Schema for Insspy
-- Run this in CockroachDB SQL Shell after creating a Serverless cluster
-- ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS trading_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  broker TEXT,
  account_type TEXT,
  starting_balance DECIMAL(18,4),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trading_accounts_user_id ON trading_accounts(user_id);

CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  account_id UUID,
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
  setup_playbook_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_user_entry ON trades(user_id, entry_time DESC);
CREATE INDEX IF NOT EXISTS idx_trades_mt5_ticket ON trades(mt5_ticket);
CREATE INDEX IF NOT EXISTS idx_trades_strategy ON trades(user_id, strategy);

CREATE TABLE IF NOT EXISTS ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  trade_ids UUID[],
  analysis_text TEXT,
  insights JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_analyses_user_id ON ai_analyses(user_id);

CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  target_value DECIMAL(18,4),
  current_value DECIMAL(18,4) DEFAULT 0,
  unit TEXT,
  period TEXT,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);

CREATE TABLE IF NOT EXISTS setup_playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  entry_rules TEXT[],
  exit_rules TEXT[],
  timeframe TEXT,
  market_conditions TEXT[],
  screenshot_urls TEXT[],
  examples TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_setup_playbooks_user_id ON setup_playbooks(user_id);

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  key TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT 'MT5 Sync',
  last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);

CREATE TABLE IF NOT EXISTS report_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  report_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_downloads_user_id ON report_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_report_downloads_created ON report_downloads(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS import_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  source TEXT NOT NULL,
  trades_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_import_log_user_id ON import_log(user_id);
CREATE INDEX IF NOT EXISTS idx_import_log_source ON import_log(user_id, source);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  display_name TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
