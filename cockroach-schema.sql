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

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  display_name TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  interval TEXT CHECK (interval IS NULL OR interval IN ('month', 'year')),
  trial_days INT DEFAULT 7,
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_amount DECIMAL(10,2),
  max_uses INT,
  max_uses_per_user INT DEFAULT 1,
  current_uses INT DEFAULT 0,
  applies_to_plan_ids UUID[],
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupon_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL,
  user_id UUID NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coupon_id, user_id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'expired', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  coupon_id UUID,
  razorpay_subscription_id TEXT,
  razorpay_order_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_order_id ON subscriptions(razorpay_order_id);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subscription_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded')),
  processor TEXT DEFAULT 'razorpay',
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  razorpay_signature TEXT,
  coupon_id UUID,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- Seed default pricing plans
INSERT INTO pricing_plans (name, description, price, currency, interval, trial_days, features, sort_order) VALUES
  ('premium_monthly', 'Premium Monthly — full access, cancel anytime', 499.00, 'INR', 'month', 7, '{"ai_coaching":true,"advanced_analytics":true,"unlimited_history":true,"priority_support":true,"mt5_sync":true,"psychology_tracking":true,"scorecard":true,"reports":true,"trade_replay":true,"leaderboard":true,"setup_playbook":true}', 1),
  ('premium_yearly', 'Premium Yearly — 2 months free with annual plan', 4999.00, 'INR', 'year', 7, '{"ai_coaching":true,"advanced_analytics":true,"unlimited_history":true,"priority_support":true,"mt5_sync":true,"psychology_tracking":true,"scorecard":true,"reports":true,"trade_replay":true,"leaderboard":true,"setup_playbook":true}', 2),
  ('premium_lifetime', 'Premium Lifetime — one-time payment, forever access', 9999.00, 'INR', NULL, 0, '{"ai_coaching":true,"advanced_analytics":true,"unlimited_history":true,"priority_support":true,"mt5_sync":true,"psychology_tracking":true,"scorecard":true,"reports":true,"trade_replay":true,"leaderboard":true,"setup_playbook":true}', 3)
ON CONFLICT DO NOTHING;
