"use client";

interface ScoreRingProps {
  score: number;
  label: string;
  size?: number;
}

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  return "D";
}

function getColor(score: number): string {
  if (score >= 80) return "var(--color-profit)";
  if (score >= 60) return "var(--color-warning)";
  return "var(--color-loss)";
}

export function ScoreRing({ score, label, size = 160 }: ScoreRingProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(240, 234, 214, 0.05)"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x={size / 2}
          y={size / 2 - 8}
          textAnchor="middle"
          fill="var(--text-primary)"
          fontSize="32"
          fontWeight="700"
          fontFamily="var(--font-playfair)"
        >
          {score}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 14}
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="13"
          fontFamily="var(--font-playfair)"
        >
          / 100
        </text>
      </svg>
      <div className="mt-2 text-center">
        <div className="text-[14px] font-bold" style={{ color }}>
          Grade {getGrade(score)}
        </div>
        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {label}
        </div>
      </div>
    </div>
  );
}
