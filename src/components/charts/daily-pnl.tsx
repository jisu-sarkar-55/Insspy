"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

interface DailyPnlChartProps {
  data: { date: string; pnl: number }[];
}

export function DailyPnlChart({ data }: DailyPnlChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-[300px]"
        style={{ color: "var(--text-muted)" }}
      >
        No data available for daily P&L
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
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
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "P&L"]}
        />
        <ReferenceLine y={0} stroke="var(--border-medium)" />
        <Bar
          dataKey="pnl"
          radius={[3, 3, 0, 0]}
          maxBarSize={40}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.pnl >= 0 ? "var(--color-profit)" : "var(--color-loss)"}
              fillOpacity={0.7}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
