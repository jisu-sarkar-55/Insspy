"use client";

import { X } from "lucide-react";

interface ImprovementAreasProps {
  areas: string[];
}

export function ImprovementAreas({ areas }: ImprovementAreasProps) {
  return (
    <div
      className="card-surface rounded-lg border border-border p-5"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        Needs Improvement
      </div>
      <div className="space-y-2">
        {areas.map((area, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full"
              style={{ background: "var(--color-loss-bg)", border: "1px solid rgba(248, 113, 113, 0.2)" }}
            >
              <X className="h-3 w-3" style={{ color: "var(--color-loss)" }} />
            </div>
            <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
              {area}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
