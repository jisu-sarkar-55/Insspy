"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Trade } from "@/types";

interface Props {
  trades: Trade[];
}

export function TradeReplay({ trades }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const closed = trades
    .filter((t) => t.net_pnl !== null)
    .sort((a, b) => b.entry_time.localeCompare(a.entry_time))
    .slice(0, 50);

  if (closed.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        No closed trades to replay
      </div>
    );
  }

  const formatDuration = (t: Trade) => {
    if (!t.exit_time) return "—";
    const ms = new Date(t.exit_time).getTime() - new Date(t.entry_time).getTime();
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const calcRR = (t: Trade) => {
    if (!t.stop_loss || !t.net_pnl) return null;
    const risk = Math.abs(t.entry_price - t.stop_loss);
    return risk > 0 ? (t.net_pnl / risk).toFixed(1) : null;
  };

  return (
    <div className="space-y-1">
      {closed.map((t) => {
        const isExpanded = expanded === t.id;
        const rr = calcRR(t);
        return (
          <div key={t.id} className="card-surface rounded-lg overflow-hidden" style={{ borderColor: "var(--border-subtle)" }}>
            <button
              className="flex w-full items-center gap-3 px-3 py-2 text-left"
              onClick={() => setExpanded(isExpanded ? null : t.id)}
            >
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: (t.net_pnl || 0) >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>{t.symbol}</span>
                  <Badge className="text-[9px]" style={{ background: t.direction === "buy" ? "rgba(74, 222, 128, 0.2)" : "rgba(248, 113, 113, 0.2)", color: t.direction === "buy" ? "var(--color-profit)" : "var(--color-loss)" }}>
                    {t.direction.toUpperCase()}
                  </Badge>
                  {t.strategy && (
                    <Badge variant="outline" className="text-[9px]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>{t.strategy}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {new Date(t.entry_time).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{formatDuration(t)}</span>
                  {rr && <span className="text-[10px]" style={{ color: "var(--color-info)" }}>{rr}R</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-bold font-[var(--font-playfair)]" style={{ color: (t.net_pnl || 0) >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}>
                  {(t.net_pnl || 0) >= 0 ? "+" : ""}${(t.net_pnl || 0).toFixed(2)}
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
              )}
            </button>

            {isExpanded && (
              <div className="border-t px-3 py-3 space-y-2" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div>
                    <div className="text-[9px] uppercase" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>Entry</div>
                    <div className="text-[11px] font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>{t.entry_price}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>Exit</div>
                    <div className="text-[11px] font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>{t.exit_price || "—"}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>Stop Loss</div>
                    <div className="text-[11px] font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>{t.stop_loss || "—"}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>Take Profit</div>
                    <div className="text-[11px] font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>{t.take_profit || "—"}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-[9px] uppercase" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>Lot Size</div>
                    <div className="text-[11px] font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>{t.lot_size}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>Commission</div>
                    <div className="text-[11px] font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>${t.commission.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>Swap</div>
                    <div className="text-[11px] font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>${t.swap.toFixed(2)}</div>
                  </div>
                </div>
                {t.confidence_before && (
                  <div className="flex gap-4">
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Confidence: <span style={{ color: "var(--text-primary)" }}>{t.confidence_before}/10</span></span>
                    {t.fear_level && <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Fear: <span style={{ color: "var(--text-primary)" }}>{t.fear_level}/10</span></span>}
                    {t.greed_level && <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Greed: <span style={{ color: "var(--text-primary)" }}>{t.greed_level}/10</span></span>}
                  </div>
                )}
                {t.notes && (
                  <div className="rounded p-2 text-[11px] leading-relaxed" style={{ background: "var(--surface-raised)", color: "var(--text-secondary)" }}>
                    {t.notes}
                  </div>
                )}
                {t.screenshot_url && (
                  <div>
                    <div className="text-[9px] uppercase mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}>Screenshot Timeline</div>
                    <div className="rounded overflow-hidden" style={{ background: "var(--surface-raised)" }}>
                      <img 
                        src={t.screenshot_url} 
                        alt={`Trade screenshot for ${t.symbol}`}
                        className="w-full h-auto max-h-48 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
