"use client";

import type { SymbolStats } from "@/types";

interface Props {
  data: SymbolStats[];
}

export function SymbolTable({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        No symbol data
      </div>
    );
  }

  const best = data.reduce((b, s) => (s.pnl > b.pnl ? s : b), data[0]);
  const worst = data.reduce((w, s) => (s.pnl < w.pnl ? s : w), data[0]);

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-1 rounded-lg p-2" style={{ background: "var(--color-profit-bg)", border: "1px solid rgba(74, 222, 128,0.15)" }}>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Best symbol</div>
          <div className="text-sm font-bold font-[var(--font-playfair)]" style={{ color: "var(--color-profit)" }}>{best.symbol}</div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>+${best.pnl.toFixed(0)}</div>
        </div>
        <div className="flex-1 rounded-lg p-2" style={{ background: "var(--color-loss-bg)", border: "1px solid rgba(248, 113, 113,0.15)" }}>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Worst symbol</div>
          <div className="text-sm font-bold font-[var(--font-playfair)]" style={{ color: "var(--color-loss)" }}>{worst.symbol}</div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>${worst.pnl.toFixed(0)}</div>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Symbol", "Trades", "Win Rate", "P&L", "Avg R", "PF"].map((h) => (
              <th key={h} className="border-b px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s.symbol}>
              <td className="border-b px-2 py-2 text-[11px] font-semibold font-[var(--font-playfair)]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>{s.symbol}</td>
              <td className="border-b px-2 py-2 text-[11px] font-[var(--font-jetbrains)]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>{s.trades}</td>
              <td className="border-b px-2 py-2 text-[11px] font-semibold font-[var(--font-jetbrains)]" style={{ borderColor: "var(--border-subtle)", color: s.winRate >= 50 ? "var(--color-profit)" : "var(--color-loss)" }}>{s.winRate.toFixed(0)}%</td>
              <td className="border-b px-2 py-2 text-[11px] font-[var(--font-jetbrains)]" style={{ borderColor: "var(--border-subtle)", color: s.pnl >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}>${s.pnl.toFixed(0)}</td>
              <td className="border-b px-2 py-2 text-[11px] font-[var(--font-jetbrains)]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>{s.avgRR.toFixed(1)}R</td>
              <td className="border-b px-2 py-2 text-[11px] font-[var(--font-jetbrains)]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>{s.profitFactor === Infinity ? "∞" : s.profitFactor.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
