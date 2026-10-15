"use client";

import { Shield } from "lucide-react";
import type { TraderScorecard as ScorecardType } from "@/types";

interface TraderScorecardProps {
  data: ScorecardType | null;
}

const pillars = [
  { key: "riskManagement" as const, label: "Risk Management", color: "var(--color-profit)" },
  { key: "patience" as const, label: "Patience", color: "var(--color-info)" },
  { key: "execution" as const, label: "Execution", color: "var(--color-ai)" },
  { key: "consistency" as const, label: "Consistency", color: "var(--primary)" },
];

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  return "D";
}

export function TraderScorecard({ data }: TraderScorecardProps) {
  if (!data) return null;

  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (data.overall / 100) * circumference;

  return (
    <div
      className="card-featured rounded-lg p-5"
      style={{ background: "var(--surface-card)" }}
    >
      <div className="mb-4 flex items-center gap-2">
        <Shield className="h-4 w-4" style={{ color: "var(--color-profit)" }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Trader Discipline Scorecard
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <svg className="h-20 w-20" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle
              cx="40" cy="40" r="32" fill="none"
              stroke={data.overall >= 70 ? "var(--color-profit)" : data.overall >= 50 ? "var(--primary)" : "var(--color-loss)"}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
            <text x="40" y="38" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">
              {data.overall}
            </text>
            <text x="40" y="50" textAnchor="middle" fill="var(--text-muted)" fontSize="9">
              / 100
            </text>
          </svg>
        </div>

        <div className="flex-1 space-y-2">
          {pillars.map(({ key, label, color }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-[100px] text-[11px]" style={{ color: "var(--text-secondary)" }}>
                {label}
              </span>
              <div className="h-1.5 flex-1 rounded-full" style={{ background: "var(--border-subtle)" }}>
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${data[key]}%`, background: color }}
                />
              </div>
              <span className="w-7 text-right text-[11px] font-semibold" style={{ color }}>
                {data[key]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 text-center">
        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          Overall Grade:{" "}
        </span>
        <span className="text-[13px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--color-profit)" }}>
          {getGrade(data.overall)} Trader
        </span>
      </div>
    </div>
  );
}
