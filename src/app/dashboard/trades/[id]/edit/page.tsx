"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TradeForm } from "@/components/trades/trade-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Trade } from "@/types";

export default function EditTradePage() {
  const params = useParams();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;

    async function fetchTrade() {
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("trades")
          .select("*")
          .eq("id", params.id)
          .single();

        if (fetchError) throw fetchError;
        if (!cancelled) setTrade(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load trade");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTrade();
    return () => { cancelled = true; };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: "var(--text-muted)" }}>Loading trade...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div
          className="inline-block rounded-lg p-4 text-sm mb-4"
          style={{ background: "var(--color-loss-bg)", border: "1px solid rgba(248, 113, 113, 0.2)", color: "var(--color-loss)" }}
        >
          {error}
        </div>
        <Link href="/dashboard/trades">
          <Button>Back to Trades</Button>
        </Link>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="text-center py-12">
        <p style={{ color: "var(--text-muted)" }}>Trade not found</p>
        <Link href="/dashboard/trades">
          <Button className="mt-4">Back to Trades</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>Edit Trade</h1>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
          Update the details of your trade
        </p>
      </div>
      <TradeForm initialData={trade} isEditing />
    </div>
  );
}
