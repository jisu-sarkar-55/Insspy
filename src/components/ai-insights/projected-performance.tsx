"use client";

import type { ProjectedPerformance as ProjectedType } from "@/types";

interface ProjectedPerformanceProps {
  data: ProjectedType | null;
}

export function ProjectedPerformance({ data }: ProjectedPerformanceProps) {
  if (!data) return null;

  return (
    <div
      className="card-premium rounded-lg p-5"
      style={{ background: "var(--surface-card)" }}
    >
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        Projected Performance
      </div>

      <div
        className="rounded-lg p-4"
        style={{
          background: "linear-gradient(135deg, rgba(74, 222, 128, 0.06), rgba(96, 165, 250, 0.06))",
          border: "1px solid rgba(74, 222, 128, 0.12)",
        }}
      >
        <div className="mb-1 text-[11px]" style={{ color: "var(--text-secondary)" }}>
          If current behavior continues:
        </div>

        <div className="mt-3 grid grid-cols-3 gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Expected Monthly Profit
            </div>
            <div
              className="mt-0.5 text-[16px] font-bold font-[var(--font-playfair)]"
              style={{ color: data.expectedMonthlyProfit >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}
            >
              {data.expectedMonthlyProfit >= 0 ? "+" : ""}${data.expectedMonthlyProfit.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Expected Drawdown
            </div>
            <div className="mt-0.5 text-[16px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--primary)" }}>
              {data.expectedDrawdown}%
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Confidence
            </div>
            <div className="mt-0.5 text-[16px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--color-info)" }}>
              {data.confidence}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
