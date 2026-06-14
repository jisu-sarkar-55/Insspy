import type { Trade, DashboardStats, StrategyStats, DailyPnl, MonthlyPnl } from "@/types";

export function calculateDashboardStats(trades: Trade[]): DashboardStats {
  const closedTrades = trades.filter((t) => t.net_pnl !== null);

  if (closedTrades.length === 0) {
    return {
      totalTrades: 0,
      winRate: 0,
      netPnl: 0,
      profitFactor: 0,
      averageWin: 0,
      averageLoss: 0,
      bestDay: 0,
      worstDay: 0,
      totalWinningTrades: 0,
      totalLosingTrades: 0,
    };
  }

  const winningTrades = closedTrades.filter((t) => t.net_pnl! > 0);
  const losingTrades = closedTrades.filter((t) => t.net_pnl! < 0);

  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.net_pnl || 0), 0);
  const grossProfit = winningTrades.reduce((sum, t) => sum + (t.net_pnl || 0), 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.net_pnl || 0), 0));

  const averageWin =
    winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;
  const averageLoss =
    losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;

  const dailyPnl = calculateDailyPnl(closedTrades);
  const bestDay = dailyPnl.reduce((max, d) => Math.max(max, d.pnl), 0);
  const worstDay = dailyPnl.reduce((min, d) => Math.min(min, d.pnl), 0);

  return {
    totalTrades: closedTrades.length,
    winRate: (winningTrades.length / closedTrades.length) * 100,
    netPnl: totalPnl,
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0,
    averageWin,
    averageLoss,
    bestDay,
    worstDay,
    totalWinningTrades: winningTrades.length,
    totalLosingTrades: losingTrades.length,
  };
}

export function calculateStrategyStats(trades: Trade[]): StrategyStats[] {
  const strategyMap = new Map<string, Trade[]>();

  trades.forEach((trade) => {
    const strategy = trade.strategy || "Untagged";
    if (!strategyMap.has(strategy)) {
      strategyMap.set(strategy, []);
    }
    strategyMap.get(strategy)!.push(trade);
  });

  return Array.from(strategyMap.entries()).map(([strategy, strategyTrades]) => {
    const closedTrades = strategyTrades.filter((t) => t.net_pnl !== null);
    const winningTrades = closedTrades.filter((t) => t.net_pnl! > 0);
    const totalPnl = closedTrades.reduce((sum, t) => sum + (t.net_pnl || 0), 0);

    return {
      strategy,
      totalTrades: closedTrades.length,
      winRate:
        closedTrades.length > 0
          ? (winningTrades.length / closedTrades.length) * 100
          : 0,
      netPnl: totalPnl,
      averageRR: calculateAverageRR(closedTrades),
    };
  });
}

function calculateAverageRR(trades: Trade[]): number {
  const tradesWithRR = trades.filter(
    (t) => t.stop_loss && t.net_pnl !== null
  );

  if (tradesWithRR.length === 0) return 0;

  const totalRR = tradesWithRR.reduce((sum, trade) => {
    const risk = Math.abs(trade.entry_price - trade.stop_loss!);
    const reward = Math.abs(trade.net_pnl || 0);
    return sum + (risk > 0 ? reward / risk : 0);
  }, 0);

  return totalRR / tradesWithRR.length;
}

export function calculateDailyPnl(trades: Trade[]): DailyPnl[] {
  const dailyMap = new Map<string, { pnl: number; trades: number }>();

  trades.forEach((trade) => {
    const date = trade.entry_time.split("T")[0];
    const existing = dailyMap.get(date) || { pnl: 0, trades: 0 };
    dailyMap.set(date, {
      pnl: existing.pnl + (trade.net_pnl || 0),
      trades: existing.trades + 1,
    });
  });

  return Array.from(dailyMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function calculateMonthlyPnl(trades: Trade[]): MonthlyPnl[] {
  const monthlyMap = new Map<string, { pnl: number; trades: number }>();

  trades.forEach((trade) => {
    const month = trade.entry_time.substring(0, 7);
    const existing = monthlyMap.get(month) || { pnl: 0, trades: 0 };
    monthlyMap.set(month, {
      pnl: existing.pnl + (trade.net_pnl || 0),
      trades: existing.trades + 1,
    });
  });

  return Array.from(monthlyMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function calculateEquityCurve(
  trades: Trade[],
  startingBalance: number
): { date: string; equity: number }[] {
  const sortedTrades = [...trades]
    .filter((t) => t.net_pnl !== null)
    .sort((a, b) => a.entry_time.localeCompare(b.entry_time));

  let equity = startingBalance;
  return sortedTrades.map((trade) => {
    equity += trade.net_pnl || 0;
    return { date: trade.entry_time.split("T")[0], equity };
  });
}
