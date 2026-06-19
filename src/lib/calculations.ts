import type {
  Trade,
  DashboardStats,
  StrategyStats,
  DailyPnl,
  MonthlyPnl,
  TraderIQ,
  SessionStat,
  BehaviourFlag,
  StreakData,
  HeatmapDay,
  EmotionStat,
  HourStat,
  AiCoachingInsight,
  AnalyticsKPIs,
  DrawdownStats,
  PnlHistogramBucket,
  SymbolStats,
  DayOfWeekStats,
  HourHeatmapCell,
  TradeDurationStats,
  RiskStats,
  ExecutiveSummary,
  TopInsightCard,
  SessionInsight,
  DetectedPattern,
  OvertradingPattern,
  RevengePattern,
  OpportunityFound,
  StrengthItem,
  MoneyLeak,
  EdgeCondition,
  WeeklyReview,
  ProjectedPerformance,
  TraderScorecard,
  InsufficientDataSection,
} from "@/types";

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
      bestDayDate: null,
      bestDayTrades: 0,
      worstDay: 0,
      worstDayDate: null,
      worstDayTrades: 0,
      biggestLoss: 0,
      biggestLossDate: null,
      totalWinningTrades: 0,
      totalLosingTrades: 0,
    };
  }

  const winningTrades = closedTrades.filter((t) => (t.net_pnl ?? 0) > 0);
  const losingTrades = closedTrades.filter((t) => (t.net_pnl ?? 0) < 0);

  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.net_pnl || 0), 0);
  const grossProfit = winningTrades.reduce((sum, t) => sum + (t.net_pnl || 0), 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.net_pnl || 0), 0));

  const averageWin =
    winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;
  const averageLoss =
    losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;

  const dailyPnl = calculateDailyPnl(closedTrades);
  const bestDay = dailyPnl.length > 0 ? Math.max(...dailyPnl.map((d) => d.pnl)) : 0;
  const worstDay = dailyPnl.length > 0 ? Math.min(...dailyPnl.map((d) => d.pnl)) : 0;
  const bestDayEntry = dailyPnl.find((d) => d.pnl === bestDay) || null;
  const worstDayEntry = dailyPnl.find((d) => d.pnl === worstDay) || null;

  let biggestLoss = 0;
  let biggestLossDate: string | null = null;
  if (losingTrades.length > 0) {
    const worstTrade = losingTrades.reduce((worst, t) =>
      (t.net_pnl ?? 0) < (worst.net_pnl ?? 0) ? t : worst,
      losingTrades[0]);
    biggestLoss = worstTrade?.net_pnl ?? 0;
    biggestLossDate = worstTrade?.entry_time?.split("T")[0] ?? null;
  }

  return {
    totalTrades: closedTrades.length,
    winRate: (winningTrades.length / closedTrades.length) * 100,
    netPnl: totalPnl,
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99.9 : 0,
    averageWin,
    averageLoss,
    bestDay,
    bestDayDate: bestDayEntry?.date || null,
    bestDayTrades: bestDayEntry?.trades || 0,
    worstDay,
    worstDayDate: worstDayEntry?.date || null,
    worstDayTrades: worstDayEntry?.trades || 0,
    biggestLoss,
    biggestLossDate,
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
    const winningTrades = closedTrades.filter((t) => (t.net_pnl ?? 0) > 0);
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
  const withExit = trades.filter(
    (t) => t.stop_loss !== null && t.exit_price !== null
  );
  const withoutExit = trades.filter(
    (t) => t.stop_loss !== null && t.exit_price === null && t.net_pnl !== null
  );

  if (withExit.length === 0 && withoutExit.length === 0) return 0;

  let totalRR = 0;
  let count = 0;

  for (const trade of withExit) {
    const riskDistance = Math.abs(trade.entry_price - trade.stop_loss!);
    if (riskDistance === 0) continue;
    const priceMove =
      trade.direction === "buy"
        ? trade.exit_price! - trade.entry_price
        : trade.entry_price - trade.exit_price!;
    totalRR += priceMove / riskDistance;
    count++;
  }

  if (withoutExit.length > 0 && withExit.length > 0) {
    let totalDerived = 0;
    for (const trade of withExit) {
      const priceMove =
        trade.direction === "buy"
          ? trade.exit_price! - trade.entry_price
          : trade.entry_price - trade.exit_price!;
      const pm = Math.abs(priceMove);
      if (pm > 0 && trade.lot_size > 0 && trade.net_pnl !== null) {
        totalDerived += Math.abs(trade.net_pnl) / (pm * trade.lot_size);
      }
    }
    if (totalDerived > 0) {
      const multiplier = totalDerived / withExit.length;
      for (const trade of withoutExit) {
        const riskDistance = Math.abs(trade.entry_price - trade.stop_loss!);
        if (riskDistance === 0 || trade.lot_size <= 0) continue;
        const riskInDollars = riskDistance * trade.lot_size * multiplier;
        if (riskInDollars > 0) {
          totalRR += (trade.net_pnl || 0) / riskInDollars;
          count++;
        }
      }
    }
  }

  return count > 0 ? totalRR / count : 0;
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
    .sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
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
    .sort((a, b) => (a.month > b.month ? 1 : a.month < b.month ? -1 : 0));
}

export function calculateEquityCurve(
  trades: Trade[],
  startingBalance: number
): { date: string; equity: number }[] {
  const dailyMap = new Map<string, number>();
  trades
    .filter((t) => t.net_pnl !== null)
    .forEach((t) => {
      const date = t.entry_time.split("T")[0];
      dailyMap.set(date, (dailyMap.get(date) || 0) + (t.net_pnl || 0));
    });

  const sorted = Array.from(dailyMap.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  return sorted.reduce<{ date: string; equity: number }[]>(
    (acc, [date, pnl]) => {
      const prevEquity = acc.length > 0 ? acc[acc.length - 1].equity : startingBalance;
      acc.push({ date, equity: prevEquity + pnl });
      return acc;
    },
    []
  );
}

function getHour(dateStr: string): number {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return -1;
  return d.getHours();
}

function getSessionLabel(hour: number): string {
  if (hour < 0) return "Unknown";
  if (hour >= 8 && hour < 13) return "London";
  if (hour >= 13 && hour < 21) return "New York";
  if (hour >= 0 && hour < 8) return "Asia";
  return "Off-hours";
}

export function calculateSessionStats(trades: Trade[]): SessionStat[] {
  const closed = trades.filter((t) => t.net_pnl !== null);
  const sessionMap = new Map<string, { wins: number; total: number; pnl: number }>();

  closed.forEach((t) => {
    const hour = getHour(t.entry_time);
    const session = getSessionLabel(hour);
    if (session === "Off-hours" || session === "Unknown") return;
    const existing = sessionMap.get(session) || { wins: 0, total: 0, pnl: 0 };
    existing.total++;
    if ((t.net_pnl ?? 0) > 0) existing.wins++;
    existing.pnl += t.net_pnl || 0;
    sessionMap.set(session, existing);
  });

  const order = ["London", "New York", "Asia"];
  return order
    .filter((s) => sessionMap.has(s))
    .map((session) => {
      const d = sessionMap.get(session)!;
      return {
        session,
        winRate: d.total > 0 ? (d.wins / d.total) * 100 : 0,
        pnl: d.pnl,
        trades: d.total,
      };
    });
}

export function calculateBehaviourFlags(trades: Trade[]): BehaviourFlag[] {
  const closed = trades
    .filter((t) => t.net_pnl !== null)
    .sort((a, b) => a.entry_time.localeCompare(b.entry_time));

  const flags: BehaviourFlag[] = [];

  if (closed.length === 0) {
    return flags;
  }

  let revengeDetected = false;
  let lastLossTime: number | null = null;

  closed.forEach((t) => {
    const time = new Date(t.entry_time).getTime();
    if (isNaN(time)) return;
    if ((t.net_pnl ?? 0) < 0) {
      if (lastLossTime !== null && time - lastLossTime < 30 * 60 * 1000) {
        revengeDetected = true;
      }
      lastLossTime = time;
    }
  });

  const avgTradesPerDay =
    closed.length /
    Math.max(
      1,
      (new Date(closed[closed.length - 1].entry_time).getTime() -
        new Date(closed[0].entry_time).getTime()) /
        (1000 * 60 * 60 * 24)
    );

  const winners = closed.filter((t) => (t.net_pnl ?? 0) > 0);
  const losers = closed.filter((t) => (t.net_pnl ?? 0) < 0);

  const avgRR = calculateAverageRR(closed);
  const plannedRR = 2.0;
  const exitingEarly = avgRR > 0 && avgRR < plannedRR * 0.8;

  const avgWinSize =
    winners.length > 0
      ? winners.reduce((s, t) => s + (t.net_pnl || 0), 0) / winners.length
      : 0;
  const avgLossSize =
    losers.length > 0
      ? losers.reduce((s, t) => s + Math.abs(t.net_pnl || 0), 0) / losers.length
      : 0;

  flags.push({
    id: "revenge",
    label: "Revenge trading",
    status: revengeDetected ? "bad" : "ok",
    detail: revengeDetected
      ? "Detected — rapid trades after loss"
      : "No revenge trading detected",
  });

  flags.push({
    id: "overtrading",
    label: "Overtrading",
    status: avgTradesPerDay > 6 ? "warn" : "ok",
    detail:
      avgTradesPerDay > 6
        ? `${avgTradesPerDay.toFixed(0)} trades/day avg`
        : `${avgTradesPerDay.toFixed(0)} trades/day — within limits`,
  });

  flags.push({
    id: "risk",
    label: "Risk per trade",
    status: "ok",
    detail: "Consistent position sizing",
  });

  const planAdherence =
    closed.filter((t) => t.followed_plan).length / closed.length;
  flags.push({
    id: "plan",
    label: "Trading within plan",
    status: planAdherence > 0.8 ? "ok" : "warn",
    detail:
      planAdherence > 0.8
        ? `${(planAdherence * 100).toFixed(0)}% plan adherence`
        : `Only ${(planAdherence * 100).toFixed(0)}% plan adherence`,
  });

  flags.push({
    id: "cutting",
    label: "Cutting losers fast",
    status: avgLossSize < avgWinSize * 1.5 ? "ok" : "warn",
    detail: `Avg loss: $${avgLossSize.toFixed(0)}`,
  });

  flags.push({
    id: "holding",
    label: "Holding winners",
    status: exitingEarly ? "warn" : "ok",
    detail: exitingEarly
      ? `Exit at ${avgRR.toFixed(1)}R avg (planned ${plannedRR}R)`
      : `Avg ${avgRR.toFixed(1)}R achieved`,
  });

  return flags;
}

export function calculateStreaks(trades: Trade[]): StreakData {
  const closed = trades
    .filter((t) => t.net_pnl !== null)
    .sort((a, b) => a.entry_time.localeCompare(b.entry_time));

  if (closed.length === 0) {
    return {
      current: 0,
      currentType: "none",
      personalBest: 0,
      worstLosing: 0,
      trades: [],
      bestProfitRun: { amount: 0, count: 0 },
      worstLossRun: { amount: 0, count: 0 },
    };
  }

  const outcomes: ("W" | "L" | "B")[] = closed.map((t) =>
    (t.net_pnl ?? 0) > 0 ? "W" : (t.net_pnl ?? 0) < 0 ? "L" : "B"
  );

  let current = 0;
  let currentType: "win" | "loss" | "none" = "none";
  for (let i = outcomes.length - 1; i >= 0; i--) {
    if (outcomes[i] === "W") {
      if (currentType === "loss") break;
      current++;
      currentType = "win";
    } else if (outcomes[i] === "L") {
      if (currentType === "win") break;
      current++;
      currentType = "loss";
    } else {
      break;
    }
  }

  let personalBest = 0;
  let worstLosing = 0;
  let streak = 0;
  let streakType: "W" | "L" | "B" | null = null;

  outcomes.forEach((o) => {
    if (o === streakType) {
      streak++;
    } else {
      if (streakType === "W") personalBest = Math.max(personalBest, streak);
      if (streakType === "L") worstLosing = Math.max(worstLosing, streak);
      streak = 1;
      streakType = o;
    }
  });
  if (streakType === "W") personalBest = Math.max(personalBest, streak);
  if (streakType === "L") worstLosing = Math.max(worstLosing, streak);

  let bestProfitRun = { amount: 0, count: 0 };
  let worstLossRun = { amount: 0, count: 0 };
  let runAmount = 0;
  let runCount = 0;

  closed.forEach((t) => {
    const pnl = t.net_pnl || 0;
    if (pnl > 0) {
      if (runAmount >= 0) {
        runAmount += pnl;
        runCount++;
      } else {
        if (runAmount < worstLossRun.amount) {
          worstLossRun = { amount: runAmount, count: runCount };
        }
        runAmount = pnl;
        runCount = 1;
      }
    } else if (pnl < 0) {
      if (runAmount <= 0) {
        runAmount += pnl;
        runCount++;
      } else {
        if (runAmount > bestProfitRun.amount) {
          bestProfitRun = { amount: runAmount, count: runCount };
        }
        runAmount = pnl;
        runCount = 1;
      }
    } else {
      if (runAmount > bestProfitRun.amount) {
        bestProfitRun = { amount: runAmount, count: runCount };
      }
      if (runAmount < worstLossRun.amount) {
        worstLossRun = { amount: runAmount, count: runCount };
      }
      runAmount = 0;
      runCount = 0;
    }
  });
  if (runAmount > bestProfitRun.amount) {
    bestProfitRun = { amount: runAmount, count: runCount };
  }
  if (runAmount < worstLossRun.amount) {
    worstLossRun = { amount: runAmount, count: runCount };
  }

  return {
    current,
    currentType,
    personalBest,
    worstLosing,
    trades: outcomes.slice(-20),
    bestProfitRun,
    worstLossRun,
  };
}

export function calculateHeatmapData(
  trades: Trade[],
  year: number,
  month: number
): HeatmapDay[] {
  const closed = trades.filter((t) => t.net_pnl !== null);
  const dailyPnl = new Map<number, number>();

  closed.forEach((t) => {
    const d = new Date(t.entry_time);
    if (d.getUTCFullYear() === year && d.getUTCMonth() === month) {
      const day = d.getUTCDate();
      dailyPnl.set(day, (dailyPnl.get(day) || 0) + (t.net_pnl || 0));
    }
  });

  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const adjustedFirst = firstDay === 0 ? 6 : firstDay - 1;

  const days: HeatmapDay[] = [];
  for (let i = 0; i < adjustedFirst; i++) {
    days.push({
      date: "",
      pnl: 0,
      dayOfMonth: 0,
      dayOfWeek: i,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      date: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      pnl: dailyPnl.get(d) || 0,
      dayOfMonth: d,
      dayOfWeek: (adjustedFirst + d - 1) % 7,
    });
  }

  return days;
}

export function calculateEmotionStats(trades: Trade[]): EmotionStat[] {
  const closed = trades.filter((t) => t.net_pnl !== null);

  const emotions = [
    { key: "fomo" as const, emoji: "\u{1F624}", label: "FOMO" },
    { key: "fear" as const, emoji: "\u{1F630}", label: "Fear" },
    { key: "calm" as const, emoji: "\u{1F60C}", label: "Calm" },
    { key: "greedy" as const, emoji: "\u{1F911}", label: "Greedy" },
    { key: "confident" as const, emoji: "\u{1F4AA}", label: "Confident" },
  ];

  return emotions.map(({ key, emoji, label }) => {
    let count = 0;
    let wins = 0;

    closed.forEach((t) => {
      let match = false;
      if (key === "fomo") {
        match = (t.greed_level || 0) >= 7 && (t.confidence_before || 0) >= 7;
      } else if (key === "fear") {
        match = (t.fear_level || 0) >= 6;
      } else if (key === "calm") {
        match =
          (t.fear_level || 0) < 5 &&
          (t.greed_level || 0) < 5 &&
          (t.confidence_before || 0) >= 5;
      } else if (key === "greedy") {
        match = (t.greed_level || 0) >= 7;
      } else if (key === "confident") {
        match =
          (t.confidence_before || 0) >= 7 &&
          (t.fear_level || 0) < 5;
      }
      if (match) {
        count++;
        if ((t.net_pnl ?? 0) > 0) wins++;
      }
    });

    return {
      emoji,
      label,
      count,
      winRate: count > 0 ? (wins / count) * 100 : 0,
    };
  });
}

export function calculateBestHours(trades: Trade[]): HourStat[] {
  const closed = trades.filter((t) => t.net_pnl !== null);
  const hourMap = new Map<number, { wins: number; total: number }>();

  closed.forEach((t) => {
    const hour = getHour(t.entry_time);
    if (hour < 0) return;
    const existing = hourMap.get(hour) || { wins: 0, total: 0 };
    existing.total++;
    if ((t.net_pnl ?? 0) > 0) existing.wins++;
    hourMap.set(hour, existing);
  });

  return Array.from(hourMap.entries())
    .map(([hour, d]) => ({
      hour: `${String(hour).padStart(2, "0")}:00-${String((hour + 2) % 24).padStart(2, "0")}:00`,
      winRate: d.total > 0 ? (d.wins / d.total) * 100 : 0,
      trades: d.total,
    }))
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 5);
}

export function calculateTraderIQ(trades: Trade[]): TraderIQ {
  const closed = trades.filter((t) => t.net_pnl !== null);
  if (closed.length === 0) {
    return { total: 0, risk: 0, patience: 0, execution: 0, consistency: 0, discipline: 0 };
  }

  const stopLossUsage =
    closed.filter((t) => t.stop_loss !== null).length / closed.length;
  const risk = Math.round(stopLossUsage * 40 + 30 + (closed.length > 10 ? 20 : closed.length * 2));

  const avgTradesPerDay =
    closed.length /
    Math.max(
      1,
      (new Date(closed[closed.length - 1].entry_time).getTime() -
        new Date(closed[0].entry_time).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  const patience = Math.round(
    Math.min(100, Math.max(0, 100 - (avgTradesPerDay - 3) * 10 + 20))
  );

  const avgRR = calculateAverageRR(closed);
  const execution = Math.round(Math.min(100, avgRR * 35 + 20));

  const wins = closed.filter((t) => (t.net_pnl ?? 0) > 0).length;
  const winRate = (wins / closed.length) * 100;
  const consistency = Math.round(Math.min(100, winRate * 0.8 + Math.min(closed.length, 100) * 0.3));

  const planAdherence =
    closed.filter((t) => t.followed_plan).length / closed.length;
  const discipline = Math.round(planAdherence * 60 + 20 + (winRate > 50 ? 15 : 0));

  const total = Math.round((risk + patience + execution + consistency + discipline) / 5);

  return {
    total: Math.min(100, total),
    risk: Math.min(100, risk),
    patience: Math.min(100, patience),
    execution: Math.min(100, execution),
    consistency: Math.min(100, consistency),
    discipline: Math.min(100, discipline),
  };
}

export function calculateAiCoaching(trades: Trade[]): AiCoachingInsight[] {
  const closed = trades
    .filter((t) => t.net_pnl !== null)
    .sort((a, b) => a.entry_time.localeCompare(b.entry_time));
  const insights: AiCoachingInsight[] = [];

  if (closed.length === 0) return insights;

  const flags = calculateBehaviourFlags(closed);
  const revengeFlag = flags.find((f) => f.id === "revenge");
  if (revengeFlag && revengeFlag.status === "bad") {
    insights.push({
      severity: "critical",
      title: "Revenge trading detected",
      body: "You took rapid trades after a recent loss. This pattern erodes your account. Set a 30-minute cooldown after any loss before your next entry.",
    });
  }

  const avgRR = calculateAverageRR(closed);
  if (avgRR > 0 && avgRR < 1.5) {
    insights.push({
      severity: "warning",
      title: `Exiting winners early — avg ${avgRR.toFixed(1)}R achieved`,
      body: `Your average R:R is ${avgRR.toFixed(1)}R. Consider using trailing stops instead of manual exits to capture more profit.`,
    });
  }

  const winRate = (closed.filter((t) => (t.net_pnl ?? 0) > 0).length / closed.length) * 100;
  if (winRate > 60) {
    insights.push({
      severity: "positive",
      title: `Strong win rate at ${winRate.toFixed(0)}%`,
      body: "Your win rate is above average. Keep maintaining your edge and avoid deviating from what works.",
    });
  }

  const sessionStats = calculateSessionStats(closed);
  const bestSession = sessionStats.length > 0
    ? sessionStats.reduce((best, s) => (s.pnl > best.pnl ? s : best), sessionStats[0])
    : null;
  const worstSession = sessionStats.length > 0
    ? sessionStats.reduce((worst, s) => (s.pnl < worst.pnl ? s : worst), sessionStats[0])
    : null;

  if (bestSession && worstSession && bestSession.session !== worstSession.session) {
    insights.push({
      severity: "tip",
      title: `Focus on ${bestSession.session} session`,
      body: `${bestSession.session}: ${bestSession.winRate.toFixed(0)}% WR, $${bestSession.pnl.toFixed(0)} P&L. ${worstSession.session}: ${worstSession.winRate.toFixed(0)}% WR, $${worstSession.pnl.toFixed(0)} P&L. Consider skipping ${worstSession.session}.`,
    });
  }

  return insights;
}

// ─── ANALYTICS FUNCTIONS ───────────────────────────────────────

export function calculateAnalyticsKPIs(trades: Trade[], startingBalance = 10000): AnalyticsKPIs {
  const closed = trades.filter((t) => t.net_pnl !== null);
  if (closed.length === 0) {
    return { netProfit: 0, profitFactor: 0, winRate: 0, avgRR: 0, maxDrawdown: 0, expectancy: 0, totalTrades: 0, avgWin: 0, avgLoss: 0 };
  }

  const winners = closed.filter((t) => (t.net_pnl ?? 0) > 0);
  const losers = closed.filter((t) => (t.net_pnl ?? 0) < 0);
  const netProfit = closed.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const grossProfit = winners.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const grossLoss = Math.abs(losers.reduce((s, t) => s + (t.net_pnl || 0), 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99.9 : 0;
  const winRate = (winners.length / closed.length) * 100;
  const avgRR = calculateAverageRR(closed);
  const dd = calculateDrawdownAnalysis(closed, startingBalance);
  const expectancy = closed.reduce((s, t) => s + (t.net_pnl || 0), 0) / closed.length;
  const avgWin = winners.length > 0 ? grossProfit / winners.length : 0;
  const avgLoss = losers.length > 0 ? grossLoss / losers.length : 0;

  return { netProfit, profitFactor, winRate, avgRR, maxDrawdown: dd.maxDrawdownPct, expectancy, totalTrades: closed.length, avgWin, avgLoss };
}

export function calculateDrawdownAnalysis(trades: Trade[], startBalance: number): DrawdownStats {
  const sorted = [...trades]
    .filter((t) => t.net_pnl !== null)
    .sort((a, b) => a.entry_time.localeCompare(b.entry_time));

  if (sorted.length === 0) {
    return { maxDrawdown: 0, maxDrawdownPct: 0, currentDrawdown: 0, currentDrawdownPct: 0, maxDrawdownDuration: 0, currentDrawdownDuration: 0, curve: [] };
  }

  let equity = startBalance;
  let peak = startBalance;
  let maxDD = 0;
  let maxDDPct = 0;
  let maxDDDuration = 0;
  let currentDD = 0;
  let currentDDPct = 0;
  let inDrawdown = false;
  let drawdownStartDate: string | null = null;
  let currentDDDays = 0;

  function daysBetween(a: string, b: string): number {
    return Math.max(1, Math.round(
      (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)
    ));
  }

  const curve: Array<{ date: string; equity: number; drawdown: number; drawdownPct: number }> = sorted.map((t) => {
    const date = t.entry_time.split("T")[0];
    equity += t.net_pnl || 0;

    if (equity >= peak) {
      if (inDrawdown && drawdownStartDate) {
        const d = daysBetween(drawdownStartDate, date);
        if (d > maxDDDuration) maxDDDuration = d;
      }
      peak = equity;
      inDrawdown = false;
      drawdownStartDate = null;
      currentDDDays = 0;
    }

    const dd = peak - equity;
    const ddPct = peak > 0 ? (dd / peak) * 100 : 0;

    if (dd > 0) {
      if (!inDrawdown) drawdownStartDate = date;
      inDrawdown = true;
      if (drawdownStartDate) currentDDDays = daysBetween(drawdownStartDate, date);
      currentDD = dd;
      currentDDPct = ddPct;
    }

    if (dd > maxDD) {
      maxDD = dd;
      maxDDPct = ddPct;
    }

    return { date, equity, drawdown: dd, drawdownPct: ddPct };
  });

  if (inDrawdown && drawdownStartDate) {
    const lastDate = sorted[sorted.length - 1].entry_time.split("T")[0];
    const d = daysBetween(drawdownStartDate, lastDate);
    if (d > maxDDDuration) maxDDDuration = d;
  }

  return {
    maxDrawdown: maxDD,
    maxDrawdownPct: maxDDPct,
    currentDrawdown: inDrawdown ? currentDD : 0,
    currentDrawdownPct: inDrawdown ? currentDDPct : 0,
    maxDrawdownDuration: maxDDDuration,
    currentDrawdownDuration: inDrawdown ? currentDDDays : 0,
    curve,
  };
}

export function calculatePnlHistogram(trades: Trade[]): PnlHistogramBucket[] {
  const closed = trades.filter((t) => t.net_pnl !== null);
  const ranges = [
    { min: -Infinity, max: -200, label: "≤ -$200" },
    { min: -200, max: -100, label: "-$200 to -$100" },
    { min: -100, max: -50, label: "-$100 to -$50" },
    { min: -50, max: -20, label: "-$50 to -$20" },
    { min: -20, max: 0, label: "-$20 to $0" },
    { min: 0, max: 20, label: "$0 to $20" },
    { min: 20, max: 50, label: "$20 to $50" },
    { min: 50, max: 100, label: "$50 to $100" },
    { min: 100, max: 200, label: "$100 to $200" },
    { min: 200, max: Infinity, label: "≥ $200" },
  ];

  return ranges.map(({ min, max, label }) => {
    const bucket = closed.filter((t) => {
      const pnl = t.net_pnl || 0;
      if (min === -Infinity) return pnl <= max;
      if (max === Infinity) return pnl >= min;
      return pnl > min && pnl <= max;
    });
    return {
      range: label,
      count: bucket.length,
      wins: bucket.filter((t) => (t.net_pnl ?? 0) > 0).length,
      losses: bucket.filter((t) => (t.net_pnl ?? 0) < 0).length,
    };
  });
}

export function calculateSymbolStats(trades: Trade[]): SymbolStats[] {
  const symbolMap = new Map<string, Trade[]>();
  trades.filter((t) => t.net_pnl !== null).forEach((t) => {
    const arr = symbolMap.get(t.symbol) || [];
    arr.push(t);
    symbolMap.set(t.symbol, arr);
  });

  return Array.from(symbolMap.entries())
    .map(([symbol, arr]) => {
      const winners = arr.filter((t) => (t.net_pnl ?? 0) > 0);
      const losers = arr.filter((t) => (t.net_pnl ?? 0) < 0);
      const pnl = arr.reduce((s, t) => s + (t.net_pnl || 0), 0);
      const gp = winners.reduce((s, t) => s + (t.net_pnl || 0), 0);
      const gl = Math.abs(losers.reduce((s, t) => s + (t.net_pnl || 0), 0));
      return {
        symbol,
        trades: arr.length,
        winRate: (winners.length / arr.length) * 100,
        pnl,
        avgRR: calculateAverageRR(arr),
        profitFactor: gl > 0 ? gp / gl : gp > 0 ? 99.9 : 0,
        bestTrade: arr.reduce((max, t) => Math.max(max, t.net_pnl || 0), -Infinity),
        worstTrade: arr.reduce((min, t) => Math.min(min, t.net_pnl || 0), Infinity),
      };
    })
    .sort((a, b) => b.pnl - a.pnl);
}

export function calculateDayOfWeekStats(trades: Trade[]): DayOfWeekStats[] {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dayMap = new Map<number, { wins: number; total: number; pnl: number }>();

  trades.filter((t) => t.net_pnl !== null).forEach((t) => {
    const d = new Date(t.entry_time).getUTCDay();
    const idx = d === 0 ? 6 : d - 1;
    const existing = dayMap.get(idx) || { wins: 0, total: 0, pnl: 0 };
    existing.total++;
    if ((t.net_pnl ?? 0) > 0) existing.wins++;
    existing.pnl += t.net_pnl || 0;
    dayMap.set(idx, existing);
  });

  return days.map((day, i) => {
    const d = dayMap.get(i) || { wins: 0, total: 0, pnl: 0 };
    return {
      day,
      dayIndex: i,
      trades: d.total,
      winRate: d.total > 0 ? (d.wins / d.total) * 100 : 0,
      pnl: d.pnl,
    };
  });
}

export function calculateHourHeatmap(trades: Trade[]): HourHeatmapCell[] {
  const cells: HourHeatmapCell[] = [];
  const map = new Map<string, { total: number; sumPnl: number }>();

  trades.filter((t) => t.net_pnl !== null).forEach((t) => {
    const hour = new Date(t.entry_time).getUTCHours();
    const dow = new Date(t.entry_time).getUTCDay();
    const idx = dow === 0 ? 6 : dow - 1;
    if (idx > 4) return;
    const key = `${hour}-${idx}`;
    const existing = map.get(key) || { total: 0, sumPnl: 0 };
    existing.total++;
    existing.sumPnl += t.net_pnl || 0;
    map.set(key, existing);
  });

  for (let h = 0; h < 24; h++) {
    for (let d = 0; d < 5; d++) {
      const key = `${h}-${d}`;
      const data = map.get(key);
      cells.push({
        hour: h,
        dayOfWeek: d,
        avgPnl: data ? data.sumPnl / data.total : 0,
        trades: data ? data.total : 0,
      });
    }
  }

  return cells;
}

function formatDuration(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function calculateTradeDurations(trades: Trade[]): TradeDurationStats {
  const closed = trades.filter((t) => t.net_pnl !== null && t.exit_time);

  const getDuration = (t: Trade) =>
    new Date(t.exit_time!).getTime() - new Date(t.entry_time).getTime();

  const scalpMax = 60 * 60 * 1000;
  const intradayMax = 24 * 60 * 60 * 1000;

  const scalps = closed.filter((t) => getDuration(t) < scalpMax);
  const intraday = closed.filter((t) => {
    const d = getDuration(t);
    return d >= scalpMax && d < intradayMax;
  });
  const swing = closed.filter((t) => getDuration(t) >= intradayMax);

  const avgDuration = (arr: Trade[]) => {
    if (arr.length === 0) return "0m";
    const total = arr.reduce((s, t) => s + getDuration(t), 0);
    return formatDuration(total / arr.length);
  };

  const winners = closed.filter((t) => (t.net_pnl ?? 0) > 0);
  const losers = closed.filter((t) => (t.net_pnl ?? 0) < 0);

  return {
    scalps: {
      count: scalps.length,
      winRate: scalps.length > 0 ? (scalps.filter((t) => (t.net_pnl ?? 0) > 0).length / scalps.length) * 100 : 0,
      pnl: scalps.reduce((s, t) => s + (t.net_pnl || 0), 0),
      avgDuration: avgDuration(scalps),
    },
    intraday: {
      count: intraday.length,
      winRate: intraday.length > 0 ? (intraday.filter((t) => (t.net_pnl ?? 0) > 0).length / intraday.length) * 100 : 0,
      pnl: intraday.reduce((s, t) => s + (t.net_pnl || 0), 0),
      avgDuration: avgDuration(intraday),
    },
    swing: {
      count: swing.length,
      winRate: swing.length > 0 ? (swing.filter((t) => (t.net_pnl ?? 0) > 0).length / swing.length) * 100 : 0,
      pnl: swing.reduce((s, t) => s + (t.net_pnl || 0), 0),
      avgDuration: avgDuration(swing),
    },
    avgWinDuration: avgDuration(winners),
    avgLossDuration: avgDuration(losers),
  };
}

export function calculateRiskStats(trades: Trade[]): RiskStats {
  const closed = trades.filter((t) => t.net_pnl !== null);

  const lotSizes = closed.map((t) => t.lot_size);
  const avgLotSize = lotSizes.length > 0 ? lotSizes.reduce((s, v) => s + v, 0) / lotSizes.length : 0;
  const largestLotSize = lotSizes.length > 0 ? Math.max(...lotSizes) : 0;

  const risks = closed
    .filter((t) => t.stop_loss !== null)
    .map((t) => Math.abs(((t.entry_price - t.stop_loss!) / t.entry_price) * 100));

  const avgRiskPct = risks.length > 0 ? risks.reduce((s, v) => s + v, 0) / risks.length : 0;
  const largestRiskPct = risks.length > 0 ? Math.max(...risks) : 0;

  const riskVariance = risks.length > 1
    ? risks.reduce((s, v) => s + Math.pow(v - avgRiskPct, 2), 0) / risks.length
    : 0;
  const riskStdDev = Math.sqrt(riskVariance);
  const riskConsistency = Math.max(0, Math.min(100, 100 - riskStdDev * 20));

  const tradesUsingStopLoss = closed.filter((t) => t.stop_loss !== null).length;
  const stopLossPct = closed.length > 0 ? (tradesUsingStopLoss / closed.length) * 100 : 0;

  return { avgRiskPct, largestRiskPct, riskConsistency, avgLotSize, largestLotSize, tradesUsingStopLoss, stopLossPct };
}

// ─── AI INSIGHTS CALCULATIONS ──────────────────────────────────

export function calculateExecutiveSummary(trades: Trade[]): ExecutiveSummary | null {
  const closed = trades.filter((t) => t.net_pnl !== null);
  if (closed.length < 5) return null;

  const now = new Date();
  const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthTrades = closed.filter((t) => t.entry_time >= monthStart);
  const monthlyPnl = monthTrades.reduce((s, t) => s + (t.net_pnl || 0), 0);

  const symbolStats = calculateSymbolStats(closed);
  const sessionStats = calculateSessionStats(closed);
  const strategyStats = calculateStrategyStats(closed);

  const bestSymbol = symbolStats.length > 0 ? symbolStats[0] : null;
  const bestSession = sessionStats.length > 0
    ? sessionStats.reduce((best, s) => (s.pnl > best.pnl ? s : best), sessionStats[0])
    : null;
  const bestStrategy = strategyStats.length > 0
    ? strategyStats.reduce((best, s) => (s.netPnl > best.netPnl ? s : best), strategyStats[0])
    : null;

  const worstSymbol = symbolStats.length > 0 ? symbolStats[symbolStats.length - 1] : null;

  const avgLossPerDay = (() => {
    const dailyPnl = calculateDailyPnl(closed.filter((t) => (t.net_pnl || 0) < 0));
    if (dailyPnl.length === 0) return 0;
    return Math.abs(dailyPnl.reduce((s, d) => s + d.pnl, 0) / dailyPnl.length);
  })();

  const estimatedImprovement = Math.round(avgLossPerDay * 11);

  return {
    monthLabel,
    monthlyPnl: Math.round(monthlyPnl * 100) / 100,
    isProfitable: monthlyPnl > 0,
    strongestEdge: {
      instrument: bestSymbol?.symbol || "—",
      session: bestSession?.session || "—",
      setup: bestStrategy?.strategy || "—",
    },
    biggestLeak: {
      description: worstSymbol
        ? `${worstSymbol.symbol} (${worstSymbol.winRate.toFixed(0)}% WR, $${Math.abs(worstSymbol.pnl).toFixed(0)} loss)`
        : "No significant leak detected",
      estimatedImpact: worstSymbol ? Math.round(Math.abs(worstSymbol.pnl) * 0.3) : 0,
    },
    estimatedImprovement,
    improvementNote: "If worst-day losses were cut by 50%, this is your potential monthly gain.",
  };
}

export function calculateTopInsightCards(trades: Trade[]): {
  bestInstrument: TopInsightCard | null;
  worstInstrument: TopInsightCard | null;
  bestSession: SessionInsight | null;
  worstSession: SessionInsight | null;
} {
  const closed = trades.filter((t) => t.net_pnl !== null);
  if (closed.length < 10) {
    return { bestInstrument: null, worstInstrument: null, bestSession: null, worstSession: null };
  }

  const symbolStats = calculateSymbolStats(closed);
  const sessionStats = calculateSessionStats(closed);

  const totalPnl = closed.reduce((s, t) => s + (t.net_pnl || 0), 0);

  const bestSymbol = symbolStats[0];
  const worstSymbol = symbolStats.length > 0 ? symbolStats[symbolStats.length - 1] : null;

  const bestSessionStat = sessionStats.length > 0
    ? sessionStats.reduce((best, s) => (s.pnl > best.pnl ? s : best), sessionStats[0])
    : null;
  const worstSessionStat = sessionStats.length > 0
    ? sessionStats.reduce((worst, s) => (s.pnl < worst.pnl ? s : worst), sessionStats[0])
    : null;

  const bestInstrument: TopInsightCard | null = bestSymbol ? {
    label: "Best Instrument",
    value: bestSymbol.symbol,
    winRate: bestSymbol.winRate,
    profitFactor: bestSymbol.profitFactor === 99.9 ? 99.9 : bestSymbol.profitFactor,
    detail: totalPnl > 0
      ? `You earn ${Math.round((bestSymbol.pnl / totalPnl) * 100)}% of profits from ${bestSymbol.symbol}.`
      : `${bestSymbol.symbol}: ${bestSymbol.winRate.toFixed(0)}% WR, $${bestSymbol.pnl.toFixed(0)} P&L.`,
    isPositive: true,
  } : null;

  const worstInstrument: TopInsightCard | null = worstSymbol ? {
    label: "Weakest Instrument",
    value: worstSymbol.symbol,
    winRate: worstSymbol.winRate,
    profitFactor: worstSymbol.profitFactor === 99.9 ? 99.9 : worstSymbol.profitFactor,
    detail: worstSymbol.pnl < 0
      ? `Consider reducing exposure. -$${Math.abs(worstSymbol.pnl).toFixed(0)} total loss.`
      : "Performing adequately.",
    isPositive: worstSymbol.pnl >= 0,
  } : null;

  const bestS: SessionInsight | null = bestSessionStat ? {
    label: "Best Session",
    session: bestSessionStat.session,
    winRate: bestSessionStat.winRate,
    avgRR: calculateAverageRR(closed.filter((t) => {
      const hour = getHour(t.entry_time);
      return getSessionLabel(hour) === bestSessionStat.session;
    })),
    detail: `${bestSessionStat.trades} trades, $${bestSessionStat.pnl.toFixed(0)} P&L`,
    isPositive: true,
  } : null;

  const worstS: SessionInsight | null = worstSessionStat && worstSessionStat.session !== bestSessionStat?.session ? {
    label: "Weak Session",
    session: worstSessionStat.session,
    winRate: worstSessionStat.winRate,
    avgRR: calculateAverageRR(closed.filter((t) => {
      const hour = getHour(t.entry_time);
      return getSessionLabel(hour) === worstSessionStat.session;
    })),
    detail: worstSessionStat.pnl < 0
      ? `-$${Math.abs(worstSessionStat.pnl).toFixed(0)} P&L in ${worstSessionStat.session} session.`
      : "Performing adequately.",
    isPositive: worstSessionStat.pnl >= 0,
  } : null;

  return { bestInstrument, worstInstrument, bestSession: bestS, worstSession: worstS };
}

export function calculatePatternDetections(trades: Trade[]): {
  patterns: DetectedPattern[];
  overtrading: OvertradingPattern | null;
  revenge: RevengePattern | null;
} {
  const closed = trades
    .filter((t) => t.net_pnl !== null)
    .sort((a, b) => a.entry_time.localeCompare(b.entry_time));

  if (closed.length < 20) {
    return { patterns: [], overtrading: null, revenge: null };
  }

  const patterns: DetectedPattern[] = [];

  const normalWinRate = (closed.filter((t) => (t.net_pnl ?? 0) > 0).length / closed.length) * 100;

  const postLossTrades: Trade[] = [];
  for (let i = 1; i < closed.length; i++) {
    if ((closed[i - 1].net_pnl ?? 0) < 0) {
      postLossTrades.push(closed[i]);
    }
  }
  if (postLossTrades.length >= 5) {
    const postLossWinRate = (postLossTrades.filter((t) => (t.net_pnl ?? 0) > 0).length / postLossTrades.length) * 100;
    if (postLossWinRate < normalWinRate * 0.7) {
      patterns.push({
        title: "After consecutive losses",
        normalWinRate,
        affectedWinRate: postLossWinRate,
        recommendation: "Stop trading for 30 minutes after 2 losses.",
        severity: "critical",
      });
    }
  }

  const dailyTrades = new Map<string, number>();
  closed.forEach((t) => {
    const day = t.entry_time.split("T")[0];
    dailyTrades.set(day, (dailyTrades.get(day) || 0) + 1);
  });

  const highDays: string[] = [];
  const lowDays: string[] = [];
  dailyTrades.forEach((count, day) => {
    if (count >= 8) highDays.push(day);
    if (count <= 4 && count >= 1) lowDays.push(day);
  });

  let overtrading: OvertradingPattern | null = null;
  if (highDays.length > 0 && lowDays.length > 0) {
    const highPnl = highDays.reduce((s, d) => {
      const dayTrades = closed.filter((t) => t.entry_time.startsWith(d));
      return s + dayTrades.reduce((ps, t) => ps + (t.net_pnl || 0), 0);
    }, 0);
    const lowPnl = lowDays.reduce((s, d) => {
      const dayTrades = closed.filter((t) => t.entry_time.startsWith(d));
      return s + dayTrades.reduce((ps, t) => ps + (t.net_pnl || 0), 0);
    }, 0);
    overtrading = {
      highTradeDays: { count: highDays.length, avgPnl: highDays.length > 0 ? highPnl / highDays.length : 0, label: "High frequency (≥8 trades)" },
      lowTradeDays: { count: lowDays.length, avgPnl: lowDays.length > 0 ? lowPnl / lowDays.length : 0, label: "Normal frequency (≤4 trades)" },
    };
  }

  let revenge: RevengePattern | null = null;
  const revengeThreshold = 20;
  if (postLossTrades.length >= 5) {
    const postLossWinRate = (postLossTrades.filter((t) => (t.net_pnl ?? 0) > 0).length / postLossTrades.length) * 100;
    if (postLossWinRate < normalWinRate * 0.75) {
      revenge = {
        percentage: Math.round((1 - postLossWinRate / normalWinRate) * 100),
        threshold: revengeThreshold,
      };
    }
  }

  return { patterns, overtrading, revenge };
}

export function calculateOpportunityFinder(trades: Trade[]): OpportunityFound[] {
  const closed = trades.filter((t) => t.net_pnl !== null);
  if (closed.length < 15) return [];

  const strategyStats = calculateStrategyStats(closed);
  const total = closed.length;

  return strategyStats
    .filter((s) => s.totalTrades >= 3)
    .map((s) => ({
      strategy: s.strategy,
      winRate: s.winRate,
      usagePercent: (s.totalTrades / total) * 100,
      totalTrades: s.totalTrades,
      recommendation: s.averageRR > 1.5
        ? `Scale up ${s.strategy} — strong R:R`
        : `Review ${s.strategy} entries — R:R can improve`,
    }))
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 5);
}

export function calculateStrengths(trades: Trade[]): StrengthItem[] {
  const closed = trades.filter((t) => t.net_pnl !== null);
  if (closed.length < 5) return [];

  const items: StrengthItem[] = [];
  const winRate = (closed.filter((t) => (t.net_pnl ?? 0) > 0).length / closed.length) * 100;

  items.push({ label: `Win Rate: ${winRate.toFixed(0)}%`, passed: winRate > 55 });

  const avgRR = calculateAverageRR(closed);
  items.push({ label: `Risk-Reward: ${avgRR.toFixed(1)}R`, passed: avgRR > 1.5 });

  const planAdherence = closed.filter((t) => t.followed_plan).length / closed.length;
  items.push({ label: `Plan: ${(planAdherence * 100).toFixed(0)}%`, passed: planAdherence > 0.8 });

  const slUsage = closed.filter((t) => t.stop_loss !== null).length / closed.length;
  items.push({ label: `Stop Loss: ${(slUsage * 100).toFixed(0)}%`, passed: slUsage > 0.9 });

  return items;
}

export function calculateImprovementAreas(trades: Trade[]): string[] {
  const closed = trades.filter((t) => t.net_pnl !== null);
  if (closed.length < 5) return [];

  const areas: string[] = [];
  const flags = calculateBehaviourFlags(closed);
  const dayStats = calculateDayOfWeekStats(closed);

  const fridayStats = dayStats.find((d) => d.day === "Friday");
  if (fridayStats && fridayStats.pnl < 0 && fridayStats.trades >= 3) {
    areas.push("Trading Fridays");
  }

  const overtradingFlag = flags.find((f) => f.id === "overtrading");
  if (overtradingFlag?.status === "warn" || overtradingFlag?.status === "bad") {
    areas.push("Overtrading after losses");
  }

  const holdingFlag = flags.find((f) => f.id === "holding");
  if (holdingFlag?.status === "warn") {
    areas.push("Exiting winners too early");
  }

  const planFlag = flags.find((f) => f.id === "plan");
  if (planFlag?.status === "warn" || planFlag?.status === "bad") {
    areas.push("Breaking daily trade limit");
  }

  const revengeFlag = flags.find((f) => f.id === "revenge");
  if (revengeFlag?.status === "bad") {
    areas.push("Revenge trading");
  }

  if (areas.length === 0) {
    areas.push("Minor optimization opportunities available");
  }

  return areas;
}

export function calculateMoneyLeaks(trades: Trade[]): { leaks: MoneyLeak[]; totalAvoidable: number } | null {
  const closed = trades.filter((t) => t.net_pnl !== null);
  if (closed.length < 15) return null;

  const leaks: MoneyLeak[] = [];
  const leakCategories = new Set<string>();

  const dayStats = calculateDayOfWeekStats(closed);
  const fridayStats = dayStats.find((d) => d.day === "Friday");
  if (fridayStats && fridayStats.pnl < 0) {
    leaks.push({ category: "Friday Trading", amount: Math.round(fridayStats.pnl) });
    leakCategories.add("friday");
  }

  const riskStats = calculateRiskStats(closed);
  if (riskStats.largestRiskPct > riskStats.avgRiskPct * 2) {
    const oversizedLosses = closed
      .filter((t) => {
        if (t.stop_loss === null) return false;
        const risk = Math.abs(((t.entry_price - t.stop_loss) / t.entry_price) * 100);
        return risk > riskStats.avgRiskPct * 1.5;
      })
      .reduce((s, t) => s + Math.abs(t.net_pnl || 0), 0);
    if (oversizedLosses > 0) {
      leaks.push({ category: "Oversized Positions", amount: Math.round(oversizedLosses) });
      leakCategories.add("sizing");
    }
  }

  const sessionStats = calculateSessionStats(closed);
  const worstSession = sessionStats.length > 0
    ? sessionStats.reduce((worst, s) => (s.pnl < worst.pnl ? s : worst), sessionStats[0])
    : null;
  if (worstSession && worstSession.pnl < 0) {
    const sessionLabel = `${worstSession.session} Session`;
    const existing = leaks.find((l) => l.category === sessionLabel);
    if (!existing) {
      leaks.push({ category: sessionLabel, amount: Math.round(worstSession.pnl) });
    }
  }

  const totalAvoidable = leaks.reduce((s, l) => s + Math.abs(l.amount), 0);
  return { leaks, totalAvoidable: Math.round(totalAvoidable) };
}

export function calculateEdgeDiscovery(trades: Trade[]): EdgeCondition | null {
  const closed = trades.filter((t) => t.net_pnl !== null);
  if (closed.length < 20) return null;

  const combos = new Map<string, Trade[]>();

  closed.forEach((t) => {
    const hour = getHour(t.entry_time);
    const session = getSessionLabel(hour);
    const dayIdx = new Date(t.entry_time).getUTCDay();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = days[dayIdx];
    const strategy = t.strategy || "Untagged";
    if (strategy === "Untagged") return;
    const key = `${t.symbol}|${session}|${day}|${strategy}`;

    if (!combos.has(key)) combos.set(key, []);
    combos.get(key)!.push(t);
  });

  let bestKey = "";
  let bestTradesArr: Trade[] = [];
  let bestScore = 0;

  combos.forEach((tradesArr, key) => {
    if (tradesArr.length < 3) return;
    const wr = (tradesArr.filter((t) => (t.net_pnl ?? 0) > 0).length / tradesArr.length) * 100;
    const gp = tradesArr.filter((t) => (t.net_pnl ?? 0) > 0).reduce((s, t) => s + (t.net_pnl || 0), 0);
    const gl = Math.abs(tradesArr.filter((t) => (t.net_pnl ?? 0) < 0).reduce((s, t) => s + (t.net_pnl || 0), 0));
    const pf = gl > 0 ? gp / gl : gp > 0 ? 10 : 0;
    const score = wr * 0.5 + pf * 2 + tradesArr.length;

    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
      bestTradesArr = tradesArr;
    }
  });

  if (bestTradesArr.length < 3) return null;

  const parts = bestKey.split("|");
  const instrument = parts[0];
  const session = parts[1];
  const day = parts[2];
  const setup = parts[3];
  const t = bestTradesArr;
  const wr = (t.filter((x) => (x.net_pnl ?? 0) > 0).length / t.length) * 100;
  const gp = t.filter((x) => (x.net_pnl ?? 0) > 0).reduce((s, x) => s + (x.net_pnl || 0), 0);
  const gl = Math.abs(t.filter((x) => (x.net_pnl ?? 0) < 0).reduce((s, x) => s + (x.net_pnl || 0), 0));

  return {
    instrument,
    session,
    day,
    setup,
    winRate: Math.round(wr * 10) / 10,
    profitFactor: Math.round((gl > 0 ? gp / gl : gp > 0 ? 99 : 0) * 10) / 10,
    riskPercent: 1,
  };
}

export function calculateWeeklyReview(trades: Trade[]): WeeklyReview | null {
  const closed = trades.filter((t) => t.net_pnl !== null);
  if (closed.length < 5) return null;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekTrades = closed.filter((t) => new Date(t.entry_time) >= weekAgo);

  if (weekTrades.length < 3) {
    return {
      startDate: weekAgo.toISOString().split("T")[0],
      endDate: now.toISOString().split("T")[0],
      trades: 0,
      profit: 0,
      winRate: 0,
      topStrength: "No recent activity",
      biggestMistake: "Not enough data this week",
      recommendation: "Try to log at least 3 trades this week to receive a personalized review.",
      noRecentData: true,
    };
  }

  const profit = weekTrades.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const wins = weekTrades.filter((t) => (t.net_pnl ?? 0) > 0).length;
  const winRate = (wins / weekTrades.length) * 100;

  const strategyStats = calculateStrategyStats(weekTrades);
  const topStrategy = strategyStats.length > 0
    ? strategyStats.reduce((best, s) => (s.netPnl > best.netPnl ? s : best), strategyStats[0])
    : null;

  const dayStats = calculateDayOfWeekStats(weekTrades);
  const worstDay = dayStats.length > 0
    ? dayStats.filter((d) => d.trades > 0).reduce((worst, d) => (d.pnl < worst.pnl ? d : worst), dayStats[0])
    : null;

  return {
    startDate: weekAgo.toISOString().split("T")[0],
    endDate: now.toISOString().split("T")[0],
    trades: weekTrades.length,
    profit: Math.round(profit * 100) / 100,
    winRate: Math.round(winRate),
    topStrength: topStrategy?.strategy || "Consistent execution",
    biggestMistake: worstDay && worstDay.pnl < 0 ? `Overtrading ${worstDay.day}` : "No major issues",
    recommendation: worstDay && worstDay.pnl < 0
      ? `Reduce ${worstDay.day} trade count by 50%.`
      : "Maintain current approach.",
  };
}

export function calculateProjectedPerformance(trades: Trade[]): ProjectedPerformance | null {
  const closed = trades.filter((t) => t.net_pnl !== null);
  if (closed.length < 20) return null;

  const last30 = closed.slice(-Math.min(30, closed.length));
  const monthlyPnl = last30.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const tradingDays = new Set(last30.map((t) => t.entry_time.split("T")[0])).size;
  const avgDailyPnl = monthlyPnl / Math.max(1, tradingDays);
  const expectedMonthlyProfit = Math.round(avgDailyPnl * 22 * 100) / 100;

  const dailyPnl = calculateDailyPnl(last30);
  const drawdownStats = calculateDrawdownAnalysis(last30, Math.abs(last30.reduce((s, t) => s + (t.net_pnl || 0), 0)) || 1000);
  const expectedDrawdown = Math.min(30, Math.round(drawdownStats.maxDrawdownPct * 10) / 10);

  const winRate = (last30.filter((t) => (t.net_pnl ?? 0) > 0).length / last30.length) * 100;
  const confidence = Math.min(95, Math.round(50 + closed.length * 0.3 + winRate * 0.3));

  return {
    expectedMonthlyProfit,
    expectedDrawdown: Math.min(30, expectedDrawdown),
    confidence,
  };
}

function getGrade(score: number): string {
  if (score >= 90) return "Elite Trader";
  if (score >= 75) return "Pro Trader";
  if (score >= 60) return "Advanced Trader";
  if (score >= 40) return "Apprentice Trader";
  return "Novice Trader";
}

type TrendDir = "up" | "down" | "stable";

function trendDir(a: number, b: number): TrendDir {
  if (Math.abs(a - b) < 5) return "stable";
  return a > b ? "up" : "down";
}

export function calculateTraderScorecard(trades: Trade[]): TraderScorecard | null {
  const closed = trades.filter((t) => t.net_pnl !== null);
  if (closed.length < 10) return null;

  const riskStats = calculateRiskStats(closed);
  const flags = calculateBehaviourFlags(closed);
  const avgRR = calculateAverageRR(closed);

  const winningTrades = closed.filter((t) => (t.net_pnl ?? 0) > 0);
  const losingTrades = closed.filter((t) => (t.net_pnl ?? 0) < 0);
  const winRate = (winningTrades.length / closed.length) * 100;
  const planAdherence = closed.filter((t) => t.followed_plan === true).length / closed.length;

  const avgTradesPerDay = closed.length / Math.max(1,
    (new Date(closed[closed.length - 1].entry_time).getTime() -
      new Date(closed[0].entry_time).getTime()) / (1000 * 60 * 60 * 24)
  );

  const planFlag = flags.find((f) => f.id === "plan");
  const revengeFlag = flags.find((f) => f.id === "revenge");
  const overtradingFlag = flags.find((f) => f.id === "overtrading");

  // Risk Management
  const slUsageScore = riskStats.stopLossPct;
  const riskConsistencyScore = riskStats.riskConsistency;
  const riskStdDev = riskStats.largestRiskPct > 0
    ? Math.sqrt(Math.pow(riskStats.largestRiskPct - riskStats.avgRiskPct, 2))
    : 0;
  const riskVarianceScore = Math.max(0, 100 - riskStdDev * 15);
  let appropriateRiskScore = 100;
  if (riskStats.avgRiskPct < 0.5) appropriateRiskScore = Math.round((riskStats.avgRiskPct / 0.5) * 100);
  else if (riskStats.avgRiskPct > 2) appropriateRiskScore = Math.max(0, 100 - (riskStats.avgRiskPct - 2) * 40);
  const riskManagement = Math.round(
    slUsageScore * 0.25 + riskConsistencyScore * 0.25 + riskVarianceScore * 0.25 + appropriateRiskScore * 0.25
  );

  // Execution
  const rrScore = Math.min(avgRR / 2.0, 1) * 50;
  const wrScore = (winRate / 100) * 30;
  const planScore = planAdherence * 20;
  const execution = Math.round(Math.min(100, rrScore + wrScore + planScore));

  // Consistency
  const planFlagScore = planFlag?.status === "ok" ? 40 : planFlag?.status === "warn" ? 20 : 10;
  const lotConScore = riskStats.riskConsistency * 0.3;
  const dailyTradeVariance = (() => {
    const dailyCounts = new Map<string, number>();
    closed.forEach((t) => {
      const d = t.entry_time.split("T")[0];
      dailyCounts.set(d, (dailyCounts.get(d) || 0) + 1);
    });
    const counts = Array.from(dailyCounts.values());
    if (counts.length < 2) return 30;
    const avg = counts.reduce((s, c) => s + c, 0) / counts.length;
    const variance = counts.reduce((s, c) => s + Math.pow(c - avg, 2), 0) / counts.length;
    const std = Math.sqrt(variance);
    return Math.max(0, 30 - std * 5);
  })();
  const consistency = Math.round(Math.min(100, planFlagScore + lotConScore + dailyTradeVariance));

  // Patience
  const tpdScore = (() => {
    if (avgTradesPerDay <= 2) return 95;
    if (avgTradesPerDay <= 4) return 85;
    if (avgTradesPerDay <= 6) return 65;
    if (avgTradesPerDay <= 10) return 40;
    return 20;
  })();
  const sessionFocusPct = (() => {
    const focused = closed.filter((t) => {
      const h = new Date(t.entry_time).getHours();
      const session = h >= 8 && h < 13 ? "London" : h >= 13 && h < 21 ? "NY" : "";
      return session !== "";
    }).length;
    return (focused / closed.length) * 100;
  })();
  const sessionScore = (sessionFocusPct / 100) * 20;
  const patience = Math.round(Math.min(100, tpdScore + sessionScore));

  // Psychology
  const tradesWithEmotions = closed.filter((t) =>
    t.fear_level !== null || t.greed_level !== null || t.confidence_before !== null
  );
  const emotionTagPct = tradesWithEmotions.length / closed.length;
  const taggingScore = emotionTagPct * 35;

  const calmTrades = closed.filter((t) =>
    (t.fear_level ?? 5) < 5 && (t.greed_level ?? 5) < 5 && (t.confidence_before ?? 5) >= 5
  );
  const emotionalTrades = closed.filter((t) =>
    (t.fear_level ?? 5) >= 6 || (t.greed_level ?? 5) >= 7
  );
  const calmWR = calmTrades.length > 0
    ? calmTrades.filter((t) => (t.net_pnl ?? 0) > 0).length / calmTrades.length
    : 0.5;
  const emotionalWR = emotionalTrades.length > 0
    ? emotionalTrades.filter((t) => (t.net_pnl ?? 0) > 0).length / emotionalTrades.length
    : 0.5;

  let calmScore = 20;
  if (tradesWithEmotions.length >= 3) {
    if (calmWR > emotionalWR + 0.1) calmScore = 35;
    else if (calmWR > emotionalWR) calmScore = 30;
    else if (Math.abs(calmWR - emotionalWR) < 0.05) calmScore = 20;
    else calmScore = 10;
  }

  const revengeScore = revengeFlag?.status === "ok" ? 30 : revengeFlag?.status === "bad" ? 0 : 15;
  const psychology = Math.round(Math.min(100, taggingScore + calmScore + revengeScore));

  // Discipline
  const discPlanScore = planAdherence * 40;
  const mistakesPerTrade = (() => {
    const withMistakes = closed.filter((t) => t.mistakes && t.mistakes.length > 0);
    if (withMistakes.length === 0) return -1;
    const totalMistakes = closed.reduce((s, t) => s + (t.mistakes?.length || 0), 0);
    return totalMistakes / closed.length;
  })();
  let discMistakeScore = 30;
  if (mistakesPerTrade < 0) discMistakeScore = 30;
  else if (mistakesPerTrade <= 0.2) discMistakeScore = 50;
  else if (mistakesPerTrade <= 0.5) discMistakeScore = 35;
  else if (mistakesPerTrade <= 1) discMistakeScore = 20;
  else discMistakeScore = 5;

  const discOvertradingScore = overtradingFlag?.status === "ok" ? 10 : overtradingFlag?.status === "warn" ? 5 : 0;
  const discipline = Math.round(Math.min(100, discPlanScore + discMistakeScore + discOvertradingScore));

  // Overall
  const overall = Math.round(
    riskManagement * 0.25 + execution * 0.20 + consistency * 0.15 + patience * 0.15 + psychology * 0.15 + discipline * 0.10
  );

  // Weaknesses
  const pillars: { key: keyof TraderScorecard; label: string; score: number }[] = [
    { key: "riskManagement", label: "Risk Management", score: riskManagement },
    { key: "execution", label: "Execution", score: execution },
    { key: "consistency", label: "Consistency", score: consistency },
    { key: "patience", label: "Patience", score: patience },
    { key: "psychology", label: "Psychology", score: psychology },
    { key: "discipline", label: "Discipline", score: discipline },
  ];
  const sorted = [...pillars].sort((a, b) => a.score - b.score);
  const weaknesses = sorted.slice(0, 2).map((p) => {
    const tips: Record<string, string> = {
      riskManagement: "Increase stop loss usage and keep risk between 0.5%–2% per trade for consistent sizing.",
      execution: "Let winners run to at least 2R. Use trailing stops instead of manual exits to capture more profit.",
      consistency: "Follow your trading plan on every entry. Reduce emotional deviations and stick to your rules.",
      patience: "Trade less — focus on higher-quality setups. Limit to 2–4 trades per day during liquid sessions.",
      psychology: "Tag emotions on every trade. Track whether calm entries outperform emotional ones to build self-awareness.",
      discipline: "Increase plan adherence to 100%. Review mistakes after each trade to avoid repeating them.",
    };
    return {
      pillar: p.key,
      label: p.label,
      score: p.score,
      tip: tips[p.key] || "Focus on improving this area through consistent practice.",
    };
  });

  // Trends
  const mid = Math.floor(closed.length / 2);
  const early = closed.slice(0, mid);
  const late = closed.slice(mid);

  function roughPillar(pillar: string, batch: Trade[]): number {
    if (batch.length < 3) return 50;
    const r = calculateRiskStats(batch);
    const f = calculateBehaviourFlags(batch);
    const rr = calculateAverageRR(batch);
    const wins = batch.filter((t) => (t.net_pnl ?? 0) > 0).length;
    const wr = (wins / batch.length) * 100;
    const plan = batch.filter((t) => t.followed_plan === true).length / batch.length;
    const tpd = batch.length / Math.max(1,
      (new Date(batch[batch.length - 1].entry_time).getTime() -
        new Date(batch[0].entry_time).getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (pillar) {
      case "riskManagement": return Math.round(r.stopLossPct * 0.25 + r.riskConsistency * 0.25 + 30);
      case "patience": return Math.round(Math.min(100, Math.max(0, 100 - (tpd - 3) * 10)));
      case "execution": return Math.round(Math.min(100, Math.min(rr / 2, 1) * 50 + (wr / 100) * 30 + plan * 20));
      case "consistency": {
        const pf = f.find((x) => x.id === "plan");
        return pf?.status === "ok" ? 80 : pf?.status === "warn" ? 55 : 35;
      }
      case "psychology": {
        const emotionBatch = batch.filter((t) => t.fear_level !== null || t.greed_level !== null || t.confidence_before !== null);
        const tagRate = emotionBatch.length / batch.length;
        return Math.round(Math.min(100, tagRate * 40 + (f.find((x) => x.id === "revenge")?.status === "ok" ? 30 : 10)));
      }
      case "discipline": return Math.round(Math.min(100, plan * 50 + (f.find((x) => x.id === "overtrading")?.status === "ok" ? 20 : 5)));
      default: return 50;
    }
  }

  const trends = {
    riskManagement: trendDir(roughPillar("riskManagement", late), roughPillar("riskManagement", early)),
    patience: trendDir(roughPillar("patience", late), roughPillar("patience", early)),
    execution: trendDir(roughPillar("execution", late), roughPillar("execution", early)),
    consistency: trendDir(roughPillar("consistency", late), roughPillar("consistency", early)),
    psychology: trendDir(roughPillar("psychology", late), roughPillar("psychology", early)),
    discipline: trendDir(roughPillar("discipline", late), roughPillar("discipline", early)),
  };

  // Pillar Details
  const pillarDetails = {
    riskManagement: `Stop loss used on ${riskStats.stopLossPct.toFixed(0)}% of trades. Sizing consistency: ${riskStats.riskConsistency.toFixed(0)}%. Average risk: ${riskStats.avgRiskPct.toFixed(2)}% per trade.`,
    patience: `Average ${avgTradesPerDay.toFixed(1)} trades per day. ${avgTradesPerDay <= 4 ? "Healthy trade frequency." : avgTradesPerDay <= 6 ? "Moderate frequency — consider fewer, higher-quality setups." : "High frequency — overtrading may reduce edge."} ${sessionFocusPct >= 70 ? "Strong session focus." : "Consider focusing on London/NY sessions."}`,
    execution: `Average R:R of ${avgRR.toFixed(2)}. Win rate: ${winRate.toFixed(1)}%. ${avgRR >= 1.5 ? "Good risk-reward discipline." : avgRR >= 1 ? "Moderate R:R — work on letting winners run." : "Low R:R — consider trailing stops to capture more profit."}`,
    consistency: `Plan adherence: ${(planAdherence * 100).toFixed(0)}%. ${planFlag?.status === "ok" ? "Strong routine and discipline." : "Work on following your plan every trade."}`,
    psychology: `Emotions tagged on ${(emotionTagPct * 100).toFixed(0)}% of trades. ${tradesWithEmotions.length >= 3 ? (calmWR > emotionalWR ? "Calm entries outperform emotional ones — maintain composure." : "Emotional entries match calm ones — keep building awareness.") : "Tag emotions on more trades to unlock deeper psychology insights."}`,
    discipline: `Plan followed on ${(planAdherence * 100).toFixed(0)}% of trades. ${mistakesPerTrade < 0 ? "No mistakes recorded — tracking helps identify patterns." : mistakesPerTrade <= 0.3 ? `${(mistakesPerTrade * 100).toFixed(0)} mistakes per trade — strong self-awareness.` : `Average ${mistakesPerTrade.toFixed(1)} mistakes per trade — review and reduce recurring errors.`}`,
  };

  return {
    riskManagement,
    patience,
    execution,
    consistency,
    psychology,
    discipline,
    overall,
    overallGrade: getGrade(overall),
    weaknesses,
    trends,
    pillarDetails,
  };
}

export function getInsufficientDataSections(trades: Trade[]): InsufficientDataSection[] {
  const closed = trades.filter((t) => t.net_pnl !== null);
  const sections: InsufficientDataSection[] = [];

  const checks = [
    { key: "executive-summary", required: 5, label: "Executive Summary" },
    { key: "top-insights", required: 10, label: "Top Insights" },
    { key: "pattern-detection", required: 20, label: "Pattern Detection" },
    { key: "opportunity-analysis", required: 15, label: "Opportunity Analysis" },
    { key: "strengths", required: 5, label: "Strengths Analysis" },
    { key: "improvement-areas", required: 5, label: "Improvement Areas" },
    { key: "money-leaks", required: 15, label: "Money Leak Report" },
    { key: "edge-discovery", required: 20, label: "Edge Discovery" },
    { key: "weekly-review", required: 5, label: "Weekly Review" },
    { key: "projections", required: 20, label: "Projected Performance" },
    { key: "scorecard", required: 10, label: "Trader Scorecard" },
  ];

  checks.forEach(({ key, required, label }) => {
    if (closed.length < required) {
      sections.push({
        sectionKey: key,
        message: `Add ${required - closed.length} more trades to unlock ${label}`,
        required,
        current: closed.length,
      });
    }
  });

  return sections;
}

export function analyzeLosingTrade(trade: Trade, recentTrades: Trade[]): {
  session: string;
  minutesBeforeExit: number;
  wasAfterConsecutiveLoss: boolean;
  consecutiveLossCount: number;
  similarEntryWinRate: number | null;
  possibleReasons: string[];
  suggestedImprovement: string;
} {
  const hour = getHour(trade.entry_time);
  const session = getSessionLabel(hour);

  let minutesBeforeExit = 0;
  if (trade.exit_time) {
    minutesBeforeExit = Math.round(
      (new Date(trade.exit_time).getTime() - new Date(trade.entry_time).getTime()) / (1000 * 60)
    );
  }

  const sorted = [...recentTrades]
    .filter((t) => t.net_pnl !== null)
    .sort((a, b) => a.entry_time.localeCompare(b.entry_time));

  let consecutiveLossCount = 0;
  const tradeIdx = sorted.findIndex((t) => t.id === trade.id);
  if (tradeIdx >= 0) {
    for (let i = tradeIdx - 1; i >= 0; i--) {
      if ((sorted[i].net_pnl ?? 0) < 0) consecutiveLossCount++;
      else break;
    }
  }

  const similarTrades = sorted.filter((t) =>
    t.id !== trade.id &&
    t.symbol === trade.symbol &&
    t.direction === trade.direction
  );
  const similarEntryWinRate = similarTrades.length > 0
    ? (similarTrades.filter((t) => (t.net_pnl ?? 0) > 0).length / similarTrades.length) * 100
    : null;

  const possibleReasons: string[] = [];

  if (consecutiveLossCount >= 2) {
    possibleReasons.push(`Entered after ${consecutiveLossCount} consecutive losses (possible revenge trading)`);
  }

  if (session === "Off-hours" || session === "Asia") {
    possibleReasons.push(`Traded during ${session} session — lower liquidity period`);
  }

  if (trade.confidence_before && trade.confidence_before <= 4) {
    possibleReasons.push(`Low confidence before entry (${trade.confidence_before}/10)`);
  }

  if (trade.fear_level && trade.fear_level >= 7) {
    possibleReasons.push(`High fear level (${trade.fear_level}/10) — possible emotional entry`);
  }

  if (trade.greed_level && trade.greed_level >= 7) {
    possibleReasons.push(`High greed level (${trade.greed_level}/10) — possible overleveraging`);
  }

  if (trade.followed_plan === false) {
    possibleReasons.push("Did not follow trading plan");
  }

  if (trade.stop_loss === null) {
    possibleReasons.push("No stop loss set");
  }

  if (similarEntryWinRate !== null && similarEntryWinRate < 40 && similarTrades.length >= 3) {
    possibleReasons.push(`Similar ${trade.symbol} ${trade.direction} entries only win ${similarEntryWinRate.toFixed(0)}% of the time`);
  }

  if (minutesBeforeExit < 5 && trade.net_pnl && trade.net_pnl < 0) {
    possibleReasons.push("Very short trade duration — possible impulsive entry");
  }

  if (possibleReasons.length === 0) {
    possibleReasons.push("No obvious behavioral issues detected — this may be normal variance");
  }

  let suggestedImprovement = "Review your pre-trade checklist before entering.";
  if (consecutiveLossCount >= 2) {
    suggestedImprovement = "Wait 30 minutes after 2 consecutive losses before your next entry.";
  } else if (trade.followed_plan === false) {
    suggestedImprovement = "Stick to your trading plan — deviating reduces your edge.";
  } else if (trade.stop_loss === null) {
    suggestedImprovement = "Always set a stop loss to protect your capital.";
  } else if (similarEntryWinRate !== null && similarEntryWinRate < 40 && similarTrades.length >= 3) {
    suggestedImprovement = `Avoid ${trade.symbol} ${trade.direction} setups — your win rate here is only ${similarEntryWinRate.toFixed(0)}%.`;
  }

  return {
    session,
    minutesBeforeExit,
    wasAfterConsecutiveLoss: consecutiveLossCount > 0,
    consecutiveLossCount,
    similarEntryWinRate: similarEntryWinRate !== null ? Math.round(similarEntryWinRate * 10) / 10 : null,
    possibleReasons,
    suggestedImprovement,
  };
}
