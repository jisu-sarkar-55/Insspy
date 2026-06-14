"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface WinLossChartProps {
  wins: number;
  losses: number;
}

const COLORS = ["#10b981", "#ef4444"];

export function WinLossChart({ wins, losses }: WinLossChartProps) {
  const data = [
    { name: "Wins", value: wins },
    { name: "Losses", value: losses },
  ];

  if (wins === 0 && losses === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-zinc-400">
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
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
          }}
          formatter={(value, name) => [value, name]}
        />
        <Legend
          wrapperStyle={{ color: "#a1a1aa" }}
          formatter={(value) => <span style={{ color: "#a1a1aa" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
