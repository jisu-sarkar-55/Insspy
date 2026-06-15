"use client";

interface ScoreBreakdownProps {
  scores: {
    label: string;
    score: number;
    description: string;
  }[];
}

function getColor(score: number): string {
  if (score >= 80) return "var(--color-profit)";
  if (score >= 60) return "var(--color-warning)";
  return "var(--color-loss)";
}

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  return (
    <div className="space-y-4">
      {scores.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
              {item.label}
            </span>
            <span className="text-[13px] font-bold font-[var(--font-playfair)]" style={{ color: getColor(item.score) }}>
              {item.score}/100
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full" style={{ background: "var(--border-subtle)" }}>
            <div
              className="h-2.5 rounded-full transition-all"
              style={{ width: `${item.score}%`, background: getColor(item.score) }}
            />
          </div>
          <div className="mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
            {item.description}
          </div>
        </div>
      ))}
    </div>
  );
}
