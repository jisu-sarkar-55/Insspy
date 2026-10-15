"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreItem {
  label: string;
  score: number;
  description: string;
  trend: "up" | "down" | "stable";
}

interface ScoreBreakdownProps {
  scores: ScoreItem[];
}

function getColor(score: number): string {
  if (score >= 80) return "var(--color-profit)";
  if (score >= 60) return "var(--color-warning)";
  return "var(--color-loss)";
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="h-3 w-3" style={{ color: "var(--color-profit)" }} />;
  if (trend === "down") return <TrendingDown className="h-3 w-3" style={{ color: "var(--color-loss)" }} />;
  return <Minus className="h-3 w-3" style={{ color: "var(--text-muted)" }} />;
}

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  return (
    <div className="space-y-4">
      {scores.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
                {item.label}
              </span>
              <TrendIcon trend={item.trend} />
            </div>
            <span className="text-[13px] font-bold font-[var(--font-playfair)]" style={{ color: getColor(item.score) }}>
              {item.score}
            </span>
          </div>
          <div className="h-2 w-full rounded-full" style={{ background: "var(--border-subtle)" }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${item.score}%`, background: getColor(item.score) }}
            />
          </div>
          <div className="mt-1 text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {item.description}
          </div>
        </div>
      ))}
    </div>
  );
}
