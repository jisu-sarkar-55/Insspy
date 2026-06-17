"use client";

import { Check } from "lucide-react";
import type { StrengthItem } from "@/types";

interface StrengthsAnalysisProps {
  items: StrengthItem[];
}

export function StrengthsAnalysis({ items }: StrengthsAnalysisProps) {
  return (
    <div
      className="card-featured rounded-lg p-5"
      style={{ background: "var(--surface-card)" }}
    >
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        Your Strengths
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full"
              style={{
                background: item.passed ? "var(--color-profit-bg)" : "var(--color-loss-bg)",
                border: `1px solid ${item.passed ? "rgba(74, 222, 128, 0.2)" : "rgba(248, 113, 113, 0.2)"}`,
              }}
            >
              <Check
                className="h-3 w-3"
                style={{ color: item.passed ? "var(--color-profit)" : "var(--color-loss)" }}
              />
            </div>
            <span
              className="text-[12px]"
              style={{ color: item.passed ? "var(--text-primary)" : "var(--text-secondary)" }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
