"use client";

import { DollarSign, Target, TrendingUp, TrendingDown, Zap, Activity } from "lucide-react";
import type { DashboardStats } from "@/types";

interface StatGridProps {
  stats: DashboardStats;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
      label: "Avg R:R",
      value: stats.averageRR > 0 ? `${stats.averageRR.toFixed(2)}R` : "—",
      icon: Activity,
      color:
        stats.averageRR >= 2
          ? "var(--color-profit)"
          : stats.averageRR >= 1
          ? "var(--color-warning)"
          : "var(--text-muted)",
      sub:
        stats.averageRR >= 2
          ? "Excellent"
          : stats.averageRR >= 1
          ? "Room for improvement"
          : "Insufficient data",
    },
    {
      label: "Best day",
      value: `$${stats.bestDay.toFixed(0)}`,
      icon: TrendingUp,
      color: stats.bestDay > 0 ? "var(--color-profit)" : stats.bestDay < 0 ? "var(--color-loss)" : "var(--text-muted)",
      sub: stats.bestDayDate ? `${formatDate(stats.bestDayDate)} · ${stats.bestDayTrades} trade${stats.bestDayTrades !== 1 ? "s" : ""}` : undefined,
    },
    {
      label: "Worst day",
      icon: TrendingDown,
      color: stats.worstDay < 0 ? "var(--color-loss)" : "var(--text-muted)",
      render: () =>
        stats.worstDay < 0 ? (
          <div>
            <div className="text-2xl font-bold leading-none" style={{ fontFamily: "var(--font-jetbrains)", color: "var(--color-loss)" }}>
              ${stats.worstDay.toFixed(0)}
            </div>
            {stats.worstDayDate && (
              <div className="mt-1.5 text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                {formatDate(stats.worstDayDate)} · {stats.worstDayTrades} trade{stats.worstDayTrades !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
            No loss days
          </div>
        ),
    },
    {
      label: "Biggest loss",
      icon: Activity,
      color: "var(--color-loss)",
      render: () =>
        stats.biggestLoss < 0 ? (
          <div>
            <div className="text-2xl font-bold leading-none" style={{ fontFamily: "var(--font-jetbrains)", color: "var(--color-loss)" }}>
              ${stats.biggestLoss.toFixed(0)}
            </div>
            {stats.biggestLossDate && (
              <div className="mt-1.5 text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                {formatDate(stats.biggestLossDate)}
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
            No losing trades
          </div>
        ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7 stagger-children">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative overflow-hidden rounded-xl border p-3.5 card-surface hover-lift"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <span
            className="absolute inset-x-0 top-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, ${card.color}, transparent)`,
              opacity: 0.7,
            }}
          />
          <div className="mb-2.5 flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-lg"
              style={{
                background: `color-mix(in srgb, ${card.color} 14%, transparent)`,
                border: `1px solid color-mix(in srgb, ${card.color} 22%, transparent)`,
              }}
            >
              <card.icon className="h-3 w-3" style={{ color: card.color }} />
            </div>
            <span
              className="text-[9px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--text-muted)" }}
            >
              {card.label}
            </span>
          </div>
          {"render" in card && card.render ? (
            card.render()
          ) : (
            <div
              className="text-2xl font-bold leading-none tabular-nums"
              style={{ fontFamily: "var(--font-jetbrains)", color: card.color }}
            >
              {card.value}
            </div>
          )}
          {"sub" in card && card.sub && (
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
