"use client";

import { useEffect, useState } from "react";

interface ScoreRingProps {
  score: number;
  label: string;
  grade: string;
  size?: number;
}

function getColor(score: number): string {
  if (score >= 80) return "var(--color-profit)";
  if (score >= 60) return "var(--color-warning)";
  return "var(--color-loss)";
}

function getGradeColor(grade: string): string {
  if (grade.startsWith("Elite")) return "var(--color-profit)";
  if (grade.startsWith("Pro")) return "var(--color-ai)";
  if (grade.startsWith("Advanced")) return "var(--color-warning)";
  if (grade.startsWith("Apprentice")) return "var(--color-info)";
  return "var(--color-loss)";
}

export function ScoreRing({ score, label, grade, size = 180 }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getColor(score);

  useEffect(() => {
    let frame: number;
    const duration = 800;
    const start = performance.now();
    function animate(t: number) {
      const elapsed = t - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * ease));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(240, 234, 214, 0.06)"
            strokeWidth="12"
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
          {/* Glow circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            opacity={0.2}
            style={{ filter: "blur(6px)" }}
          />
          {/* Score text */}
          <text
            x={size / 2}
            y={size / 2 - 6}
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize="38"
            fontWeight="700"
            fontFamily="var(--font-playfair)"
          >
            {animatedScore}
          </text>
          <text
            x={size / 2}
            y={size / 2 + 16}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="13"
            fontFamily="var(--font-playfair)"
          >
            / 100
          </text>
        </svg>
      </div>
      <div className="mt-3 text-center">
        <div
          className="text-sm font-bold tracking-wide"
          style={{ color: getGradeColor(grade) }}
        >
          {grade}
        </div>
        <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
          {label}
        </div>
      </div>
    </div>
  );
}
