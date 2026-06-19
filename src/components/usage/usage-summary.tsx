"use client";

import { useEffect, useState, useCallback } from "react";
import { UsageBar } from "./usage-bar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  Brain,
  FileText,
  Target,
  Library,
  Upload,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface UsageItem {
  current: number;
  limit: number;
}

interface UsageData {
  trades: UsageItem;
  ai_analyses: UsageItem;
  csv_imports: UsageItem;
  goals: UsageItem;
  playbooks: UsageItem;
  report_downloads: UsageItem;
}

const defaultItem: UsageItem = { current: 0, limit: 0 };

const sections: {
  key: keyof UsageData;
  label: string;
  icon: typeof TrendingUp;
}[] = [
  { key: "trades", label: "Trades logged", icon: TrendingUp },
  { key: "ai_analyses", label: "AI analyses / month", icon: Brain },
  { key: "csv_imports", label: "CSV imports (total)", icon: FileText },
  { key: "goals", label: "Active goals", icon: Target },
  { key: "playbooks", label: "Setup playbooks", icon: Library },
  { key: "report_downloads", label: "PDF report downloads / month", icon: Upload },
];

function Skeleton() {
  return (
    <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
      <CardHeader>
        <div className="h-4 w-32 rounded" style={{ background: "var(--surface-raised)" }} />
      </CardHeader>
      <CardContent className="space-y-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-40 rounded" style={{ background: "var(--surface-raised)" }} />
            <div className="h-2 rounded-full" style={{ background: "var(--surface-raised)" }} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function safeItem(val: unknown): UsageItem {
  if (val && typeof val === "object" && "current" in val && "limit" in val) {
    const v = val as Record<string, unknown>;
    return {
      current: Number(v.current) || 0,
      limit: Number(v.limit) || 0,
    };
  }
  return defaultItem;
}

export function UsageSummary() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchUsage = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);

    try {
      const res = await fetch("/api/user/usage", { cache: "no-cache" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Request failed (${res.status})`);
      }
      const d = await res.json();
      if (!d || typeof d !== "object") throw new Error("Invalid response");
      setData(d as UsageData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();

    const onFocus = () => fetchUsage(true);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchUsage]);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardContent className="py-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-5 w-5" style={{ color: "var(--color-loss)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {error}
            </p>
            <button
              onClick={() => fetchUsage()}
              className="text-xs underline cursor-pointer"
              style={{ color: "var(--color-ai)" }}
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || typeof data !== "object") return null;

  const trades = safeItem(data.trades);
  const ai = safeItem(data.ai_analyses);
  const csv = safeItem(data.csv_imports);
  const goals = safeItem(data.goals);
  const playbooks = safeItem(data.playbooks);
  const reports = safeItem(data.report_downloads);

  const totalUsed = trades.current + ai.current + csv.current + goals.current + playbooks.current + reports.current;
  const totalLimit = trades.limit + ai.limit + csv.limit + goals.limit + playbooks.limit + reports.limit;
  const overallPct = totalLimit > 0 ? Math.min((totalUsed / totalLimit) * 100, 100) : 0;
  const overallColor = overallPct >= 90 ? "var(--color-loss)" : overallPct >= 75 ? "var(--color-warning)" : "var(--color-ai)";

  const items = [trades, ai, csv, goals, playbooks, reports];

  return (
    <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle
            className="flex items-center gap-2"
            style={{ color: "var(--text-primary)", fontSize: "1rem" }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "rgba(251, 191, 36, 0.1)" }}
            >
              <TrendingUp className="h-4 w-4" style={{ color: "var(--primary)" }} />
            </div>
            Usage & Limits
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                {lastUpdated}
              </span>
            )}
            <button
              onClick={() => fetchUsage(true)}
              disabled={refreshing}
              className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium cursor-pointer transition-opacity hover:opacity-70 disabled:opacity-40"
              style={{ background: "var(--surface-raised)", color: "var(--text-secondary)" }}
            >
              <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div
          className="rounded-lg p-3"
          style={{ background: "var(--surface-raised)" }}
        >
          <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text-secondary)" }}>
            <span className="font-semibold">Overall usage</span>
            <span style={{ color: "var(--text-muted)" }}>{overallPct.toFixed(0)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-page)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${overallPct}%`, background: overallColor }}
            />
          </div>
        </div>

        {sections.map(({ key, label, icon: Icon }, idx) => {
          const item = items[idx];
          return (
            <div key={key} className="flex items-start gap-3">
              <div
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                style={{ background: "var(--surface-raised)" }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <UsageBar current={item.current} limit={item.limit} label={label} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
