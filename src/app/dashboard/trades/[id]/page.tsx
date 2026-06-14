"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Trade } from "@/types";

export default function TradeDetailPage() {
  const params = useParams();
  const router = useRouter();
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

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this trade?")) return;

    const { error } = await supabase
      .from("trades")
      .delete()
      .eq("id", params.id);

    if (!error) {
      router.push("/dashboard/trades");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Loading trade...</div>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">Trade not found</p>
        <Link href="/dashboard/trades">
          <Button className="mt-4">Back to Trades</Button>
        </Link>
      </div>
    );
  }

  const pnlColor =
    (trade.net_pnl || 0) >= 0 ? "text-emerald-400" : "text-red-400";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/trades">
            <Button variant="ghost" size="icon" className="text-zinc-400">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
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
            </h1>
            <p className="text-zinc-400 mt-1">
              {new Date(trade.entry_time).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/trades/${trade.id}/edit`}>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-red-700 text-red-400 hover:bg-red-900/20"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Trade Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-400">Entry Price</span>
              <span className="text-white font-medium">{trade.entry_price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Exit Price</span>
              <span className="text-white font-medium">
                {trade.exit_price || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Stop Loss</span>
              <span className="text-white font-medium">
                {trade.stop_loss || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Take Profit</span>
              <span className="text-white font-medium">
                {trade.take_profit || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Lot Size</span>
              <span className="text-white font-medium">{trade.lot_size}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-400">Net P&L</span>
              <span className={`text-xl font-bold ${pnlColor}`}>
                {trade.net_pnl !== null ? `$${trade.net_pnl.toFixed(2)}` : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Commission</span>
              <span className="text-white font-medium">
                ${trade.commission.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Swap</span>
              <span className="text-white font-medium">
                ${trade.swap.toFixed(2)}
              </span>
            </div>
            {trade.strategy && (
              <div className="flex justify-between">
                <span className="text-zinc-400">Strategy</span>
                <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                  {trade.strategy}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Psychology</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-400">Confidence</span>
              <span className="text-white font-medium">
                {trade.confidence_before || "-"}/10
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Fear Level</span>
              <span className="text-white font-medium">
                {trade.fear_level || "-"}/10
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Greed Level</span>
              <span className="text-white font-medium">
                {trade.greed_level || "-"}/10
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Followed Plan</span>
              <span className="text-white font-medium">
                {trade.followed_plan === true
                  ? "Yes"
                  : trade.followed_plan === false
                  ? "No"
                  : "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        {trade.notes && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 whitespace-pre-wrap">{trade.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
