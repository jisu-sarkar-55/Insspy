"use client";

import { DollarSign, Target, TrendingUp, Shield, Zap } from "lucide-react";
import type { DashboardStats } from "@/types";

interface StatGridProps {
  stats: DashboardStats;
}

export function StatGrid({ stats }: StatGridProps) {
  const cards = [
    {
      label: "Net P&L",
      value: `$${stats.netPnl.toFixed(0)}`,
      icon: DollarSign,
      color: stats.netPnl >= 0 ? "var(--color-profit)" : "var(--color-loss)",
    },
    {
      label: "Win rate",
      value: `${stats.winRate.toFixed(0)}%`,
      icon: Target,
      color: stats.winRate >= 50 ? "var(--color-profit)" : "var(--color-loss)",
      sub: `${stats.totalWinningTrades}W / ${stats.totalLosingTrades}L`,
    },
    {
      label: "Profit factor",
      value:
        stats.profitFactor === Infinity
          ? "∞"
          : stats.profitFactor.toFixed(2),
      icon: Zap,
      color:
        stats.profitFactor >= 2
          ? "var(--color-profit)"
          : stats.profitFactor >= 1
          ? "var(--color-warning)"
          : "var(--color-loss)",
      sub:
        stats.profitFactor >= 2
          ? "Excellent"
          : stats.profitFactor >= 1
          ? "Good"
          : "Needs work",
    },
    {
      label: "Best day",
      value: `$${stats.bestDay.toFixed(0)}`,
      icon: TrendingUp,
      color: "var(--color-profit)",
    },
    {
      label: "Worst day",
      value: `$${stats.worstDay.toFixed(0)}`,
      icon: Shield,
      color: "var(--color-loss)",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 stagger-children">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border p-3.5 card-surface hover-lift"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div
            className="mb-2 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--text-muted)" }}
          >
            <card.icon className="h-3 w-3" />
            {card.label}
          </div>
          <div
            className="text-2xl font-bold leading-none"
            style={{ fontFamily: "var(--font-playfair)", color: card.color }}
          >
            {card.value}
          </div>
          {card.sub && (
            <div
              className="mt-1.5 text-[10px] font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              {card.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
