"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface EquityCurveProps {
  data: { date: string; equity: number }[];
  startingBalance?: number;
}

export function EquityCurveChart({ data, startingBalance }: EquityCurveProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-[300px]"
        style={{ color: "var(--text-muted)" }}
      >
        No data available for equity curve
      </div>
    );
  }

  const firstEquity = data[0]?.equity ?? 0;
  const lastEquity = data[data.length - 1]?.equity ?? 0;
  const totalPnl = lastEquity - (startingBalance ?? firstEquity);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 text-[11px]">
        <span style={{ color: "var(--text-muted)" }}>
          Start: <span className="font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>${(startingBalance ?? firstEquity).toFixed(0)}</span>
        </span>
        <span style={{ color: "var(--text-muted)" }}>
          Current: <span className="font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>${lastEquity.toFixed(0)}</span>
        </span>
        <span style={{ color: totalPnl >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}>
          {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(0)} ({((totalPnl / (startingBalance ?? firstEquity)) * 100).toFixed(1)}%)
        </span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-subtle)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="var(--text-muted)"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "var(--border-subtle)" }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--surface-card)",
              border: "1px solid var(--border-medium)",
              borderRadius: "6px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "var(--text-primary)" }}
            itemStyle={{ color: "var(--text-secondary)" }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Equity"]}
          />
          {startingBalance && (
            <ReferenceLine
              y={startingBalance}
              stroke="var(--text-muted)"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
            />
          )}
          <Line
            type="monotone"
            dataKey="equity"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--primary)", stroke: "var(--surface-card)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
