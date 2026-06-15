"use client";

import { DollarSign } from "lucide-react";
import type { MoneyLeak } from "@/types";

interface MoneyLeakReportProps {
  leaks: MoneyLeak[];
  totalAvoidable: number;
}

export function MoneyLeakReport({ leaks, totalAvoidable }: MoneyLeakReportProps) {
  return (
    <div
      className="card-surface rounded-lg border border-border p-5"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        Money Leak Report
      </div>

      <div className="space-y-2">
        {leaks.map((leak, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg p-3"
            style={{ background: "var(--surface-raised)" }}
          >
            <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
              {leak.category}
            </span>
            <span className="text-[13px] font-semibold font-[var(--font-playfair)]" style={{ color: "var(--color-loss)" }}>
              -${Math.abs(leak.amount).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div
        className="mt-3 flex items-center justify-between rounded-lg p-3"
        style={{ background: "var(--color-loss-bg)", border: "1px solid rgba(248, 113, 113, 0.15)" }}
      >
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" style={{ color: "var(--color-loss)" }} />
          <span className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
            Total Avoidable Loss
          </span>
        </div>
        <span className="text-[14px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--color-loss)" }}>
          -${totalAvoidable.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
