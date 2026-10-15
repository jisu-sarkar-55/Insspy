"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { TradeDurationStats } from "@/types";

interface Props {
  data: TradeDurationStats;
}

export function TradeDurationChart({ data }: Props) {
  const total = data.scalps.count + data.intraday.count + data.swing.count;
  if (total === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        No duration data — add exit times to your trades
      </div>
    );
  }

  const chartData = [
    { name: "Scalp\n(<1h)", count: data.scalps.count, winRate: data.scalps.winRate, pnl: data.scalps.pnl, duration: data.scalps.avgDuration },
    { name: "Intraday\n(1h-24h)", count: data.intraday.count, winRate: data.intraday.winRate, pnl: data.intraday.pnl, duration: data.intraday.avgDuration },
    { name: "Swing\n(>24h)", count: data.swing.count, winRate: data.swing.winRate, pnl: data.swing.pnl, duration: data.swing.avgDuration },
  ];

  const colors = ["var(--color-info)", "var(--color-profit)", "var(--color-ai)"];

  return (
    <div className="space-y-3">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
          <YAxis stroke="var(--text-muted)" fontSize={10} />
          <Tooltip
            contentStyle={{ background: "var(--surface-raised)", border: "1px solid var(--border-subtle)", borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: "var(--text-primary)" }}
            formatter={(v, name) => [name === "count" ? `${v} trades` : name === "winRate" ? `${Number(v).toFixed(0)}% WR` : `$${Number(v).toFixed(0)}`, name === "count" ? "Trades" : name === "winRate" ? "Win Rate" : "P&L"]}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {chartData.map((d, i) => (
          <div key={d.name} className="rounded-lg p-2 text-center" style={{ background: "var(--surface-raised)" }}>
            <div className="text-[10px] font-semibold" style={{ color: colors[i] }}>{d.name.replace("\n", " ")}</div>
            <div className="mt-1 text-lg font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>{d.count}</div>
            <div className="text-[10px]" style={{ color: d.winRate >= 50 ? "var(--color-profit)" : "var(--color-loss)" }}>{d.winRate.toFixed(0)}% WR</div>
            <div className="text-[10px]" style={{ color: d.pnl >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}>${d.pnl.toFixed(0)}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px]" style={{ color: "var(--text-muted)" }}>
        <span>Avg winning duration: <span style={{ color: "var(--color-profit)" }}>{data.avgWinDuration}</span></span>
        <span>Avg losing duration: <span style={{ color: "var(--color-loss)" }}>{data.avgLossDuration}</span></span>
      </div>
    </div>
  );
}
