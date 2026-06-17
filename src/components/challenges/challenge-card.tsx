"use client";

import type { Challenge, ChallengeProgress } from "@/types";
import { CheckCircle, Circle, TrendingUp, Shield, Brain, Compass, Target } from "lucide-react";

interface ChallengeCardProps {
  challenge: Challenge;
  progress: ChallengeProgress;
}

const categoryConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  discipline: { label: "Discipline", color: "var(--color-info)", bg: "rgba(96, 165, 250, 0.12)", icon: Target },
  risk: { label: "Risk", color: "var(--color-warning)", bg: "rgba(251, 191, 36, 0.12)", icon: Shield },
  performance: { label: "Performance", color: "var(--color-profit)", bg: "rgba(74, 222, 128, 0.12)", icon: TrendingUp },
  psychology: { label: "Psychology", color: "var(--color-ai)", bg: "rgba(192, 132, 252, 0.12)", icon: Brain },
  diversification: { label: "Diversification", color: "var(--primary)", bg: "rgba(251, 191, 36, 0.08)", icon: Compass },
};

const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy: { label: "Easy", color: "var(--color-profit)" },
  medium: { label: "Medium", color: "var(--color-warning)" },
  hard: { label: "Hard", color: "var(--color-loss)" },
};

function ProgressRing({ progress, size = 52 }: { progress: number; size?: number }) {
  const stroke = 3.5;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progress / 100) * circ;

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border-subtle)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={progress >= 100 ? "var(--color-profit)" : progress >= 60 ? "var(--color-warning)" : "var(--color-info)"}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight={600}
        fill="var(--text-primary)"
        fontFamily="var(--font-jetbrains)"
      >
        {Math.min(100, Math.round(progress))}%
      </text>
    </svg>
  );
}

export function ChallengeCard({ challenge, progress }: ChallengeCardProps) {
  const catConfig = categoryConfig[challenge.category] || categoryConfig.discipline;
  const diffConfig = difficultyConfig[challenge.difficulty] || difficultyConfig.medium;
  const CatIcon = catConfig.icon;

  return (
    <div
      className="rounded-xl border p-4 transition-all hover:translate-y-[-2px]"
      style={{
        background: progress.passed
          ? "linear-gradient(135deg, rgba(74, 222, 128, 0.06), rgba(74, 222, 128, 0.02))"
          : "var(--surface-card)",
        borderColor: progress.passed ? "rgba(74, 222, 128, 0.2)" : "var(--border-subtle)",
        boxShadow: progress.passed
          ? "0 0 0 1px rgba(74, 222, 128, 0.08)"
          : "none",
      }}
    >
      {/* Header: icon + badges */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg text-lg shrink-0"
          style={{ background: catConfig.bg }}
        >
          {challenge.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-[13px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              {challenge.title}
            </div>
            {progress.passed && (
              <div
                className="flex items-center gap-0.5 text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(74, 222, 128, 0.12)", color: "var(--color-profit)" }}
              >
                <CheckCircle className="h-2.5 w-2.5" />
                Passed
              </div>
            )}
          </div>
          <div className="text-[11px] mt-0.5 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
            {challenge.description}
          </div>
        </div>
      </div>

      {/* Badge row */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <div
          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
          style={{ background: catConfig.bg, color: catConfig.color }}
        >
          <CatIcon className="h-2.5 w-2.5" />
          {catConfig.label}
        </div>
        <div
          className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
          style={{ background: `${diffConfig.color}15`, color: diffConfig.color }}
        >
          {diffConfig.label}
        </div>
        <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>
          {challenge.rule}
        </div>
      </div>

      {/* Progress ring + stats */}
      <div className="flex items-center gap-3 mb-3">
        <ProgressRing progress={progress.progress} />
        <div className="flex-1 space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold font-[var(--font-playfair)]" style={{
              color: progress.passed ? "var(--color-profit)" : progress.progress >= 60 ? "var(--color-warning)" : "var(--text-primary)",
            }}>
              {progress.current}
            </span>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              / {progress.target} {challenge.unit}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
            <span>{challenge.duration}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      {progress.details.length > 0 && (
        <div
          className="rounded-lg p-2.5 space-y-1 max-h-28 overflow-y-auto"
          style={{ background: "var(--surface-raised)" }}
        >
          {progress.details.map((detail, i) => {
            const isPositive = detail.startsWith("✅") || detail.includes("✅") || detail.includes("🎉") || detail.includes("Master") || detail.includes("Excellent") || detail.includes("Great") || detail.includes("Perfect") || detail.includes("Drawdown within") || detail.includes("Session discipline") || detail.includes("Win rate requirement met") || detail.includes("Scalp count target") || detail.includes("Target reached");
            return (
              <div
                key={i}
                className="flex items-start gap-1.5 text-[11px] leading-relaxed"
                style={{ color: isPositive ? "var(--color-profit)" : "var(--text-secondary)" }}
              >
                <Circle className="h-2 w-2 mt-0.5 shrink-0" fill={isPositive ? "var(--color-profit)" : "var(--text-muted)"} fillOpacity={isPositive ? 1 : 0.3} />
                <span>{detail.replace(/^[✅❌] /, "")}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
