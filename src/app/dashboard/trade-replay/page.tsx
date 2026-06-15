"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TradeReplay } from "@/components/analytics/trade-replay";
import type { Trade } from "@/types";

export default function TradeReplayPage() {
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
        <div style={{ color: "var(--text-muted)" }}>Loading trade replay...</div>
      </div>
    );
  }

  const closed = trades.filter((t) => t.net_pnl !== null);

  if (closed.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-2 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
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
      <div>
        <h1 className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
          Trade Replay
        </h1>
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          Replay every trade with entry, exit, RR, notes, and screenshot timeline
        </p>
      </div>

      <div
        className="rounded-lg border p-4"
        style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
      >
        <TradeReplay trades={closed} />
      </div>
    </div>
  );
}
