"use client";

interface EquityMiniProps {
  data: { date: string; equity: number }[];
}

export function EquityMini({ data }: EquityMiniProps) {
  if (data.length < 2) {
    return (
      <div
        className="flex h-20 items-center justify-center rounded-lg text-[11px]"
        style={{ background: "var(--surface-raised)", color: "var(--text-muted)" }}
      >
        Need at least 2 trades for equity curve
      </div>
    );
  }

  const values = data.map((d) => d.equity);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 240;
  const h = 80;
  const padding = 4;

  const points = values.map((v, i) => ({
    x: padding + (i / (values.length - 1)) * (w - padding * 2),
    y: padding + (1 - (v - min) / range) * (h - padding * 2),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${h} L${points[0].x},${h} Z`;

  return (
    <div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-20 w-full"
          preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#eqGrad)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.5"
        />
      </svg>
      <div className="mt-2 flex gap-3">
        <span className="text-[10px]" style={{ color: "var(--primary)" }}>
          ● Balance
        </span>
      </div>
    </div>
  );
}
