"use client";

import { Trophy, Users, BarChart3, Target } from "lucide-react";
import { AdBanner } from "@/components/ads/ad-banner";

export default function LeaderboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
          Leaderboard
        </h1>
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          Compare your performance with other traders
        </p>
      </div>

      <div
        className="rounded-lg border p-8 text-center"
        style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
      >
        <div className="flex justify-center mb-4">
          <div
            className="rounded-full p-4"
            style={{ background: "var(--color-profit-bg)" }}
          >
            <Trophy className="h-8 w-8" style={{ color: "var(--color-profit)" }} />
          </div>
        </div>
        
        <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          Coming Soon
        </h2>
        <p className="text-[13px] mb-6 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
          The leaderboard feature is under development. Soon you&apos;ll be able to 
          anonymously compare your trading performance with others.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div
            className="rounded-lg p-4"
            style={{ background: "var(--surface-raised)" }}
          >
            <div className="flex justify-center mb-2">
              <Target className="h-5 w-5" style={{ color: "var(--color-info)" }} />
            </div>
            <div className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>
              Discipline
            </div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              Plan adherence score
            </div>
          </div>

          <div
            className="rounded-lg p-4"
            style={{ background: "var(--surface-raised)" }}
          >
            <div className="flex justify-center mb-2">
              <BarChart3 className="h-5 w-5" style={{ color: "var(--color-profit)" }} />
            </div>
            <div className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>
              Consistency
            </div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              Trading routine metrics
            </div>
          </div>

          <div
            className="rounded-lg p-4"
            style={{ background: "var(--surface-raised)" }}
          >
            <div className="flex justify-center mb-2">
              <Users className="h-5 w-5" style={{ color: "var(--color-ai)" }} />
            </div>
            <div className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>
              Win Rate
            </div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              Success percentage
            </div>
          </div>
        </div>

        <p className="text-[10px] mt-6" style={{ color: "var(--text-muted)" }}>
          All comparisons are anonymous. No personal trading data will be shared.
        </p>
      </div>

      <div className="flex justify-center py-4">
        <AdBanner slot="leaderboard-mid" />
      </div>
    </div>
  );
}
