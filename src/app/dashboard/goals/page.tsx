"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GoalCard } from "@/components/goals/goal-card";
import { CreateGoalDialog } from "@/components/goals/create-goal-dialog";
import type { Goal, GoalFormData } from "@/types";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;
    async function fetchGoals() {
      const { data } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });

      if (!cancelled && data) setGoals(data);
      if (!cancelled) setLoading(false);
    }
    fetchGoals();
    return () => { cancelled = true; };
  }, [supabase]);

  const handleCreate = async (formData: GoalFormData) => {
    setCreating(true);
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setGoals([data, ...goals]);
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this goal?")) return;
    const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
    if (res.ok) {
      setGoals(goals.filter((g) => g.id !== id));
    }
  };

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");
  const failedGoals = goals.filter((g) => g.status === "failed");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: "var(--text-muted)" }}>Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>Goals</h1>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            Set targets and track your progress
          </p>
        </div>
        <CreateGoalDialog onSubmit={handleCreate} loading={creating} />
      </div>

      {goals.length === 0 ? (
        <div
          className="rounded-lg border p-12 text-center"
          style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
        >
          <div className="text-[14px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            No goals yet
          </div>
          <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            Create your first goal to start tracking your trading performance targets.
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {activeGoals.length > 0 && (
            <div>
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Active Goals ({activeGoals.length})
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div>
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Completed ({completedGoals.length})
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {failedGoals.length > 0 && (
            <div>
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Failed ({failedGoals.length})
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {failedGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
