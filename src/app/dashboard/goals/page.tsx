"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GoalCard } from "@/components/goals/goal-card";
import { CreateGoalDialog } from "@/components/goals/create-goal-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AdBanner } from "@/components/ads/ad-banner";
import type { Goal, GoalFormData } from "@/types";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function fetchGoals() {
      setError(null);
      try {
        await supabase.auth.getUser();
        const res = await fetch("/api/goals");
        if (!res.ok) throw new Error("Failed to load goals");
        const data = await res.json();
        if (!cancelled) setGoals(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load goals");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchGoals();
    return () => { cancelled = true; };
  }, []);

  const handleCreate = async (formData: GoalFormData): Promise<boolean> => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to create goal" }));
        throw new Error(err.error || "Failed to create goal");
      }
      const data = await res.json();
      setGoals([data, ...goals]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create goal");
      return false;
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    const status = completed ? "completed" : "active";
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to update goal" }));
        throw new Error(err.error || "Failed to update goal");
      }
      setGoals(goals.map((g) => (g.id === id ? { ...g, status } : g)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update goal");
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTarget(id);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/goals/${deleteTarget}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to delete goal" }));
        throw new Error(err.error || "Failed to delete goal");
      }
      setGoals(goals.filter((g) => g.id !== deleteTarget));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete goal");
    }
    setDeleteTarget(null);
  };

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

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
            Track your trading objectives
          </p>
        </div>
        <CreateGoalDialog onSubmit={handleCreate} loading={creating} />
      </div>

      <div className="flex justify-center py-4">
        <AdBanner slot="goals-top" />
      </div>

      {error && (
        <div
          className="rounded-lg p-3 text-sm"
          style={{ background: "var(--color-loss-bg)", border: "1px solid rgba(248, 113, 113, 0.2)", color: "var(--color-loss)" }}
        >
          {error}
        </div>
      )}

      {goals.length === 0 ? (
        <div
          className="rounded-lg border p-12 text-center"
          style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
        >
          <div className="text-[14px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            No goals yet
          </div>
          <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            Create your first goal to start tracking.
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {activeGoals.length > 0 && (
            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Active &mdash; {activeGoals.length}
              </div>
              <div className="space-y-2">
                {activeGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} onToggle={handleToggle} />
                ))}
              </div>
            </div>
          )}

          {completedGoals.length > 0 && (
            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Completed &mdash; {completedGoals.length}
              </div>
              <div className="space-y-2">
                {completedGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} onToggle={handleToggle} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Goal"
        description="Are you sure you want to delete this goal?"
        onConfirm={executeDelete}
      />

      <div className="flex justify-center py-4">
        <AdBanner slot="goals-bottom" />
      </div>
    </div>
  );
}
