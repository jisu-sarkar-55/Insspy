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
      <div className="flex items-center justify-center h-[300px] text-zinc-400">
        No data available for equity curve
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
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
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Equity"]}
        />
        <Line
          type="monotone"
          dataKey="equity"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
