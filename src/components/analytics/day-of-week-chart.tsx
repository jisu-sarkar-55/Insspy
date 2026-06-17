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
  ReferenceLine,
} from "recharts";
import type { DayOfWeekStats } from "@/types";

interface Props {
  data: DayOfWeekStats[];
}

export function DayOfWeekChart({ data }: Props) {
  const hasData = data.some((d) => d.trades > 0);
  if (!hasData) {
    return (
      <div className="flex h-[250px] items-center justify-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        No day-of-week data
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={10} tickFormatter={(v) => v.slice(0, 3)} />
          <YAxis stroke="var(--text-muted)" fontSize={10} tickFormatter={(v) => `$${v}`} />
          <Tooltip
            contentStyle={{ background: "var(--surface-raised)", border: "1px solid var(--border-subtle)", borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: "var(--text-primary)" }}
            formatter={(v, name, props) => {
              if (name === "pnl") return [`$${Number(v).toFixed(0)}`, "P&L"];
              return [v, name];
            }}
          />
          <ReferenceLine y={0} stroke="var(--border-subtle)" />
          <Bar dataKey="pnl" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.pnl >= 0 ? "var(--color-profit)" : "var(--color-loss)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-5 gap-1.5">
        {data.filter((d) => d.trades > 0).map((d) => (
          <div key={d.day} className="rounded p-1.5 text-center" style={{ background: "var(--surface-raised)" }}>
            <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{d.day.slice(0, 3)}</div>
            <div className="text-[10px] font-semibold" style={{ color: d.winRate >= 50 ? "var(--color-profit)" : "var(--color-loss)" }}>{d.winRate.toFixed(0)}% WR</div>
            <div className="text-[10px]" style={{ color: d.pnl >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}>${d.pnl.toFixed(0)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
