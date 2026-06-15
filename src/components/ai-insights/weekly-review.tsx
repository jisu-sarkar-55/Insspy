"use client";

import { Calendar, Loader2 } from "lucide-react";
import type { WeeklyReview as WeeklyReviewType } from "@/types";

interface WeeklyReviewProps {
  data: WeeklyReviewType | null;
  onGenerate: () => void;
  loading: boolean;
}

export function WeeklyReview({ data, onGenerate, loading }: WeeklyReviewProps) {
  return (
    <div
      className="card-surface rounded-lg border border-border p-5"
      style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Weekly AI Review
        </div>
        <button
          onClick={onGenerate}
          disabled={loading}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-semibold"
          style={{ background: "var(--color-ai-bg)", color: "var(--color-ai)", border: "1px solid rgba(192, 132, 252, 0.2)" }}
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Calendar className="h-3 w-3" />
          )}
          {data ? "Refresh Review" : "Generate Review"}
        </button>
      </div>

      {data ? (
        <div className="space-y-3">
          <div className="flex gap-6">
            <div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Trades</div>
              <div className="text-[14px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>{data.trades}</div>
            </div>
            <div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Profit</div>
              <div
                className="text-[14px] font-bold"
                style={{ color: data.profit >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}
              >
                {data.profit >= 0 ? "+" : ""}${data.profit.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Win Rate</div>
              <div className="text-[14px] font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>{data.winRate}%</div>
            </div>
          </div>

          <div
            className="rounded-lg p-3"
            style={{ background: "var(--color-profit-bg)", border: "1px solid rgba(74, 222, 128, 0.15)" }}
          >
            <div className="text-[10px] font-semibold" style={{ color: "var(--color-profit)" }}>Top Strength</div>
            <div className="text-[12px]" style={{ color: "var(--text-primary)" }}>{data.topStrength}</div>
          </div>

          <div
            className="rounded-lg p-3"
            style={{ background: "var(--color-loss-bg)", border: "1px solid rgba(248, 113, 113, 0.15)" }}
          >
            <div className="text-[10px] font-semibold" style={{ color: "var(--color-loss)" }}>Biggest Mistake</div>
            <div className="text-[12px]" style={{ color: "var(--text-primary)" }}>{data.biggestMistake}</div>
          </div>

          <div
            className="rounded-lg p-3"
            style={{ background: "var(--color-ai-bg)", border: "1px solid rgba(192, 132, 252, 0.15)" }}
          >
            <div className="text-[10px] font-semibold" style={{ color: "var(--color-ai)" }}>Recommendation</div>
            <div className="text-[12px]" style={{ color: "var(--text-primary)" }}>{data.recommendation}</div>
          </div>
        </div>
      ) : (
        <div
          className="rounded-lg p-6 text-center text-[12px]"
          style={{ background: "var(--surface-raised)", color: "var(--text-muted)" }}
        >
          Click &quot;Generate Review&quot; to get a weekly summary of your trading performance.
        </div>
      )}
    </div>
  );
}
