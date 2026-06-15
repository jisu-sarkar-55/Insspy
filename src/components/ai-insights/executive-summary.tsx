"use client";

import { TrendingUp, Target, AlertTriangle } from "lucide-react";
import type { ExecutiveSummary as ExecutiveSummaryType } from "@/types";

interface ExecutiveSummaryProps {
  data: ExecutiveSummaryType;
}

export function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  return (
    <div
      className="card-surface rounded-lg border border-border p-5"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        Executive Summary
      </div>

      <div className="mb-4">
        <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
          This month you are{" "}
          <span
            className="font-bold"
            style={{ color: data.isProfitable ? "var(--color-profit)" : "var(--color-loss)" }}
          >
            {data.isProfitable ? "profitable" : "in drawdown"} (
            {data.monthlyPnl >= 0 ? "+" : ""}${data.monthlyPnl.toLocaleString()})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div
          className="rounded-lg p-3"
          style={{ background: "var(--color-profit-bg)", border: "1px solid rgba(74, 222, 128, 0.15)" }}
        >
          <div className="mb-2 flex items-center gap-2">
            <Target className="h-4 w-4" style={{ color: "var(--color-profit)" }} />
            <span className="text-[11px] font-semibold" style={{ color: "var(--color-profit)" }}>
              Strongest Edge
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3" style={{ color: "var(--text-muted)" }} />
              <span className="text-[12px] font-medium font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
                {data.strongestEdge.instrument}
              </span>
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              {data.strongestEdge.session} Session
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              {data.strongestEdge.setup} setups
            </div>
          </div>
        </div>

        <div
          className="rounded-lg p-3"
          style={{ background: "var(--color-loss-bg)", border: "1px solid rgba(248, 113, 113, 0.15)" }}
        >
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" style={{ color: "var(--color-loss)" }} />
            <span className="text-[11px] font-semibold" style={{ color: "var(--color-loss)" }}>
              Biggest Leak
            </span>
          </div>
          <div className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
            {data.biggestLeak.description}
          </div>
          {data.biggestLeak.estimatedImpact > 0 && (
            <div className="mt-1 text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Estimated monthly improvement:{" "}
              <span className="font-semibold" style={{ color: "var(--color-profit)" }}>
                +${data.estimatedImprovement.toLocaleString()} if corrected
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
