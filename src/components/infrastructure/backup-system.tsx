"use client"

import { useState } from "react"
import {
  Download,
  Clock,
  Database,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  FileDown,
  Calendar,
  HardDrive,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const recentBackups = [
  { id: "1", timestamp: "Jun 15, 2026 2:30 PM", size: "12.4 MB", status: "complete", trades: 2526 },
  { id: "2", timestamp: "Jun 15, 2026 8:00 AM", size: "12.1 MB", status: "complete", trades: 2518 },
  { id: "3", timestamp: "Jun 14, 2026 8:00 PM", size: "11.8 MB", status: "complete", trades: 2510 },
  { id: "4", timestamp: "Jun 14, 2026 8:00 AM", size: "11.5 MB", status: "complete", trades: 2498 },
  { id: "5", timestamp: "Jun 13, 2026 8:00 PM", size: "0 B", status: "failed", trades: 0 },
]

const backupTypes = [
  { label: "Trades", included: true, count: "2,526" },
  { label: "Notes", included: true, count: "184" },
  { label: "Screenshots", included: true, count: "47" },
  { label: "Journal Entries", included: true, count: "92" },
  { label: "AI Insights", included: true, count: "36" },
]

export function BackupSystem() {
  const [autoBackup, setAutoBackup] = useState(true)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <h2
            className="text-xl font-semibold"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--text-primary)",
            }}
          >
            Backup System
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Protect your trading data with automatic backups and recovery
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 stagger-children">
        {[
          {
            label: "Last Backup",
            value: "12 min ago",
            icon: <Clock size={16} style={{ color: "var(--text-muted)" }} />,
            detail: "Today, 10:31 AM",
          },
          {
            label: "Status",
            value: "Protected",
            icon: (
              <div className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: "var(--color-profit)",
                    boxShadow: "0 0 8px var(--color-profit)",
                  }}
                />
              </div>
            ),
            valueColor: "var(--color-profit)",
            detail: "All data safe",
          },
          {
            label: "Storage Used",
            value: "12.4 MB",
            icon: <HardDrive size={16} style={{ color: "var(--text-muted)" }} />,
            detail: "of 100 MB",
          },
          {
            label: "Next Backup",
            value: "In 4 hours",
            icon: <Calendar size={16} style={{ color: "var(--text-muted)" }} />,
            detail: "Auto-scheduled",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="card-surface hover-lift"
            style={{
              backgroundColor: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  {stat.label}
                </span>
                {stat.icon}
              </div>
              <div
                className="text-lg font-bold"
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  color: stat.valueColor || "var(--text-primary)",
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-[11px]"
                style={{ color: "var(--text-muted)" }}
              >
                {stat.detail}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Backup Controls */}
      <Card
        className="card-surface"
        style={{
          backgroundColor: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Button
            className="btn-gold-glow gap-1.5"
            style={{
              backgroundColor: "var(--primary)",
              color: "#000",
              fontWeight: 600,
            }}
          >
            <Download size={15} />
            Create Backup Now
          </Button>

          <div className="flex items-center gap-2.5">
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Auto Backup
            </span>
            <button
              onClick={() => setAutoBackup(!autoBackup)}
              className="relative h-6 w-11 cursor-pointer rounded-full transition-colors"
              style={{
                backgroundColor: autoBackup ? "var(--primary)" : "var(--surface-raised)",
                border: `1px solid ${autoBackup ? "var(--primary)" : "var(--border-subtle)"}`,
              }}
            >
              <div
                className="absolute top-0.5 h-4.5 w-4.5 rounded-full transition-transform"
                style={{
                  transform: autoBackup ? "translateX(20px)" : "translateX(2px)",
                  background: autoBackup ? "#000" : "var(--text-muted)",
                }}
              />
            </button>
          </div>

          <div className="h-6 w-px" style={{ background: "var(--border-subtle)" }} />

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            style={{
              borderColor: "var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            <RotateCcw size={14} />
            Restore
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            style={{
              borderColor: "var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            <FileDown size={14} />
            Export All
          </Button>
        </CardContent>
      </Card>

      {/* Backup Types & Recent Backups */}
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        {/* Backup Types Checklist */}
        <Card
          className="card-surface"
          style={{
            backgroundColor: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <CardHeader style={{ padding: "16px 16px 0 16px" }}>
            <CardTitle className="flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <ShieldCheck size={16} style={{ color: "var(--color-profit)" }} />
              What&apos;s Included
            </CardTitle>
          </CardHeader>
          <CardContent style={{ padding: "16px" }}>
            <div className="flex flex-col gap-2.5">
              {backupTypes.map((type, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2
                      size={16}
                      style={{ color: type.included ? "var(--color-profit)" : "var(--text-muted)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {type.label}
                    </span>
                  </div>
                  <span
                    className="mono-data text-[11px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {type.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Backups */}
        <Card
          className="card-surface"
          style={{
            backgroundColor: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <CardHeader style={{ padding: "16px 16px 0 16px" }}>
            <CardTitle className="flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Database size={16} style={{ color: "var(--primary)" }} />
              Recent Backups
            </CardTitle>
          </CardHeader>
          <CardContent style={{ padding: "16px" }}>
            <div className="flex flex-col gap-0">
              {recentBackups.map((backup, i) => (
                <div key={backup.id}>
                  <div
                    className="grid items-center gap-4 py-3"
                    style={{ gridTemplateColumns: "1fr auto auto auto" }}
                  >
                    <div>
                      <div
                        className="text-[13px] font-medium"
                        style={{
                          fontFamily: "var(--font-jetbrains)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {backup.timestamp}
                      </div>
                      <div
                        className="mt-0.5 text-[12px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {backup.trades > 0 ? `${backup.trades.toLocaleString()} trades` : "No data"}
                      </div>
                    </div>
                    <span
                      className="text-[13px]"
                      style={{
                        fontFamily: "var(--font-jetbrains)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {backup.size}
                    </span>
                    <Badge
                      variant={backup.status === "complete" ? "default" : "destructive"}
                      className="text-[10px]"
                      style={{
                        backgroundColor:
                          backup.status === "complete"
                            ? "rgba(74, 222, 128, 0.15)"
                            : "rgba(248, 113, 113, 0.15)",
                        color:
                          backup.status === "complete" ? "var(--color-profit)" : "var(--color-loss)",
                        borderColor:
                          backup.status === "complete"
                            ? "rgba(74, 222, 128, 0.3)"
                            : "rgba(248, 113, 113, 0.3)",
                      }}
                    >
                      {backup.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={backup.status === "failed"}
                      style={{ color: "var(--text-muted)" }}
                    >
                      <RotateCcw size={14} />
                    </Button>
                  </div>
                  {i < recentBackups.length - 1 && (
                    <Separator style={{ backgroundColor: "var(--border-subtle)" }} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
