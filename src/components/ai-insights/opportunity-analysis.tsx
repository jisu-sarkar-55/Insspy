"use client";

import { Lightbulb } from "lucide-react";
import type { OpportunityFound } from "@/types";

interface OpportunityAnalysisProps {
  data: OpportunityFound | null;
}

export function OpportunityAnalysis({ data }: OpportunityAnalysisProps) {
  if (!data) return null;

  return (
    <div
      className="card-surface rounded-lg border border-border p-5"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        Opportunity Analysis
      </div>

      <div
        className="rounded-lg p-4"
        style={{ background: "var(--color-ai-bg)", border: "1px solid rgba(192, 132, 252, 0.15)" }}
      >
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-4 w-4" style={{ color: "var(--color-ai)" }} />
          <span className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
            Opportunity Found
          </span>
        </div>

        <div className="mb-3">
          <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Your {data.strategy} setup
          </div>
          <div className="flex gap-4 mt-1">
            <div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Win Rate</div>
              <div className="text-[16px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--color-profit)" }}>
                {data.winRate.toFixed(0)}%
              </div>
            </div>
            <div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Usage</div>
              <div className="text-[16px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--color-ai)" }}>
                {data.usagePercent}%
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {data.recommendation}
        </div>
      </div>
    </div>
  );
}
