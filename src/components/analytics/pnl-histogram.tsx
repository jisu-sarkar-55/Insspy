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
import type { PnlHistogramBucket } from "@/types";

interface Props {
  data: PnlHistogramBucket[];
}

export function PnlHistogram({ data }: Props) {
  const hasData = data.some((d) => d.count > 0);
  if (!hasData) {
    return (
      <div className="flex h-[250px] items-center justify-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        No P&L distribution data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
        <XAxis
          dataKey="range"
          stroke="var(--text-muted)"
          fontSize={9}
          angle={-35}
          textAnchor="end"
          height={60}
        />
        <YAxis stroke="var(--text-muted)" fontSize={10} />
        <Tooltip
          contentStyle={{ background: "var(--surface-raised)", border: "1px solid var(--border-subtle)", borderRadius: 8, fontSize: 11 }}
          labelStyle={{ color: "var(--text-primary)" }}
          formatter={(value, name) => [Number(value), name === "wins" ? "Wins" : name === "losses" ? "Losses" : "Trades"]}
        />
        <ReferenceLine y={0} stroke="var(--border-subtle)" />
        <Bar dataKey="wins" stackId="a" fill="var(--color-profit)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="losses" stackId="a" fill="var(--color-loss)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
