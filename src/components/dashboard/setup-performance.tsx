"use client";

import type { StrategyStats } from "@/types";

interface SetupPerformanceProps {
  strategies: StrategyStats[];
}

function getStatus(s: StrategyStats): { label: string; color: string; bg: string } {
  if (s.winRate >= 70 && s.netPnl > 0)
    return { label: "Edge", color: "var(--color-profit)", bg: "var(--color-profit-bg)" };
  if (s.winRate >= 60 && s.netPnl > 0)
    return { label: "Good", color: "var(--color-info)", bg: "var(--color-info-bg)" };
  if (s.winRate >= 50)
    return { label: "Review", color: "var(--primary)", bg: "var(--color-warning-bg)" };
  return { label: "Stop", color: "var(--color-loss)", bg: "var(--color-loss-bg)" };
}

export function SetupPerformance({ strategies }: SetupPerformanceProps) {
  if (strategies.length === 0) {
    return (
      <div
        className="flex h-32 items-center justify-center rounded-lg text-[11px]"
        style={{ color: "var(--text-muted)" }}
      >
        No strategy data yet. Tag your trades with a strategy.
      </div>
    );
  }

  const sorted = [...strategies].sort((a, b) => b.netPnl - a.netPnl);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: 400 }}>
      <thead>
        <tr>
          {["Setup", "Trades", "Win rate", "Net P&L", "Status"].map(
            (h) => (
              <th
                key={h}
                className="border-b px-2 py-1.5 text-left text-[9px] font-semibold uppercase tracking-[0.12em]"
                style={{
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-muted)",
                }}
              >
                {h}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {sorted.map((s) => {
          const status = getStatus(s);
          return (
            <tr key={s.strategy}>
              <td
                className="border-b px-2 py-2 text-[11px] font-semibold"
                style={{
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-primary)",
                }}
              >
                {s.strategy}
              </td>
              <td
                className="border-b px-2 py-2 text-[11px] font-[var(--font-jetbrains)]"
                style={{
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-secondary)",
                }}
              >
                {s.totalTrades}
              </td>
              <td
                className="border-b px-2 py-2 text-[11px] font-semibold font-[var(--font-jetbrains)]"
                style={{
                  borderColor: "var(--border-subtle)",
                  color:
                    s.winRate >= 60
                      ? "var(--color-profit)"
                      : s.winRate >= 50
                      ? "var(--primary)"
                      : "var(--color-loss)",
                }}
              >
                {s.winRate.toFixed(0)}%
              </td>
              <td
                className="border-b px-2 py-2 text-[11px] font-[var(--font-jetbrains)]"
                style={{
                  borderColor: "var(--border-subtle)",
                  color:
                    s.netPnl >= 0 ? "var(--color-profit)" : "var(--color-loss)",
                }}
              >
                ${s.netPnl.toFixed(0)}
              </td>
              <td
                className="border-b px-2 py-2"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <span
                  className="inline-block rounded-sm px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                  style={{ background: status.bg, color: status.color }}
                >
                  {status.label}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  );
}
