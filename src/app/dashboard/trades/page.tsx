"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import type { Trade } from "@/types";
import { useRouter } from "next/navigation";

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [strategyFilter, setStrategyFilter] = useState<string>("all");
  const [directionFilter, setDirectionFilter] = useState<string>("all");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchTrades();
  }, []);

  async function fetchTrades() {
    const { data } = await supabase
      .from("trades")
      .select("*")
      .order("entry_time", { ascending: false });

    if (data) {
      setTrades(data);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this trade?")) return;

    const { error } = await supabase.from("trades").delete().eq("id", id);

    if (!error) {
      setTrades(trades.filter((t) => t.id !== id));
    }
  }

  const filteredTrades = trades.filter((trade) => {
    if (strategyFilter !== "all" && trade.strategy !== strategyFilter) return false;
    if (directionFilter !== "all" && trade.direction !== directionFilter) return false;
    return true;
  });

  const strategies = [...new Set(trades.map((t) => t.strategy).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Trades</h1>
          <p className="text-zinc-400 mt-1">
            {trades.length} total trades
          </p>
        </div>
        <Link href="/dashboard/trades/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Trade
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <Select value={strategyFilter} onValueChange={(value) => value && setStrategyFilter(value)}>
          <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-white">
            <SelectValue placeholder="All Strategies" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="all">All Strategies</SelectItem>
            {strategies.map((s) => (
              <SelectItem key={s} value={s!}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={directionFilter} onValueChange={(value) => value && setDirectionFilter(value)}>
          <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-white">
            <SelectValue placeholder="All Directions" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="all">All Directions</SelectItem>
            <SelectItem value="buy">Buy (Long)</SelectItem>
            <SelectItem value="sell">Sell (Short)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading trades...</div>
      ) : filteredTrades.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-4">
            {trades.length === 0
              ? "No trades yet. Add your first trade to get started!"
              : "No trades match your filters."}
          </p>
          {trades.length === 0 && (
            <Link href="/dashboard/trades/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Trade
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-400">Symbol</TableHead>
                <TableHead className="text-zinc-400">Direction</TableHead>
                <TableHead className="text-zinc-400">Entry</TableHead>
                <TableHead className="text-zinc-400">Exit</TableHead>
                <TableHead className="text-zinc-400">P&L</TableHead>
                <TableHead className="text-zinc-400">Strategy</TableHead>
                <TableHead className="text-zinc-400">Date</TableHead>
                <TableHead className="text-zinc-400 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.map((trade) => (
                <TableRow key={trade.id} className="border-zinc-800">
                  <TableCell className="font-medium text-white">
                    {trade.symbol}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        trade.direction === "buy" ? "default" : "secondary"
                      }
                      className={
                        trade.direction === "buy"
                          ? "bg-emerald-600/20 text-emerald-400"
                          : "bg-red-600/20 text-red-400"
                      }
                    >
                      {trade.direction.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {trade.entry_price}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {trade.exit_price || "-"}
                  </TableCell>
                  <TableCell
                    className={
                      (trade.net_pnl || 0) >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {trade.net_pnl !== null
                      ? `$${trade.net_pnl.toFixed(2)}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {trade.strategy && (
                      <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                        {trade.strategy}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {new Date(trade.entry_time).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/trades/${trade.id}`}>
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/trades/${trade.id}/edit`}>
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400 hover:text-red-400"
                        onClick={() => handleDelete(trade.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
