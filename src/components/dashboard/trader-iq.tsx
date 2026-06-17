"use client";

import Link from "next/link";
import { ArrowUpRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { TraderScorecard } from "@/types";

interface TraderIQProps {
  data: TraderScorecard | null;
}

const pillars: { key: keyof TraderScorecard["trends"]; label: string; color: string }[] = [
  { key: "riskManagement", label: "Risk Management", color: "var(--color-profit)" },
  { key: "execution", label: "Execution", color: "var(--color-ai)" },
  { key: "consistency", label: "Consistency", color: "var(--primary)" },
  { key: "patience", label: "Patience", color: "var(--color-info)" },
  { key: "psychology", label: "Psychology", color: "var(--color-premium, #8b5cf6)" },
  { key: "discipline", label: "Discipline", color: "var(--color-warning)" },
];

function getGradeColor(grade: string): string {
  if (grade.startsWith("Elite")) return "var(--color-profit)";
  if (grade.startsWith("Pro")) return "var(--color-ai)";
  if (grade.startsWith("Advanced")) return "var(--color-warning)";
  if (grade.startsWith("Apprentice")) return "var(--color-info)";
  return "var(--color-loss)";
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="h-2.5 w-2.5" style={{ color: "var(--color-profit)" }} />;
  if (trend === "down") return <TrendingDown className="h-2.5 w-2.5" style={{ color: "var(--color-loss)" }} />;
  return <Minus className="h-2.5 w-2.5" style={{ color: "var(--text-muted)" }} />;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "var(--color-profit)";
  if (score >= 60) return "var(--color-warning)";
  return "var(--color-loss)";
}

export function TraderIQ({ data }: TraderIQProps) {
  const circumference = 2 * Math.PI * 32;
  const score = data?.overall ?? 0;
  const grade = data?.overallGrade ?? "Novice Trader";
  const offset = circumference - (score / 100) * circumference;
  const scoreColor = getScoreColor(score);

  return (
    <div
      className="relative overflow-hidden rounded-lg border p-5 card-surface"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-[140px] w-[140px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="mb-2 text-[9px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: "var(--text-muted)" }}
      >
        Trader IQ Score
      </div>
      <div className="flex items-center gap-4">
        <svg className="h-20 w-20 shrink-0" viewBox="0 0 80 80">
          <circle
            cx="40" cy="40" r="32"
            fill="none" stroke="var(--border-subtle)" strokeWidth="8"
          />
          <circle
            cx="40" cy="40" r="32"
            fill="none" stroke={scoreColor} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            style={{ transition: "stroke-dashoffset 600ms ease-out" }}
          />
          <text
            x="40" y="38" textAnchor="middle"
            fill={scoreColor} fontSize="18" fontWeight="700"
            fontFamily="var(--font-playfair), serif"
          >
            {score}
          </text>
          <text
            x="40" y="50" textAnchor="middle"
            fill="var(--text-muted)" fontSize="9"
            fontFamily="var(--font-inter), sans-serif"
          >
            / 100
          </text>
        </svg>
        <div>
          <div
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: scoreColor }}
          >
            {score}
          </div>
          <div
            className="text-[11px] font-semibold"
            style={{ color: getGradeColor(grade) }}
          >
            {grade}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-[7px]">
        {pillars.map(({ key, label, color }) => {
          const pillarScore = data ? data[key] : 0;
          const trend = data?.trends?.[key] ?? "stable";
          return (
            <div key={key} className="flex items-center gap-2">
              <span
                className="w-[78px] text-[11px]"
                style={{ color: "var(--text-secondary)" }}
              >
                {label}
              </span>
              <div
                className="h-1 flex-1 rounded-full"
                style={{ background: "var(--border-subtle)" }}
              >
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: `${pillarScore}%`,
                    background: color,
                  }}
                />
              </div>
              <span
                className="w-7 text-right text-[11px]"
                style={{ color }}
              >
                {pillarScore}
              </span>
              <div className="w-3 shrink-0 flex items-center justify-center">
                {data && <TrendIcon trend={trend} />}
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href="/dashboard/scorecard"
        className="mt-3 flex items-center gap-1 text-[11px] font-medium transition-opacity hover:opacity-80"
        style={{ color: "var(--color-premium, #8b5cf6)" }}
      >
        View Full Scorecard
        <ArrowUpRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
