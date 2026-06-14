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
} from "recharts";

interface DailyPnlChartProps {
  data: { date: string; pnl: number }[];
}

export function DailyPnlChart({ data }: DailyPnlChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-zinc-400">
        No data available for daily P&L
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="date"
          stroke="#71717a"
          fontSize={12}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <YAxis stroke="#71717a" fontSize={12} tickFormatter={(value) => `$${value}`} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#fff" }}
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "P&L"]}
        />
        <ReferenceLine y={0} stroke="#52525b" />
        <Bar
          dataKey="pnl"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
