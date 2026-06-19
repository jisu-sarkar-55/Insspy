import type { Trade, Challenge, ChallengeProgress } from "@/types";

export const CHALLENGES: Challenge[] = [
  {
    id: "no-overtrading",
    title: "No Overtrading",
    description: "Keep your daily trade count at 6 or fewer for 5 consecutive trading days.",
    icon: "🎯",
    targetValue: 5,
    unit: "days",
    duration: "5 consecutive days",
    rule: "≤6 trades per day",
    difficulty: "medium",
    category: "discipline",
  },
  {
    id: "20-trade-discipline",
    title: "20 Trade Discipline",
    description: "Complete 20 trades while following your trading plan every time.",
    icon: "🏆",
    targetValue: 20,
    unit: "trades",
    duration: "Until 20 trades completed",
    rule: "100% plan adherence",
    difficulty: "medium",
    category: "discipline",
  },
  {
    id: "risk-consistency",
    title: "Risk Consistency",
    description: "Keep risk per trade within 0.5%-2% for 10 consecutive trades.",
    icon: "🛡️",
    targetValue: 10,
    unit: "trades",
    duration: "10 consecutive trades",
    rule: "Risk 0.5%-2%",
    difficulty: "medium",
    category: "risk",
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
    difficulty: "hard",
    category: "performance",
  },
  {
    id: "loss-recovery",
    title: "Loss Recovery",
    description: "Recover from a drawdown of 3% or more within the next 10 trades.",
    icon: "💪",
    targetValue: 10,
    unit: "trades",
    duration: "10 trades after drawdown",
    rule: "Recover from >3% drawdown",
    difficulty: "hard",
    category: "risk",
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
    difficulty: "hard",
    category: "performance",
  },
  {
    id: "profit-target",
    title: "Profit Target",
    description: "Reach $500 in net profit across closed trades.",
    icon: "💰",
    targetValue: 500,
    unit: "USD",
    duration: "Until $500 profit",
    rule: "Net profit ≥ $500",
    difficulty: "medium",
    category: "performance",
  },
  {
    id: "scalper-edge",
    title: "Scalper's Edge",
    description: "Complete 10 scalp trades (<1h duration) with a 60%+ win rate.",
    icon: "⚡",
    targetValue: 10,
    unit: "scalps",
    duration: "Until 10 scalps completed",
    rule: "10 scalps @ ≥60% WR",
    difficulty: "hard",
    category: "performance",
  },
  {
    id: "emotion-tagging",
    title: "Emotion Tracker",
    description: "Tag your emotions (fear/confidence/greed) on 15 consecutive trades.",
    icon: "🧠",
    targetValue: 15,
    unit: "trades",
    duration: "15 consecutive trades",
    rule: "Tag emotions each trade",
    difficulty: "easy",
    category: "psychology",
  },
  {
    id: "diversification",
    title: "Diversification",
    description: "Trade at least 5 different symbols over your trading history.",
    icon: "🌐",
    targetValue: 5,
    unit: "symbols",
    duration: "Until 5 symbols traded",
    rule: "Trade 5+ different symbols",
    difficulty: "easy",
    category: "diversification",
  },
  {
    id: "no-revenge",
    title: "No Revenge Trading",
    description: "Go 20 trades without taking a trade within 30 minutes of a loss.",
    icon: "🧘",
    targetValue: 20,
    unit: "trades",
    duration: "20 consecutive trades",
    rule: "No trade <30min after loss",
    difficulty: "hard",
    category: "psychology",
  },
  {
    id: "perfect-week",
    title: "Perfect Week",
    description: "Achieve a 100% win rate in a single week (minimum 5 trades).",
    icon: "💎",
    targetValue: 5,
    unit: "trades",
    duration: "1 trading week",
    rule: "100% WR, ≥5 trades",
    difficulty: "hard",
    category: "performance",
  },
  {
    id: "consistent-sizing",
    title: "Consistent Sizing",
    description: "Use the same lot size (±0.01) for 15 consecutive trades.",
    icon: "📏",
    targetValue: 15,
    unit: "trades",
    duration: "15 consecutive trades",
    rule: "Same lot size ±0.01",
    difficulty: "easy",
    category: "risk",
  },
  {
    id: "session-focus",
    title: "Session Focus",
    description: "Only trade during London or New York sessions for 10 trades.",
    icon: "🌍",
    targetValue: 10,
    unit: "trades",
    duration: "10 consecutive trades",
    rule: "London/NY only",
    difficulty: "easy",
    category: "discipline",
  },
  {
    id: "max-drawdown-limit",
    title: "Max Drawdown Limit",
    description: "Keep your maximum drawdown under 5% over 20 closed trades.",
    icon: "⛑️",
    targetValue: 20,
    unit: "trades",
    duration: "Over 20 trades",
    rule: "Max DD < 5%",
    difficulty: "medium",
    category: "risk",
  },
];

function getHour(dateStr: string): number {
  return new Date(dateStr).getUTCHours();
}

function getSessionLabel(hour: number): string {
  if (hour >= 8 && hour < 13) return "London";
  if (hour >= 13 && hour < 21) return "New York";
  if (hour >= 0 && hour < 8) return "Asia";
  return "Off-hours";
}

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
    case "profit-target":
      return computeProfitTarget(closed);
    case "scalper-edge":
      return computeScalperEdge(closed);
    case "emotion-tagging":
      return computeEmotionTagging(relevantTrades);
    case "diversification":
      return computeDiversification(closed);
    case "no-revenge":
      return computeNoRevenge(closed);
    case "perfect-week":
      return computePerfectWeek(closed);
    case "consistent-sizing":
      return computeConsistentSizing(relevantTrades);
    case "session-focus":
      return computeSessionFocus(relevantTrades);
    case "max-drawdown-limit":
      return computeMaxDrawdownLimit(closed);
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

  let currentStreak = 0;
  let maxStreak = 0;
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
    maxStreak = Math.max(maxStreak, currentStreak);
  }

  return {
    challengeId: "no-overtrading",
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

function compute20TradeDiscipline(trades: Trade[]): ChallengeProgress {
  const planAdhered = trades.filter((t) => t.followed_plan === true).length;

  const details: string[] = [];
  if (trades.length > 0) {
    details.push(`${planAdhered} of ${trades.length} trades followed plan`);
    details.push(`Plan adherence: ${Math.round((planAdhered / trades.length) * 100)}%`);
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

  const withinRange = withSL.filter((t) => {
    const risk = Math.abs(((t.entry_price - t.stop_loss!) / t.entry_price) * 100);
    return risk >= 0.5 && risk <= 2.0;
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
      `${withinRange.length} of ${withSL.length} trades within 0.5%-2% risk`,
      `Best streak: ${maxStreak} consecutive`,
    ],
  };
}

function computeWinStreak(trades: Trade[]): ChallengeProgress {
  let currentStreak = 0;
  for (let i = trades.length - 1; i >= 0; i--) {
    if (trades[i].net_pnl! > 0) currentStreak++;
    else break;
  }

  let bestStreak = 0;
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
    progress: Math.min(100, Math.round((bestStreak / 5) * 100)),
    current: bestStreak,
    target: 5,
    passed: bestStreak >= 5,
    active: true,
    startedAt: null,
    completedAt: bestStreak >= 5 ? new Date().toISOString() : null,
    details: [
      `Current win streak: ${currentStreak}`,
      `Personal best: ${bestStreak}`,
    ],
  };
}

function computeLossRecovery(trades: Trade[]): ChallengeProgress {
  const STARTING_BALANCE = 10000;
  let equity = STARTING_BALANCE;
  let peak = STARTING_BALANCE;
  let maxDD = 0;

  trades.forEach((t) => {
    equity += t.net_pnl || 0;
    if (equity > peak) peak = equity;
    const dd = peak - equity;
    if (dd > maxDD) maxDD = dd;
  });

  const ddPct = (maxDD / STARTING_BALANCE) * 100;
  const recovered = ddPct < 3;

  return {
    challengeId: "loss-recovery",
    progress: recovered ? 100 : Math.min(90, Math.round(ddPct * 10)),
    current: Math.round(ddPct * 10) / 10,
    target: 3,
    passed: ddPct < 3 && trades.length >= 10,
    active: true,
    startedAt: null,
    completedAt: ddPct < 3 && trades.length >= 10 ? new Date().toISOString() : null,
    details: [
      `Max drawdown: ${ddPct.toFixed(1)}%`,
      recovered ? "Drawdown within acceptable range ✅" : "Drawdown exceeds 3% — keep recovering",
    ],
  };
}

function computeProfitableWeek(trades: Trade[]): ChallengeProgress {
  const dailyPnl = new Map<string, number>();
  trades.forEach((t) => {
    const day = t.entry_time.split("T")[0];
    dailyPnl.set(day, (dailyPnl.get(day) || 0) + (t.net_pnl || 0));
  });

  let currentStreak = 0;
  let maxStreak = 0;
  const details: string[] = [];

  const sortedDays = Array.from(dailyPnl.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  for (const [day, pnl] of sortedDays) {
    if (pnl > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
      details.push(`✅ ${day}: +$${pnl.toFixed(0)}`);
    } else {
      currentStreak = 0;
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

function computeProfitTarget(trades: Trade[]): ChallengeProgress {
  const totalPnl = trades.reduce((s, t) => s + (t.net_pnl || 0), 0);

  return {
    challengeId: "profit-target",
    progress: Math.min(100, Math.round((Math.max(0, totalPnl) / 500) * 100)),
    current: Math.round(Math.max(0, totalPnl)),
    target: 500,
    passed: totalPnl >= 500,
    active: true,
    startedAt: null,
    completedAt: totalPnl >= 500 ? new Date().toISOString() : null,
    details: [
      `Current net P&L: $${totalPnl.toFixed(0)}`,
      totalPnl >= 500 ? "Target reached! 🎉" : `$${Math.round(500 - totalPnl)} more to go`,
    ],
  };
}

function computeScalperEdge(trades: Trade[]): ChallengeProgress {
  const withDuration = trades.filter((t) => t.exit_time);
  const scalps = withDuration.filter((t) => {
    const dur = new Date(t.exit_time!).getTime() - new Date(t.entry_time).getTime();
    return dur < 60 * 60 * 1000;
  });

  const scalpWins = scalps.filter((t) => t.net_pnl! > 0);
  const winRate = scalps.length > 0 ? (scalpWins.length / scalps.length) * 100 : 0;
  const meetsWR = winRate >= 60;
  const qualifying = meetsWR ? scalps.length : 0;

  return {
    challengeId: "scalper-edge",
    progress: Math.min(100, Math.round((Math.min(qualifying, 10) / 10) * 100)),
    current: Math.min(qualifying, 10),
    target: 10,
    passed: qualifying >= 10 && meetsWR,
    active: true,
    startedAt: null,
    completedAt: qualifying >= 10 && meetsWR ? new Date().toISOString() : null,
    details: [
      `${scalps.length} scalps, ${scalpWins.length} wins (${winRate.toFixed(0)}% WR)`,
      meetsWR ? "Win rate requirement met ✅" : "Need 60%+ win rate on scalps",
      scalps.length < 10 ? `${10 - scalps.length} more scalps needed` : "Scalp count target met!",
    ],
  };
}

function computeEmotionTagging(trades: Trade[]): ChallengeProgress {
  let currentStreak = 0;
  let maxStreak = 0;

  for (const t of trades) {
    const hasEmotion = t.fear_level !== null || t.greed_level !== null || t.confidence_before !== null;
    if (hasEmotion) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return {
    challengeId: "emotion-tagging",
    progress: Math.min(100, Math.round((maxStreak / 15) * 100)),
    current: maxStreak,
    target: 15,
    passed: maxStreak >= 15,
    active: true,
    startedAt: null,
    completedAt: maxStreak >= 15 ? new Date().toISOString() : null,
    details: [
      `Best consecutive streak: ${maxStreak} trades with emotions tagged`,
      maxStreak >= 15 ? "Excellent journaling habit! 🧠" : `${15 - maxStreak} more to go`,
    ],
  };
}

function computeDiversification(trades: Trade[]): ChallengeProgress {
  const symbols = new Set(trades.map((t) => t.symbol));
  const count = symbols.size;

  return {
    challengeId: "diversification",
    progress: Math.min(100, Math.round((count / 5) * 100)),
    current: count,
    target: 5,
    passed: count >= 5,
    active: true,
    startedAt: null,
    completedAt: count >= 5 ? new Date().toISOString() : null,
    details: [
      `Traded symbols: ${Array.from(symbols).join(", ")}`,
      count >= 5 ? "Great diversification! 🌐" : `Trade ${5 - count} more symbols`,
    ],
  };
}

function computeNoRevenge(trades: Trade[]): ChallengeProgress {
  let consecutiveClean = 0;
  let maxStreak = 0;

  for (let i = 0; i < trades.length; i++) {
    const isLoss = (trades[i].net_pnl ?? 0) < 0;
    if (isLoss && i + 1 < trades.length) {
      const nextTime = new Date(trades[i + 1].entry_time).getTime();
      const thisTime = new Date(trades[i].entry_time).getTime();
      const diffMin = (nextTime - thisTime) / (1000 * 60);
      if (diffMin < 30) {
        consecutiveClean = 0;
        continue;
      }
    }
    consecutiveClean++;
    maxStreak = Math.max(maxStreak, consecutiveClean);
  }

  return {
    challengeId: "no-revenge",
    progress: Math.min(100, Math.round((maxStreak / 20) * 100)),
    current: maxStreak,
    target: 20,
    passed: maxStreak >= 20,
    active: true,
    startedAt: null,
    completedAt: maxStreak >= 20 ? new Date().toISOString() : null,
    details: [
      `Clean streak: ${maxStreak} trades without revenge`,
      maxStreak >= 20 ? "Master of emotional control 🧘" : `${20 - maxStreak} more clean trades needed`,
    ],
  };
}

function computePerfectWeek(trades: Trade[]): ChallengeProgress {
  const dailyPnl = new Map<string, number[]>();
  trades.forEach((t) => {
    const day = t.entry_time.split("T")[0];
    if (!dailyPnl.has(day)) dailyPnl.set(day, []);
    dailyPnl.get(day)!.push(t.net_pnl ?? 0);
  });

  const sortedDays = Array.from(dailyPnl.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  let bestPerfectDays = 0;
  let currentPerfect = 0;
  let daysInWeek = 0;
  let currentWeekStart = sortedDays[0]?.[0] ?? "";

  for (const [day, pnls] of sortedDays) {
    const dayOfWeek = new Date(day).getUTCDay();
    const monday = dayOfWeek === 1;
    if (monday || daysInWeek === 0) {
      currentPerfect = 0;
      daysInWeek = 0;
      currentWeekStart = day;
    }
    daysInWeek++;
    const allWins = pnls.every((p) => p > 0);
    if (allWins && pnls.length >= 1) currentPerfect++;
    if (daysInWeek >= 5) {
      if (currentPerfect >= 5) bestPerfectDays = Math.max(bestPerfectDays, currentPerfect);
      currentPerfect = 0;
      daysInWeek = 0;
    }
  }

  const recentWeekDays = Array.from(dailyPnl.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 5)
    .filter(([_, pnls]) => pnls.every((p) => p > 0)).length;

  return {
    challengeId: "perfect-week",
    progress: Math.min(100, Math.round((recentWeekDays / 5) * 100)),
    current: recentWeekDays,
    target: 5,
    passed: bestPerfectDays >= 5,
    active: true,
    startedAt: null,
    completedAt: bestPerfectDays >= 5 ? new Date().toISOString() : null,
    details: [
      `Best perfect week: ${bestPerfectDays} green days`,
      bestPerfectDays >= 5 ? "Perfect week achieved! 💎" : "Keep every day green for a full week",
    ],
  };
}

function computeConsistentSizing(trades: Trade[]): ChallengeProgress {
  let maxStreak = 0;
  let currentStreak = 0;
  let prevLot = trades[0]?.lot_size ?? -1;

  for (const t of trades) {
    if (Math.abs(t.lot_size - prevLot) <= 0.01) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
      prevLot = t.lot_size;
    }
  }

  return {
    challengeId: "consistent-sizing",
    progress: Math.min(100, Math.round((maxStreak / 15) * 100)),
    current: maxStreak,
    target: 15,
    passed: maxStreak >= 15,
    active: true,
    startedAt: null,
    completedAt: maxStreak >= 15 ? new Date().toISOString() : null,
    details: [
      `Best streak: ${maxStreak} trades with same lot size`,
      maxStreak >= 15 ? "Perfect consistency! 📏" : `${15 - maxStreak} more consistent trades needed`,
    ],
  };
}

function computeSessionFocus(trades: Trade[]): ChallengeProgress {
  let currentStreak = 0;
  let maxStreak = 0;

  for (const t of trades) {
    const hour = getHour(t.entry_time);
    const session = getSessionLabel(hour);
    if (session === "London" || session === "New York") {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  const sessionsUsed = new Set(trades.map((t) => getSessionLabel(getHour(t.entry_time))));

  return {
    challengeId: "session-focus",
    progress: Math.min(100, Math.round((maxStreak / 10) * 100)),
    current: maxStreak,
    target: 10,
    passed: maxStreak >= 10,
    active: true,
    startedAt: null,
    completedAt: maxStreak >= 10 ? new Date().toISOString() : null,
    details: [
      `Best streak: ${maxStreak} London/NY trades`,
      `Sessions used: ${Array.from(sessionsUsed).filter((s) => s !== "Off-hours").join(", ") || "None"}`,
      maxStreak >= 10 ? "Session discipline mastered! 🌍" : `${10 - maxStreak} more focused trades`,
    ],
  };
}

function computeMaxDrawdownLimit(trades: Trade[]): ChallengeProgress {
  const STARTING_BALANCE = 10000;
  let equity = STARTING_BALANCE;
  let peak = STARTING_BALANCE;
  let maxDD = 0;

  trades.forEach((t) => {
    equity += t.net_pnl || 0;
    if (equity > peak) peak = equity;
    const dd = peak - equity;
    if (dd > maxDD) maxDD = dd;
  });

  const ddPct = (maxDD / STARTING_BALANCE) * 100;

  return {
    challengeId: "max-drawdown-limit",
    progress: Math.min(100, Math.round((1 - ddPct / 5) * 100)),
    current: Math.round(ddPct * 10) / 10,
    target: 5,
    passed: ddPct < 5 && trades.length >= 20,
    active: true,
    startedAt: null,
    completedAt: ddPct < 5 && trades.length >= 20 ? new Date().toISOString() : null,
    details: [
      `Max drawdown: ${ddPct.toFixed(1)}%`,
      ddPct < 5 ? "Drawdown within limit ✅" : "Reduce drawdown below 5%",
      trades.length < 20 ? `${20 - trades.length} more trades required` : undefined,
    ].filter(Boolean) as string[],
  };
}
