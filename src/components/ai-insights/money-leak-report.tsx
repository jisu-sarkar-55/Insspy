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
      className="card-featured rounded-lg p-5"
      style={{ background: "var(--surface-card)" }}
    >
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        Money Leak Report
      </div>

      <div className="space-y-3">
        {leaks.map((leak, i) => {
          const pct = totalAvoidable > 0 ? (Math.abs(leak.amount) / totalAvoidable) * 100 : 0;
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
                  {leak.category}
                </span>
                <span className="text-[13px] font-semibold font-[var(--font-playfair)]" style={{ color: "var(--color-loss)" }}>
                  -${Math.abs(leak.amount).toLocaleString()}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-raised)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: i === 0
                      ? "linear-gradient(90deg, var(--color-loss), rgba(248, 113, 113, 0.4))"
                      : "rgba(248, 113, 113, 0.3)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="mt-4 flex items-center justify-between rounded-lg p-3"
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
