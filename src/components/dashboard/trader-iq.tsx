"use client";

import type { TraderIQ as TraderIQType } from "@/types";

interface TraderIQProps {
  data: TraderIQType;
}

const pillars = [
  { key: "risk" as const, label: "Risk control", color: "var(--color-profit)" },
  { key: "patience" as const, label: "Patience", color: "var(--color-info)" },
  { key: "execution" as const, label: "Execution", color: "var(--color-ai)" },
  { key: "consistency" as const, label: "Consistency", color: "var(--primary)" },
  { key: "discipline" as const, label: "Discipline", color: "var(--color-profit)" },
];

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  return "D";
}

export function TraderIQ({ data }: TraderIQProps) {
  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (data.total / 100) * circumference;

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
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="8"
          />
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            style={{ transition: "stroke-dashoffset 600ms ease-out" }}
          />
          <text
            x="40"
            y="38"
            textAnchor="middle"
            fill="var(--primary)"
            fontSize="18"
            fontWeight="700"
            fontFamily="var(--font-playfair), serif"
          >
            {data.total}
          </text>
          <text
            x="40"
            y="50"
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="9"
            fontFamily="var(--font-inter), sans-serif"
          >
            / 100
          </text>
        </svg>
        <div>
          <div
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--primary)" }}
          >
            {data.total}
          </div>
          <div
            className="text-[11px] font-semibold"
            style={{ color: "var(--primary)" }}
          >
            Grade {getGrade(data.total)} Trader
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-[7px]">
        {pillars.map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="w-[70px] text-[11px]"
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
                  width: `${data[key]}%`,
                  background: color,
                }}
              />
            </div>
            <span
              className="w-7 text-right text-[11px]"
              style={{ color }}
            >
              {data[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
