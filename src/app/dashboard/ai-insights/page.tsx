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
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);
  const [losingTradeAnalysis, setLosingTradeAnalysis] = useState<LosingTradeAnalysisType | null>(null);

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
    } catch {
      // silently fail
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
  const hasSection = (key: string) => !insufficient.some((s) => s.sectionKey === key);
  const getSection = (key: string) => insufficient.find((s) => s.sectionKey === key);

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

      {hasSection("executive-summary") && executiveSummary && (
        <ExecutiveSummary data={executiveSummary} />
      )}
      {getSection("executive-summary") && (
        <InsufficientData section={getSection("executive-summary")!} />
      )}

      {hasSection("top-insights") && (topInsights.bestInstrument || topInsights.bestSession) && (
        <TopInsights {...topInsights} />
      )}
      {getSection("top-insights") && (
        <InsufficientData section={getSection("top-insights")!} />
      )}

      {hasSection("pattern-detection") && (
        <PatternDetection {...patterns} />
      )}
      {getSection("pattern-detection") && (
        <InsufficientData section={getSection("pattern-detection")!} />
      )}

      {hasSection("opportunity-analysis") && opportunity && (
        <OpportunityAnalysis data={opportunity} />
      )}

      {hasSection("strengths") && strengths.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StrengthsAnalysis items={strengths} />
          {improvements.length > 0 && <ImprovementAreas areas={improvements} />}
        </div>
      )}
      {getSection("strengths") && (
        <InsufficientData section={getSection("strengths")!} />
      )}

      {hasSection("money-leaks") && moneyLeaks && moneyLeaks.leaks.length > 0 && (
        <MoneyLeakReport leaks={moneyLeaks.leaks} totalAvoidable={moneyLeaks.totalAvoidable} />
      )}
      {getSection("money-leaks") && (
        <InsufficientData section={getSection("money-leaks")!} />
      )}

      {hasSection("edge-discovery") && edge && (
        <EdgeDiscovery data={edge} />
      )}
      {getSection("edge-discovery") && (
        <InsufficientData section={getSection("edge-discovery")!} />
      )}

      {hasSection("weekly-review") && (
        <WeeklyReview
          data={weeklyReview}
          loading={weeklyLoading}
          onGenerate={() => setWeeklyLoading(!weeklyLoading)}
        />
      )}

      {hasSection("projections") && (
        <ProjectedPerformance data={projections} />
      )}
      {getSection("projections") && (
        <InsufficientData section={getSection("projections")!} />
      )}

      {hasSection("scorecard") && (
        <TraderScorecard data={scorecard} />
      )}
      {getSection("scorecard") && (
        <InsufficientData section={getSection("scorecard")!} />
      )}
    </div>
  );
}
