"use client";

import { useEffect, useState, useMemo } from "react";
import { calculateTraderScorecard, calculateRiskStats } from "@/lib/calculations";
import { ScoreRing } from "@/components/scorecard/score-ring";
import { ScoreBreakdown } from "@/components/scorecard/score-breakdown";
import { WeaknessPanel } from "@/components/scorecard/weakness-panel";
import Link from "next/link";
import { Shield, Lock, ArrowUpRight } from "lucide-react";
import type { Trade } from "@/types";
import { PremiumGate } from "@/components/premium";

function SkeletonLine({ width }: { width: string }) {
  return <div className={`h-3 rounded ${width}`} style={{ background: "var(--border-subtle)" }} />;
}

function SkeletonRing() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-[180px] w-[180px] rounded-full" style={{ background: "var(--surface-raised)" }} />
      <div className="h-4 w-28 rounded" style={{ background: "var(--surface-raised)" }} />
    </div>
  );
}

function SkeletonBars() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <SkeletonLine width="w-28" />
            <SkeletonLine width="w-10" />
          </div>
          <div className="h-2 w-full rounded-full" style={{ background: "var(--border-subtle)" }} />
        </div>
      ))}
    </div>
  );
}

export default function ScorecardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchTrades() {
      try {
        const res = await fetch("/api/trades");
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) setTrades(data);
      } catch (err) {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : "Failed to load trades");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchTrades();
    return () => { cancelled = true; };
  }, []);

  const closed = useMemo(() => trades.filter((t) => t.net_pnl !== null), [trades]);
  const scorecard = useMemo(() => closed.length >= 10 ? calculateTraderScorecard(closed) : null, [closed]);
  const riskStats = useMemo(() => closed.length > 0 ? calculateRiskStats(closed) : null, [closed]);

  if (loading) {
    return (
      <PremiumGate>
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="h-7 w-36 rounded" style={{ background: "var(--surface-raised)" }} />
            <div className="h-4 w-52 rounded" style={{ background: "var(--surface-raised)" }} />
          </div>
          <div className="rounded-xl border p-6" style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
              <SkeletonRing />
              <div className="flex-1 w-full">
                <SkeletonLine width="w-32" />
                <div className="mt-4">
                  <SkeletonBars />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-32 rounded-xl border" style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }} />
            <div className="h-32 rounded-xl border" style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }} />
          </div>
        </div>
      </PremiumGate>
    );
  }

  if (fetchError) {
    return (
      <PremiumGate>
        <div className="flex items-center justify-center h-64">
          <div style={{ color: "var(--color-loss)" }}>{fetchError}</div>
        </div>
      </PremiumGate>
    );
  }

  if (closed.length === 0) {
    return (
      <PremiumGate>
        <div className="py-12 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h2 className="mb-2 text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
            No Trade Data
          </h2>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            Add or import trades to unlock your scorecard.
          </p>
        </div>
      </PremiumGate>
    );
  }

  if (closed.length < 10) {
    return (
      <PremiumGate>
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
              Trader Scorecard
            </h1>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              Premium performance analysis
            </p>
          </div>
          <div className="rounded-xl border p-8 text-center" style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "rgba(251, 191, 36, 0.1)" }}>
                <Lock className="h-7 w-7" style={{ color: "var(--color-warning)" }} />
              </div>
            </div>
            <div className="text-[14px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Scorecard Locked
            </div>
            <div className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>
              Add at least 10 closed trades to unlock your premium scorecard.
            </div>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5" style={{ background: "var(--surface-raised)" }}>
              <span className="text-[11px] font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--color-warning)" }}>
                {closed.length}
              </span>
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>/ 10 trades</span>
              <div className="h-1.5 w-16 rounded-full" style={{ background: "var(--border-subtle)" }}>
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${(closed.length / 10) * 100}%`, background: "var(--color-warning)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </PremiumGate>
    );
  }

  if (!scorecard) {
    return (
      <PremiumGate>
        <div className="py-12 text-center" style={{ color: "var(--text-muted)" }}>
          Unable to compute scorecard.
        </div>
      </PremiumGate>
    );
  }

  const scoreData = [
    {
      label: "Risk Management",
      score: scorecard.riskManagement,
      description: scorecard.pillarDetails.riskManagement,
      trend: scorecard.trends.riskManagement,
    },
    {
      label: "Execution",
      score: scorecard.execution,
      description: scorecard.pillarDetails.execution,
      trend: scorecard.trends.execution,
    },
    {
      label: "Consistency",
      score: scorecard.consistency,
      description: scorecard.pillarDetails.consistency,
      trend: scorecard.trends.consistency,
    },
    {
      label: "Patience",
      score: scorecard.patience,
      description: scorecard.pillarDetails.patience,
      trend: scorecard.trends.patience,
    },
    {
      label: "Psychology",
      score: scorecard.psychology,
      description: scorecard.pillarDetails.psychology,
      trend: scorecard.trends.psychology,
    },
    {
      label: "Discipline",
      score: scorecard.discipline,
      description: scorecard.pillarDetails.discipline,
      trend: scorecard.trends.discipline,
    },
  ];

  const sortedPillars = [...scoreData].sort((a, b) => a.score - b.score);
  const weaknesses = scorecard.weaknesses;
  const strengths = sortedPillars.slice(-2).map((p) => ({
    pillar: p.label.toLowerCase().replace(/\s+/g, ""),
    label: p.label,
    score: p.score,
    tip: "",
  }));

  return (
    <PremiumGate>
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
            Trader Scorecard
          </h1>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            Premium performance analysis — {closed.length} trades evaluated
          </p>
        </div>
        <span className="premium-badge">Premium</span>
      </div>

      {/* Main scorecard */}
      <div
        className="card-premium rounded-xl p-6"
        style={{ background: "var(--surface-card)" }}
      >
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <ScoreRing score={scorecard.overall} label="Overall Score" grade={scorecard.overallGrade} />

          <div className="flex-1 w-full">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" style={{ color: "var(--color-ai)" }} />
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Score Breakdown
              </span>
              <Link
                href="/dashboard"
                className="ml-auto flex items-center gap-1 text-[10px] font-medium transition-opacity hover:opacity-80"
                style={{ color: "var(--text-muted)" }}
              >
                Trader IQ on Dashboard
                <ArrowUpRight className="h-2.5 w-2.5" />
              </Link>
            </div>
            <ScoreBreakdown scores={scoreData} />
          </div>
        </div>
      </div>

      {/* Weaknesses + Strengths */}
      <div className="rounded-xl border p-5" style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Improvement Areas
          </span>
        </div>
        <WeaknessPanel weaknesses={weaknesses} strengths={strengths} />
      </div>

      {/* Detailed analysis */}
      <div className="rounded-xl border p-5" style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            What Each Score Measures
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg p-3" style={{ background: "var(--surface-raised)" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[12px] font-semibold" style={{ color: "var(--color-profit)" }}>
                Risk Management
              </div>
              <span className="text-[11px] font-bold font-[var(--font-jetbrains)]" style={{ color: "var(--text-secondary)" }}>
                {scorecard.riskManagement}
              </span>
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Stop loss usage, position sizing consistency, and risk per trade appropriateness. Weight: 25% of overall.
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--surface-raised)" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[12px] font-semibold" style={{ color: "var(--color-ai)" }}>
                Execution
              </div>
              <span className="text-[11px] font-bold font-[var(--font-jetbrains)]" style={{ color: "var(--text-secondary)" }}>
                {scorecard.execution}
              </span>
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Average R:R achieved, win rate, and plan adherence. Measures your ability to let winners run. Weight: 20%.
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--surface-raised)" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[12px] font-semibold" style={{ color: "var(--color-warning)" }}>
                Consistency
              </div>
              <span className="text-[11px] font-bold font-[var(--font-jetbrains)]" style={{ color: "var(--text-secondary)" }}>
                {scorecard.consistency}
              </span>
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Plan adherence, lot size consistency, and daily trade variance. Higher scores mean fewer deviations. Weight: 15%.
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--surface-raised)" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[12px] font-semibold" style={{ color: "var(--color-info)" }}>
                Patience
              </div>
              <span className="text-[11px] font-bold font-[var(--font-jetbrains)]" style={{ color: "var(--text-secondary)" }}>
                {scorecard.patience}
              </span>
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Trades per day and session focus. Fewer, higher-quality setups earn better scores. Weight: 15%.
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--surface-raised)" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[12px] font-semibold" style={{ color: "var(--color-ai)" }}>
                Psychology
              </div>
              <span className="text-[11px] font-bold font-[var(--font-jetbrains)]" style={{ color: "var(--text-secondary)" }}>
                {scorecard.psychology}
              </span>
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Emotion tagging rate and calm vs emotional performance. Self-awareness reduces costly mistakes. Weight: 15%.
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: "var(--surface-raised)" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[12px] font-semibold" style={{ color: "var(--color-profit)" }}>
                Discipline
              </div>
              <span className="text-[11px] font-bold font-[var(--font-jetbrains)]" style={{ color: "var(--text-secondary)" }}>
                {scorecard.discipline}
              </span>
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Plan adherence, mistakes tracking, and overtrading avoidance. Discipline compounds over time. Weight: 10%.
            </div>
          </div>
        </div>
      </div>
    </div>
    </PremiumGate>
  );
}
