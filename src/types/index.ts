export interface Profile {
  id: string;
  display_name: string | null;
  timezone: string;
  created_at: string;
}

export interface TradingAccount {
  id: string;
  user_id: string;
  name: string;
  broker: string | null;
  account_type: "demo" | "live" | "prop";
  starting_balance: number;
  currency: string;
  created_at: string;
}

export interface Trade {
  id: string;
  user_id: string;
  account_id: string;
  symbol: string;
  direction: "buy" | "sell";
  entry_price: number;
  exit_price: number | null;
  stop_loss: number | null;
  take_profit: number | null;
  lot_size: number;
  entry_time: string;
  exit_time: string | null;
  pnl: number | null;
  commission: number;
  swap: number;
  net_pnl: number | null;
  strategy: string | null;
  tags: string[];
  notes: string | null;
  screenshot_url: string | null;
  confidence_before: number | null;
  fear_level: number | null;
  greed_level: number | null;
  followed_plan: boolean | null;
  mistakes: string[];
  source: "manual" | "mt5" | "csv";
  mt5_ticket: string | null;
  setup_playbook_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiAnalysis {
  id: string;
  user_id: string;
  trade_ids: string[];
  analysis_text: string;
  insights: Record<string, unknown>;
  created_at: string;
}

export interface DashboardStats {
  totalTrades: number;
  winRate: number;
  netPnl: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  bestDay: number;
  bestDayDate: string | null;
  bestDayTrades: number;
  worstDay: number;
  worstDayDate: string | null;
  worstDayTrades: number;
  biggestLoss: number;
  biggestLossDate: string | null;
  totalWinningTrades: number;
  totalLosingTrades: number;
}

export interface StrategyStats {
  strategy: string;
  totalTrades: number;
  winRate: number;
  netPnl: number;
  averageRR: number;
}

export interface DailyPnl {
  date: string;
  pnl: number;
  trades: number;
}

export interface MonthlyPnl {
  month: string;
  pnl: number;
  trades: number;
}

export interface TradeFormData {
  symbol: string;
  direction: "buy" | "sell";
  entry_price: number;
  exit_price?: number;
  stop_loss?: number;
  take_profit?: number;
  lot_size: number;
  entry_time: string;
  exit_time?: string;
  commission?: number;
  swap?: number;
  net_pnl?: number;
  strategy?: string;
  tags?: string[];
  notes?: string;
  confidence_before?: number;
  fear_level?: number;
  greed_level?: number;
  followed_plan?: boolean;
  mistakes?: string[];
  setup_playbook_id?: string;
}

export interface TraderIQ {
  total: number;
  risk: number;
  patience: number;
  execution: number;
  consistency: number;
  discipline: number;
}

export interface SessionStat {
  session: string;
  winRate: number;
  pnl: number;
  trades: number;
}

export interface BehaviourFlag {
  id: string;
  label: string;
  status: "ok" | "warn" | "bad";
  detail: string;
}

export interface StreakData {
  current: number;
  currentType: "win" | "loss" | "none";
  personalBest: number;
  worstLosing: number;
  trades: ("W" | "L" | "B")[];
  bestProfitRun: { amount: number; count: number };
  worstLossRun: { amount: number; count: number };
}

export interface HeatmapDay {
  date: string;
  pnl: number;
  dayOfMonth: number;
  dayOfWeek: number;
}

export interface EmotionStat {
  emoji: string;
  label: string;
  count: number;
  winRate: number;
}

export interface HourStat {
  hour: string;
  winRate: number;
  trades: number;
}

export interface AiCoachingInsight {
  severity: "critical" | "warning" | "positive" | "tip";
  title: string;
  body: string;
}

export interface AnalyticsKPIs {
  netProfit: number;
  profitFactor: number;
  winRate: number;
  avgRR: number;
  maxDrawdown: number;
  expectancy: number;
  totalTrades: number;
  avgWin: number;
  avgLoss: number;
}

export interface DrawdownPoint {
  date: string;
  equity: number;
  drawdown: number;
  drawdownPct: number;
}

export interface DrawdownStats {
  maxDrawdown: number;
  maxDrawdownPct: number;
  currentDrawdown: number;
  currentDrawdownPct: number;
  maxDrawdownDuration: number;
  currentDrawdownDuration: number;
  curve: DrawdownPoint[];
}

export interface PnlHistogramBucket {
  range: string;
  count: number;
  wins: number;
  losses: number;
}

export interface SymbolStats {
  symbol: string;
  trades: number;
  winRate: number;
  pnl: number;
  avgRR: number;
  profitFactor: number;
  bestTrade: number;
  worstTrade: number;
}

export interface DayOfWeekStats {
  day: string;
  dayIndex: number;
  trades: number;
  winRate: number;
  pnl: number;
}

export interface HourHeatmapCell {
  hour: number;
  dayOfWeek: number;
  avgPnl: number;
  trades: number;
}

export interface TradeDurationStats {
  scalps: { count: number; winRate: number; pnl: number; avgDuration: string };
  intraday: { count: number; winRate: number; pnl: number; avgDuration: string };
  swing: { count: number; winRate: number; pnl: number; avgDuration: string };
  avgWinDuration: string;
  avgLossDuration: string;
}

export interface RiskStats {
  avgRiskPct: number;
  largestRiskPct: number;
  riskConsistency: number;
  avgLotSize: number;
  largestLotSize: number;
  tradesUsingStopLoss: number;
  stopLossPct: number;
}

// ─── AI INSIGHTS TYPES ─────────────────────────────────────────

export interface ExecutiveSummary {
  monthLabel: string;
  monthlyPnl: number;
  isProfitable: boolean;
  strongestEdge: {
    instrument: string;
    session: string;
    setup: string;
  };
  biggestLeak: {
    description: string;
    estimatedImpact: number;
  };
  estimatedImprovement: number;
  improvementNote: string;
}

export interface TopInsightCard {
  label: string;
  value: string;
  winRate: number;
  profitFactor: number;
  detail: string;
  isPositive: boolean;
}

export interface SessionInsight {
  label: string;
  session: string;
  winRate: number;
  avgRR: number;
  detail: string;
  isPositive: boolean;
}

export interface DetectedPattern {
  title: string;
  normalWinRate: number;
  affectedWinRate: number;
  recommendation: string;
  severity: "critical" | "warning" | "info";
}

export interface OvertradingPattern {
  highTradeDays: { count: number; avgPnl: number; label: string };
  lowTradeDays: { count: number; avgPnl: number; label: string };
}

export interface RevengePattern {
  percentage: number;
  threshold: number;
}

export interface OpportunityFound {
  strategy: string;
  winRate: number;
  usagePercent: number;
  totalTrades: number;
  recommendation: string;
}

export interface StrengthItem {
  label: string;
  passed: boolean;
}

export interface MoneyLeak {
  category: string;
  amount: number;
}

export interface EdgeCondition {
  instrument: string;
  session: string;
  day: string;
  setup: string;
  winRate: number;
  profitFactor: number;
  riskPercent: number;
}

export interface WeeklyReview {
  startDate: string;
  endDate: string;
  trades: number;
  profit: number;
  winRate: number;
  topStrength: string;
  biggestMistake: string;
  recommendation: string;
  noRecentData?: boolean;
}

export interface ProjectedPerformance {
  expectedMonthlyProfit: number;
  expectedDrawdown: number;
  confidence: number;
}

export interface TraderScorecard {
  riskManagement: number;
  patience: number;
  execution: number;
  consistency: number;
  overall: number;
}

export interface LosingTradeAnalysis {
  trade: Trade;
  localAnalysis: {
    session: string;
    minutesBeforeExit: number;
    wasAfterConsecutiveLoss: boolean;
    consecutiveLossCount: number;
    similarEntryWinRate: number;
    possibleReasons: string[];
    suggestedImprovement: string;
  };
  aiAnalysis: string | null;
}

export interface InsufficientDataSection {
  sectionKey: string;
  message: string;
  required: number;
  current: number;
}

// ─── PERFORMANCE SECTION TYPES ─────────────────────────────────

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  type: "monthly_profit" | "drawdown_limit" | "consistency" | "custom";
  target_value: number;
  current_value: number;
  unit: string;
  period: "monthly" | "weekly" | "custom";
  start_date: string;
  end_date: string | null;
  status: "active" | "completed" | "failed";
  created_at: string;
}

export interface GoalFormData {
  title: string;
  type: Goal["type"];
  target_value: number;
  unit: string;
  period: Goal["period"];
  start_date?: string;
  end_date?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetValue: number;
  unit: string;
  duration: string;
  rule: string;
  difficulty: "easy" | "medium" | "hard";
  category: "discipline" | "risk" | "performance" | "psychology" | "diversification";
}

export interface ChallengeProgress {
  challengeId: string;
  progress: number;
  current: number;
  target: number;
  passed: boolean;
  active: boolean;
  startedAt: string | null;
  completedAt: string | null;
  details: string[];
}

// ─── SETUP PLAYBOOK TYPES ──────────────────────────────────────

export interface SetupPlaybook {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  entry_rules: string[];
  exit_rules: string[];
  timeframe: string | null;
  market_conditions: string[];
  screenshot_urls: string[];
  examples: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SetupPlaybookFormData {
  name: string;
  description?: string;
  entry_rules: string[];
  exit_rules: string[];
  timeframe?: string;
  market_conditions: string[];
  screenshot_urls: string[];
  examples?: string;
}
