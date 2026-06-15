"use client";

import { useState } from "react";
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Globe,
  Activity,
  Clock,
  Webhook,
  RefreshCw,
  Shield,
  Zap,
  Terminal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const apiKeys = [
  { id: "1", name: "MT5 Sync", key: "ins_live_a1b2c3d4...x9z0", created: "Jan 15, 2026", lastUsed: "2 min ago", status: "active" },
  { id: "2", name: "Zapier Integration", key: "ins_live_e5f6g7h8...w3y1", created: "Feb 3, 2026", lastUsed: "1 hour ago", status: "active" },
  { id: "3", name: "Old Webhook", key: "ins_live_i9j0k1l2...v5u7", created: "Dec 10, 2025", lastUsed: "Never", status: "revoked" },
];

const webhooks = [
  { id: "1", url: "https://hooks.zapier.com/trigger/...", events: ["trade.imported", "trade.created"], status: "active", lastTriggered: "5 min ago" },
  { id: "2", url: "https://api.slack.com/webhook/...", events: ["backup.completed"], status: "active", lastTriggered: "2 hours ago" },
];

const apiLogs = [
  { method: "POST", endpoint: "/api/trades", status: 201, time: "2 min ago" },
  { method: "GET", endpoint: "/api/trades?limit=50", status: 200, time: "5 min ago" },
  { method: "POST", endpoint: "/api/sync/mt5", status: 200, time: "8 min ago" },
  { method: "DELETE", endpoint: "/api/trades/abc123", status: 204, time: "1 hour ago" },
  { method: "POST", endpoint: "/api/ai/analyze", status: 429, time: "2 hours ago" },
];

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    GET: { bg: "rgba(96, 165, 250, 0.1)", text: "var(--color-info)", border: "rgba(96, 165, 250, 0.2)" },
    POST: { bg: "rgba(74, 222, 128, 0.1)", text: "var(--color-profit)", border: "rgba(74, 222, 128, 0.2)" },
    DELETE: { bg: "rgba(248, 113, 113, 0.1)", text: "var(--color-loss)", border: "rgba(248, 113, 113, 0.2)" },
    PUT: { bg: "rgba(251, 191, 36, 0.1)", text: "var(--primary)", border: "rgba(251, 191, 36, 0.2)" },
  };
  const c = colors[method] || colors.GET;
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontFamily: "var(--font-jetbrains)" }}
    >
      {method}
    </span>
  );
}

function StatusBadge({ status }: { status: number }) {
  const color =
    status >= 200 && status < 300
      ? { bg: "rgba(74, 222, 128, 0.1)", text: "var(--color-profit)", border: "rgba(74, 222, 128, 0.2)" }
      : status === 429
        ? { bg: "rgba(251, 191, 36, 0.1)", text: "var(--primary)", border: "rgba(251, 191, 36, 0.2)" }
        : { bg: "rgba(248, 113, 113, 0.1)", text: "var(--color-loss)", border: "rgba(248, 113, 113, 0.2)" };
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold"
      style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}`, fontFamily: "var(--font-jetbrains)" }}
    >
      {status}
    </span>
  );
}

export function ApiHub() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "rgba(96, 165, 250, 0.1)", border: "1px solid rgba(96, 165, 250, 0.2)" }}
            >
              <Terminal className="h-4 w-4" style={{ color: "var(--color-info)" }} />
            </div>
            <h2
              className="text-xl font-semibold"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--text-primary)",
              }}
            >
              API Integration Hub
            </h2>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Professional automated integrations and webhook management
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 stagger-children">
        {[
          { label: "Active APIs", value: "2", icon: Key, color: "var(--primary)" },
          { label: "API Health", value: "99.8%", icon: Activity, color: "var(--color-profit)" },
          { label: "Requests Today", value: "1,247", icon: Zap, color: "var(--color-info)" },
          { label: "Sync Frequency", value: "2 min", icon: Clock, color: "var(--color-ai)" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-lg border p-3 hover-lift"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className="h-3.5 w-3.5" style={{ color }} />
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                {label}
              </span>
            </div>
            <div
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* API Keys */}
      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4" style={{ color: "var(--primary)" }} />
            <CardTitle className="text-sm" style={{ color: "var(--text-secondary)" }}>
              API Keys
            </CardTitle>
          </div>
          <Button size="sm" className="gap-1.5" style={{ background: "var(--primary)", color: "#000" }}>
            <Plus className="h-3.5 w-3.5" />
            Generate New Key
          </Button>
        </CardHeader>
        <CardContent className="p-0 px-4 pb-3">
          <div className="flex flex-col gap-2">
            {apiKeys.map((apiKey, i) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between rounded-md px-3 py-2.5"
                style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
                        {apiKey.name}
                      </span>
                      <Badge
                        variant={apiKey.status === "active" ? "default" : "destructive"}
                        style={{
                          fontSize: "9px",
                          ...(apiKey.status === "active"
                            ? { background: "rgba(74, 222, 128, 0.1)", color: "var(--color-profit)", border: "1px solid rgba(74, 222, 128, 0.2)" }
                            : {}),
                        }}
                      >
                        {apiKey.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span
                        className="text-[11px]"
                        style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}
                      >
                        {apiKey.key}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        Created {apiKey.created}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        Last used {apiKey.lastUsed}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleCopy(apiKey.id)}
                    style={{ color: copiedId === apiKey.id ? "var(--color-profit)" : "var(--text-muted)" }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Webhook className="h-4 w-4" style={{ color: "var(--color-info)" }} />
            <CardTitle className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Webhooks
            </CardTitle>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5" style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>
            <Plus className="h-3.5 w-3.5" />
            Add Webhook
          </Button>
        </CardHeader>
        <CardContent className="p-0 px-4 pb-3">
          <div className="flex flex-col gap-2">
            {webhooks.map((wh, i) => (
              <div
                key={wh.id}
                className="rounded-md px-3 py-2.5"
                style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" style={{ color: "var(--color-info)" }} />
                    <span
                      className="text-[12px]"
                      style={{ color: "var(--text-primary)", fontFamily: "var(--font-jetbrains)" }}
                    >
                      {wh.url}
                    </span>
                  </div>
                  <Badge
                    variant="default"
                    style={{
                      fontSize: "9px",
                      background: "rgba(74, 222, 128, 0.1)",
                      color: "var(--color-profit)",
                      border: "1px solid rgba(74, 222, 128, 0.2)",
                    }}
                  >
                    {wh.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex gap-1">
                    {wh.events.map((event) => (
                      <Badge
                        key={event}
                        variant="outline"
                        style={{
                          fontSize: "9px",
                          borderColor: "var(--border-subtle)",
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-jetbrains)",
                        }}
                      >
                        {event}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    Last triggered {wh.lastTriggered}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Logs */}
      <Card style={{ background: "var(--surface-card)", borderColor: "var(--border-subtle)" }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" style={{ color: "var(--color-ai)" }} />
            <CardTitle className="text-sm" style={{ color: "var(--text-secondary)" }}>
              API Logs
            </CardTitle>
          </div>
          <Button size="icon-xs" variant="ghost" style={{ color: "var(--text-muted)" }}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 px-4 pb-3">
          <div className="flex max-h-[280px] flex-col gap-1 overflow-y-auto pr-1">
            {apiLogs.map((log, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md px-3 py-2"
                style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}
              >
                <div className="flex items-center gap-2.5">
                  <MethodBadge method={log.method} />
                  <span
                    className="text-[12px]"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-jetbrains)" }}
                  >
                    {log.endpoint}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <StatusBadge status={log.status} />
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {log.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
