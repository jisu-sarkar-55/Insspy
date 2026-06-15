"use client";

import { useMemo, useState, useEffect } from "react";
import { Trash2, Check } from "lucide-react";
import type { Goal } from "@/types";

interface GoalCardProps {
  goal: Goal;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, onDelete }: GoalCardProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const daysLeft = useMemo(() => {
    if (!goal.end_date) return null;
    return Math.max(0, Math.ceil((new Date(goal.end_date).getTime() - now) / (1000 * 60 * 60 * 24)));
  }, [goal.end_date, now]);
  const progress = goal.target_value > 0
    ? Math.min(100, Math.round((Math.abs(goal.current_value) / Math.abs(goal.target_value)) * 100))
    : 0;

  const isActive = goal.status === "active";
  const isCompleted = goal.status === "completed";

  const getColor = () => {
    if (isCompleted) return "var(--color-profit)";
    if (goal.status === "failed") return "var(--color-loss)";
    if (progress >= 80) return "var(--color-profit)";
    if (progress >= 50) return "var(--color-warning)";
    return "var(--color-info)";
  };

  const getBorderColor = () => {
    if (isCompleted) return "rgba(74, 222, 128, 0.2)";
    if (goal.status === "failed") return "rgba(248, 113, 113, 0.2)";
    return "var(--border-subtle)";
  };

  return (
    <div
      className="rounded-lg border p-4 transition-all"
      style={{ background: "var(--surface-card)", borderColor: getBorderColor() }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
              {goal.title}
            </div>
            {isCompleted && (
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full"
                style={{ background: "var(--color-profit-bg)", border: "1px solid rgba(74, 222, 128, 0.2)" }}
              >
                <Check className="h-3 w-3" style={{ color: "var(--color-profit)" }} />
              </div>
            )}
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            {goal.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Goal
          </div>
        </div>
        {isActive && (
          <button
            onClick={() => onDelete(goal.id)}
            className="p-1 rounded transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] font-bold font-[var(--font-playfair)]" style={{ color: getColor() }}>
              {goal.unit === "$" ? `$${Math.abs(goal.current_value).toLocaleString()}` : Math.abs(goal.current_value).toLocaleString()}
            </span>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              / {goal.unit === "$" ? `$${goal.target_value.toLocaleString()}` : goal.target_value.toLocaleString()} {goal.unit}
            </span>
          </div>
          <span className="text-[12px] font-semibold" style={{ color: getColor() }}>
            {progress}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full" style={{ background: "var(--border-subtle)" }}>
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${progress}%`, background: getColor() }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {daysLeft !== null ? (
            <>
              {isCompleted ? (
                <span style={{ color: "var(--color-profit)" }}>Completed</span>
              ) : goal.status === "failed" ? (
                <span style={{ color: "var(--color-loss)" }}>Failed</span>
              ) : (
                <>
                  {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
                </>
              )}
            </>
          ) : (
            <span>No deadline</span>
          )}
        </div>
        <div
          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
          style={{
            background: isActive ? "var(--color-info-bg)" : isCompleted ? "var(--color-profit-bg)" : "var(--color-loss-bg)",
            color: isActive ? "var(--color-info)" : isCompleted ? "var(--color-profit)" : "var(--color-loss)",
          }}
        >
          {goal.status}
        </div>
      </div>
    </div>
  );
}
