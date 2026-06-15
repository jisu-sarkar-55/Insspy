"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import type { Trade } from "@/types";

interface JournalEntryCardProps {
  trade: Trade;
  showTimeline?: boolean;
}

function getEmotionLabel(trade: Trade): { label: string; color: string } {
  if (trade.confidence_before && trade.confidence_before >= 8) {
    return { label: "Confident", color: "var(--color-profit)" };
  }
  if (trade.greed_level && trade.greed_level >= 7) {
    return { label: "Greedy", color: "var(--color-warning)" };
  }
  if (trade.fear_level && trade.fear_level >= 7) {
    return { label: "Fearful", color: "var(--color-loss)" };
  }
  if (trade.confidence_before && trade.confidence_before <= 3) {
    return { label: "Uncertain", color: "var(--text-muted)" };
  }
  return { label: "Neutral", color: "var(--text-secondary)" };
}

function getRMultiple(trade: Trade): string | null {
  if (!trade.stop_loss || !trade.entry_price || !trade.exit_price) return null;
  const risk = Math.abs(trade.entry_price - trade.stop_loss);
  if (risk === 0) return null;
  const reward =
    trade.direction === "buy"
      ? trade.exit_price - trade.entry_price
      : trade.entry_price - trade.exit_price;
  const r = reward / risk;
  return `${r >= 0 ? "+" : ""}${r.toFixed(1)}R`;
}

export function JournalEntryCard({ trade }: JournalEntryCardProps) {
  const emotion = getEmotionLabel(trade);
  const rMultiple = getRMultiple(trade);
  const isWin = trade.net_pnl !== null && trade.net_pnl >= 0;

  return (
    <Link href={`/dashboard/trades/${trade.id}`}>
      <Card
        className="cursor-pointer transition-colors hover:border-[var(--border-medium)]"
        style={{
          background: "var(--surface-card)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {trade.symbol}
                </span>
                <Badge
                  style={{
                    background: trade.direction === "buy" ? "var(--color-profit-bg)" : "var(--color-loss-bg)",
                    color: trade.direction === "buy" ? "var(--color-profit)" : "var(--color-loss)",
                  }}
                >
                  {trade.direction.toUpperCase()}
                </Badge>
                {trade.strategy && (
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {trade.strategy}
                  </Badge>
                )}
              </div>

              {trade.notes && (
                <p
                  className="mb-2 line-clamp-2 text-[13px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {trade.notes}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-[11px]">
                <span style={{ color: "var(--text-muted)" }}>
                  <span style={{ color: emotion.color }}>{emotion.label}</span>
                </span>
                {rMultiple && (
                  <span
                    className="mono-data font-semibold"
                    style={{ color: isWin ? "var(--color-profit)" : "var(--color-loss)" }}
                  >
                    {rMultiple}
                  </span>
                )}
                {trade.mistakes && trade.mistakes.length > 0 && (
                  <span className="flex items-center gap-1" style={{ color: "var(--color-loss)" }}>
                    <AlertTriangle className="h-3 w-3" />
                    {trade.mistakes.length} mistake{trade.mistakes.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 text-right">
              {trade.net_pnl !== null && (
                <div
                  className="mono-data text-sm font-bold"
                  style={{ color: isWin ? "var(--color-profit)" : "var(--color-loss)" }}
                >
                  ${trade.net_pnl.toFixed(2)}
                </div>
              )}
              <div className="mt-0.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
                {new Date(trade.entry_time).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
