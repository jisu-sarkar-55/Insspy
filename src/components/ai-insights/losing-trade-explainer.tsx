"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import type { LosingTradeAnalysis as LosingTradeAnalysisType, Trade } from "@/types";

interface LosingTradeExplainerProps {
  lastLosingTrade: Trade | null;
  onExplain: (tradeId: string) => void;
  analysis: LosingTradeAnalysisType | null;
  loading: boolean;
}

export function LosingTradeExplainer({
  lastLosingTrade,
  onExplain,
  analysis,
  loading,
}: LosingTradeExplainerProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (analysis && !expanded) {
      setExpanded(true);
    }
  }, [analysis, expanded]);

  if (!lastLosingTrade) return null;

  return (
    <div
      className="card-coaching rounded-lg p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: "var(--color-ai)" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Explain My Last Losing Trade
          </span>
          {!analysis && !loading && (
            <span className="animate-pulse inline-flex h-2 w-2 rounded-full" style={{ background: "var(--color-ai)" }} />
          )}
        </div>
        <button
          onClick={() => {
            if (!analysis) {
              onExplain(lastLosingTrade.id);
            }
            setExpanded(!expanded);
          }}
          disabled={loading}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors"
          style={{
            background: "linear-gradient(135deg, rgba(192, 132, 252, 0.2), rgba(74, 222, 128, 0.15))",
            color: "var(--color-ai)",
            border: "1px solid rgba(192, 132, 252, 0.25)",
          }}
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          {analysis ? (expanded ? "Collapse" : "Expand") : "Analyze"}
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      <div className="mt-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
        {lastLosingTrade.symbol} {lastLosingTrade.direction.toUpperCase()} —{" "}
        ${Math.abs(lastLosingTrade.net_pnl || 0).toFixed(2)} loss
      </div>

      {expanded && analysis && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div
              className="rounded-lg p-2.5"
              style={{ background: "var(--surface-raised)" }}
            >
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Session</div>
              <div className="text-[12px] font-semibold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
                {analysis.localAnalysis.session}
              </div>
            </div>
            <div
              className="rounded-lg p-2.5"
              style={{ background: "var(--surface-raised)" }}
            >
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Duration</div>
              <div className="text-[12px] font-semibold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
                {analysis.localAnalysis.minutesBeforeExit}m
              </div>
            </div>
            <div
              className="rounded-lg p-2.5"
              style={{ background: "var(--surface-raised)" }}
            >
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Consecutive Losses</div>
              <div
                className="text-[12px] font-semibold font-[var(--font-playfair)]"
                style={{ color: analysis.localAnalysis.consecutiveLossCount > 0 ? "var(--color-loss)" : "var(--text-primary)" }}
              >
                {analysis.localAnalysis.consecutiveLossCount}
              </div>
            </div>
            <div
              className="rounded-lg p-2.5"
              style={{ background: "var(--surface-raised)" }}
            >
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Similar Entry WR</div>
              <div
                className="text-[12px] font-semibold font-[var(--font-playfair)]"
                style={{ color: analysis.localAnalysis.similarEntryWinRate !== null && analysis.localAnalysis.similarEntryWinRate > 50 ? "var(--color-profit)" : "var(--color-loss)" }}
              >
                {analysis.localAnalysis.similarEntryWinRate !== null ? `${analysis.localAnalysis.similarEntryWinRate}%` : "—"}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>
              Possible Reasons
            </div>
            <div className="space-y-1.5">
              {analysis.localAnalysis.possibleReasons.map((reason, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg p-2.5"
                  style={{ background: "var(--color-loss-bg)", border: "1px solid rgba(248, 113, 113, 0.12)" }}
                >
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--color-loss)" }} />
                  <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-lg p-3"
            style={{ background: "var(--color-profit-bg)", border: "1px solid rgba(74, 222, 128, 0.15)" }}
          >
            <div className="text-[10px] font-semibold" style={{ color: "var(--color-profit)" }}>
              Suggested Improvement
            </div>
            <div className="mt-0.5 text-[12px]" style={{ color: "var(--text-primary)" }}>
              {analysis.localAnalysis.suggestedImprovement}
            </div>
          </div>

          {analysis.aiAnalysis && (
            <div
              className="rounded-lg p-3"
              style={{ background: "var(--color-ai-bg)", border: "1px solid rgba(192, 132, 252, 0.15)" }}
            >
              <div className="mb-1 text-[10px] font-semibold" style={{ color: "var(--color-ai)" }}>
                AI Coach Analysis
              </div>
              <div className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {analysis.aiAnalysis}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
