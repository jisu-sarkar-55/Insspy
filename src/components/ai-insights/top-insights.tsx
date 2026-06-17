"use client";

import { Trophy, AlertTriangle, Globe, ShieldAlert } from "lucide-react";
import type { TopInsightCard, SessionInsight } from "@/types";

interface TopInsightsProps {
  bestInstrument: TopInsightCard | null;
  worstInstrument: TopInsightCard | null;
  bestSession: SessionInsight | null;
  worstSession: SessionInsight | null;
}

function InsightCard({ card, icon: Icon, iconColor }: {
  card: TopInsightCard;
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <div
      className="flex flex-col rounded-lg p-3"
      style={{ background: card.isPositive ? "rgba(74, 222, 128, 0.04)" : "rgba(248, 113, 113, 0.04)", border: `1px solid ${card.isPositive ? "rgba(74, 222, 128, 0.12)" : "rgba(248, 113, 113, 0.12)"}` }}
    >
      <div className="flex items-center gap-1.5 mb-2.5">
        <Icon className="h-3.5 w-3.5" style={{ color: iconColor }} />
        <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {card.label}
        </span>
      </div>
      <div className="text-base font-bold font-[var(--font-playfair)] truncate" style={{ color: "var(--text-primary)" }}>
        {card.value}
      </div>
      <div className="flex gap-3 mt-1.5 mb-2">
        <div>
          <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>WR</div>
          <div className="text-[12px] font-semibold" style={{ color: card.winRate > 50 ? "var(--color-profit)" : "var(--color-loss)" }}>
            {card.winRate.toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>PF</div>
          <div className="text-[12px] font-semibold" style={{ color: card.profitFactor > 1 ? "var(--color-profit)" : "var(--color-loss)" }}>
            {card.profitFactor.toFixed(1)}
          </div>
        </div>
      </div>
      <div className="mt-auto text-[10px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {card.detail}
      </div>
    </div>
  );
}

function SessionCard({ insight, icon: Icon, iconColor }: {
  insight: SessionInsight;
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <div
      className="flex flex-col rounded-lg p-3"
      style={{ background: insight.isPositive ? "rgba(74, 222, 128, 0.04)" : "rgba(248, 113, 113, 0.04)", border: `1px solid ${insight.isPositive ? "rgba(74, 222, 128, 0.12)" : "rgba(248, 113, 113, 0.12)"}` }}
    >
      <div className="flex items-center gap-1.5 mb-2.5">
        <Icon className="h-3.5 w-3.5" style={{ color: iconColor }} />
        <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {insight.label}
        </span>
      </div>
      <div className="text-base font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
        {insight.session}
      </div>
      <div className="flex gap-3 mt-1.5 mb-2">
        <div>
          <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>WR</div>
          <div className="text-[12px] font-semibold" style={{ color: insight.winRate > 50 ? "var(--color-profit)" : "var(--color-loss)" }}>
            {insight.winRate.toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>Avg R:R</div>
          <div className="text-[12px] font-semibold" style={{ color: insight.avgRR > 1 ? "var(--color-profit)" : "var(--color-loss)" }}>
            {insight.avgRR.toFixed(1)}R
          </div>
        </div>
      </div>
      <div className="mt-auto text-[10px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {insight.detail}
      </div>
    </div>
  );
}

export function TopInsights({ bestInstrument, worstInstrument, bestSession, worstSession }: TopInsightsProps) {
  const items = [
    bestInstrument && { type: "insight" as const, card: bestInstrument, icon: Trophy, color: "var(--color-profit)" },
    worstInstrument && { type: "insight" as const, card: worstInstrument, icon: AlertTriangle, color: "var(--color-loss)" },
    bestSession && { type: "session" as const, card: bestSession as SessionInsight, icon: Globe, color: "var(--color-profit)" },
    worstSession && { type: "session" as const, card: worstSession as SessionInsight, icon: ShieldAlert, color: "var(--primary)" },
  ].filter(Boolean);

  if (items.length === 0) return null;

  return (
    <div
      className="card-featured rounded-lg p-5"
      style={{ background: "var(--surface-card)" }}
    >
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        Top Insights
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, i) => {
          if (!item) return null;
          if (item.type === "insight") {
            const card = item.card as TopInsightCard;
            return <InsightCard key={i} card={card} icon={item.icon} iconColor={item.color} />;
          }
          const card = item.card as SessionInsight;
          return <SessionCard key={i} insight={card} icon={item.icon} iconColor={item.color} />;
        })}
      </div>
    </div>
  );
}
