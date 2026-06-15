"use client";

import { Lock } from "lucide-react";
import type { InsufficientDataSection } from "@/types";

interface InsufficientDataProps {
  section: InsufficientDataSection;
}

export function InsufficientData({ section }: InsufficientDataProps) {
  const progress = Math.round((section.current / section.required) * 100);

  return (
    <div
      className="card-surface rounded-lg border border-border p-5"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: "var(--surface-raised)" }}
        >
          <Lock className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
        </div>
        <div>
          <div className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>
            {section.message}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1.5 w-32 rounded-full" style={{ background: "var(--border-subtle)" }}>
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${progress}%`, background: "var(--color-ai)" }}
              />
            </div>
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              {section.current}/{section.required}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
