"use client";

import type { SessionStat } from "@/types";

interface SessionPerformanceProps {
  sessions: SessionStat[];
}

const sessionColors: Record<string, string> = {
  London: "var(--color-profit)",
  "New York": "var(--color-loss)",
  Asia: "var(--primary)",
  Overlap: "var(--color-ai)",
};

export function SessionPerformance({ sessions }: SessionPerformanceProps) {
  const worstSession = sessions.reduce(
    (worst, s) => (s.pnl < worst.pnl ? s : worst),
    sessions[0]
  );

  return (
    <div className="space-y-3">
      <div className="space-y-2.5">
        {sessions.map((s) => {
          const color = sessionColors[s.session] || "var(--text-secondary)";
          return (
            <div key={s.session} className="flex items-center gap-2.5">
              <div
                className="w-[55px] text-[11px]"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.session}
              </div>
              <div
                className="relative h-5 flex-1 overflow-hidden rounded"
                style={{ background: "var(--surface-raised)" }}
              >
                <div
                  className="flex h-full items-center rounded px-1.5 text-[10px] font-semibold"
                  style={{
                    width: `${Math.max(s.winRate, 5)}%`,
                    background: color,
                    color: "var(--primary-foreground)",
                  }}
                >
                  {s.winRate.toFixed(0)}%
                </div>
              </div>
              <div className="flex min-w-[110px] gap-2">
                <span
                  className="text-[10px] font-medium font-[var(--font-jetbrains)]"
                  style={{
                    color: s.pnl >= 0 ? "var(--color-profit)" : "var(--color-loss)",
                  }}
                >
                  ${s.pnl.toFixed(0)}
                </span>
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {s.trades}T
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {worstSession && worstSession.pnl < 0 && (
        <div
          className="rounded-md p-2 text-[10px]"
          style={{
            background: "var(--color-loss-bg)",
            border: "1px solid rgba(248, 113, 113, 0.12)",
            color: "var(--color-loss)",
          }}
        >
          Stop trading {worstSession.session} session — it&apos;s costing you $
          {Math.abs(worstSession.pnl).toFixed(0)}/month
        </div>
      )}
    </div>
  );
}
