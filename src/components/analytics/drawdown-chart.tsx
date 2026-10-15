"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DrawdownStats } from "@/types";

interface Props {
  data: DrawdownStats;
}

export function DrawdownChart({ data }: Props) {
  if (data.curve.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        No drawdown data
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="card-surface rounded-lg p-2.5">
          <div className="text-[10px] uppercase tracking-wide font-[var(--font-jetbrains)]" style={{ color: "var(--text-muted)" }}>Max Drawdown</div>
          <div className="text-lg font-bold font-[var(--font-playfair)]" style={{ color: "var(--color-loss)" }}>-{data.maxDrawdownPct.toFixed(1)}%</div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>${data.maxDrawdown.toFixed(0)}</div>
        </div>
        <div className="card-surface rounded-lg p-2.5">
          <div className="text-[10px] uppercase tracking-wide font-[var(--font-jetbrains)]" style={{ color: "var(--text-muted)" }}>Current Drawdown</div>
          <div className="text-lg font-bold font-[var(--font-playfair)]" style={{ color: data.currentDrawdown > 0 ? "var(--primary)" : "var(--color-profit)" }}>
            -{data.currentDrawdownPct.toFixed(1)}%
          </div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{data.currentDrawdownDuration}d duration</div>
        </div>
        <div className="card-surface rounded-lg p-2.5">
          <div className="text-[10px] uppercase tracking-wide font-[var(--font-jetbrains)]" style={{ color: "var(--text-muted)" }}>Max DD Duration</div>
          <div className="text-lg font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>{data.maxDrawdownDuration}</div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>days</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data.curve}>
          <defs>
            <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-loss)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--color-loss)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
          <YAxis stroke="var(--text-muted)" fontSize={10} tickFormatter={(v) => `${v.toFixed(1)}%`} />
          <Tooltip
            contentStyle={{ background: "var(--surface-raised)", border: "1px solid var(--border-subtle)", borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: "var(--text-primary)" }}
            formatter={(v) => [`-${Number(v).toFixed(2)}%`, "Drawdown"]}
          />
          <Area type="monotone" dataKey="drawdownPct" stroke="var(--color-loss)" fill="url(#ddGrad)" strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
