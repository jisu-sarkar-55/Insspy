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
import { ConfirmDialog } from "@/components/premium/confirm-dialog";

export default function TradeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playbookName, setPlaybookName] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
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
        if (!cancelled) {
          setTrade(data);
          if (data?.setup_playbook_id) {
            const { data: pb } = await supabase
              .from("setup_playbooks")
              .select("name")
              .eq("id", data.setup_playbook_id)
              .single();
            if (!cancelled && pb) setPlaybookName(pb.name);
          }
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load trade");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTrade();
    return () => { cancelled = true; };
  }, [params.id]);

  async function handleDelete() {
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
        <div>
          <Link href="/dashboard/trades">
            <Button>Back to Trades</Button>
          </Link>
        </div>
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

  const pnlColor =
    (trade.net_pnl || 0) >= 0 ? "var(--color-profit)" : "var(--color-loss)";

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/trades">
            <Button variant="ghost" size="icon" style={{ color: "var(--text-muted)" }}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-[var(--font-playfair)] flex items-center gap-3" style={{ color: "var(--text-primary)" }}>
              {trade.symbol}
              <Badge
                style={{
                  background: trade.direction === "buy" ? "var(--color-profit-bg)" : "var(--color-loss-bg)",
                  color: trade.direction === "buy" ? "var(--color-profit)" : "var(--color-loss)",
                }}
              >
                {trade.direction.toUpperCase()}
              </Badge>
            </h1>
            <p className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>
              {new Date(trade.entry_time).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/trades/${trade.id}/edit`}>
            <Button
              variant="outline"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-red-700"
            style={{ color: "var(--color-loss)" }}
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Trade"
        description="Are you sure you want to delete this trade? This cannot be undone."
        onConfirm={handleDelete}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
          <CardHeader>
            <CardTitle style={{ color: "var(--text-primary)" }}>Trade Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Entry Price</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>{trade.entry_price}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Exit Price</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {trade.exit_price || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Stop Loss</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {trade.stop_loss || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Take Profit</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {trade.take_profit || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Lot Size</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>{trade.lot_size}</span>
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
          <CardHeader>
            <CardTitle style={{ color: "var(--text-primary)" }}>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Net P&L</span>
              <span className="text-xl font-bold font-[var(--font-playfair)]" style={{ color: pnlColor }}>
                {trade.net_pnl !== null ? `$${trade.net_pnl.toFixed(2)}` : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Commission</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                ${trade.commission.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Swap</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                ${trade.swap.toFixed(2)}
              </span>
            </div>
            {trade.strategy && (
              <div className="flex justify-between">
                <span style={{ color: "var(--text-muted)" }}>Strategy</span>
                <Badge variant="outline" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>
                  {trade.strategy}
                </Badge>
              </div>
            )}
            {playbookName && (
              <div className="flex justify-between">
                <span style={{ color: "var(--text-muted)" }}>Playbook</span>
                <Badge variant="outline" style={{ borderColor: "var(--border-subtle)", color: "var(--color-ai)" }}>
                  {playbookName}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
          <CardHeader>
            <CardTitle style={{ color: "var(--text-primary)" }}>Psychology</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Confidence</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {trade.confidence_before || "-"}/10
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Fear Level</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {trade.fear_level || "-"}/10
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Greed Level</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {trade.greed_level || "-"}/10
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Followed Plan</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
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
          <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
            <CardHeader>
              <CardTitle style={{ color: "var(--text-primary)" }}>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{trade.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
