"use client";

import type { HourHeatmapCell } from "@/types";

interface Props {
  data: HourHeatmapCell[];
}

function getColor(pnl: number, hasData: boolean): string {
  if (!hasData) return "rgba(255,255,255,0.02)";
  if (pnl > 50) return "rgba(74, 222, 128,0.8)";
  if (pnl > 20) return "rgba(74, 222, 128,0.5)";
  if (pnl > 0) return "rgba(74, 222, 128,0.25)";
  if (pnl < -50) return "rgba(248, 113, 113,0.8)";
  if (pnl < -20) return "rgba(248, 113, 113,0.5)";
  if (pnl < 0) return "rgba(248, 113, 113,0.25)";
  return "rgba(255,255,255,0.04)";
}

export function HourHeatmap({ data }: Props) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  if (data.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        No hour data
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="mb-1 grid gap-[2px]" style={{ gridTemplateColumns: "40px repeat(24, 1fr)" }}>
            <div />
            {hours.map((h) => (
              <div key={h} className="text-center text-[8px]" style={{ color: "var(--text-muted)" }}>
                {h}
              </div>
            ))}
          </div>
          {days.map((day, di) => (
            <div key={day} className="grid gap-[2px]" style={{ gridTemplateColumns: "40px repeat(24, 1fr)" }}>
              <div className="flex items-center text-[9px]" style={{ color: "var(--text-muted)" }}>{day}</div>
              {hours.map((h) => {
                const cell = data.find((c) => c.hour === h && c.dayOfWeek === di);
                const hasData = cell ? cell.trades > 0 : false;
                return (
                  <div
                    key={h}
                    className="h-5 rounded-[2px] transition-transform hover:scale-110"
                    style={{ background: getColor(cell?.avgPnl || 0, hasData) }}
                    title={cell && cell.trades > 0 ? `${day} ${h}:00 — ${cell.trades}T, avg $${cell.avgPnl.toFixed(0)}` : `${day} ${h}:00 — no data`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>Loss</span>
        <div className="h-2.5 w-3 rounded-sm" style={{ background: "rgba(248, 113, 113,0.7)" }} />
        <div className="h-2.5 w-3 rounded-sm" style={{ background: "rgba(248, 113, 113,0.35)" }} />
        <div className="h-2.5 w-3 rounded-sm" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="h-2.5 w-3 rounded-sm" style={{ background: "rgba(74, 222, 128,0.35)" }} />
        <div className="h-2.5 w-3 rounded-sm" style={{ background: "rgba(74, 222, 128,0.7)" }} />
        <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>Win</span>
      </div>
    </div>
  );
}
