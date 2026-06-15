"use client";

import { Brain } from "lucide-react";

interface CoachHeaderProps {
  tradesAnalyzed: number;
  lastAnalysis?: string;
}

export function CoachHeader({ tradesAnalyzed, lastAnalysis }: CoachHeaderProps) {
  const displayDate = lastAnalysis
    ? new Date(lastAnalysis).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Never";

  return (
    <div
      className="relative overflow-hidden card-surface rounded-lg border border-border p-5"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-[160px] w-[160px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(192, 132, 252, 0.12) 0%, transparent 70%)",
        }}
      />
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
          <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Your personal trading analyst
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-6">
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
            Confidence Score
          </div>
          <div className="mt-0.5 text-[13px] font-semibold" style={{ color: "var(--color-ai)" }}>
            {Math.min(98, Math.round(60 + tradesAnalyzed * 0.3))}%
          </div>
        </div>
      </div>
    </div>
  );
}
