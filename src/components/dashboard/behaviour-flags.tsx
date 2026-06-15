"use client";

import type { BehaviourFlag } from "@/types";

interface BehaviourFlagsProps {
  flags: BehaviourFlag[];
}

const statusStyles = {
  ok: {
    bg: "var(--color-profit-bg)",
    dot: "var(--color-profit)",
    text: "var(--color-profit)",
  },
  warn: {
    bg: "var(--color-warning-bg)",
    dot: "var(--primary)",
    text: "var(--primary)",
  },
  bad: {
    bg: "var(--color-loss-bg)",
    dot: "var(--color-loss)",
    text: "var(--color-loss)",
  },
};

export function BehaviourFlags({ flags }: BehaviourFlagsProps) {
  return (
    <div className="space-y-2">
      {flags.map((flag) => {
        const style = statusStyles[flag.status];
        return (
          <div
            key={flag.id}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2"
            style={{ background: style.bg }}
          >
            <div
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: style.dot }}
            />
            <div
              className="flex-1 text-[12px]"
              style={{ color: "var(--text-primary)" }}
            >
              {flag.label}
            </div>
            <div className="text-[11px] font-semibold" style={{ color: style.text }}>
              {flag.detail}
            </div>
          </div>
        );
      })}
    </div>
  );
}
