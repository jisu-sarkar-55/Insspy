"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { CHALLENGES, computeChallengeProgress } from "@/lib/challenges";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import type { Trade, ChallengeProgress } from "@/types";

type FilterTab = "all" | "active" | "completed";

function SkeletonCard() {
  return (
    <div className="rounded-xl border p-4" style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
      <div className="animate-pulse space-y-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg" style={{ background: "var(--border-subtle)" }} />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded" style={{ background: "var(--border-subtle)" }} />
            <div className="h-3 w-full rounded" style={{ background: "var(--border-subtle)" }} />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-4 w-16 rounded-full" style={{ background: "var(--border-subtle)" }} />
          <div className="h-4 w-12 rounded-full" style={{ background: "var(--border-subtle)" }} />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full" style={{ background: "var(--border-subtle)" }} />
          <div className="flex-1 space-y-1">
            <div className="h-5 w-20 rounded" style={{ background: "var(--border-subtle)" }} />
            <div className="h-3 w-32 rounded" style={{ background: "var(--border-subtle)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-lg border p-3 text-center" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-card)" }}>
      <div className="text-lg font-bold font-[var(--font-playfair)]" style={{ color }}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</div>
    </div>
  );
}

function FilterBar({ active, onChange }: { active: FilterTab; onChange: (tab: FilterTab) => void }) {
  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="flex gap-1.5 rounded-lg p-1" style={{ background: "var(--surface-raised)" }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className="flex-1 rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all"
          style={{
            background: active === tab.key ? "var(--surface-card)" : "transparent",
            color: active === tab.key ? "var(--text-primary)" : "var(--text-muted)",
            boxShadow: active === tab.key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default function ChallengesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;
    async function fetchTrades() {
      try {
        await supabase.auth.getUser();
        const res = await fetch("/api/trades");
        if (!res.ok) throw new Error("Failed to load trades");
        const data = await res.json();
        if (!cancelled) setTrades(data);
      } catch (err) {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : "Failed to load trades");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchTrades();
    return () => { cancelled = true; };
  }, [supabase]);

  const closed = useMemo(() => trades.filter((t) => t.net_pnl !== null), [trades]);

  const allProgress: ChallengeProgress[] = useMemo(
    () => CHALLENGES.map((c) => computeChallengeProgress(c.id, closed)),
    [closed]
  );

  const completed = allProgress.filter((p) => p.passed);
  const active = allProgress.filter((p) => !p.passed && p.current > 0);

  const filteredChallenges = useMemo(() => {
    switch (filter) {
      case "completed":
        return CHALLENGES.filter((c) => completed.some((p) => p.challengeId === c.id));
      case "active":
        return CHALLENGES.filter((c) => active.some((p) => p.challengeId === c.id));
      default:
        return CHALLENGES;
    }
  }, [filter, completed, active]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="h-7 w-28 rounded" style={{ background: "var(--surface-raised)" }} />
          <div className="h-4 w-44 rounded" style={{ background: "var(--surface-raised)" }} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg" style={{ background: "var(--surface-raised)" }} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: "var(--color-loss)" }}>{fetchError}</div>
      </div>
    );
  }

  if (closed.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-4xl mb-3">🎮</div>
        <h2 className="mb-2 text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
          No Trade Data
        </h2>
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          Add or import trades to start completing challenges.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
          Challenges
        </h1>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
          Gamified trading challenges to build discipline and track growth
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Total Challenges" value={CHALLENGES.length} color="var(--text-primary)" />
        <StatCard label="Completed" value={completed.length} color="var(--color-profit)" />
        <StatCard label="In Progress" value={active.length} color="var(--color-warning)" />
        <StatCard label="Completion" value={`${Math.round((completed.length / CHALLENGES.length) * 100)}%`} color="var(--color-ai)" />
      </div>

      {/* Filter */}
      <FilterBar active={filter} onChange={setFilter} />

      {/* Challenge grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges.map((challenge) => {
          const progress = allProgress.find((p) => p.challengeId === challenge.id)!;
          return (
            <ChallengeCard key={challenge.id} challenge={challenge} progress={progress} />
          );
        })}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-3xl mb-2">🏁</div>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            {filter === "active"
              ? "No active challenges. Start trading to begin!"
              : filter === "completed"
              ? "No completed challenges yet. Keep pushing!"
              : "No challenges match the current filter."}
          </p>
        </div>
      )}
    </div>
  );
}
