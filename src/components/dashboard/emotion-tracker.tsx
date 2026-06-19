"use client";

import type { EmotionStat, HourStat } from "@/types";

interface EmotionTrackerProps {
  emotions: EmotionStat[];
  bestHours: HourStat[];
}

export function EmotionTracker({ emotions, bestHours }: EmotionTrackerProps) {
  const calmEmotion = emotions.find((e) => e.label === "Calm");
  const fomoEmotion = emotions.find((e) => e.label === "FOMO");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
        {emotions.map((e) => (
          <div
            key={e.label}
            className="rounded-md p-2 text-center"
            style={{ background: "var(--surface-raised)" }}
          >
            <div className="text-lg">{e.emoji}</div>
            <div className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
              {e.label}
            </div>
            <div
              className="mt-0.5 text-sm font-bold"
              style={{
                fontFamily: "var(--font-playfair)",
                color:
                  e.winRate >= 60
                    ? "var(--color-profit)"
                    : e.winRate >= 40
                    ? "var(--primary)"
                    : "var(--color-loss)",
              }}
            >
              {e.count}
            </div>
          </div>
        ))}
      </div>

      {calmEmotion && fomoEmotion && (
        <div
          className="rounded-md p-2"
          style={{
            background: "var(--color-profit-bg)",
            border: "1px solid rgba(74, 222, 128, 0.15)",
          }}
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-profit)" }}>
            State insight
          </div>
          <div className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
            When calm: {calmEmotion.winRate.toFixed(0)}% WR · When FOMO:{" "}
            {fomoEmotion.winRate.toFixed(0)}% WR
          </div>
        </div>
      )}

      {bestHours.length > 0 && (
        <div>
          <div className="mb-1.5 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
            Best hours to trade
          </div>
          <div className="space-y-1">
            {bestHours.slice(0, 3).map((h) => (
              <div
                key={h.hour}
                className="flex items-center justify-between rounded px-2 py-1 text-[11px]"
                style={{ background: "var(--surface-raised)" }}
              >
                <span style={{ color: "var(--text-secondary)" }}>{h.hour}</span>
                <span
                  className="font-semibold font-[var(--font-jetbrains)]"
                  style={{
                    color:
                      h.winRate >= 60
                        ? "var(--color-profit)"
                        : h.winRate >= 40
                        ? "var(--color-info)"
                        : "var(--color-loss)",
                  }}
                >
                  {h.winRate.toFixed(0)}% WR
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
