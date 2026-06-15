"use client";

import type { StreakData } from "@/types";

interface StreakTrackerProps {
  data: StreakData;
}

const dotStyles = {
  W: {
    bg: "var(--color-profit-bg)",
    color: "var(--color-profit)",
    border: "rgba(74, 222, 128, 0.2)",
  },
  L: {
    bg: "var(--color-loss-bg)",
    color: "var(--color-loss)",
    border: "rgba(248, 113, 113, 0.2)",
  },
  B: {
    bg: "var(--surface-raised)",
    color: "var(--text-muted)",
    border: "var(--border-subtle)",
  },
};

export function StreakTracker({ data }: StreakTrackerProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
            Current streak
          </div>
          <div
            className="text-lg font-bold"
            style={{
              fontFamily: "var(--font-playfair)",
              color:
                data.currentType === "win"
                  ? "var(--color-profit)"
                  : data.currentType === "loss"
                  ? "var(--color-loss)"
                  : "var(--text-primary)",
            }}
          >
            {data.currentType === "win" ? "🔥 " : ""}
            {data.current}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
            Personal best
          </div>
          <div className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
            {data.personalBest}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
            Worst losing
          </div>
          <div className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--color-loss)" }}>
            {data.worstLosing}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {data.trades.map((t, i) => {
          const style = dotStyles[t];
          return (
            <div
              key={i}
              className="flex h-6 w-6 items-center justify-center rounded-sm text-[10px] font-semibold"
              style={{
                background: style.bg,
                color: style.color,
                border: `1px solid ${style.border}`,
              }}
            >
              {t}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <div
          className="flex-1 rounded-md p-2"
          style={{
            background: "var(--color-profit-bg)",
            border: "1px solid rgba(74, 222, 128, 0.15)",
          }}
        >
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
            Best profit run
          </div>
          <div className="text-sm font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--color-profit)" }}>
            +${data.bestProfitRun.amount.toFixed(0)}
          </div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            {data.bestProfitRun.count} trades
          </div>
        </div>
        <div
          className="flex-1 rounded-md p-2"
          style={{
            background: "var(--color-loss-bg)",
            border: "1px solid rgba(248, 113, 113, 0.15)",
          }}
        >
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
            Worst loss run
          </div>
          <div className="text-sm font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--color-loss)" }}>
            -${Math.abs(data.worstLossRun.amount).toFixed(0)}
          </div>
          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            {data.worstLossRun.count} trades
          </div>
        </div>
      </div>
    </div>
  );
}
