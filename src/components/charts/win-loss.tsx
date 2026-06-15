"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface WinLossChartProps {
  wins: number;
  losses: number;
}

const COLORS = ["var(--color-profit)", "var(--color-loss)"];

export function WinLossChart({ wins, losses }: WinLossChartProps) {
  const data = [
    { name: "Wins", value: wins },
    { name: "Losses", value: losses },
  ];

  if (wins === 0 && losses === 0) {
    return (
      <div
        className="flex items-center justify-center h-[300px]"
        style={{ color: "var(--text-muted)" }}
      >
        No trade data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.7}
              stroke="var(--surface-card)"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--surface-card)",
            border: "1px solid var(--border-medium)",
            borderRadius: "6px",
            fontSize: "12px",
          }}
          itemStyle={{ color: "var(--text-secondary)" }}
          formatter={(value, name) => [value, name]}
        />
        <Legend
          wrapperStyle={{ color: "var(--text-secondary)", fontSize: "12px" }}
          formatter={(value) => <span style={{ color: "var(--text-secondary)" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
