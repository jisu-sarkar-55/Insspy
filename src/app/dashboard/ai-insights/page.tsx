"use client";

import { useEffect, useState, useCallback } from "react";
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
        const { data, error } = await supabase
          .from("trades")
          .select("*")
          .order("entry_time", { ascending: false });
        if (error) throw error;
        if (!cancelled && data) setTrades(data);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: "var(--text-muted)" }}>Loading AI insights...</div>
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
          Add or import trades to unlock your AI coaching insights.
        </p>
      </div>
    );
  }

  const insufficient = getInsufficientDataSections(closed);
  const sectionReady = (key: string) => !insufficient.find((s) => s.sectionKey === key);
  const sectionLocked = (key: string) => insufficient.find((s) => s.sectionKey === key);

  const executiveSummary = calculateExecutiveSummary(closed);
  const topInsights = calculateTopInsightCards(closed);
  const patterns = calculatePatternDetections(closed);
  const opportunity = calculateOpportunityAnalysis(closed);
  const strengths = calculateStrengths(closed);
  const improvements = calculateImprovementAreas(closed);
  const moneyLeaks = calculateMoneyLeaks(closed);
  const edge = calculateEdgeDiscovery(closed);
  const weeklyReview = calculateWeeklyReview(closed);
  const projections = calculateProjectedPerformance(closed);
  const scorecard = calculateTraderScorecard(closed);

  const lastLosingTrade = closed.find((t) => t.net_pnl! < 0) || null;

  return (
    <div className="space-y-4">
      <CoachHeader tradesAnalyzed={closed.length} />

      {lastLosingTrade && (
        <LosingTradeExplainer
          lastLosingTrade={lastLosingTrade}
          onExplain={handleExplainTrade}
          analysis={losingTradeAnalysis}
          loading={explainLoading}
        />
      )}

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

      {(() => {
        const locked = sectionLocked("pattern-detection");
        if (locked) return <InsufficientData section={locked} />;
        return <PatternDetection {...patterns} />;
      })()}

      {(() => {
        const locked = sectionLocked("opportunity-analysis");
        if (locked) return <InsufficientData section={locked} />;
        if (opportunity) return <OpportunityAnalysis data={opportunity} />;
        return null;
      })()}

      {(() => {
        const locked = sectionLocked("strengths");
        if (locked) return <InsufficientData section={locked} />;
        if (strengths.length === 0) return null;
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <StrengthsAnalysis items={strengths} />
            {improvements.length > 0 && <ImprovementAreas areas={improvements} />}
          </div>
        );
      })()}

      {(() => {
        const locked = sectionLocked("money-leaks");
        if (locked) return <InsufficientData section={locked} />;
        if (moneyLeaks && moneyLeaks.leaks.length > 0) return <MoneyLeakReport leaks={moneyLeaks.leaks} totalAvoidable={moneyLeaks.totalAvoidable} />;
        return null;
      })()}

      {(() => {
        const locked = sectionLocked("edge-discovery");
        if (locked) return <InsufficientData section={locked} />;
        if (edge) return <EdgeDiscovery data={edge} />;
        return null;
      })()}

      {sectionReady("weekly-review") && (
        <WeeklyReview data={weeklyReview} />
      )}

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
  );
}
