"use client";

import { useEffect, useState, useMemo } from "react";
import { TradeReplay } from "@/components/analytics/trade-replay";
import { AlertCircle, Play } from "lucide-react";
import { AdBanner } from "@/components/ads/ad-banner";
import type { Trade } from "@/types";

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 animate-pulse" style={{ background: "var(--surface-card)" }}>
      <div className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--surface-raised)" }} />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <div className="h-3 w-16 rounded" style={{ background: "var(--surface-raised)" }} />
          <div className="h-3 w-10 rounded" style={{ background: "var(--surface-raised)" }} />
          <div className="h-3 w-12 rounded" style={{ background: "var(--surface-raised)" }} />
        </div>
        <div className="h-2.5 w-40 rounded" style={{ background: "var(--surface-raised)" }} />
      </div>
      <div className="h-4 w-16 rounded" style={{ background: "var(--surface-raised)" }} />
    </div>
  );
}

export default function TradeReplayPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchTrades() {
      try {
        const res = await fetch("/api/trades");
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data)) setTrades(data);
      } catch (err: unknown) {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : "Failed to load trades");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchTrades();
    return () => { cancelled = true; };
  }, []);

  const closed = useMemo(() => trades.filter((t) => t.net_pnl !== null), [trades]);
  const totalPnl = closed.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const wins = closed.filter((t) => (t.net_pnl || 0) > 0);
  const winRate = closed.length > 0 ? (wins.length / closed.length) * 100 : 0;
  const dateRange =
    closed.length > 0
      ? `${closed[closed.length - 1].entry_time.split("T")[0]} — ${closed[0].entry_time.split("T")[0]}`
      : null;

  if (loading) {
    return (
        <div className="space-y-4 animate-fade-in">
          <div>
            <div className="h-7 w-28 rounded mb-1" style={{ background: "var(--surface-raised)" }} />
            <div className="h-4 w-56 rounded" style={{ background: "var(--surface-raised)" }} />
          </div>
          <div
            className="rounded-lg border overflow-hidden"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
          >
            <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ borderBottomWidth: 1, borderColor: "var(--border-subtle)" }}>
                  <SkeletonCard />
                </div>
              ))}
            </div>
          </div>
        </div>
    );
  }

  if (fetchError) {
    return (
        <div className="py-12 text-center animate-fade-in">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="h-8 w-8" style={{ color: "var(--color-loss)" }} />
            <h2
              className="text-xl font-bold font-[var(--font-playfair)]"
              style={{ color: "var(--text-primary)" }}
            >
              Failed to Load Data
            </h2>
            <p className="text-sm max-w-md" style={{ color: "var(--text-muted)" }}>
              {fetchError}
            </p>
          </div>
        </div>
    );
  }

  if (closed.length === 0) {
    return (
        <div className="py-12 text-center animate-fade-in">
          <h2
            className="mb-2 text-2xl font-bold font-[var(--font-playfair)]"
            style={{ color: "var(--text-primary)" }}
          >
            No Trade Data
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            Add or import trades to replay them.
          </p>
        </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
            Trade Replay
          </h1>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            Replay every trade with entry, exit, analysis, and screenshot timeline
          </p>
        </div>
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.15))",
            color: "var(--color-premium, #8b5cf6)",
          }}
        >
          <span className="text-[10px]">✦</span> Premium
        </div>
      </div>

      <div
        className="flex items-center gap-4 text-[11px] px-1"
        style={{ color: "var(--text-muted)" }}
      >
        <span className="flex items-center gap-1">
          <Play className="h-3 w-3" />
          {closed.length} trades
        </span>
        <span style={{ color: "var(--border-medium)" }}>|</span>
        <span style={{ color: "var(--color-profit)" }}>{wins.length}W</span>
        <span style={{ color: "var(--color-loss)" }}>{closed.length - wins.length}L</span>
        <span style={{ color: "var(--text-muted)" }}>{winRate.toFixed(0)}% WR</span>
        <span style={{ color: "var(--border-medium)" }}>|</span>
        <span style={{ color: totalPnl >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}>
          {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(0)}
        </span>
        {dateRange && (
          <>
            <span style={{ color: "var(--border-medium)" }}>|</span>
            <span>{dateRange}</span>
          </>
        )}
      </div>

      <div className="flex justify-center py-4">
        <AdBanner slot="trade-replay-mid" />
      </div>

      <div>
        <div
          className="text-xs font-semibold mb-3 flex items-center gap-2"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>Trade Replay Timeline</span>
          <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
        </div>

        <div
          className="rounded-lg border overflow-hidden"
          style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
        >
          <TradeReplay trades={closed} />
        </div>
      </div>

      <div className="flex justify-center py-4">
        <AdBanner slot="trade-replay-bottom" />
      </div>
    </div>
  );
}
