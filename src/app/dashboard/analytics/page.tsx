"use client";

import { useEffect, useState } from "react";
import { EquityCurveChart } from "@/components/charts/equity-curve";
import { SessionPerformance } from "@/components/dashboard/session-performance";
import { SetupPerformance } from "@/components/dashboard/setup-performance";
import { PnlHeatmap } from "@/components/dashboard/pnl-heatmap";
import { EmotionTracker } from "@/components/dashboard/emotion-tracker";
import { AiCoachingPanel } from "@/components/dashboard/ai-coaching-panel";
import { AnalyticsKPICards } from "@/components/analytics/analytics-kpi-cards";
import { DrawdownChart } from "@/components/analytics/drawdown-chart";
import { PnlHistogram } from "@/components/analytics/pnl-histogram";
import { SymbolTable } from "@/components/analytics/symbol-table";
import { DayOfWeekChart } from "@/components/analytics/day-of-week-chart";
import { HourHeatmap } from "@/components/analytics/hour-heatmap";
import { TradeDurationChart } from "@/components/analytics/trade-duration-chart";
import { RiskStatsCard } from "@/components/analytics/risk-stats-card";

import {
  calculateAnalyticsKPIs,
  calculateDrawdownAnalysis,
  calculateEquityCurve,
  calculatePnlHistogram,
  calculateSymbolStats,
  calculateSessionStats,
  calculateDayOfWeekStats,
  calculateHourHeatmap,
  calculateTradeDurations,
  calculateRiskStats,
  calculateStrategyStats,
  calculateHeatmapData,
  calculateEmotionStats,
  calculateBestHours,
  calculateAiCoaching,
} from "@/lib/calculations";
import type { Trade } from "@/types";

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`card-surface rounded-lg border p-4 ${className || ""}`}
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, var(--border-subtle), transparent)" }} />
      <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, var(--border-subtle))" }} />
    </div>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`rounded-lg ${className || ""}`} style={{ background: "var(--surface-raised)" }}>
      <div className="animate-pulse space-y-3 p-4">
        <div className="h-3 w-1/3 rounded" style={{ background: "var(--border-subtle)" }} />
        <div className="h-32 w-full rounded" style={{ background: "var(--border-subtle)" }} />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-32 rounded" style={{ background: "var(--surface-raised)" }} />
          <div className="mt-1 h-4 w-48 rounded" style={{ background: "var(--surface-raised)" }} />
        </div>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg p-3" style={{ background: "var(--surface-raised)" }}>
              <div className="animate-pulse space-y-2">
                <div className="h-3 w-16 rounded" style={{ background: "var(--border-subtle)" }} />
                <div className="h-6 w-20 rounded" style={{ background: "var(--border-subtle)" }} />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SkeletonBlock />
          <SkeletonBlock />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SkeletonBlock />
          <SkeletonBlock />
          <SkeletonBlock />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SkeletonBlock />
          <SkeletonBlock />
          <SkeletonBlock />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SkeletonBlock />
          <SkeletonBlock />
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: "var(--color-loss)" }}>{fetchError}</div>
      </div>
    );
  }

  const STARTING_BALANCE = 10000;
  const closed = trades.filter((t) => t.net_pnl !== null);

  if (closed.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-2 text-2xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
          No Trade Data
        </h2>
        <p style={{ color: "var(--text-muted)" }}>
          Add or import trades to see your analytics.
        </p>
      </div>
    );
  }

  const kpis = calculateAnalyticsKPIs(closed);
  const drawdown = calculateDrawdownAnalysis(closed, STARTING_BALANCE);
  const equityCurve = calculateEquityCurve(closed, STARTING_BALANCE);
  const histogram = calculatePnlHistogram(closed);
  const symbolStats = calculateSymbolStats(closed);
  const sessionStats = calculateSessionStats(closed);
  const dayStats = calculateDayOfWeekStats(closed);
  const hourHeatmap = calculateHourHeatmap(closed);
  const durations = calculateTradeDurations(closed);
  const riskStats = calculateRiskStats(closed);
  const strategyStats = calculateStrategyStats(closed);

  const now = new Date();
  const heatmapDays = calculateHeatmapData(closed, now.getUTCFullYear(), now.getUTCMonth());
  const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });

  const emotions = calculateEmotionStats(closed);
  const bestHours = calculateBestHours(closed);
  const aiInsights = calculateAiCoaching(closed);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
          Analytics
        </h1>
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          Deep dive into your trading performance
        </p>
      </div>

      {/* ── Overview ── */}
      <SectionLabel label="Overview" />
      <AnalyticsKPICards data={kpis} />

      {/* ── Equity & Risk ── */}
      <SectionLabel label="Equity & Risk" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Section title="Equity curve">
          <EquityCurveChart data={equityCurve} startingBalance={STARTING_BALANCE} />
        </Section>
        <Section title="Drawdown analysis">
          <DrawdownChart data={drawdown} />
        </Section>
      </div>

      {/* ── Performance Breakdown ── */}
      <SectionLabel label="Performance Breakdown" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Section title="Symbol performance">
          <SymbolTable data={symbolStats} />
        </Section>
        <Section title="Session performance">
          <SessionPerformance sessions={sessionStats} />
        </Section>
        <Section title="Day of week">
          <DayOfWeekChart data={dayStats} />
        </Section>
      </div>

      {/* ── Distribution Analysis ── */}
      <SectionLabel label="Distribution Analysis" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Section title="Hour of day heatmap">
          <HourHeatmap data={hourHeatmap} />
        </Section>
        <Section title="P&L distribution">
          <PnlHistogram data={histogram} />
        </Section>
        <Section title="Trade duration analysis">
          <TradeDurationChart data={durations} />
        </Section>
      </div>

      {/* ── Strategy & Risk ── */}
      <SectionLabel label="Strategy & Risk" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Section title="Setup performance">
          <SetupPerformance strategies={strategyStats} />
        </Section>
        <Section title="Risk analytics">
          <RiskStatsCard data={riskStats} />
        </Section>
      </div>

      {/* ── Psychology & Calendar ── */}
      <SectionLabel label="Psychology & Calendar" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Section title="Emotional analytics">
          <EmotionTracker emotions={emotions} bestHours={bestHours} />
        </Section>
        <Section title={`Calendar heatmap — ${monthLabel}`}>
          <PnlHeatmap days={heatmapDays} />
        </Section>
      </div>

      {/* ── Insights ── */}
      <SectionLabel label="Insights" />
      <Section title="AI coaching">
        <AiCoachingPanel insights={aiInsights} />
      </Section>
    </div>
  );
}
