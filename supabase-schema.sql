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

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trading_accounts' AND policyname = 'Users can manage their own accounts') THEN CREATE POLICY "Users can manage their own accounts" ON trading_accounts FOR ALL USING (auth.uid() = user_id); END IF; END; $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trades' AND policyname = 'Users can manage their own trades') THEN CREATE POLICY "Users can manage their own trades" ON trades FOR ALL USING (auth.uid() = user_id); END IF; END; $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_analyses' AND policyname = 'Users can manage their own analyses') THEN CREATE POLICY "Users can manage their own analyses" ON ai_analyses FOR ALL USING (auth.uid() = user_id); END IF; END; $$;

CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
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

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'goals' AND policyname = 'Users can manage their own goals') THEN CREATE POLICY "Users can manage their own goals" ON goals FOR ALL USING (auth.uid() = user_id); END IF; END; $$;

CREATE TABLE IF NOT EXISTS setup_playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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

ALTER TABLE setup_playbooks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'setup_playbooks' AND policyname = 'Users can manage their own playbooks') THEN CREATE POLICY "Users can manage their own playbooks" ON setup_playbooks FOR ALL USING (auth.uid() = user_id); END IF; END; $$;

ALTER TABLE trades ADD COLUMN IF NOT EXISTS setup_playbook_id UUID REFERENCES setup_playbooks(id) ON DELETE SET NULL;

-- ────────────────────────────────────────────────────────────────
-- SUBSCRIPTIONS & PAYMENTS
-- ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coupon_id, user_id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES pricing_plans(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'expired', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  coupon_id UUID REFERENCES coupons(id),
  razorpay_subscription_id TEXT,
  razorpay_order_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded')),
  processor TEXT DEFAULT 'razorpay',
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  razorpay_signature TEXT,
  coupon_id UUID REFERENCES coupons(id),
  discount_amount DECIMAL(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can manage their own profile') THEN CREATE POLICY "Users can manage their own profile" ON profiles FOR ALL USING (auth.uid() = id); END IF; END; $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pricing_plans' AND policyname = 'Anyone can view active pricing plans') THEN CREATE POLICY "Anyone can view active pricing plans" ON pricing_plans FOR SELECT USING (is_active = true); END IF; END; $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coupons' AND policyname = 'Anyone can view active coupons') THEN CREATE POLICY "Anyone can view active coupons" ON coupons FOR SELECT USING (is_active = true); END IF; END; $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coupon_usages' AND policyname = 'Users can view their own coupon usages') THEN CREATE POLICY "Users can view their own coupon usages" ON coupon_usages FOR SELECT USING (auth.uid() = user_id); END IF; END; $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coupon_usages' AND policyname = 'Users can insert their own coupon usages') THEN CREATE POLICY "Users can insert their own coupon usages" ON coupon_usages FOR INSERT WITH CHECK (auth.uid() = user_id); END IF; END; $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can view their own subscriptions') THEN CREATE POLICY "Users can view their own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id); END IF; END; $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Users can view their own payments') THEN CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (auth.uid() = user_id); END IF; END; $$;

-- Seed default pricing plans
INSERT INTO pricing_plans (name, description, price, currency, interval, trial_days, features, sort_order) VALUES
  ('premium_monthly', 'Premium Monthly — full access, cancel anytime', 499.00, 'INR', 'month', 7, '{"ai_coaching":true,"advanced_analytics":true,"unlimited_history":true,"priority_support":true,"mt5_sync":true,"psychology_tracking":true,"scorecard":true,"reports":true,"trade_replay":true,"leaderboard":true,"setup_playbook":true}', 1),
  ('premium_yearly', 'Premium Yearly — 2 months free with annual plan', 4999.00, 'INR', 'year', 7, '{"ai_coaching":true,"advanced_analytics":true,"unlimited_history":true,"priority_support":true,"mt5_sync":true,"psychology_tracking":true,"scorecard":true,"reports":true,"trade_replay":true,"leaderboard":true,"setup_playbook":true}', 2),
  ('premium_lifetime', 'Premium Lifetime — one-time payment, forever access', 9999.00, 'INR', NULL, 0, '{"ai_coaching":true,"advanced_analytics":true,"unlimited_history":true,"priority_support":true,"mt5_sync":true,"psychology_tracking":true,"scorecard":true,"reports":true,"trade_replay":true,"leaderboard":true,"setup_playbook":true}', 3)
ON CONFLICT DO NOTHING;
