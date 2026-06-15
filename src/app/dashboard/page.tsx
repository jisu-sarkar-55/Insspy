"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TraderIQ } from "@/components/dashboard/trader-iq";
import { AiCoachingPanel } from "@/components/dashboard/ai-coaching-panel";
import { StatGrid } from "@/components/dashboard/stat-grid";
import { EquityMini } from "@/components/dashboard/equity-mini";
import { SessionPerformance } from "@/components/dashboard/session-performance";
import { PnlHeatmap } from "@/components/dashboard/pnl-heatmap";
import { BehaviourFlags } from "@/components/dashboard/behaviour-flags";
import { StreakTracker } from "@/components/dashboard/streak-tracker";
import { SetupPerformance } from "@/components/dashboard/setup-performance";
import { EmotionTracker } from "@/components/dashboard/emotion-tracker";
import Link from "next/link";
import {
  calculateDashboardStats,
  calculateEquityCurve,
  calculateSessionStats,
  calculateBehaviourFlags,
  calculateStreaks,
  calculateHeatmapData,
  calculateStrategyStats,
  calculateTraderIQ,
  calculateEmotionStats,
  calculateBestHours,
  calculateAiCoaching,
} from "@/lib/calculations";
import type { Trade } from "@/types";

function SectionHeader({ title, link }: { title: string; link?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div
        className="text-[10px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: "var(--text-muted)" }}
      >
        {title}
      </div>
      {link && (
        <Link
          href={link}
          className="cursor-pointer text-[11px] font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--primary)" }}
        >
          View all →
        </Link>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTrades() {
      const { data } = await supabase
        .from("trades")
        .select("*")
        .order("entry_time", { ascending: false });

      if (data) {
        setTrades(data);
      }
      setLoading(false);
    }

    fetchTrades();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--border-medium)", borderTopColor: "transparent" }}
          />
          <div style={{ color: "var(--text-muted)" }} className="text-sm">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="py-16 text-center animate-fade-in">
        <h2
          className="mb-3 text-3xl font-bold"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Welcome to Insspy
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Start by adding your first trade to see your analytics.
        </p>
        <Link
          href="/dashboard/trades/new"
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-[11px] font-semibold uppercase tracking-wider"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          + Add Trade
        </Link>
      </div>
    );
  }

  const stats = calculateDashboardStats(trades);
  const closed = trades.filter((t) => t.net_pnl !== null);
  const equityCurve = calculateEquityCurve(closed, 10000);
  const sessionStats = calculateSessionStats(closed);
  const behaviourFlags = calculateBehaviourFlags(closed);
  const streaks = calculateStreaks(closed);

  const now = new Date();
  const heatmapDays = calculateHeatmapData(
    closed,
    now.getUTCFullYear(),
    now.getUTCMonth()
  );
  const monthLabel = now.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const strategyStats = calculateStrategyStats(closed);
  const traderIQ = calculateTraderIQ(closed);
  const emotions = calculateEmotionStats(closed);
  const bestHours = calculateBestHours(closed);
  const aiInsights = calculateAiCoaching(closed);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Dashboard
          </h1>
        </div>
        <Link
          href="/dashboard/trades/new"
          className="rounded-md px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          + Add Trade
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        <TraderIQ data={traderIQ} />
        <div
          className="rounded-lg border p-4 card-surface"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <AiCoachingPanel insights={aiInsights} />
        </div>
      </div>

      <StatGrid stats={stats} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div
          className="rounded-lg border p-4 card-surface"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <SectionHeader title="Equity curve" />
          <EquityMini data={equityCurve} />
        </div>
        <div
          className="rounded-lg border p-4 card-surface"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <SectionHeader title="Session performance" />
          <SessionPerformance sessions={sessionStats} />
        </div>
        <div
          className="rounded-lg border p-4 card-surface"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <SectionHeader title={`P&L calendar — ${monthLabel}`} />
          <PnlHeatmap days={heatmapDays} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div
          className="rounded-lg border p-4 card-surface"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <SectionHeader title="Behaviour detection" />
          <BehaviourFlags flags={behaviourFlags} />
        </div>
        <div
          className="rounded-lg border p-4 card-surface"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <SectionHeader title="Win/Loss streak" />
          <StreakTracker data={streaks} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[2fr_1fr]">
        <div
          className="rounded-lg border p-4 card-surface"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <SectionHeader title="Setup performance" link="/dashboard/analytics" />
          <SetupPerformance strategies={strategyStats} />
        </div>
        <div
          className="rounded-lg border p-4 card-surface"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <SectionHeader title="Emotion tracking" />
          <EmotionTracker emotions={emotions} bestHours={bestHours} />
        </div>
      </div>
    </div>
  );
}
