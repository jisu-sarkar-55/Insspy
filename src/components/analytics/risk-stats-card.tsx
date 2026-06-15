"use client";

import type { RiskStats } from "@/types";

interface Props {
  data: RiskStats;
}

export function RiskStatsCard({ data }: Props) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="card-surface rounded-lg p-2.5">
          <div className="text-[10px] uppercase tracking-wide font-[var(--font-jetbrains)]" style={{ color: "var(--text-muted)" }}>Avg Risk</div>
          <div className="text-lg font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>{data.avgRiskPct.toFixed(2)}%</div>
        </div>
        <div className="card-surface rounded-lg p-2.5">
          <div className="text-[10px] uppercase tracking-wide font-[var(--font-jetbrains)]" style={{ color: "var(--text-muted)" }}>Largest Risk</div>
          <div className="text-lg font-bold font-[var(--font-playfair)]" style={{ color: data.largestRiskPct > 3 ? "var(--color-loss)" : "var(--primary)" }}>{data.largestRiskPct.toFixed(2)}%</div>
        </div>
      </div>

      <div className="card-surface rounded-lg p-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Risk Consistency</span>
          <span className="text-sm font-bold" style={{ color: data.riskConsistency >= 80 ? "var(--color-profit)" : data.riskConsistency >= 60 ? "var(--primary)" : "var(--color-loss)" }}>
            {data.riskConsistency.toFixed(0)}/100
          </span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: "var(--border-subtle)" }}>
          <div
            className="h-1.5 rounded-full"
            style={{
              width: `${data.riskConsistency}%`,
              background: data.riskConsistency >= 80 ? "var(--color-profit)" : data.riskConsistency >= 60 ? "var(--primary)" : "var(--color-loss)",
            }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between rounded px-2 py-1.5 text-[11px]" style={{ background: "var(--surface-raised)" }}>
          <span style={{ color: "var(--text-secondary)" }}>Avg lot size</span>
          <span className="font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>{data.avgLotSize.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between rounded px-2 py-1.5 text-[11px]" style={{ background: "var(--surface-raised)" }}>
          <span style={{ color: "var(--text-secondary)" }}>Largest lot size</span>
          <span className="font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>{data.largestLotSize.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between rounded px-2 py-1.5 text-[11px]" style={{ background: "var(--surface-raised)" }}>
          <span style={{ color: "var(--text-secondary)" }}>Stop loss usage</span>
          <span className="font-semibold font-[var(--font-jetbrains)]" style={{ color: data.stopLossPct >= 80 ? "var(--color-profit)" : "var(--primary)" }}>{data.stopLossPct.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
