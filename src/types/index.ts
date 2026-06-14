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
  worstDay: number;
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
}
