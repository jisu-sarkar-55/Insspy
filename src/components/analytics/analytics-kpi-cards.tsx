"use client";

import { DollarSign, Target, TrendingUp, TrendingDown, Zap, Activity } from "lucide-react";
import type { AnalyticsKPIs } from "@/types";

interface Props {
  data: AnalyticsKPIs;
}

export function AnalyticsKPICards({ data }: Props) {
  const cards = [
    {
      label: "Net Profit",
      value: `$${data.netProfit.toFixed(0)}`,
      icon: DollarSign,
      color: data.netProfit >= 0 ? "var(--color-profit)" : "var(--color-loss)",
    },
    {
      label: "Win Rate",
      value: `${data.winRate.toFixed(1)}%`,
      icon: Target,
      color: data.winRate >= 50 ? "var(--color-profit)" : "var(--color-loss)",
      sub: `${data.totalTrades} trades`,
    },
    {
      label: "Profit Factor",
      value: data.profitFactor === Infinity ? "∞" : data.profitFactor.toFixed(2),
      icon: TrendingUp,
      color: data.profitFactor >= 2 ? "var(--color-profit)" : data.profitFactor >= 1 ? "var(--primary)" : "var(--color-loss)",
    },
    {
      label: "Average RR",
      value: `${data.avgRR.toFixed(1)}R`,
      icon: Zap,
      color: data.avgRR >= 2 ? "var(--color-profit)" : data.avgRR >= 1 ? "var(--color-info)" : "var(--color-loss)",
    },
    {
      label: "Max Drawdown",
      value: `${data.maxDrawdown.toFixed(1)}%`,
      icon: TrendingDown,
      color: data.maxDrawdown <= 5 ? "var(--color-profit)" : data.maxDrawdown <= 10 ? "var(--primary)" : "var(--color-loss)",
    },
    {
      label: "Expectancy",
      value: `$${data.expectancy.toFixed(2)}`,
      icon: Activity,
      color: data.expectancy > 0 ? "var(--color-profit)" : "var(--color-loss)",
      sub: "per trade",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="card-surface rounded-lg border p-3"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>
            <c.icon className="h-3 w-3" />
            {c.label}
          </div>
          <div className="text-xl font-bold leading-none font-[var(--font-playfair)]" style={{ color: c.color }}>
            {c.value}
          </div>
          {c.sub && (
            <div className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>{c.sub}</div>
          )}
        </div>
      ))}
    </div>
  );
}
