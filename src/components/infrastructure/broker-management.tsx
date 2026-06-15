"use client"

import { useState } from "react"
import {
  RefreshCw,
  Plus,
  MoreHorizontal,
  Eye,
  Unplug,
  Wifi,
  WifiOff,
  Activity,
  Building2,
  Clock,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

interface Broker {
  id: string
  name: string
  shortName: string
  logoColor: string
  status: "online" | "offline"
  lastSync: string
  trades: number
  accounts: number
  health: "healthy" | "warning" | "error"
  healthScore: number
  reliability: "A+" | "A" | "B+" | "B"
}

const initialBrokers: Broker[] = [
  {
    id: "1",
    name: "IC Markets",
    shortName: "IC",
    logoColor: "#0078D4",
    status: "online",
    lastSync: "2 min ago",
    trades: 14582,
    accounts: 3,
    health: "healthy",
    healthScore: 98,
    reliability: "A+",
  },
  {
    id: "2",
    name: "Pepperstone",
    shortName: "PS",
    logoColor: "#E4002B",
    status: "online",
    lastSync: "15 min ago",
    trades: 8456,
    accounts: 2,
    health: "healthy",
    healthScore: 96,
    reliability: "A",
  },
  {
    id: "3",
    name: "Eightcap",
    shortName: "EC",
    logoColor: "#FF6B00",
    status: "online",
    lastSync: "8 min ago",
    trades: 3241,
    accounts: 1,
    health: "healthy",
    healthScore: 94,
    reliability: "A",
  },
  {
    id: "4",
    name: "Exness",
    shortName: "EX",
    logoColor: "#FFB800",
    status: "offline",
    lastSync: "3 days ago",
    trades: 1892,
    accounts: 2,
    health: "warning",
    healthScore: 72,
    reliability: "B+",
  },
  {
    id: "5",
    name: "Custom Broker",
    shortName: "CB",
    logoColor: "#8B5CF6",
    status: "online",
    lastSync: "1 hour ago",
    trades: 567,
    accounts: 1,
    health: "healthy",
    healthScore: 91,
    reliability: "B+",
  },
]

function getHealthBadgeStyles(health: Broker["health"]) {
  switch (health) {
    case "healthy":
      return {
        backgroundColor: "rgba(74, 222, 128, 0.12)",
        color: "var(--color-profit)",
        border: "1px solid rgba(74, 222, 128, 0.2)",
      }
    case "warning":
      return {
        backgroundColor: "rgba(251, 191, 36, 0.12)",
        color: "var(--color-warning)",
        border: "1px solid rgba(251, 191, 36, 0.2)",
      }
    case "error":
      return {
        backgroundColor: "rgba(248, 113, 113, 0.12)",
        color: "var(--color-loss)",
        border: "1px solid rgba(248, 113, 113, 0.2)",
      }
  }
}

function getReliabilityBadgeStyle(reliability: Broker["reliability"]) {
  if (reliability === "A+" || reliability === "A") {
    return {
      backgroundColor: "rgba(74, 222, 128, 0.12)",
      color: "var(--color-profit)",
      border: "1px solid rgba(74, 222, 128, 0.2)",
    }
  }
  return {
    backgroundColor: "rgba(251, 191, 36, 0.12)",
    color: "var(--color-warning)",
    border: "1px solid rgba(251, 191, 36, 0.2)",
  }
}

export function BrokerManagement() {
  const [brokers, setBrokers] = useState<Broker[]>(initialBrokers)

  const handleDisconnect = (id: string) => {
    setBrokers((prev) => prev.filter((b) => b.id !== id))
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
            Broker Connections
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Manage your broker integrations and monitor sync health
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<Button variant="default" size="sm" />}>
              <Plus className="size-4" style={{ color: "var(--surface-page)" }} />
              <span style={{ color: "var(--surface-page)" }}>Connect Broker</span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Add a new broker connection</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Summary bar */}
      <div
        className="flex items-center gap-6 rounded-lg border px-4 py-3"
        style={{
          background: "var(--surface-card)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{
              background: "var(--color-profit)",
              boxShadow: "0 0 6px rgba(74, 222, 128, 0.5)",
            }}
          />
          <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
            {brokers.filter((b) => b.status === "online").length} Online
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: "var(--color-loss)" }}
          />
          <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
            {brokers.filter((b) => b.status === "offline").length} Offline
          </span>
        </div>
        <div className="h-4 w-px" style={{ background: "var(--border-subtle)" }} />
        <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
          {brokers.reduce((acc, b) => acc + b.trades, 0).toLocaleString()} total trades
        </span>
        <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
          {brokers.reduce((acc, b) => acc + b.accounts, 0)} accounts
        </span>
      </div>

      <Separator style={{ backgroundColor: "var(--border-subtle)" }} />

      {brokers.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-4 rounded-lg border py-16"
          style={{
            backgroundColor: "var(--surface-card)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <div
            className="flex size-14 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(251, 191, 36, 0.1)" }}
          >
            <Building2 className="size-7" style={{ color: "var(--primary)" }} />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              No broker connections
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Connect your first broker to start importing trades
            </p>
          </div>
          <Button variant="default" size="sm">
            <Plus className="size-4" style={{ color: "var(--surface-page)" }} />
            <span style={{ color: "var(--surface-page)" }}>Connect Broker</span>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {brokers.map((broker) => (
            <Card
              key={broker.id}
              className="group relative overflow-hidden transition-all duration-300 hover-lift"
              style={{
                backgroundColor: "var(--surface-card)",
                borderColor: "var(--border-subtle)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              {/* Subtle gold glow on hover via CSS */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: "radial-gradient(ellipse at 50% 0%, rgba(251, 191, 36, 0.06) 0%, transparent 70%)",
                }}
              />
              <CardContent className="relative z-10 flex flex-col gap-4 p-4">
                {/* Header: Logo + Name + Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-11 items-center justify-center rounded-lg text-sm font-bold"
                      style={{
                        backgroundColor: broker.logoColor,
                        color: "#FFFFFF",
                        fontFamily: "var(--font-playfair)",
                        boxShadow: `0 2px 8px ${broker.logoColor}33`,
                      }}
                    >
                      {broker.shortName}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {broker.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {broker.status === "online" ? (
                          <Wifi
                            className="size-3"
                            style={{ color: "var(--color-profit)" }}
                          />
                        ) : (
                          <WifiOff
                            className="size-3"
                            style={{ color: "var(--color-loss)" }}
                          />
                        )}
                        <span
                          className="text-[11px] capitalize"
                          style={{
                            color:
                              broker.status === "online"
                                ? "var(--color-profit)"
                                : "var(--color-loss)",
                          }}
                        >
                          {broker.status === "online" ? "Connected" : "Disconnected"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="text-[10px]"
                      style={getReliabilityBadgeStyle(broker.reliability)}
                    >
                      {broker.reliability}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px]"
                      style={getHealthBadgeStyles(broker.health)}
                    >
                      <Activity className="size-2.5" />
                      {broker.healthScore}%
                    </Badge>
                  </div>
                </div>

                <Separator style={{ backgroundColor: "var(--border-subtle)" }} />

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Last Sync
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock
                        className="size-3 shrink-0"
                        style={{ color: "var(--text-muted)" }}
                      />
                      <span
                        className="mono-data text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {broker.lastSync}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Trades
                    </span>
                    <span
                      className="mono-data text-xs font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {broker.trades.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Accounts
                    </span>
                    <span
                      className="mono-data text-xs font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {broker.accounts}
                    </span>
                  </div>
                </div>

                {/* Health bar */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Sync Health
                    </span>
                    <span
                      className="mono-data text-[11px] font-medium"
                      style={{
                        color:
                          broker.healthScore >= 90
                            ? "var(--color-profit)"
                            : broker.healthScore >= 70
                              ? "var(--color-warning)"
                              : "var(--color-loss)",
                      }}
                    >
                      {broker.healthScore}%
                    </span>
                  </div>
                  <div
                    className="h-1.5 w-full overflow-hidden rounded-full"
                    style={{ background: "var(--surface-raised)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${broker.healthScore}%`,
                        background:
                          broker.healthScore >= 90
                            ? "var(--color-profit)"
                            : broker.healthScore >= 70
                              ? "var(--color-warning)"
                              : "var(--color-loss)",
                      }}
                    />
                  </div>
                </div>

                <Separator style={{ backgroundColor: "var(--border-subtle)" }} />

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="flex-1 text-xs">
                    <Eye
                      className="size-3.5"
                      style={{ color: "var(--text-secondary)" }}
                    />
                    <span style={{ color: "var(--text-secondary)" }}>
                      View Accounts
                    </span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-xs">
                    <RefreshCw
                      className="size-3.5"
                      style={{ color: "var(--text-secondary)" }}
                    />
                    <span style={{ color: "var(--text-secondary)" }}>
                      Sync Now
                    </span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon-sm" />}
                    >
                      <MoreHorizontal
                        className="size-4"
                        style={{ color: "var(--text-muted)" }}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      style={{
                        backgroundColor: "var(--surface-raised)",
                        borderColor: "var(--border-subtle)",
                      }}
                    >
                      {broker.status === "offline" && (
                        <DropdownMenuItem>
                          <RefreshCw className="size-4" />
                          Reconnect
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDisconnect(broker.id)}
                      >
                        <Unplug className="size-4" />
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
