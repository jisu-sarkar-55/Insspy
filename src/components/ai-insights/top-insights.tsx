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
      className="card-surface rounded-lg border border-border p-4"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: iconColor }} />
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {card.label}
        </span>
      </div>
      <div className="mb-2 text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
        {card.value}
      </div>
      <div className="mb-2 flex gap-4">
        <div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Win Rate</div>
          <div className="text-[13px] font-semibold font-[var(--font-playfair)]" style={{ color: card.winRate > 50 ? "var(--color-profit)" : "var(--color-loss)" }}>
            {card.winRate.toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Profit Factor</div>
          <div className="text-[13px] font-semibold font-[var(--font-playfair)]" style={{ color: card.profitFactor > 1 ? "var(--color-profit)" : "var(--color-loss)" }}>
            {card.profitFactor.toFixed(1)}
          </div>
        </div>
      </div>
      <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
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
      className="card-surface rounded-lg border border-border p-4"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: iconColor }} />
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {insight.label}
        </span>
      </div>
      <div className="mb-2 text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
        {insight.session}
      </div>
      <div className="mb-2 flex gap-4">
        <div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Win Rate</div>
          <div className="text-[13px] font-semibold font-[var(--font-playfair)]" style={{ color: insight.winRate > 50 ? "var(--color-profit)" : "var(--color-loss)" }}>
            {insight.winRate.toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Avg RR</div>
          <div className="text-[13px] font-semibold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
            {insight.avgRR.toFixed(1)}
          </div>
        </div>
      </div>
      <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
        {insight.detail}
      </div>
    </div>
  );
}

export function TopInsights({ bestInstrument, worstInstrument, bestSession, worstSession }: TopInsightsProps) {
  return (
    <div
      className="card-surface rounded-lg border border-border p-5"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        Top Insights
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {bestInstrument && (
          <InsightCard card={bestInstrument} icon={Trophy} iconColor="var(--color-profit)" />
        )}
        {worstInstrument && (
          <InsightCard card={worstInstrument} icon={AlertTriangle} iconColor="var(--color-loss)" />
        )}
        {bestSession && (
          <SessionCard insight={bestSession} icon={Globe} iconColor="var(--color-profit)" />
        )}
        {worstSession && (
          <SessionCard insight={worstSession} icon={ShieldAlert} iconColor="var(--primary)" />
        )}
      </div>
    </div>
  );
}
