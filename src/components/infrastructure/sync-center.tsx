"use client";

import { useState } from "react";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  ArrowRight,
  Wifi,
  Activity,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const syncStatus = {
  connected: true,
  lastSync: "2 minutes ago",
  totalSynced: 28734,
  failed: 3,
  health: 98,
};

const syncHistory = [
  { time: "2 min ago", status: "success", trades: 12, duration: "1.2s" },
  { time: "1 hour ago", status: "success", trades: 8, duration: "0.8s" },
  { time: "3 hours ago", status: "partial", trades: 5, duration: "2.1s" },
  { time: "6 hours ago", status: "success", trades: 15, duration: "1.5s" },
  { time: "1 day ago", status: "failed", trades: 0, duration: "0.3s" },
];

const mt4History = [
  { file: "Statement_2026-01.htm", date: "Jan 15, 2026", trades: 142, status: "success" },
  { file: "Trade_History.ofc", date: "Dec 28, 2025", trades: 89, status: "success" },
  { file: "Account_Report.html", date: "Nov 10, 2025", trades: 203, status: "success" },
];

const csvHistory = [
  { file: "XAUUSD_trades.csv", date: "Feb 1, 2026", trades: 67, rate: "100%" },
  { file: "EURUSD_log.csv", date: "Jan 20, 2026", trades: 45, rate: "98%" },
  { file: "MT5_export.csv", date: "Jan 5, 2026", trades: 123, rate: "100%" },
];

function SyncNowButton() {
  const [syncing, setSyncing] = useState(false);

  return (
    <Button
      onClick={() => {
        setSyncing(true);
        setTimeout(() => setSyncing(false), 2000);
      }}
      disabled={syncing}
      className="h-12 w-full gap-2 text-base font-semibold"
      style={{
        background: syncing
          ? "rgba(251, 191, 36, 0.5)"
          : "linear-gradient(135deg, var(--primary), #D97706)",
        color: "#000",
      }}
    >
      <RefreshCw
        className={`h-5 w-5 ${syncing ? "animate-spin" : ""}`}
      />
      {syncing ? "Syncing..." : "Sync Now"}
    </Button>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className="relative h-6 w-11 cursor-pointer rounded-full transition-colors"
      style={{
        background: checked
          ? "var(--primary)"
          : "var(--surface-raised)",
        border: `1px solid ${checked ? "var(--primary)" : "var(--border-subtle)"}`,
      }}
    >
      <div
        className="absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white transition-transform"
        style={{
          transform: checked ? "translateX(20px)" : "translateX(2px)",
          background: checked ? "#000" : "var(--text-muted)",
        }}
      />
    </div>
  );
}

function HealthRing({ health }: { health: number }) {
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (health / 100) * circumference;

  return (
    <svg className="h-12 w-12" viewBox="0 0 44 44">
      <circle
        cx="22"
        cy="22"
        r="18"
        fill="none"
        stroke="var(--border-subtle)"
        strokeWidth="3"
      />
      <circle
        cx="22"
        cy="22"
        r="18"
        fill="none"
        stroke={health >= 90 ? "var(--color-profit)" : "var(--color-warning)"}
        strokeWidth="3"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
        style={{ transition: "stroke-dashoffset 600ms ease-out" }}
      />
      <text
        x="22"
        y="21"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--text-primary)"
        fontSize="10"
        fontWeight="700"
        fontFamily="var(--font-jetbrains), monospace"
      >
        {health}
      </text>
      <text
        x="22"
        y="28"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--text-muted)"
        fontSize="6"
        fontFamily="var(--font-inter), sans-serif"
      >
        %
      </text>
    </svg>
  );
}

function StatusDot({ connected }: { connected: boolean }) {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{
        background: connected ? "var(--color-profit)" : "var(--color-loss)",
        boxShadow: connected
          ? "0 0 6px rgba(74, 222, 128, 0.5)"
          : "0 0 6px rgba(248, 113, 113, 0.5)",
      }}
    />
  );
}

export function SyncCenter() {
  const [autoSync, setAutoSync] = useState(true);
  const [showErrors, setShowErrors] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "rgba(251, 191, 36, 0.1)", border: "1px solid rgba(251, 191, 36, 0.2)" }}
            >
              <Activity className="h-4 w-4" style={{ color: "var(--primary)" }} />
            </div>
            <h2
              className="text-xl font-semibold"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--text-primary)",
              }}
            >
              Sync Center
            </h2>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Synchronize, import, and manage your trading data across platforms
          </p>
        </div>
      </div>

      <Tabs defaultValue="mt5">
        <TabsList className="w-full" style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)" }}>
          <TabsTrigger value="mt5" className="gap-2 font-[var(--font-inter)]">
            <Wifi className="h-3.5 w-3.5" />
            MT5 Auto-Sync
          </TabsTrigger>
          <TabsTrigger value="mt4" className="gap-2 font-[var(--font-inter)]">
            <FileText className="h-3.5 w-3.5" />
            MT4 Import
          </TabsTrigger>
          <TabsTrigger value="csv" className="gap-2 font-[var(--font-inter)]">
            <Upload className="h-3.5 w-3.5" />
            CSV Import
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mt5">
          <div className="flex flex-col gap-4">
            <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Status
                    </span>
                    <div className="flex items-center gap-1.5">
                      <StatusDot connected={syncStatus.connected} />
                      <span className="text-sm font-semibold" style={{ color: "var(--color-profit)" }}>
                        {syncStatus.connected ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Last Sync
                    </span>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-jetbrains)" }}>
                      {syncStatus.lastSync}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Total Synced
                    </span>
                    <span className="text-sm font-semibold" style={{ color: "var(--color-profit)", fontFamily: "var(--font-jetbrains)" }}>
                      {syncStatus.totalSynced.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Failed
                    </span>
                    <span className="text-sm font-semibold" style={{ color: syncStatus.failed > 0 ? "var(--color-loss)" : "var(--text-primary)", fontFamily: "var(--font-jetbrains)" }}>
                      {syncStatus.failed}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Health
                    </span>
                    <HealthRing health={syncStatus.health} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <SyncNowButton />

                <div
                  className="flex items-center justify-between rounded-lg border p-3"
                  style={{ background: "var(--surface-raised)", borderColor: "var(--border-subtle)" }}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" style={{ color: "var(--primary)" }} />
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      Auto-Sync
                    </span>
                  </div>
                  <ToggleSwitch checked={autoSync} onChange={setAutoSync} />
                </div>
              </div>

              <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Recent Syncs
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 px-4 pb-3">
                  <div className="flex flex-col gap-2">
                    {syncHistory.map((entry, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md px-2 py-1.5 text-[13px]"
                        style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}
                      >
                        <div className="flex items-center gap-2">
                          {entry.status === "success" && <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--color-profit)" }} />}
                          {entry.status === "partial" && <AlertTriangle className="h-3.5 w-3.5" style={{ color: "var(--color-warning)" }} />}
                          {entry.status === "failed" && <XCircle className="h-3.5 w-3.5" style={{ color: "var(--color-loss)" }} />}
                          <span style={{ color: "var(--text-secondary)" }}>{entry.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="mono-data text-[11px]" style={{ color: "var(--text-muted)" }}>
                            {entry.trades} trades
                          </span>
                          <span className="mono-data text-[11px]" style={{ color: "var(--text-muted)" }}>
                            {entry.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div
              className="rounded-lg border overflow-hidden"
              style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
            >
              <button
                onClick={() => setShowErrors(!showErrors)}
                className="flex w-full items-center justify-between p-3 text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" style={{ color: "var(--color-loss)" }} />
                  Error Logs
                  <Badge variant="destructive" className="ml-1">
                    {syncStatus.failed}
                  </Badge>
                </div>
                {showErrors ? (
                  <ChevronUp className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                ) : (
                  <ChevronDown className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                )}
              </button>
              {showErrors && (
                <div className="border-t px-3 pb-3" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="rounded-md p-2 text-[12px]" style={{ background: "rgba(248, 113, 113, 0.05)", fontFamily: "var(--font-jetbrains)" }}>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-3 w-3 shrink-0" style={{ color: "var(--color-loss)" }} />
                        <span style={{ color: "var(--color-loss)" }}>Connection timeout</span>
                        <span style={{ color: "var(--text-muted)" }}>— 1 day ago</span>
                      </div>
                      <div className="mt-1 pl-5" style={{ color: "var(--text-muted)" }}>
                        Failed to connect to MT5 server. Retry attempted 3/3 times.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mt4">
          <div className="flex flex-col gap-4">
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors hover:border-[var(--primary)]"
              style={{ borderColor: "var(--border-subtle)", background: "var(--surface-raised)" }}
            >
              <Upload className="h-10 w-10" style={{ color: "var(--text-muted)" }} />
              <div className="text-center">
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Drop MT4 statement files here
                </div>
                <div className="mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                  Supports .ofc, .htm, and .html formats
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Browse Files
              </Button>
              <div className="flex gap-3 mt-1">
                {[".ofc", ".htm", ".html"].map((ext) => (
                  <div
                    key={ext}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium"
                    style={{ background: "rgba(251, 191, 36, 0.08)", color: "var(--primary)", border: "1px solid rgba(251, 191, 36, 0.15)" }}
                  >
                    <FileText className="h-3 w-3" />
                    {ext}
                  </div>
                ))}
              </div>
            </div>

            <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
              <CardContent className="p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                  Import Wizard
                </div>
                <div className="flex items-center justify-between gap-2">
                  {["Upload", "Preview", "Validate", "Confirm"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                          style={{
                            background: i === 0 ? "var(--primary)" : "var(--surface-raised)",
                            color: i === 0 ? "#000" : "var(--text-muted)",
                            border: `1px solid ${i === 0 ? "var(--primary)" : "var(--border-subtle)"}`,
                          }}
                        >
                          {i + 1}
                        </div>
                        <span
                          className="text-[10px] font-medium"
                          style={{ color: i === 0 ? "var(--text-primary)" : "var(--text-muted)" }}
                        >
                          {step}
                        </span>
                      </div>
                      {i < 3 && (
                        <ArrowRight className="h-4 w-4 shrink-0" style={{ color: "var(--border-subtle)" }} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Import History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 px-4 pb-3">
                <div className="flex flex-col gap-2">
                  {mt4History.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md px-2 py-1.5 text-[13px]"
                      style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--color-profit)" }} />
                        <span style={{ color: "var(--text-primary)" }}>{entry.file}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ color: "var(--text-muted)" }}>{entry.date}</span>
                        <span className="mono-data text-[11px]" style={{ color: "var(--text-muted)" }}>
                          {entry.trades} trades
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="csv">
          <div className="flex flex-col gap-4">
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors hover:border-[var(--primary)]"
              style={{ borderColor: "var(--border-subtle)", background: "var(--surface-raised)" }}
            >
              <FileText className="h-10 w-10" style={{ color: "var(--text-muted)" }} />
              <div className="text-center">
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Upload CSV trade logs
                </div>
                <div className="mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                  XAUUSD, EURUSD trade logs and MT4/MT5 statement exports
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Browse Files
                </Button>
                <Button variant="ghost" className="gap-2" style={{ color: "var(--primary)" }}>
                  <Download className="h-4 w-4" />
                  Download Sample
                </Button>
              </div>
            </div>

            <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Column Mapping
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 px-4 pb-3">
                <div className="flex flex-col gap-2">
                  {[
                    { csv: "Ticket", field: "Trade ID" },
                    { csv: "Open Time", field: "Entry Time" },
                    { csv: "Symbol", field: "Instrument" },
                    { csv: "Volume", field: "Position Size" },
                    { csv: "Profit", field: "P&L" },
                  ].map((mapping, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-md px-2 py-1.5"
                      style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}
                    >
                      <span
                        className="w-24 text-[12px] font-medium"
                        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-jetbrains)" }}
                      >
                        {mapping.csv}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--primary)" }} />
                      <span
                        className="flex-1 rounded-md border px-2 py-1 text-[12px]"
                        style={{
                          color: "var(--text-primary)",
                          background: "var(--surface-raised)",
                          borderColor: "var(--border-subtle)",
                        }}
                      >
                        {mapping.field}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Supported Formats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 px-4 pb-3">
                <div className="flex flex-wrap gap-2">
                  {["XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "BTCUSD", "MT4 Export", "MT5 Export"].map((format) => (
                    <Badge
                      key={format}
                      variant="outline"
                      style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
                    >
                      {format}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Import History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 px-4 pb-3">
                <div className="flex flex-col gap-2">
                  {csvHistory.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md px-2 py-1.5 text-[13px]"
                      style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--color-profit)" }} />
                        <span style={{ color: "var(--text-primary)" }}>{entry.file}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ color: "var(--text-muted)" }}>{entry.date}</span>
                        <span className="mono-data text-[11px]" style={{ color: "var(--text-muted)" }}>
                          {entry.trades} trades
                        </span>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: "rgba(74, 222, 128, 0.3)",
                            color: "var(--color-profit)",
                            fontSize: "10px",
                          }}
                        >
                          {entry.rate}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
