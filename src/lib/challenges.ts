import type { Trade, Challenge, ChallengeProgress } from "@/types";

export const CHALLENGES: Challenge[] = [
  {
    id: "no-overtrading",
    title: "No Overtrading Challenge",
    description: "Keep your daily trade count at 6 or fewer for 5 consecutive trading days.",
    icon: "🎯",
    targetValue: 5,
    unit: "days",
    duration: "5 consecutive days",
    rule: "≤6 trades per day",
  },
  {
    id: "20-trade-discipline",
    title: "20 Trade Discipline",
    description: "Complete exactly 20 trades while following your trading plan every time.",
    icon: "🏆",
    targetValue: 20,
    unit: "trades",
    duration: "Until 20 trades completed",
    rule: "100% plan adherence",
  },
  {
    id: "risk-consistency",
    title: "Risk Consistency Challenge",
    description: "Keep your risk per trade within 0.5%-2% for 10 consecutive trades.",
    icon: "🛡️",
    targetValue: 10,
    unit: "trades",
    duration: "10 consecutive trades",
    rule: "Risk between 0.5%-2%",
  },
  {
    id: "win-streak",
    title: "Win Streak",
    description: "Achieve 5 consecutive winning trades.",
    icon: "🔥",
    targetValue: 5,
    unit: "wins",
    duration: "Until 5 wins in a row",
    rule: "5 consecutive wins",
  },
  {
    id: "loss-recovery",
    title: "Loss Recovery",
    description: "Recover from a drawdown of 3% or more within the next 10 trades.",
    icon: "💪",
    targetValue: 10,
    unit: "trades",
    duration: "10 trades after drawdown",
    rule: "Recover from >3% drawdown in ≤10 trades",
  },
  {
    id: "profitable-week",
    title: "Profitable Week",
    description: "End every trading day green for 5 consecutive days.",
    icon: "📈",
    targetValue: 5,
    unit: "days",
    duration: "5 consecutive days",
    rule: "Each day must be profitable",
  },
];

export function computeChallengeProgress(
  challengeId: string,
  trades: Trade[],
  activeChallenge?: { started_at: string }
): ChallengeProgress {
  const closed = trades
    .filter((t) => t.net_pnl !== null)
    .sort((a, b) => a.entry_time.localeCompare(b.entry_time));

  const startedAt = activeChallenge?.started_at || null;
  const relevantTrades = startedAt
    ? closed.filter((t) => t.entry_time >= startedAt)
    : closed;

  switch (challengeId) {
    case "no-overtrading":
      return computeNoOvertrading(relevantTrades);
    case "20-trade-discipline":
      return compute20TradeDiscipline(relevantTrades);
    case "risk-consistency":
      return computeRiskConsistency(relevantTrades);
    case "win-streak":
      return computeWinStreak(closed);
    case "loss-recovery":
      return computeLossRecovery(closed);
    case "profitable-week":
      return computeProfitableWeek(relevantTrades);
    default:
      return { challengeId, progress: 0, current: 0, target: 0, passed: false, active: false, startedAt, completedAt: null, details: [] };
  }
}

function computeNoOvertrading(trades: Trade[]): ChallengeProgress {
  const dailyTrades = new Map<string, number>();
  trades.forEach((t) => {
    const day = t.entry_time.split("T")[0];
    dailyTrades.set(day, (dailyTrades.get(day) || 0) + 1);
  });

  let consecutiveGoodDays = 0;
  let currentStreak = 0;
  const details: string[] = [];

  const sortedDays = Array.from(dailyTrades.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  for (const [day, count] of sortedDays) {
    if (count <= 6) {
      currentStreak++;
      details.push(`✅ ${day}: ${count} trades`);
    } else {
      currentStreak = 0;
      details.push(`❌ ${day}: ${count} trades (overtraded)`);
    }
    consecutiveGoodDays = Math.max(consecutiveGoodDays, currentStreak);
  }

  return {
    challengeId: "no-overtrading",
    progress: Math.min(100, Math.round((consecutiveGoodDays / 5) * 100)),
    current: consecutiveGoodDays,
    target: 5,
    passed: consecutiveGoodDays >= 5,
    active: true,
    startedAt: null,
    completedAt: consecutiveGoodDays >= 5 ? new Date().toISOString() : null,
    details: details.slice(-10),
  };
}

function compute20TradeDiscipline(trades: Trade[]): ChallengeProgress {
  const planAdhered = trades.filter((t) => t.followed_plan === true).length;
  const total = trades.length;

  const details: string[] = [];
  if (total > 0) {
    details.push(`${planAdhered} of ${total} trades followed plan`);
    details.push(`Plan adherence: ${total > 0 ? Math.round((planAdhered / total) * 100) : 0}%`);
  }

  return {
    challengeId: "20-trade-discipline",
    progress: Math.min(100, Math.round((Math.min(planAdhered, 20) / 20) * 100)),
    current: Math.min(planAdhered, 20),
    target: 20,
    passed: planAdhered >= 20,
    active: true,
    startedAt: null,
    completedAt: planAdhered >= 20 ? new Date().toISOString() : null,
    details,
  };
}

function computeRiskConsistency(trades: Trade[]): ChallengeProgress {
  const withSL = trades.filter((t) => t.stop_loss !== null);
  const consistent = withSL.filter((t) => {
    const risk = Math.abs(((t.entry_price - t.stop_loss!) / t.entry_price) * 100);
    return risk >= 0.5 && risk <= 2.0;
  });

  let maxStreak = 0;
  let currentStreak = 0;

  withSL.forEach((t) => {
    const risk = Math.abs(((t.entry_price - t.stop_loss!) / t.entry_price) * 100);
    if (risk >= 0.5 && risk <= 2.0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  return {
    challengeId: "risk-consistency",
    progress: Math.min(100, Math.round((maxStreak / 10) * 100)),
    current: maxStreak,
    target: 10,
    passed: maxStreak >= 10,
    active: true,
    startedAt: null,
    completedAt: maxStreak >= 10 ? new Date().toISOString() : null,
    details: [
      `${consistent.length} of ${withSL.length} trades within 0.5%-2% risk`,
      `Best consecutive streak: ${maxStreak}`,
    ],
  };
}

function computeWinStreak(trades: Trade[]): ChallengeProgress {
  let currentStreak = 0;
  let bestStreak = 0;

  for (let i = trades.length - 1; i >= 0; i--) {
    if (trades[i].net_pnl! > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  let streak = 0;
  trades.forEach((t) => {
    if (t.net_pnl! > 0) {
      streak++;
      bestStreak = Math.max(bestStreak, streak);
    } else {
      streak = 0;
    }
  });

  return {
    challengeId: "win-streak",
    progress: Math.min(100, Math.round((currentStreak / 5) * 100)),
    current: currentStreak,
    target: 5,
    passed: currentStreak >= 5,
    active: true,
    startedAt: null,
    completedAt: currentStreak >= 5 ? new Date().toISOString() : null,
    details: [
      `Current win streak: ${currentStreak}`,
      `Personal best: ${bestStreak}`,
    ],
  };
}

function computeLossRecovery(trades: Trade[]): ChallengeProgress {
  let maxDD = 0;
  let peak = 0;
  let equity = 0;

  trades.forEach((t) => {
    equity += t.net_pnl || 0;
    if (equity > peak) peak = equity;
    const dd = peak - equity;
    if (dd > maxDD) maxDD = dd;
  });

  const ddPct = equity > 0 ? (maxDD / Math.max(1, equity + 10000)) * 100 : 0;

  return {
    challengeId: "loss-recovery",
    progress: ddPct < 3 ? 100 : Math.max(0, Math.round((1 - ddPct / 3) * 100)),
    current: Math.round(ddPct * 10) / 10,
    target: 3,
    passed: ddPct < 3 && trades.length >= 10,
    active: true,
    startedAt: null,
    completedAt: null,
    details: [
      `Max drawdown: ${ddPct.toFixed(1)}%`,
      ddPct < 3 ? "Drawdown within acceptable range" : "Need to recover from drawdown",
    ],
  };
}

function computeProfitableWeek(trades: Trade[]): ChallengeProgress {
  const dailyPnl = new Map<string, number>();
  trades.forEach((t) => {
    const day = t.entry_time.split("T")[0];
    dailyPnl.set(day, (dailyPnl.get(day) || 0) + (t.net_pnl || 0));
  });

  let consecutiveGreen = 0;
  let maxStreak = 0;
  const details: string[] = [];

  const sortedDays = Array.from(dailyPnl.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  for (const [day, pnl] of sortedDays) {
    if (pnl > 0) {
      consecutiveGreen++;
      maxStreak = Math.max(maxStreak, consecutiveGreen);
      details.push(`✅ ${day}: +$${pnl.toFixed(0)}`);
    } else {
      consecutiveGreen = 0;
      details.push(`❌ ${day}: $${pnl.toFixed(0)}`);
    }
  }

  return {
    challengeId: "profitable-week",
    progress: Math.min(100, Math.round((maxStreak / 5) * 100)),
    current: maxStreak,
    target: 5,
    passed: maxStreak >= 5,
    active: true,
    startedAt: null,
    completedAt: maxStreak >= 5 ? new Date().toISOString() : null,
    details: details.slice(-10),
  };
}
