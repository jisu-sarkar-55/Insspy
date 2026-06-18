"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  calculateExecutiveSummary,
  calculateTopInsightCards,
  calculatePatternDetections,
  calculateOpportunityAnalysis,
  calculateStrengths,
  calculateImprovementAreas,
  calculateMoneyLeaks,
  calculateEdgeDiscovery,
  calculateWeeklyReview,
  calculateProjectedPerformance,
  calculateTraderScorecard,
  getInsufficientDataSections,
} from "@/lib/calculations";
import type { Trade, LosingTradeAnalysis as LosingTradeAnalysisType } from "@/types";

import { CoachHeader } from "@/components/ai-insights/coach-header";
import { ExecutiveSummary } from "@/components/ai-insights/executive-summary";
import { TopInsights } from "@/components/ai-insights/top-insights";
import { PatternDetection } from "@/components/ai-insights/pattern-detection";
import { OpportunityAnalysis } from "@/components/ai-insights/opportunity-analysis";
import { StrengthsAnalysis } from "@/components/ai-insights/strengths-analysis";
import { ImprovementAreas } from "@/components/ai-insights/improvement-areas";
import { MoneyLeakReport } from "@/components/ai-insights/money-leak-report";
import { EdgeDiscovery } from "@/components/ai-insights/edge-discovery";
import { WeeklyReview } from "@/components/ai-insights/weekly-review";
import { ProjectedPerformance } from "@/components/ai-insights/projected-performance";
import { TraderScorecard } from "@/components/ai-insights/trader-scorecard";
import { LosingTradeExplainer } from "@/components/ai-insights/losing-trade-explainer";
import { InsufficientData } from "@/components/ai-insights/insufficient-data";
import { PremiumGate } from "@/components/premium";

function formatDateRange(trades: Trade[]): string {
  if (trades.length === 0) return "";
  const dates = trades.map((t) => new Date(t.entry_time)).sort((a, b) => a.getTime() - b.getTime());
  const start = dates[0];
  const end = dates[dates.length - 1];
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function SectionLabel({ label, premium }: { label: string; premium?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, var(--border-subtle), transparent)" }} />
      <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      {premium && <span className="premium-badge">Premium</span>}
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, var(--border-subtle))" }} />
    </div>
  );
}

export default function AiInsightsPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [explainLoading, setExplainLoading] = useState(false);
  const [losingTradeAnalysis, setLosingTradeAnalysis] = useState<LosingTradeAnalysisType | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function fetchTrades() {
      try {
        await supabase.auth.getUser();
        const res = await fetch("/api/trades");
        if (!res.ok) throw new Error("Failed to load trades");
        const data = await res.json();
        if (!cancelled) setTrades(data);
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTrades();
    return () => { cancelled = true; };
  }, []);

  const handleExplainTrade = useCallback(async (tradeId: string) => {
    setExplainLoading(true);
    try {
      const response = await fetch("/api/ai/explain-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trade_id: tradeId }),
      });
      const data = await response.json();
      if (response.ok) {
        setLosingTradeAnalysis(data);
      }
    } catch (err) {
      console.error("Failed to explain trade:", err);
    } finally {
      setExplainLoading(false);
    }
  }, []);

  const closed = useMemo(() => trades.filter((t) => t.net_pnl !== null), [trades]);

  const insufficient = useMemo(() => getInsufficientDataSections(closed), [closed]);
  const sectionReady = useCallback((key: string) => !insufficient.find((s) => s.sectionKey === key), [insufficient]);
  const sectionLocked = useCallback((key: string) => insufficient.find((s) => s.sectionKey === key), [insufficient]);

  const executiveSummary = useMemo(() => calculateExecutiveSummary(closed), [closed]);
  const topInsights = useMemo(() => calculateTopInsightCards(closed), [closed]);
  const patterns = useMemo(() => calculatePatternDetections(closed), [closed]);
  const opportunity = useMemo(() => calculateOpportunityAnalysis(closed), [closed]);
  const strengths = useMemo(() => calculateStrengths(closed), [closed]);
  const improvements = useMemo(() => calculateImprovementAreas(closed), [closed]);
  const moneyLeaks = useMemo(() => calculateMoneyLeaks(closed), [closed]);
  const edge = useMemo(() => calculateEdgeDiscovery(closed), [closed]);
  const weeklyReview = useMemo(() => calculateWeeklyReview(closed), [closed]);
  const projections = useMemo(() => calculateProjectedPerformance(closed), [closed]);
  const scorecard = useMemo(() => calculateTraderScorecard(closed), [closed]);

  const lastLosingTrade = useMemo(() => closed.find((t) => t.net_pnl! < 0) || null, [closed]);
  const dateRange = useMemo(() => formatDateRange(closed), [closed]);

  if (loading) {
    return (
      <PremiumGate>
      <div className="space-y-4">
        <div className="skeleton-section" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="skeleton-section-sm" />
          <div className="skeleton-section-sm" />
        </div>
        <div className="skeleton-section" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="skeleton-section-sm" />
          <div className="skeleton-section-sm" />
        </div>
        <div className="skeleton-section" />
      </div>
      </PremiumGate>
    );
  }

  if (closed.length === 0) {
    return (
      <PremiumGate>
      <div className="py-12 text-center">
        <h2 className="mb-2 text-2xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
          No Trade Data
        </h2>
        <p style={{ color: "var(--text-muted)" }}>
          Add or import trades to unlock your AI coaching insights.
        </p>
      </div>
      </PremiumGate>
    );
  }

  return (
    <PremiumGate>
    <div className="space-y-6">
      <CoachHeader tradesAnalyzed={closed.length} dateRange={dateRange} />

      {/* ── Featured Row ── */}
      <SectionLabel label="Overview" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {(() => {
          const locked = sectionLocked("executive-summary");
          if (locked) return <InsufficientData section={locked} />;
          if (executiveSummary) return <ExecutiveSummary data={executiveSummary} />;
          return null;
        })()}

        {(() => {
          const locked = sectionLocked("top-insights");
          if (locked) return <InsufficientData section={locked} />;
          if (topInsights.bestInstrument || topInsights.bestSession) return <TopInsights {...topInsights} />;
          return null;
        })()}
      </div>

      {/* ── Losing Trade Explainer ── */}
      {lastLosingTrade && (
        <LosingTradeExplainer
          lastLosingTrade={lastLosingTrade}
          onExplain={handleExplainTrade}
          analysis={losingTradeAnalysis}
          loading={explainLoading}
        />
      )}

      {/* ── Deep Analysis ── */}
      <SectionLabel label="Deep Analysis" premium />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {(() => {
          const locked = sectionLocked("pattern-detection");
          if (locked) return <InsufficientData section={locked} />;
          return (
            <div className="lg:col-span-2">
              <PatternDetection {...patterns} />
            </div>
          );
        })()}

        {(() => {
          const locked = sectionLocked("money-leaks");
          if (locked) return <InsufficientData section={locked} />;
          if (moneyLeaks && moneyLeaks.leaks.length > 0) return <MoneyLeakReport leaks={moneyLeaks.leaks} totalAvoidable={moneyLeaks.totalAvoidable} />;
          return null;
        })()}
      </div>

      {/* Edge Discovery + Opportunity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {(() => {
          const locked = sectionLocked("edge-discovery");
          if (locked) return <InsufficientData section={locked} />;
          if (edge) return <EdgeDiscovery data={edge} />;
          return null;
        })()}

        {(() => {
          const locked = sectionLocked("opportunity-analysis");
          if (locked) return <InsufficientData section={locked} />;
          if (opportunity) return <OpportunityAnalysis data={opportunity} />;
          return null;
        })()}
      </div>

      {/* ── Coaching ── */}
      <SectionLabel label="Coaching" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(() => {
          const locked = sectionLocked("strengths");
          if (locked) return <InsufficientData section={locked} />;
          if (strengths.length > 0) return <StrengthsAnalysis items={strengths} />;
          return null;
        })()}

        {improvements.length > 0 && <ImprovementAreas areas={improvements} />}
      </div>

      {/* ── Projections ── */}
      <SectionLabel label="Projections" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {sectionReady("weekly-review") && <WeeklyReview data={weeklyReview} />}

        {(() => {
          const locked = sectionLocked("projections");
          if (locked) return <InsufficientData section={locked} />;
          return <ProjectedPerformance data={projections} />;
        })()}

        {(() => {
          const locked = sectionLocked("scorecard");
          if (locked) return <InsufficientData section={locked} />;
          return <TraderScorecard data={scorecard} />;
        })()}
      </div>
    </div>
    </PremiumGate>
  );
}
