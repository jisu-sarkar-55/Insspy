"use client";

interface UsageBarProps {
  current: number;
  limit: number;
  label: string;
}

export function UsageBar({ current, limit, label }: UsageBarProps) {
  const pct = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
  const color = pct >= 90 ? "var(--color-loss)" : pct >= 75 ? "var(--color-warning)" : "var(--color-ai)";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex justify-between text-[11px] mb-1">
          <span style={{ color: "var(--text-secondary)" }}>{label}</span>
          <span style={{ color: "var(--text-muted)" }}>{current}/{limit}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-raised)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </div>
    </div>
  );
}
