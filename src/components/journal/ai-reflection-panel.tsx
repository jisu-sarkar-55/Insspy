"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertTriangle, Lightbulb } from "lucide-react";
import type { Trade } from "@/types";

interface AiReflectionPanelProps {
  trades: Trade[];
}

interface MistakePattern {
  mistake: string;
  count: number;
  totalLoss: number;
  avgPnl: number;
}

export function AiReflectionPanel({ trades }: AiReflectionPanelProps) {
  const analysis = useMemo(() => {
    const closedTrades = trades.filter((t) => t.net_pnl !== null);

    // Aggregate all mistakes
    const mistakeMap = new Map<string, { count: number; totalLoss: number }>();
    for (const trade of trades) {
      if (!trade.mistakes || trade.mistakes.length === 0) continue;
      for (const mistake of trade.mistakes) {
        const existing = mistakeMap.get(mistake) || { count: 0, totalLoss: 0 };
        existing.count += 1;
        if (trade.net_pnl !== null && trade.net_pnl < 0) {
          existing.totalLoss += Math.abs(trade.net_pnl);
        }
        mistakeMap.set(mistake, existing);
      }
    }

    const patterns: MistakePattern[] = Array.from(mistakeMap.entries())
      .map(([mistake, data]) => ({
        mistake,
        count: data.count,
        totalLoss: data.totalLoss,
        avgPnl: data.totalLoss / data.count,
      }))
      .sort((a, b) => b.count - a.count);

    const topMistake = patterns[0] || null;

    // Find most common lesson theme in notes
    const lessonKeywords = new Map<string, number>();
    const lessonPatterns = [
      /patience/i,
      /discipline/i,
      /confirmation/i,
      /news/i,
      /overtrading/i,
      /revenge/i,
      /fomo/i,
      /entry/i,
      /exit/i,
      /stop\s?loss/i,
      /risk/i,
      /emotion/i,
    ];

    for (const trade of trades) {
      if (!trade.notes) continue;
      for (const pattern of lessonPatterns) {
        if (pattern.test(trade.notes)) {
          const keyword = pattern.source.toLowerCase().replace(/\\b|\\/g, "").replace(/\s?/g, "");
          lessonKeywords.set(keyword, (lessonKeywords.get(keyword) || 0) + 1);
        }
      }
    }

    const topTheme = Array.from(lessonKeywords.entries())
      .sort((a, b) => b[1] - a[1])[0] || null;

    const winRate = closedTrades.length > 0
      ? (closedTrades.filter((t) => t.net_pnl! > 0).length / closedTrades.length) * 100
      : 0;

    const totalMistakeCost = patterns.reduce((sum, p) => sum + p.totalLoss, 0);

    return {
      topMistake,
      patterns: patterns.slice(0, 3),
      topTheme,
      winRate,
      totalMistakeCost,
      totalEntries: trades.length,
      mistakeTrades: patterns.reduce((sum, p) => sum + p.count, 0),
    };
  }, [trades]);

  if (trades.length === 0) return null;

  const formatKeyword = (key: string) => {
    return key
      .replace(/fomo/gi, "FOMO")
      .replace(/stoploss/gi, "Stop Loss")
      .replace(/news/gi, "News Events")
      .replace(/patience/gi, "Patience")
      .replace(/discipline/gi, "Discipline")
      .replace(/confirmation/gi, "Confirmation")
      .replace(/overtrading/gi, "Overtrading")
      .replace(/revenge/gi, "Revenge Trading")
      .replace(/entry/gi, "Entry Timing")
      .replace(/exit/gi, "Exit Strategy")
      .replace(/risk/gi, "Risk Management")
      .replace(/emotion/gi, "Emotional Control")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <Card
      className="texture-noise"
      style={{
        background: "var(--surface-card)",
        borderColor: "rgba(192, 132, 252, 0.3)",
      }}
    >
      <CardHeader className="pb-3">
        <CardTitle
          className="flex items-center gap-2 text-base"
          style={{ color: "var(--text-primary)" }}
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: "var(--color-ai-bg)" }}
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--color-ai)" }} />
          </div>
          AI Reflection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Top Mistake */}
        {analysis.topMistake ? (
          <div
            className="rounded-lg p-3"
            style={{ background: "var(--color-loss-bg)" }}
          >
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-loss)" }}>
              <AlertTriangle className="h-3 w-3" />
              Most Common Mistake
            </div>
            <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {analysis.topMistake.mistake}
            </div>
            <div className="mt-1.5 flex items-center gap-3 text-[11px]" style={{ color: "var(--text-muted)" }}>
              <span>Detected: {analysis.topMistake.count} time{analysis.topMistake.count !== 1 ? "s" : ""}</span>
              {analysis.topMistake.totalLoss > 0 && (
                <span className="mono-data" style={{ color: "var(--color-loss)" }}>
                  Cost: -${analysis.topMistake.totalLoss.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div
            className="rounded-lg p-3"
            style={{ background: "var(--color-profit-bg)" }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-profit)" }}>
              <Lightbulb className="mr-1 h-3 w-3 inline" />
              No Recurring Mistakes Detected
            </div>
            <div className="mt-1 text-[13px]" style={{ color: "var(--text-secondary)" }}>
              Keep logging your trades to unlock pattern analysis.
            </div>
          </div>
        )}

        {/* Top Theme */}
        {analysis.topTheme && (
          <div className="rounded-lg p-3" style={{ background: "var(--surface-raised)" }}>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-info)" }}>
              Recurring Theme
            </div>
            <div className="text-sm" style={{ color: "var(--text-primary)" }}>
              {formatKeyword(analysis.topTheme[0])}
              <span className="ml-1.5 text-[11px] mono-data" style={{ color: "var(--text-muted)" }}>
                ({analysis.topTheme[1]} mentions)
              </span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[12px]">
            <span style={{ color: "var(--text-muted)" }}>Win Rate</span>
            <span
              className="mono-data font-semibold"
              style={{ color: analysis.winRate >= 50 ? "var(--color-profit)" : "var(--color-loss)" }}
            >
              {analysis.winRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span style={{ color: "var(--text-muted)" }}>Mistake Entries</span>
            <span className="mono-data" style={{ color: "var(--text-secondary)" }}>
              {analysis.mistakeTrades} / {analysis.totalEntries}
            </span>
          </div>
          {analysis.totalMistakeCost > 0 && (
            <div className="flex items-center justify-between text-[12px]">
              <span style={{ color: "var(--text-muted)" }}>Total Mistake Cost</span>
              <span className="mono-data font-semibold" style={{ color: "var(--color-loss)" }}>
                -${analysis.totalMistakeCost.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Other patterns */}
        {analysis.patterns.length > 1 && (
          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Other Patterns
            </div>
            <div className="space-y-1.5">
              {analysis.patterns.slice(1).map((p) => (
                <div
                  key={p.mistake}
                  className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-[12px]"
                  style={{ background: "var(--surface-raised)" }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>{p.mistake}</span>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {p.count}x
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
