"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { calculateTraderScorecard, calculateRiskStats, calculateBehaviourFlags } from "@/lib/calculations";
import { ScoreRing } from "@/components/scorecard/score-ring";
import { ScoreBreakdown } from "@/components/scorecard/score-breakdown";
import type { Trade } from "@/types";

export default function ScorecardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTrades() {
      const { data } = await supabase
        .from("trades")
        .select("*")
        .order("entry_time", { ascending: false });

      if (data) setTrades(data);
      setLoading(false);
    }

    fetchTrades();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: "var(--text-muted)" }}>Loading scorecard...</div>
      </div>
    );
  }

  const closed = trades.filter((t) => t.net_pnl !== null);

  if (closed.length < 10) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>Trader Scorecard</h1>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            Your discipline and execution scores
          </p>
        </div>
        <div
          className="rounded-lg border p-12 text-center"
          style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
        >
          <div className="text-[14px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Not enough data
          </div>
          <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            Add at least 10 trades to unlock your scorecard.
          </div>
        </div>
      </div>
    );
  }

  const scorecard = calculateTraderScorecard(closed);
  const riskStats = calculateRiskStats(closed);
  const flags = calculateBehaviourFlags(closed);

  if (!scorecard) {
    return (
      <div className="py-12 text-center" style={{ color: "var(--text-muted)" }}>
        Unable to compute scorecard.
      </div>
    );
  }

  const planFlag = flags.find((f) => f.id === "plan");
  const avgTradesPerDay = closed.length / Math.max(1,
    (new Date(closed[closed.length - 1].entry_time).getTime() -
      new Date(closed[0].entry_time).getTime()) / (1000 * 60 * 60 * 24)
  );

  const scoreData = [
    {
      label: "Risk Management",
      score: scorecard.riskManagement,
      description: `Stop loss used on ${riskStats.stopLossPct.toFixed(0)}% of trades. Position sizing consistency: ${riskStats.riskConsistency.toFixed(0)}%.`,
    },
    {
      label: "Execution",
      score: scorecard.execution,
      description: `Average R:R achieved reflects your ability to let winners run and cut losses short.`,
    },
    {
      label: "Consistency",
      score: scorecard.consistency,
      description: `Plan adherence: ${planFlag?.status === "ok" ? "Strong" : "Needs work"}. You follow your trading plan ${closed.filter((t) => t.followed_plan).length} of ${closed.length} times.`,
    },
    {
      label: "Patience",
      score: scorecard.patience,
      description: `Average ${avgTradesPerDay.toFixed(1)} trades per day. ${avgTradesPerDay <= 6 ? "Within healthy range." : "Consider reducing frequency."}`,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>Trader Scorecard</h1>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
          Your discipline and execution scores
        </p>
      </div>

      <div
        className="rounded-lg border p-6"
        style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
      >
        <div className="flex flex-col items-center md:flex-row md:items-start md:gap-10">
          <ScoreRing score={scorecard.overall} label="Overall Score" />

          <div className="flex-1 mt-6 md:mt-0 w-full">
            <div className="mb-4 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Score Breakdown
            </div>
            <ScoreBreakdown scores={scoreData} />
          </div>
        </div>
      </div>

      <div
        className="rounded-lg border p-5"
        style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
      >
        <div className="mb-4 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          What Each Score Measures
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg p-3" style={{ background: "var(--surface-raised)" }}>
            <div className="text-[12px] font-semibold mb-1" style={{ color: "var(--color-profit)" }}>
              Risk Management
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Measures your stop loss usage rate, position sizing consistency, and overall risk control. Higher scores indicate disciplined risk management.
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--surface-raised)" }}>
            <div className="text-[12px] font-semibold mb-1" style={{ color: "var(--color-ai)" }}>
              Execution
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Based on your average R:R achieved. Reflects your ability to let winners run and cut losers short according to your plan.
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--surface-raised)" }}>
            <div className="text-[12px] font-semibold mb-1" style={{ color: "var(--color-warning)" }}>
              Consistency
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Measures how closely you follow your trading plan. Higher scores mean fewer impulsive or emotional trades.
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--surface-raised)" }}>
            <div className="text-[12px] font-semibold mb-1" style={{ color: "var(--color-info)" }}>
              Patience
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Based on your average trades per day. Lower frequency with higher quality setups leads to better scores.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
