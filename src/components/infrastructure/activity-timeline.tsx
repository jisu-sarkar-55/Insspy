"use client"

import {
  RefreshCw,
  HardDrive,
  Link2,
  ShieldCheck,
  Key,
  UserPlus,
  AlertCircle,
  Upload,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const events = [
  {
    id: "1",
    type: "sync",
    title: "MT5 Auto-Sync",
    description: "12 trades imported from IC Markets",
    time: "10:42 AM",
    date: "Today",
    status: "success" as const,
  },
  {
    id: "2",
    type: "backup",
    title: "Backup Created",
    description: "Full backup completed - 12.4 MB",
    time: "10:31 AM",
    date: "Today",
    status: "success" as const,
  },
  {
    id: "3",
    type: "validation",
    title: "Validation Completed",
    description: "99/100 integrity score - 0 critical issues",
    time: "10:18 AM",
    date: "Today",
    status: "success" as const,
  },
  {
    id: "4",
    type: "import",
    title: "CSV Imported",
    description: "847 trades imported from statements.csv",
    time: "09:54 AM",
    date: "Today",
    status: "success" as const,
  },
  {
    id: "5",
    type: "broker",
    title: "Broker Connected",
    description: "Eightcap account linked successfully",
    time: "2:15 PM",
    date: "Yesterday",
    status: "info" as const,
  },
  {
    id: "6",
    type: "api",
    title: "API Key Generated",
    description: "New key for Zapier integration",
    time: "11:30 AM",
    date: "Yesterday",
    status: "info" as const,
  },
  {
    id: "7",
    type: "account",
    title: "Account Added",
    description: "Funded Account (FTMO) created",
    time: "9:00 AM",
    date: "2 days ago",
    status: "info" as const,
  },
  {
    id: "8",
    type: "sync",
    title: "MT5 Sync Failed",
    description: "Connection timeout - retrying in 5 min",
    time: "4:22 PM",
    date: "3 days ago",
    status: "error" as const,
  },
]

const typeIcons: Record<string, React.ReactNode> = {
  sync: <RefreshCw size={14} />,
  backup: <HardDrive size={14} />,
  broker: <Link2 size={14} />,
  validation: <ShieldCheck size={14} />,
  api: <Key size={14} />,
  account: <UserPlus size={14} />,
  import: <Upload size={14} />,
}

const statusColors: Record<string, { dot: string; badge: string; badgeBg: string; badgeBorder: string }> = {
  success: {
    dot: "var(--color-profit)",
    badge: "var(--color-profit)",
    badgeBg: "rgba(74, 222, 128, 0.15)",
    badgeBorder: "rgba(74, 222, 128, 0.3)",
  },
  info: {
    dot: "var(--color-info)",
    badge: "var(--color-info)",
    badgeBg: "rgba(96, 165, 250, 0.15)",
    badgeBorder: "rgba(96, 165, 250, 0.3)",
  },
  warning: {
    dot: "var(--color-warning)",
    badge: "var(--color-warning)",
    badgeBg: "rgba(251, 191, 36, 0.15)",
    badgeBorder: "rgba(251, 191, 36, 0.3)",
  },
  error: {
    dot: "var(--color-loss)",
    badge: "var(--color-loss)",
    badgeBg: "rgba(248, 113, 113, 0.15)",
    badgeBorder: "rgba(248, 113, 113, 0.3)",
  },
}

function StatusIcon({ status }: { status: "success" | "error" }) {
  if (status === "success") {
    return <CheckCircle2 size={14} style={{ color: "var(--color-profit)" }} />
  }
  return <XCircle size={14} style={{ color: "var(--color-loss)" }} />
}

export function ActivityTimeline() {
  // Group events by date
  const groupedEvents: { date: string; events: typeof events }[] = []
  let currentDate = ""
  for (const event of events) {
    if (event.date !== currentDate) {
      currentDate = event.date
      groupedEvents.push({ date: event.date, events: [] })
    }
    groupedEvents[groupedEvents.length - 1].events.push(event)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <h2
            className="text-xl font-semibold"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--text-primary)",
            }}
          >
            Activity Timeline
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Chronological feed of all infrastructure events
          </p>
        </div>
      </div>

      <Card
        className="card-surface"
        style={{
          backgroundColor: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            {groupedEvents.map((group) => (
              <div key={group.date}>
                {/* Date header */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.12em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {group.date}
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ background: "var(--border-subtle)" }}
                  />
                </div>

                {/* Events */}
                <div className="relative pl-6">
                  {/* Vertical timeline line */}
                  <div
                    className="absolute left-[5px] top-2 bottom-2 w-px"
                    style={{ background: "var(--border-subtle)" }}
                  />

                  <div className="flex flex-col gap-4">
                    {group.events.map((event) => {
                      const colors = statusColors[event.status]
                      return (
                        <div
                          key={event.id}
                          className="relative"
                        >
                          {/* Dot */}
                          <div
                            className="absolute -left-6 top-1.5 h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor: colors.dot,
                              boxShadow: `0 0 8px ${colors.dot}`,
                              border: "2px solid var(--surface-card)",
                              zIndex: 1,
                            }}
                          />

                          {/* Event content */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div
                                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                                style={{
                                  background: colors.badgeBg,
                                  border: `1px solid ${colors.badgeBorder}`,
                                  color: colors.badge,
                                }}
                              >
                                {typeIcons[event.type] || <AlertCircle size={14} />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-sm font-semibold"
                                    style={{ color: "var(--text-primary)" }}
                                  >
                                    {event.title}
                                  </span>
                                  <StatusIcon status={event.status === "error" ? "error" : "success"} />
                                </div>
                                <p
                                  className="mt-0.5 text-[13px]"
                                  style={{ color: "var(--text-muted)" }}
                                >
                                  {event.description}
                                </p>
                              </div>
                            </div>

                            <span
                              className="shrink-0 text-[12px]"
                              style={{
                                fontFamily: "var(--font-jetbrains)",
                                color: "var(--text-muted)",
                              }}
                            >
                              {event.time}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
