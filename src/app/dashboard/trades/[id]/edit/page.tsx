"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TradeForm } from "@/components/trades/trade-form";
import type { Trade } from "@/types";

export default function EditTradePage() {
  const params = useParams();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTrade() {
      const { data } = await supabase
        .from("trades")
        .select("*")
        .eq("id", params.id)
        .single();

      setTrade(data);
      setLoading(false);
    }

    fetchTrade();
  }, [params.id, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: "var(--text-muted)" }}>Loading trade...</div>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="text-center py-12">
        <p style={{ color: "var(--text-muted)" }}>Trade not found</p>
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
