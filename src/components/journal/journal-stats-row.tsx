"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Lightbulb, AlertTriangle, Sparkles } from "lucide-react";
import type { Trade } from "@/types";

interface StatsRowProps {
  trades: Trade[];
}

export function JournalStatsRow({ trades }: StatsRowProps) {
  const totalEntries = trades.length;

  const lessonsLearned = trades.filter(
    (t) =>
      t.followed_plan === true ||
      (t.notes && /lesson|learned|improve|better|next time/i.test(t.notes))
  ).length;

  const mistakesLogged = trades.filter(
    (t) => t.mistakes && t.mistakes.length > 0
  ).length;

  const bestInsights = trades.filter(
    (t) =>
      t.net_pnl !== null &&
      t.net_pnl > 0 &&
      t.followed_plan === true &&
      t.confidence_before &&
      t.confidence_before >= 7
  ).length;

  const stats = [
    {
      icon: BookOpen,
      label: "Total Entries",
      value: totalEntries,
      color: "var(--primary)",
      bg: "rgba(251, 191, 36, 0.1)",
    },
    {
      icon: Lightbulb,
      label: "Lessons Learned",
      value: lessonsLearned,
      color: "var(--color-profit)",
      bg: "var(--color-profit-bg)",
    },
    {
      icon: AlertTriangle,
      label: "Mistakes Logged",
      value: mistakesLogged,
      color: "var(--color-loss)",
      bg: "var(--color-loss-bg)",
    },
    {
      icon: Sparkles,
      label: "Best Insights",
      value: bestInsights,
      color: "var(--color-ai)",
      bg: "var(--color-ai-bg)",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="hover-lift"
          style={{
            background: "var(--surface-card)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: stat.bg }}
              >
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
              <div>
                <div className="mono-data text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {stat.value}
                </div>
                <div className="section-label">{stat.label}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
