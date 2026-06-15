"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EquityCurveProps {
  data: { date: string; equity: number }[];
}

export function EquityCurveChart({ data }: EquityCurveProps) {
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

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
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
  );
}
