"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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

function Section({ title, children, span }: { title: string; children: React.ReactNode; span?: string }) {
  return (
    <div
      className={`card-surface rounded-lg border p-4 ${span || ""}`}
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
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
        <div style={{ color: "var(--text-muted)" }}>Loading analytics...</div>
      </div>
    );
  }

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
  const drawdown = calculateDrawdownAnalysis(closed, 10000);
  const equityCurve = calculateEquityCurve(closed, 10000);
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
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
          Analytics
        </h1>
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          Deep dive into your trading performance
        </p>
      </div>

      {/* Section A: KPIs */}
      <AnalyticsKPICards data={kpis} />

      {/* Section B: Equity + Drawdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Section title="Equity curve">
          <EquityCurveChart data={equityCurve} />
        </Section>
        <Section title="Drawdown analysis">
          <DrawdownChart data={drawdown} />
        </Section>
      </div>

      {/* Section C: Symbol + Session + Day of Week */}
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

      {/* Section D: Hour Heatmap + Histogram + Duration */}
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

      {/* Section E: Setup + Risk */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Section title="Setup performance">
          <SetupPerformance strategies={strategyStats} />
        </Section>
        <Section title="Risk analytics">
          <RiskStatsCard data={riskStats} />
        </Section>
      </div>

      {/* Section F: Emotion + Calendar Heatmap */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Section title="Emotional analytics">
          <EmotionTracker emotions={emotions} bestHours={bestHours} />
        </Section>
        <Section title={`Calendar heatmap — ${monthLabel}`}>
          <PnlHeatmap days={heatmapDays} />
        </Section>
      </div>

      {/* Section G: AI Insights */}
      <Section title="AI insights">
        <AiCoachingPanel insights={aiInsights} />
      </Section>


    </div>
  );
}
