"use client";

import { useState, useMemo, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown, ChevronUp, Search, Check, X,
  AlertTriangle, ImageOff, Target, Clock, Brain,
  BarChart3, FileText
} from "lucide-react";
import type { Trade } from "@/types";

interface Props {
  trades: Trade[];
}

function getSession(hour: number): string {
  if (hour >= 8 && hour < 13) return "London";
  if (hour >= 13 && hour < 21) return "New York";
  if (hour >= 0 && hour < 8) return "Asia";
  return "Off-hours";
}

function calcRR(trade: Trade): { rr: number; display: string } | null {
  if (!trade.stop_loss || !trade.exit_price) return null;
  const risk = Math.abs(trade.entry_price - trade.stop_loss);
  const reward = Math.abs(trade.exit_price - trade.entry_price);
  if (risk === 0) return null;
  const rr = reward / risk;
  return { rr, display: `${rr.toFixed(2)}R` };
}

function getHitLabel(trade: Trade): { label: string; color: string } | null {
  if (!trade.exit_price) return null;
  const isWin = (trade.net_pnl || 0) > 0;
  if (trade.stop_loss) {
    const hitSL = trade.direction === "buy"
      ? trade.exit_price <= trade.stop_loss
      : trade.exit_price >= trade.stop_loss;
    if (hitSL) return { label: "Hit SL", color: "var(--color-loss)" };
  }
  if (trade.take_profit) {
    const hitTP = trade.direction === "buy"
      ? trade.exit_price >= trade.take_profit
      : trade.exit_price <= trade.take_profit;
    if (hitTP) return { label: "Hit TP", color: "var(--color-profit)" };
  }
  if (isWin) return { label: "Manual Close (Win)", color: "var(--color-profit)" };
  return { label: "Manual Close (Loss)", color: "var(--color-loss)" };
}

function getMistakeColor(mistake: string): string {
  if (mistake.toLowerCase().includes("revenge") || mistake.toLowerCase().includes("overtrade")) return "var(--color-loss)";
  if (mistake.toLowerCase().includes("size") || mistake.toLowerCase().includes("risk")) return "var(--color-warning)";
  if (mistake.toLowerCase().includes("early") || mistake.toLowerCase().includes("exit")) return "var(--color-info)";
  return "var(--text-muted)";
}

export function TradeReplay({ trades }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(50);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const symbolAvgRR = useMemo(() => {
    const map = new Map<string, { totalRR: number; count: number }>();
    trades.filter((t) => t.net_pnl !== null && t.stop_loss && t.exit_price).forEach((t) => {
      const r = calcRR(t);
      if (!r) return;
      const prev = map.get(t.symbol) || { totalRR: 0, count: 0 };
      prev.totalRR += r.rr;
      prev.count++;
      map.set(t.symbol, prev);
    });
    return map;
  }, [trades]);

  const filtered = useMemo(() => {
    let list = trades.filter((t) => t.net_pnl !== null);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((t) => t.symbol.toLowerCase().includes(q));
    }
    return list.sort((a, b) => b.entry_time.localeCompare(a.entry_time));
  }, [trades, searchQuery]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const totalPnl = filtered.reduce((s, t) => s + (t.net_pnl || 0), 0);
  const wins = filtered.filter((t) => (t.net_pnl || 0) > 0);
  const winRate = filtered.length > 0 ? (wins.length / filtered.length) * 100 : 0;
  const uniqueSymbols = [...new Set(filtered.map((t) => t.symbol))];

  const formatDuration = (t: Trade) => {
    if (!t.exit_time) return "—";
    const ms = new Date(t.exit_time).getTime() - new Date(t.entry_time).getTime();
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins === 0) return "<1m";
    return `${mins}m`;
  };

  return (
    <div className="space-y-4">
      {filtered.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex items-center gap-2 rounded-lg border px-3 py-1.5 flex-1 max-w-xs"
            style={{ borderColor: "var(--border-subtle)", background: "var(--surface-raised)" }}
          >
            <Search className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Filter by symbol..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(50); }}
              className="w-full bg-transparent text-[12px] outline-none"
              style={{ color: "var(--text-primary)" }}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setVisibleCount(50); }}
                className="text-[11px]"
                style={{ color: "var(--text-muted)" }}
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--text-muted)" }}>
            <span>{filtered.length} trades</span>
            <span style={{ color: "var(--color-profit)" }}>{wins.length}W</span>
            <span style={{ color: "var(--color-loss)" }}>{filtered.length - wins.length}L</span>
            <span>{winRate.toFixed(0)}%</span>
            <span style={{ color: totalPnl >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}>
              {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(0)}
            </span>
            <span>{uniqueSymbols.length} symbols</span>
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-[11px]" style={{ color: "var(--text-muted)" }}>
          {searchQuery ? "No trades match your filter" : "No closed trades to replay"}
        </div>
      ) : (
        <div className="space-y-1">
          {visible.map((t) => {
            const isExpanded = expanded === t.id;
            const rr = calcRR(t);
            const hit = getHitLabel(t);
            const isWin = (t.net_pnl || 0) > 0;
            const session = getSession(new Date(t.entry_time).getUTCHours());
            const avg = symbolAvgRR.get(t.symbol);
            const hasImgError = imgErrors.has(t.id);

            return (
              <div
                key={t.id}
                className="rounded-lg border overflow-hidden transition-all"
                style={{
                  background: "var(--surface-card)",
                  borderColor: isExpanded ? "var(--color-premium, #8b5cf6)" : "var(--border-subtle)",
                  ...(isExpanded ? { boxShadow: "0 0 0 1px rgba(139,92,246,0.15)" } : {}),
                }}
              >
                <button
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
                  onClick={() => setExpanded(isExpanded ? null : t.id)}
                >
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: isWin ? "var(--color-profit)" : "var(--color-loss)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[12px] font-semibold font-[var(--font-playfair)]"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {t.symbol}
                      </span>
                      <Badge
                        className="text-[9px] leading-none"
                        style={{
                          background: t.direction === "buy"
                            ? "rgba(74, 222, 128, 0.15)"
                            : "rgba(248, 113, 113, 0.15)",
                          color: t.direction === "buy" ? "var(--color-profit)" : "var(--color-loss)",
                        }}
                      >
                        {t.direction.toUpperCase()}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[9px] leading-none"
                        style={{
                          borderColor: "var(--border-subtle)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {session}
                      </Badge>
                      {t.strategy && (
                        <Badge
                          variant="outline"
                          className="text-[9px] leading-none"
                          style={{
                            borderColor: "var(--border-subtle)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {t.strategy}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {new Date(t.entry_time).toLocaleDateString("en-US", {
                          month: "short", day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        <Clock className="h-2.5 w-2.5" />
                        {formatDuration(t)}
                      </span>
                      {rr && (
                        <span className="text-[10px] font-medium" style={{ color: "var(--color-info)" }}>
                          {rr.display}
                        </span>
                      )}
                      {hit && (
                        <span
                          className="text-[9px] font-medium"
                          style={{ color: hit.color }}
                        >
                          {hit.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className="text-[13px] font-bold font-[var(--font-playfair)]"
                      style={{ color: isWin ? "var(--color-profit)" : "var(--color-loss)" }}
                    >
                      {isWin ? "+" : ""}${(t.net_pnl || 0).toFixed(2)}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                  )}
                </button>

                {isExpanded && (
                  <div
                    className="border-t px-4 py-3 space-y-4"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    {/* Outcome */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={{
                          background: isWin
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(239, 68, 68, 0.1)",
                          color: isWin ? "var(--color-profit)" : "var(--color-loss)",
                        }}
                      >
                        {isWin ? "+" : ""}${(t.net_pnl || 0).toFixed(2)}
                        <span className="text-[10px] font-normal">
                          {isWin ? "Win" : "Loss"}
                        </span>
                      </div>
                      {hit && (
                        <span className="text-[11px]" style={{ color: hit.color }}>
                          · {hit.label}
                        </span>
                      )}
                      {rr && avg && (
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          · R:R {rr.display}
                          <span style={{ color: "var(--text-secondary)" }}>
                            {" "}(avg {avg.count > 0 ? (avg.totalRR / avg.count).toFixed(2) : "—"}R for {t.symbol})
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Entry Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-3 w-3" style={{ color: "var(--color-ai)" }} />
                        <span
                          className="text-[9px] font-semibold uppercase tracking-wider"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Entry Details
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <div>
                          <div className="text-[9px] uppercase font-[var(--font-jetbrains)]" style={{ color: "var(--text-muted)" }}>Entry</div>
                          <div className="text-[12px] font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>{t.entry_price}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-[var(--font-jetbrains)]" style={{ color: "var(--text-muted)" }}>Exit</div>
                          <div className="text-[12px] font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>{t.exit_price || "—"}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-[var(--font-jetbrains)]" style={{ color: "var(--text-muted)" }}>Stop Loss</div>
                          <div className="text-[12px] font-semibold font-[var(--font-jetbrains)]" style={{
                            color: "var(--text-primary)",
                            ...(t.stop_loss ? {} : { opacity: 0.5 }),
                          }}>
                            {t.stop_loss || "Not set"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-[var(--font-jetbrains)]" style={{ color: "var(--text-muted)" }}>Take Profit</div>
                          <div className="text-[12px] font-semibold font-[var(--font-jetbrains)]" style={{
                            color: "var(--text-primary)",
                            ...(t.take_profit ? {} : { opacity: 0.5 }),
                          }}>
                            {t.take_profit || "Not set"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-[var(--font-jetbrains)]" style={{ color: "var(--text-muted)" }}>Lot Size</div>
                          <div className="text-[12px] font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>{t.lot_size}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-[var(--font-jetbrains)]" style={{ color: "var(--text-muted)" }}>Commission</div>
                          <div className="text-[12px] font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>${(t.commission || 0).toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-[var(--font-jetbrains)]" style={{ color: "var(--text-muted)" }}>Swap</div>
                          <div className="text-[12px] font-semibold font-[var(--font-jetbrains)]" style={{ color: "var(--text-primary)" }}>${(t.swap || 0).toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-[var(--font-jetbrains)]" style={{ color: "var(--text-muted)" }}>Session</div>
                          <div className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>{session}</div>
                        </div>
                      </div>
                    </div>

                    {/* Psychology */}
                    {(t.confidence_before || t.fear_level || t.greed_level || t.followed_plan !== null) && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-3 w-3" style={{ color: "var(--color-premium, #8b5cf6)" }} />
                          <span
                            className="text-[9px] font-semibold uppercase tracking-wider"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Psychology
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          {t.confidence_before && (
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              Confidence: <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{t.confidence_before}/10</span>
                            </span>
                          )}
                          {t.fear_level && (
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              Fear: <span className="font-semibold" style={{ color: "var(--color-loss)" }}>{t.fear_level}/10</span>
                            </span>
                          )}
                          {t.greed_level && (
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              Greed: <span className="font-semibold" style={{ color: "var(--color-warning)" }}>{t.greed_level}/10</span>
                            </span>
                          )}
                          {t.followed_plan !== null && (
                            <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                              Plan:
                              {t.followed_plan ? (
                                <span className="flex items-center gap-0.5 font-semibold" style={{ color: "var(--color-profit)" }}>
                                  <Check className="h-3 w-3" /> Followed
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5 font-semibold" style={{ color: "var(--color-loss)" }}>
                                  <X className="h-3 w-3" /> Deviated
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Mistakes */}
                    {t.mistakes && t.mistakes.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-3 w-3" style={{ color: "var(--color-warning)" }} />
                          <span
                            className="text-[9px] font-semibold uppercase tracking-wider"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Mistakes
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {t.mistakes.map((m, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-medium"
                              style={{
                                background: `${getMistakeColor(m)}15`,
                                color: getMistakeColor(m),
                              }}
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {t.tags && t.tags.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-3 w-3" style={{ color: "var(--color-info)" }} />
                          <span
                            className="text-[9px] font-semibold uppercase tracking-wider"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Tags
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {t.tags.map((tag, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-[9px] leading-none"
                              style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes & Screenshot */}
                    {(t.notes || t.screenshot_url) && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-3 w-3" style={{ color: "var(--color-profit)" }} />
                          <span
                            className="text-[9px] font-semibold uppercase tracking-wider"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Notes &amp; Media
                          </span>
                        </div>
                        {t.notes && (
                          <div
                            className="rounded-lg p-3 text-[11px] leading-relaxed mb-2"
                            style={{ background: "var(--surface-raised)", color: "var(--text-secondary)" }}
                          >
                            {t.notes}
                          </div>
                        )}
                        {t.screenshot_url && !hasImgError && (
                          <div
                            className="rounded-lg overflow-hidden"
                            style={{ background: "var(--surface-raised)" }}
                          >
                            <img
                              src={t.screenshot_url}
                              alt={`Trade screenshot for ${t.symbol}`}
                              className="w-full h-auto max-h-52 object-contain"
                              onError={() => setImgErrors((prev) => new Set(prev).add(t.id))}
                            />
                          </div>
                        )}
                        {t.screenshot_url && hasImgError && (
                          <div
                            className="flex items-center justify-center gap-2 rounded-lg py-8 text-[11px]"
                            style={{ background: "var(--surface-raised)", color: "var(--text-muted)" }}
                          >
                            <ImageOff className="h-4 w-4" />
                            Screenshot unavailable
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setVisibleCount((c) => c + 50)}
            className="rounded-lg border px-5 py-2 text-[11px] font-medium transition-all hover:opacity-80"
            style={{
              borderColor: "var(--border-subtle)",
              background: "var(--surface-card)",
              color: "var(--text-secondary)",
            }}
          >
            Show {Math.min(50, filtered.length - visibleCount)} more trades ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
