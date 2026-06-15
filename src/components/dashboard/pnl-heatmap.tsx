"use client";

import type { HeatmapDay } from "@/types";

interface PnlHeatmapProps {
  days: HeatmapDay[];
}

function getColor(pnl: number): string {
  if (pnl === 0) return "var(--border-subtle)";
  if (pnl > 100) return "rgba(74, 222, 128, 0.7)";
  if (pnl > 0) return "rgba(74, 222, 128, 0.35)";
  if (pnl < -30) return "rgba(248, 113, 113, 0.65)";
  return "rgba(248, 113, 113, 0.3)";
}

export function PnlHeatmap({ days }: PnlHeatmapProps) {
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div>
      <div className="mb-1 grid grid-cols-7 gap-[3px]">
        {dayLabels.map((d, i) => (
          <div
            key={i}
            className="text-center text-[9px]"
            style={{ color: "var(--text-muted)" }}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-[3px]">
        {days.map((d, i) => (
          <div
            key={i}
            className="h-6 rounded-[2px] transition-transform hover:scale-110"
            style={{
              background: d.dayOfMonth === 0 ? "transparent" : getColor(d.pnl),
            }}
            title={
              d.dayOfMonth > 0
                ? d.pnl !== 0
                  ? `${d.date}: ${d.pnl > 0 ? "+" : ""}$${d.pnl.toFixed(0)}`
                  : `${d.date}: No trade`
                : ""
            }
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1">
        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
          Loss
        </span>
        <div
          className="h-[10px] w-[14px] rounded-[2px]"
          style={{ background: "rgba(248, 113, 113, 0.65)" }}
        />
        <div
          className="h-[10px] w-[14px] rounded-[2px]"
          style={{ background: "rgba(248, 113, 113, 0.3)" }}
        />
        <div
          className="h-[10px] w-[14px] rounded-[2px]"
          style={{ background: "var(--border-subtle)" }}
        />
        <div
          className="h-[10px] w-[14px] rounded-[2px]"
          style={{ background: "rgba(74, 222, 128, 0.35)" }}
        />
        <div
          className="h-[10px] w-[14px] rounded-[2px]"
          style={{ background: "rgba(74, 222, 128, 0.7)" }}
        />
        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
          Win
        </span>
      </div>
    </div>
  );
}
