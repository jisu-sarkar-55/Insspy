"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Eye, Pencil, Trash2, Trash } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AdBanner } from "@/components/ads";
import type { Trade } from "@/types";

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [strategyFilter, setStrategyFilter] = useState<string>("all");
  const [directionFilter, setDirectionFilter] = useState<string>("all");
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [clearConfirmed, setClearConfirmed] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    fetch("/api/trades")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data)) setTrades(data);
        else throw new Error(data.error || "Failed to load trades");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load trades");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/trades/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTrades(trades.filter((t) => t.id !== id));
      }
    } catch {
      // ignore
    }
    setDeleteTarget(null);
  }

  async function executeClearAll() {
    setClearing(true);
    setShowClearDialog(false);
    setClearConfirmed(false);

    try {
      const ids = trades.map(t => t.id);
      const res = await fetch("/api/trades", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) setTrades([]);
    } catch {
      // ignore
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
                onClick={() => setShowClearDialog(true)}
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

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={strategyFilter} onValueChange={(value) => value && setStrategyFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]" style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>
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
          <SelectTrigger className="w-full sm:w-[180px]" style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>
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
      ) : error ? (
        <div
          className="rounded-lg p-4 text-sm"
          style={{ background: "var(--color-loss-bg)", border: "1px solid rgba(248, 113, 113, 0.2)", color: "var(--color-loss)" }}
        >
          {error}
        </div>
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
                        <Button variant="ghost" size="icon" aria-label="View trade" style={{ color: "var(--text-muted)" }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/trades/${trade.id}/edit`}>
                        <Button variant="ghost" size="icon" aria-label="Edit trade" style={{ color: "var(--text-muted)" }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete trade"
                        style={{ color: "var(--color-loss)" }}
                        onClick={() => setDeleteTarget(trade.id)}
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
      <Dialog open={showClearDialog} onOpenChange={(open) => { setShowClearDialog(open); if (!open) setClearConfirmed(false); }}>
        <DialogContent style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)", maxWidth: "420px" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "var(--text-primary)" }}>Clear all trades?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              This will permanently delete all <strong>{trades.length} trades</strong> from your account. This action <strong>cannot be undone</strong>.
            </p>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={clearConfirmed}
                onChange={(e) => setClearConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded"
                style={{ accentColor: "var(--color-loss)" }}
              />
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                I understand that all trades will be permanently deleted and this cannot be undone.
              </span>
            </label>

            <div className="flex gap-3">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => { setShowClearDialog(false); setClearConfirmed(false); }}
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!clearConfirmed}
                onClick={executeClearAll}
                style={{ background: !clearConfirmed ? "var(--border-subtle)" : "var(--color-loss)", color: !clearConfirmed ? "var(--text-muted)" : "white" }}
              >
                Delete All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Trade"
        description="Are you sure you want to delete this trade? This cannot be undone."
        onConfirm={() => { if (deleteTarget) handleDelete(deleteTarget); }}
      />

      <div className="pt-4">
        <AdBanner slot="trades-banner" />
      </div>
    </div>
  );
}
