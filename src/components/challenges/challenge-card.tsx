"use client";

import type { Challenge, ChallengeProgress } from "@/types";

interface ChallengeCardProps {
  challenge: Challenge;
  progress: ChallengeProgress;
}

export function ChallengeCard({ challenge, progress }: ChallengeCardProps) {
  const getColor = () => {
    if (progress.passed) return "var(--color-profit)";
    if (progress.progress >= 60) return "var(--color-warning)";
    return "var(--color-info)";
  };

  return (
    <div
      className="rounded-lg border p-4 transition-all"
      style={{
        background: progress.passed
          ? "linear-gradient(135deg, rgba(74, 222, 128, 0.05), rgba(74, 222, 128, 0.02))"
          : "var(--surface-card)",
        borderColor: progress.passed ? "rgba(74, 222, 128, 0.2)" : "var(--border-subtle)",
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="text-2xl">{challenge.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
              {challenge.title}
            </div>
            {progress.passed && (
              <div
                className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ background: "var(--color-profit-bg)", color: "var(--color-profit)" }}
              >
                Passed
              </div>
            )}
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {challenge.description}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[16px] font-bold font-[var(--font-playfair)]" style={{ color: getColor() }}>
              {progress.current}
            </span>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              / {progress.target} {challenge.unit}
            </span>
          </div>
          <span className="text-[12px] font-semibold" style={{ color: getColor() }}>
            {progress.progress}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full" style={{ background: "var(--border-subtle)" }}>
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${progress.progress}%`, background: getColor() }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] mb-3" style={{ color: "var(--text-muted)" }}>
        <span>{challenge.duration}</span>
        <span>{challenge.rule}</span>
      </div>

      {progress.details.length > 0 && (
        <div
          className="rounded-lg p-2.5 max-h-32 overflow-y-auto"
          style={{ background: "var(--surface-raised)" }}
        >
          {progress.details.map((detail, i) => (
            <div key={i} className="text-[11px] py-0.5" style={{ color: "var(--text-secondary)" }}>
              {detail}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
