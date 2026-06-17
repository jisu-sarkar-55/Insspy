"use client";

import { Brain } from "lucide-react";

interface CoachHeaderProps {
  tradesAnalyzed: number;
  lastAnalysis?: string;
  dateRange?: string;
}

function calculateConfidence(tradesAnalyzed: number): number {
  if (tradesAnalyzed < 5) return 0;
  if (tradesAnalyzed < 20) return Math.round(40 + tradesAnalyzed * 2);
  if (tradesAnalyzed < 50) return Math.round(70 + (tradesAnalyzed - 20) * 0.5);
  if (tradesAnalyzed < 100) return Math.round(85 + (tradesAnalyzed - 50) * 0.2);
  return Math.min(96, Math.round(90 + (tradesAnalyzed - 100) * 0.05));
}

export function CoachHeader({ tradesAnalyzed, lastAnalysis, dateRange }: CoachHeaderProps) {
  const displayDate = lastAnalysis
    ? new Date(lastAnalysis).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Never";

  const confidence = calculateConfidence(tradesAnalyzed);

  return (
    <div
      className="card-premium rounded-lg p-5"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ background: "var(--color-ai-bg)", border: "1px solid rgba(192, 132, 252, 0.2)" }}
          >
            <Brain className="h-5 w-5" style={{ color: "var(--color-ai)" }} />
          </div>
          <div>
            <div className="text-lg font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
              AI Trading Coach
            </div>
            {dateRange && (
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                {dateRange}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="premium-badge">Premium Feature</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Last Analysis
          </div>
          <div className="mt-0.5 text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
            {displayDate}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Trades Analyzed
          </div>
          <div className="mt-0.5 text-[13px] font-semibold font-[var(--font-playfair)]" style={{ color: "var(--color-profit)" }}>
            {tradesAnalyzed.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            AI Confidence
          </div>
          <div className="mt-0.5 text-[13px] font-semibold" style={{ color: confidence > 80 ? "var(--color-profit)" : confidence > 50 ? "var(--primary)" : "var(--text-muted)" }}>
            {confidence}%
          </div>
        </div>
      </div>
    </div>
  );
}
