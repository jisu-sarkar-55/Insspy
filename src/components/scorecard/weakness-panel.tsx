"use client";

import { AlertTriangle, TrendingUp } from "lucide-react";

interface WeaknessItem {
  pillar: string;
  label: string;
  score: number;
  tip: string;
}

interface WeaknessPanelProps {
  weaknesses: WeaknessItem[];
  strengths: WeaknessItem[];
}

function getColor(score: number): string {
  if (score >= 80) return "var(--color-profit)";
  if (score >= 60) return "var(--color-warning)";
  return "var(--color-loss)";
}

export function WeaknessPanel({ weaknesses, strengths }: WeaknessPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {weaknesses.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-loss)" }}>
            <AlertTriangle className="h-3 w-3" />
            Needs Improvement
          </div>
          <div className="space-y-2">
            {weaknesses.map((w) => (
              <div
                key={w.pillar}
                className="rounded-lg border p-3"
                style={{
                  background: "rgba(248, 113, 113, 0.04)",
                  borderColor: "rgba(248, 113, 113, 0.12)",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
                    {w.label}
                  </span>
                  <span className="text-[12px] font-bold font-[var(--font-playfair)]" style={{ color: getColor(w.score) }}>
                    {w.score}/100
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {w.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {strengths.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-profit)" }}>
            <TrendingUp className="h-3 w-3" />
            Strengths
          </div>
          <div className="space-y-2">
            {strengths.map((s) => (
              <div
                key={s.pillar}
                className="rounded-lg border p-3"
                style={{
                  background: "rgba(74, 222, 128, 0.04)",
                  borderColor: "rgba(74, 222, 128, 0.12)",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
                    {s.label}
                  </span>
                  <span className="text-[12px] font-bold font-[var(--font-playfair)]" style={{ color: getColor(s.score) }}>
                    {s.score}/100
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  <span className="font-semibold" style={{ color: "var(--color-profit)" }}>Keep it up. </span>
                  {s.score >= 80
                    ? "This is a standout area — maintain your approach."
                    : "Above average performance — small refinements can push this higher."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
