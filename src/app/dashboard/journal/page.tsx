"use client";

import { useEffect, useState, useMemo } from "react";
import { AdBanner } from "@/components/ads/ad-banner";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Plus,
  Search,
  BookMarked,
  TrendingUp,
} from "lucide-react";
import { JournalStatsRow } from "@/components/journal/journal-stats-row";
import { JournalEntryCard } from "@/components/journal/journal-entry-card";
import { AiReflectionPanel } from "@/components/journal/ai-reflection-panel";
import type { Trade } from "@/types";

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    let cancelled = false;
    async function fetchTrades() {
      try {
        const res = await fetch("/api/trades");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          setTrades(data.filter((t: Trade) => t.notes != null));
        }
      } catch {
        // ignore
      }
      if (!cancelled) setLoading(false);
    }

    fetchTrades();
    return () => { cancelled = true; };
  }, []);

  const filteredTrades = useMemo(() => {
    let result = trades;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          (t.notes && t.notes.toLowerCase().includes(q)) ||
          t.symbol.toLowerCase().includes(q) ||
          (t.strategy && t.strategy.toLowerCase().includes(q)) ||
          (t.mistakes && t.mistakes.some((m) => m.toLowerCase().includes(q)))
      );
    }

    // Filter by tab
    switch (activeTab) {
      case "lessons":
        result = result.filter(
          (t) =>
            t.followed_plan === true ||
            (t.notes && /lesson|learned|improve|better|next time/i.test(t.notes))
        );
        break;
      case "mistakes":
        result = result.filter(
          (t) => t.mistakes && t.mistakes.length > 0
        );
        break;
      case "breakthroughs":
        result = result.filter(
          (t) =>
            t.net_pnl !== null &&
            t.net_pnl > 0 &&
            t.followed_plan === true &&
            t.confidence_before &&
            t.confidence_before >= 7
        );
        break;
    }

    return result;
  }, [trades, searchQuery, activeTab]);

  // Group trades by date for timeline
  const groupedTrades = useMemo(() => {
    const groups = new Map<string, Trade[]>();
    for (const trade of filteredTrades) {
      const dateKey = new Date(trade.entry_time).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const existing = groups.get(dateKey) || [];
      existing.push(trade);
      groups.set(dateKey, existing);
    }
    return Array.from(groups.entries());
  }, [filteredTrades]);

  const tabCounts = useMemo(() => ({
    all: trades.length,
    lessons: trades.filter(
      (t) =>
        t.followed_plan === true ||
        (t.notes && /lesson|learned|improve|better|next time/i.test(t.notes))
    ).length,
    mistakes: trades.filter((t) => t.mistakes && t.mistakes.length > 0).length,
    breakthroughs: trades.filter(
      (t) =>
        t.net_pnl !== null &&
        t.net_pnl > 0 &&
        t.followed_plan === true &&
        t.confidence_before &&
        t.confidence_before >= 7
    ).length,
  }), [trades]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
          <div
            className="h-4 w-4 animate-spin rounded-full border-2"
            style={{ borderColor: "var(--border-subtle)", borderTopColor: "var(--primary)" }}
          />
          Loading chronicle...
        </div>
      </div>
    );
  }

  // Empty state
  if (trades.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-bold font-[var(--font-playfair)]"
              style={{ color: "var(--text-primary)" }}
            >
              Trading Chronicle
            </h1>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              Your trade reflections, lessons, and improvements
            </p>
          </div>
        </div>

        <Card
          className="texture-noise"
          style={{
            background: "var(--surface-card)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <CardContent className="py-16">
            <div className="mx-auto max-w-lg text-center">
              <div
                className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl"
                style={{ background: "rgba(251, 191, 36, 0.08)", border: "1px solid rgba(251, 191, 36, 0.15)" }}
              >
                <BookOpen className="h-9 w-9" style={{ color: "var(--primary)" }} />
              </div>

              <div className="mb-1 text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
                Est. 2026
              </div>

              <h2
                className="mb-3 text-xl font-bold font-[var(--font-playfair)]"
                style={{ color: "var(--text-primary)" }}
              >
                Trading Chronicle
              </h2>

              <p
                className="mb-8 text-[13px] leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                Your trade reflections, lessons, mistakes, and improvements
                are recorded here. Journal entries help uncover patterns that
                statistics alone miss.
              </p>

              <p
                className="mb-8 text-[12px] italic leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                Begin documenting your journey.<br />
                The best traders record their thoughts as carefully as their trades.
              </p>

              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/dashboard/trades/new">
                  <Button className="btn-gold-glow gap-1.5">
                    <Plus className="h-4 w-4" />
                    New Entry
                  </Button>
                </Link>
                <Link href="/dashboard/import">
                  <Button variant="outline" className="gap-1.5">
                    <BookMarked className="h-4 w-4" />
                    Import Trade Notes
                  </Button>
                </Link>
                <Button variant="ghost" disabled className="gap-1.5">
                  <TrendingUp className="h-4 w-4" />
                  View Example
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main content with entries
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold font-[var(--font-playfair)]"
            style={{ color: "var(--text-primary)" }}
          >
            Trading Chronicle
          </h1>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            {trades.length} journal entr{trades.length === 1 ? "y" : "ies"} — your reflections and lessons
          </p>
        </div>
        <Link href="/dashboard/trades/new">
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Entry
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <JournalStatsRow trades={trades} />

      <div className="ledger-divider" />

      {/* Tabs + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList variant="line">
            <TabsTrigger value="all">
              All Entries
              <Badge
                variant="outline"
                className="ml-1 h-5 min-w-5 px-1 text-[10px]"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
              >
                {tabCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="lessons">
              Lessons
              <Badge
                variant="outline"
                className="ml-1 h-5 min-w-5 px-1 text-[10px]"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
              >
                {tabCounts.lessons}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="mistakes">
              Mistakes
              <Badge
                variant="outline"
                className="ml-1 h-5 min-w-5 px-1 text-[10px]"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
              >
                {tabCounts.mistakes}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="breakthroughs">
              Breakthroughs
              <Badge
                variant="outline"
                className="ml-1 h-5 min-w-5 px-1 text-[10px]"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
              >
                {tabCounts.breakthroughs}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative">
          <Search
            className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
          />
          <Input
            placeholder="Search notes, symbols, mistakes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-full pl-8 text-[13px] sm:w-64"
            style={{
              background: "var(--surface-raised)",
              borderColor: "var(--border-subtle)",
            }}
          />
        </div>
      </div>

      {/* Content: Timeline + AI Panel */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        {/* Timeline */}
        <div className="space-y-5">
          {filteredTrades.length === 0 ? (
            <Card
              style={{
                background: "var(--surface-card)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <CardContent className="py-10 text-center">
                <Search className="mx-auto mb-3 h-8 w-8" style={{ color: "var(--text-muted)" }} />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  No entries match your search.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              {/* Vertical timeline line */}
              <div
                className="absolute left-[19px] top-0 bottom-0 w-px"
                style={{
                  background: "linear-gradient(to bottom, var(--border-subtle), transparent)",
                }}
              />

              {groupedTrades.map(([dateLabel, dayTrades]) => (
                <div key={dateLabel} className="relative mb-6">
                  {/* Date header with dot */}
                  <div className="mb-3 flex items-center gap-3 pl-0">
                    <div
                      className="relative z-10 h-[10px] w-[10px] shrink-0 rounded-full border-2"
                      style={{
                        background: "var(--primary)",
                        borderColor: "var(--surface-page)",
                        boxShadow: "0 0 0 2px var(--primary)",
                      }}
                    />
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {dateLabel}
                    </span>
                  </div>

                  {/* Entries for this date */}
                  <div className="ml-[30px] space-y-2.5">
                    {dayTrades.map((trade) => (
                      <JournalEntryCard key={trade.id} trade={trade} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Reflection Panel (sticky on desktop) */}
      <div className="hidden lg:block">
        <div className="sticky top-5 space-y-5">
          <AiReflectionPanel trades={trades} />
          <AdBanner slot="journal-sidebar" />
        </div>
      </div>
      <div className="lg:hidden">
        <AiReflectionPanel trades={trades} />
      </div>
      </div>
    </div>
  );
}
