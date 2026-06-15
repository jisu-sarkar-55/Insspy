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
import { Plus, Eye, Pencil, Trash2, Trash } from "lucide-react";
import type { Trade } from "@/types";
import { useRouter } from "next/navigation";

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [strategyFilter, setStrategyFilter] = useState<string>("all");
  const [directionFilter, setDirectionFilter] = useState<string>("all");
  const [clearing, setClearing] = useState(false);
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

  async function handleClearAll() {
    if (!confirm(`Delete ALL ${trades.length} trades? This cannot be undone.`)) return;
    if (!confirm("Are you absolutely sure? Everything will be permanently erased.")) return;

    setClearing(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setClearing(false);
      return;
    }

    const { error } = await supabase.from("trades").delete().eq("user_id", user.id);

    if (!error) {
      setTrades([]);
    }
    setClearing(false);
  }

  const filteredTrades = trades.filter((trade) => {
    if (strategyFilter !== "all" && trade.strategy !== strategyFilter) return false;
    if (directionFilter !== "all" && trade.direction !== directionFilter) return false;
    return true;
  });

  const strategies = [...new Set(trades.map((t) => t.strategy).filter(Boolean))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>Trades</h1>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            {trades.length} total trades
          </p>
        </div>
        <div className="flex items-center gap-3">
          {trades.length > 0 && (
            <Button
              variant="outline"
              className="border-zinc-700"
              style={{ color: "var(--color-loss)" }}
              onClick={handleClearAll}
              disabled={clearing}
            >
              <Trash className="h-4 w-4 mr-2" />
              {clearing ? "Clearing..." : "Clear All"}
            </Button>
          )}
          <Link href="/dashboard/trades/new">
            <Button style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Trade
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-4">
        <Select value={strategyFilter} onValueChange={(value) => value && setStrategyFilter(value)}>
          <SelectTrigger className="w-[180px]" style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>
            <SelectValue placeholder="All Strategies" />
          </SelectTrigger>
          <SelectContent style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)" }}>
            <SelectItem value="all">All Strategies</SelectItem>
            {strategies.map((s) => (
              <SelectItem key={s} value={s!}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={directionFilter} onValueChange={(value) => value && setDirectionFilter(value)}>
          <SelectTrigger className="w-[180px]" style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>
            <SelectValue placeholder="All Directions" />
          </SelectTrigger>
          <SelectContent style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)" }}>
            <SelectItem value="all">All Directions</SelectItem>
            <SelectItem value="buy">Buy (Long)</SelectItem>
            <SelectItem value="sell">Sell (Short)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>Loading trades...</div>
      ) : filteredTrades.length === 0 ? (
        <div className="text-center py-12">
          <p className="mb-4" style={{ color: "var(--text-muted)" }}>
            {trades.length === 0
              ? "No trades yet. Add your first trade to get started!"
              : "No trades match your filters."}
          </p>
          {trades.length === 0 && (
            <Link href="/dashboard/trades/new">
              <Button style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Trade
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden" style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)" }}>
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "var(--border-subtle)" }}>
                <TableHead style={{ color: "var(--text-muted)" }}>Symbol</TableHead>
                <TableHead style={{ color: "var(--text-muted)" }}>Direction</TableHead>
                <TableHead style={{ color: "var(--text-muted)" }}>Entry</TableHead>
                <TableHead style={{ color: "var(--text-muted)" }}>Exit</TableHead>
                <TableHead style={{ color: "var(--text-muted)" }}>P&L</TableHead>
                <TableHead style={{ color: "var(--text-muted)" }}>Strategy</TableHead>
                <TableHead style={{ color: "var(--text-muted)" }}>Date</TableHead>
                <TableHead style={{ color: "var(--text-muted)" }} className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.map((trade) => (
                <TableRow key={trade.id} style={{ borderColor: "var(--border-subtle)" }}>
                  <TableCell className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {trade.symbol}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        trade.direction === "buy" ? "default" : "secondary"
                      }
                      style={{
                        background: trade.direction === "buy" ? "var(--color-profit-bg)" : "var(--color-loss-bg)",
                        color: trade.direction === "buy" ? "var(--color-profit)" : "var(--color-loss)",
                      }}
                    >
                      {trade.direction.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ color: "var(--text-secondary)" }}>
                    {trade.entry_price}
                  </TableCell>
                  <TableCell style={{ color: "var(--text-secondary)" }}>
                    {trade.exit_price || "-"}
                  </TableCell>
                  <TableCell
                    style={{
                      color: (trade.net_pnl || 0) >= 0 ? "var(--color-profit)" : "var(--color-loss)",
                    }}
                  >
                    {trade.net_pnl !== null
                      ? `$${trade.net_pnl.toFixed(2)}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {trade.strategy && (
                      <Badge variant="outline" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>
                        {trade.strategy}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell style={{ color: "var(--text-muted)" }}>
                    {new Date(trade.entry_time).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/trades/${trade.id}`}>
                        <Button variant="ghost" size="icon" style={{ color: "var(--text-muted)" }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/trades/${trade.id}/edit`}>
                        <Button variant="ghost" size="icon" style={{ color: "var(--text-muted)" }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        style={{ color: "var(--color-loss)" }}
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
