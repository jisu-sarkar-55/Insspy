"use client";

import { Lock } from "lucide-react";
import type { InsufficientDataSection } from "@/types";

interface InsufficientDataProps {
  section: InsufficientDataSection;
}

const sectionPreviews: Record<string, string> = {
  "executive-summary": "Shows monthly P&L, strongest instrument, best session, and biggest money leak.",
  "top-insights": "Reveals your best and weakest instruments plus highest-performing trading sessions.",
  "pattern-detection": "Identifies overtrading, revenge trading, and other behavioral patterns in your history.",
  "opportunity-analysis": "Finds high-win-rate strategies you're underusing and could trade more.",
  "strengths": "Evaluates your risk control, position sizing, plan discipline, and trade execution.",
  "improvement-areas": "Flags specific areas like overtrading, holding losers too long, or breaking trade limits.",
  "money-leaks": "Calculates how much you lose to specific behaviors like Friday trading or oversized positions.",
  "edge-discovery": "Scans instrument/session/day/strategy combos to find your highest-probability setup.",
  "weekly-review": "Summarizes your last 7 days: trades, profit, top strength, biggest mistake.",
  "projections": "Projects your monthly profit and drawdown based on recent performance trends.",
  "scorecard": "Scores you across risk management, patience, execution, and consistency pillars.",
};

export function InsufficientData({ section }: InsufficientDataProps) {
  const progress = Math.round((section.current / section.required) * 100);
  const preview = sectionPreviews[section.sectionKey] || "Add more trades to unlock this insight.";

  return (
    <div
      className="card-surface rounded-lg border border-border p-5"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "var(--surface-raised)" }}
        >
          <Lock className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>
            {section.message}
          </div>
          <div className="mt-1 text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {preview}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 w-32 rounded-full" style={{ background: "var(--border-subtle)" }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%`, background: "var(--color-ai)" }}
              />
            </div>
            <span className="text-[10px] tabular-nums" style={{ color: "var(--text-muted)" }}>
              {section.current}/{section.required}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
