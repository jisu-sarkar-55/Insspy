"use client";

import { Brain, Flame, Clock, TrendingUp, Shield } from "lucide-react";
import type { AiCoachingInsight } from "@/types";

interface AiCoachingPanelProps {
  insights: AiCoachingInsight[];
}

const severityConfig = {
  critical: {
    bg: "var(--color-loss-bg)",
    border: "rgba(248, 113, 113, 0.15)",
    icon: Flame,
    iconColor: "var(--color-loss)",
  },
  warning: {
    bg: "var(--color-warning-bg)",
    border: "rgba(251, 191, 36, 0.15)",
    icon: Clock,
    iconColor: "var(--primary)",
  },
  positive: {
    bg: "var(--color-profit-bg)",
    border: "rgba(74, 222, 128, 0.15)",
    icon: TrendingUp,
    iconColor: "var(--color-profit)",
  },
  tip: {
    bg: "var(--color-ai-bg)",
    border: "rgba(192, 132, 252, 0.15)",
    icon: Shield,
    iconColor: "var(--color-ai)",
  },
};

export function AiCoachingPanel({ insights }: AiCoachingPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="mb-1 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: "var(--text-muted)" }}
      >
        <Brain className="h-4 w-4" style={{ color: "var(--color-ai)" }} />
        AI Coaching — Live Insights
      </div>
      {insights.length === 0 ? (
        <div
          className="rounded-lg p-4 text-center text-[12px]"
          style={{ background: "var(--surface-raised)", color: "var(--text-muted)" }}
        >
          Add more trades to unlock AI coaching insights
        </div>
      ) : (
        insights.map((insight, i) => {
          const config = severityConfig[insight.severity];
          const Icon = config.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg p-3"
              style={{
                background: config.bg,
                border: `1px solid ${config.border}`,
              }}
            >
              <Icon
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: config.iconColor }}
              />
              <div>
                <div
                  className="text-[12px] font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {insight.title}
                </div>
                <div
                  className="mt-0.5 text-[11px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {insight.body}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
