"use client";

import { BarChart3, Skull } from "lucide-react";
import type { DetectedPattern, OvertradingPattern, RevengePattern } from "@/types";

interface PatternDetectionProps {
  patterns: DetectedPattern[];
  overtrading: OvertradingPattern | null;
  revenge: RevengePattern | null;
}

function PatternCard({ pattern }: { pattern: DetectedPattern }) {
  const config = {
    critical: { bg: "var(--color-loss-bg)", border: "rgba(248, 113, 113, 0.15)", color: "var(--color-loss)" },
    warning: { bg: "var(--color-warning-bg)", border: "rgba(251, 191, 36, 0.15)", color: "var(--primary)" },
    info: { bg: "var(--color-info-bg)", border: "rgba(96, 165, 250, 0.15)", color: "var(--color-info)" },
  };
  const c = config[pattern.severity];

  return (
    <div className="rounded-lg p-4" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
      <div className="mb-2 text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
        {pattern.title}
      </div>
      <div className="mb-3 flex gap-6">
        {pattern.normalWinRate > 0 && (
          <div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Normal Win Rate</div>
            <div className="text-[14px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--color-profit)" }}>
              {pattern.normalWinRate.toFixed(0)}%
            </div>
          </div>
        )}
        {pattern.affectedWinRate > 0 && (
          <div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Affected Win Rate</div>
            <div className="text-[14px] font-bold" style={{ color: c.color }}>
              {pattern.affectedWinRate.toFixed(0)}%
            </div>
          </div>
        )}
      </div>
      <div className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {pattern.recommendation}
      </div>
    </div>
  );
}

export function PatternDetection({ patterns, overtrading, revenge }: PatternDetectionProps) {
  return (
    <div
      className="card-surface rounded-lg border border-border p-5"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        Pattern Detection
      </div>

      <div className="space-y-3">
        {patterns.map((pattern, i) => (
          <PatternCard key={i} pattern={pattern} />
        ))}

        {overtrading && (
          <div
            className="rounded-lg p-4"
            style={{ background: "var(--color-warning-bg)", border: "1px solid rgba(251, 191, 36, 0.15)" }}
          >
            <div className="mb-2 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" style={{ color: "var(--primary)" }} />
              <span className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
                Overtrading Detection
              </span>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {overtrading.highTradeDays.label}
                </div>
                <div className="text-[14px] font-bold font-[var(--font-playfair)]" style={{ color: overtrading.highTradeDays.avgPnl >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}>
                  ${overtrading.highTradeDays.avgPnl.toFixed(0)} avg PnL
                </div>
              </div>
              <div>
                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {overtrading.lowTradeDays.label}
                </div>
                <div className="text-[14px] font-bold font-[var(--font-playfair)]" style={{ color: overtrading.lowTradeDays.avgPnl >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}>
                  ${overtrading.lowTradeDays.avgPnl.toFixed(0)} avg PnL
                </div>
              </div>
            </div>
          </div>
        )}

        {revenge && (
          <div
            className="rounded-lg p-4"
            style={{ background: "var(--color-loss-bg)", border: "1px solid rgba(248, 113, 113, 0.15)" }}
          >
            <div className="mb-2 flex items-center gap-2">
              <Skull className="h-4 w-4" style={{ color: "var(--color-loss)" }} />
              <span className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
                Revenge Trading Detection
              </span>
            </div>
            <div className="text-[13px] font-bold" style={{ color: "var(--color-loss)" }}>
              {revenge.percentage}% of losses occur within {revenge.threshold} minutes
              after another losing trade.
            </div>
            <div className="mt-1 text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Possible revenge trading behavior detected.
            </div>
          </div>
        )}

        {patterns.length === 0 && !overtrading && !revenge && (
          <div
            className="rounded-lg p-4 text-center text-[12px]"
            style={{ background: "var(--surface-raised)", color: "var(--text-muted)" }}
          >
            No significant patterns detected in your recent trading.
          </div>
        )}
      </div>
    </div>
  );
}
