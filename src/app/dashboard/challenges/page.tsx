"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CHALLENGES, computeChallengeProgress } from "@/lib/challenges";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import type { Trade, ChallengeProgress } from "@/types";

export default function ChallengesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTrades() {
      const { data } = await supabase
        .from("trades")
        .select("*")
        .order("entry_time", { ascending: false });

      if (data) setTrades(data);
      setLoading(false);
    }

    fetchTrades();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: "var(--text-muted)" }}>Loading challenges...</div>
      </div>
    );
  }

  const closed = trades.filter((t) => t.net_pnl !== null);

  const allProgress: ChallengeProgress[] = CHALLENGES.map((c) =>
    computeChallengeProgress(c.id, closed)
  );

  const completedChallenges = allProgress.filter((p) => p.passed);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>Challenges</h1>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
          Gamified trading challenges to build discipline
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CHALLENGES.map((challenge) => {
          const progress = allProgress.find((p) => p.challengeId === challenge.id)!;
          return (
            <ChallengeCard key={challenge.id} challenge={challenge} progress={progress} />
          );
        })}
      </div>

      {completedChallenges.length > 0 && (
        <div>
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Completed ({completedChallenges.length})
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedChallenges.map((progress) => {
              const challenge = CHALLENGES.find((c) => c.id === progress.challengeId)!;
              return (
                <ChallengeCard key={challenge.id} challenge={challenge} progress={progress} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
