"use client";

import { Star } from "lucide-react";
import type { EdgeCondition } from "@/types";

interface EdgeDiscoveryProps {
  data: EdgeCondition | null;
}

export function EdgeDiscovery({ data }: EdgeDiscoveryProps) {
  if (!data) return null;

  return (
    <div
      className="card-surface rounded-lg border border-border p-5"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        Edge Discovery Engine
      </div>

      <div
        className="rounded-lg p-4"
        style={{
          background: "linear-gradient(135deg, rgba(74, 222, 128, 0.08), rgba(192, 132, 252, 0.08))",
          border: "1px solid rgba(74, 222, 128, 0.15)",
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <Star className="h-4 w-4" style={{ color: "var(--color-profit)" }} />
          <span className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
            Your Highest Probability Conditions
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Instrument
            </div>
            <div className="mt-0.5 text-[14px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
              {data.instrument}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Session
            </div>
            <div className="mt-0.5 text-[14px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
              {data.session}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Day
            </div>
            <div className="mt-0.5 text-[14px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
              {data.day}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Setup
            </div>
            <div className="mt-0.5 text-[14px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
              {data.setup}
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-6">
          <div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Win Rate</div>
            <div className="text-[18px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--color-profit)" }}>
              {data.winRate}%
            </div>
          </div>
          <div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Profit Factor</div>
            <div className="text-[18px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--color-profit)" }}>
              {data.profitFactor}
            </div>
          </div>
          <div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Risk</div>
            <div className="text-[18px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
              {data.riskPercent}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
