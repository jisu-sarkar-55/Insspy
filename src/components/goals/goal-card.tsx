"use client";

import { Trash2, Check } from "lucide-react";
import type { Goal } from "@/types";

interface GoalCardProps {
  goal: Goal;
  onDelete: (id: string) => void;
  onToggle: (id: string, completed: boolean) => void;
}

export function GoalCard({ goal, onDelete, onToggle }: GoalCardProps) {
  const isCompleted = goal.status === "completed";

  return (
    <div
      className="group flex items-center gap-3 rounded-lg border px-4 py-3 transition-all hover:border-opacity-60"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <button
        onClick={() => onToggle(goal.id, !isCompleted)}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors"
        style={{
          borderColor: isCompleted ? "var(--color-profit)" : "var(--border-subtle)",
          background: isCompleted ? "var(--color-profit-bg)" : "transparent",
        }}
      >
        {isCompleted && <Check className="h-3 w-3" style={{ color: "var(--color-profit)" }} />}
      </button>

      <span
        className="flex-1 text-[13px] transition-all"
        style={{
          color: isCompleted ? "var(--text-muted)" : "var(--text-primary)",
          textDecoration: isCompleted ? "line-through" : "none",
        }}
      >
        {goal.title}
      </span>

      <button
        onClick={() => onDelete(goal.id)}
        className="shrink-0 rounded p-1 opacity-0 transition-opacity group-hover:opacity-60 hover:opacity-100!"
        style={{ color: "var(--text-muted)" }}
        title="Delete goal"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
