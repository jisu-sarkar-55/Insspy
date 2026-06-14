"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import type { Trade } from "@/types";

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTrades() {
      const { data } = await supabase
        .from("trades")
        .select("*")
        .not("notes", "is", null)
        .order("entry_time", { ascending: false });

      if (data) {
        setTrades(data);
      }
      setLoading(false);
    }

    fetchTrades();
  }, [supabase]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Trade Journal</h1>
        <p className="text-zinc-400 mt-1">
          Review your trade notes and reflections
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading journal...</div>
      ) : trades.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400">
                No journal entries yet. Add notes to your trades to see them here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {trades.map((trade) => (
            <Link key={trade.id} href={`/dashboard/trades/${trade.id}`}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-3">
                      {trade.symbol}
                      <Badge
                        className={
                          trade.direction === "buy"
                            ? "bg-emerald-600/20 text-emerald-400"
                            : "bg-red-600/20 text-red-400"
                        }
                      >
                        {trade.direction.toUpperCase()}
                      </Badge>
                      {trade.strategy && (
                        <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                          {trade.strategy}
                        </Badge>
                      )}
                    </CardTitle>
                    <span className="text-zinc-400 text-sm">
                      {new Date(trade.entry_time).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300 line-clamp-2">{trade.notes}</p>
                  {trade.net_pnl !== null && (
                    <p className={`mt-2 text-sm font-medium ${trade.net_pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      P&L: ${trade.net_pnl.toFixed(2)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
