"use client"

import { useState } from "react"
import {
  Plus,
  BarChart3,
  Archive,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  Wallet,
  Activity,
  GitCompare,
  Layers,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"

interface TradingAccount {
  id: string
  name: string
  broker: string
  type: "live" | "demo" | "funded" | "challenge" | "personal"
  balance: number
  equity: number
  drawdown: number
  winRate: number
  status: "active" | "paused" | "archived"
  trades: number
  lastActive: string
}

const initialAccounts: TradingAccount[] = [
  {
    id: "1",
    name: "Primary Live",
    broker: "IC Markets",
    type: "live",
    balance: 25000,
    equity: 27450,
    drawdown: 8.2,
    winRate: 64,
    status: "active",
    trades: 1247,
    lastActive: "2 min ago",
  },
  {
    id: "2",
    name: "Funded Account",
    broker: "FTMO",
    type: "funded",
    balance: 100000,
    equity: 103200,
    drawdown: 4.1,
    winRate: 71,
    status: "active",
    trades: 856,
    lastActive: "15 min ago",
  },
  {
    id: "3",
    name: "Practice Demo",
    broker: "Pepperstone",
    type: "demo",
    balance: 10000,
    equity: 10890,
    drawdown: 12.5,
    winRate: 58,
    status: "active",
    trades: 342,
    lastActive: "1 hour ago",
  },
  {
    id: "4",
    name: "Challenge Phase 1",
    broker: "Eightcap",
    type: "challenge",
    balance: 50000,
    equity: 51200,
    drawdown: 6.8,
    winRate: 67,
    status: "paused",
    trades: 189,
    lastActive: "3 days ago",
  },
  {
    id: "5",
    name: "Swing Trading",
    broker: "IC Markets",
    type: "personal",
    balance: 15000,
    equity: 16340,
    drawdown: 3.2,
    winRate: 72,
    status: "active",
    trades: 94,
    lastActive: "5 hours ago",
  },
  {
    id: "6",
    name: "Scalping Account",
    broker: "Exness",
    type: "live",
    balance: 8000,
    equity: 8420,
    drawdown: 9.7,
    winRate: 61,
    status: "active",
    trades: 2103,
    lastActive: "30 min ago",
  },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function getTypeBadgeStyles(type: TradingAccount["type"]) {
  switch (type) {
    case "live":
      return {
        backgroundColor: "rgba(74, 222, 128, 0.12)",
        color: "var(--color-profit)",
        border: "1px solid rgba(74, 222, 128, 0.2)",
      }
    case "funded":
      return {
        backgroundColor: "rgba(251, 191, 36, 0.12)",
        color: "var(--color-warning)",
        border: "1px solid rgba(251, 191, 36, 0.2)",
      }
    case "demo":
      return {
        backgroundColor: "rgba(96, 165, 250, 0.12)",
        color: "var(--color-info)",
        border: "1px solid rgba(96, 165, 250, 0.2)",
      }
    case "challenge":
      return {
        backgroundColor: "rgba(192, 132, 252, 0.12)",
        color: "var(--color-ai)",
        border: "1px solid rgba(192, 132, 252, 0.2)",
      }
    case "personal":
      return {
        backgroundColor: "rgba(196, 184, 162, 0.12)",
        color: "var(--text-secondary)",
        border: "1px solid rgba(196, 184, 162, 0.2)",
      }
  }
}

function getStatusIndicator(status: TradingAccount["status"]) {
  switch (status) {
    case "active":
      return { color: "var(--color-profit)", label: "Active" }
    case "paused":
      return { color: "var(--color-warning)", label: "Paused" }
    case "archived":
      return { color: "var(--text-muted)", label: "Archived" }
  }
}

export function AccountManagement() {
  const [accounts] = useState<TradingAccount[]>(initialAccounts)
  const [activeFilter, setActiveFilter] = useState("all")

  const filteredAccounts = accounts.filter((account) => {
    if (activeFilter === "all") return true
    return account.type === activeFilter
  })

  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0)
  const totalEquity = accounts.reduce((acc, a) => acc + a.equity, 0)

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
            Trading Accounts
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Manage and monitor all your trading accounts across brokers
          </p>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" size="sm" className="gap-1.5" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }} />}>
                <GitCompare className="size-3.5" />
                Compare
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Compare account performance</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<Button variant="default" size="sm" className="gap-1.5" />}>
                <Plus className="size-4" style={{ color: "var(--surface-page)" }} />
                <span style={{ color: "var(--surface-page)" }}>Add Account</span>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Add a new trading account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
          <Layers className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
          <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
            {accounts.length} Accounts
          </span>
        </div>
        <div className="h-4 w-px" style={{ background: "var(--border-subtle)" }} />
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
            Total Balance:
          </span>
          <span className="mono-data text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>
            {formatCurrency(totalBalance)}
          </span>
        </div>
        <div className="h-4 w-px" style={{ background: "var(--border-subtle)" }} />
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
            Total Equity:
          </span>
          <span className="mono-data text-[11px] font-semibold" style={{ color: "var(--color-profit)" }}>
            {formatCurrency(totalEquity)}
          </span>
        </div>
      </div>

      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList
          style={{
            backgroundColor: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="demo">Demo</TabsTrigger>
          <TabsTrigger value="funded">Funded</TabsTrigger>
          <TabsTrigger value="challenge">Challenge</TabsTrigger>
        </TabsList>
      </Tabs>

      <Separator style={{ backgroundColor: "var(--border-subtle)" }} />

      {filteredAccounts.length === 0 ? (
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
            <Wallet className="size-7" style={{ color: "var(--primary)" }} />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              No accounts found
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {activeFilter === "all"
                ? "Add your first trading account to get started"
                : `No ${activeFilter} accounts to display`}
            </p>
          </div>
          <Button variant="default" size="sm">
            <Plus className="size-4" style={{ color: "var(--surface-page)" }} />
            <span style={{ color: "var(--surface-page)" }}>Add Account</span>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {filteredAccounts.map((account) => {
            const statusInfo = getStatusIndicator(account.status)
            const pnl = account.equity - account.balance
            const pnlPct = ((pnl / account.balance) * 100).toFixed(1)
            return (
              <Card
                key={account.id}
                className="group relative overflow-hidden transition-all duration-300 hover-lift"
                style={{
                  backgroundColor: "var(--surface-card)",
                  borderColor: "var(--border-subtle)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }}
              >
                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: "radial-gradient(ellipse at 50% 0%, rgba(251, 191, 36, 0.06) 0%, transparent 70%)",
                  }}
                />
                <CardContent className="relative z-10 flex flex-col gap-4 p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1.5">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {account.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {account.broker}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px]"
                          style={getTypeBadgeStyles(account.type)}
                        >
                          {account.type.charAt(0).toUpperCase() +
                            account.type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="size-2 rounded-full"
                        style={{
                          backgroundColor: statusInfo.color,
                          boxShadow: account.status === "active" ? `0 0 6px ${statusInfo.color}` : "none",
                        }}
                      />
                      <span
                        className="text-[10px] uppercase tracking-wider font-medium"
                        style={{ color: statusInfo.color }}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <Separator style={{ backgroundColor: "var(--border-subtle)" }} />

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Balance
                      </span>
                      <span
                        className="mono-data text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Equity
                      </span>
                      <span
                        className="mono-data text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {formatCurrency(account.equity)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Drawdown
                      </span>
                      <div className="flex items-center gap-1">
                        {account.drawdown > 10 ? (
                          <AlertTriangle
                            className="size-3"
                            style={{ color: "var(--color-loss)" }}
                          />
                        ) : account.drawdown > 5 ? (
                          <Shield
                            className="size-3"
                            style={{ color: "var(--color-warning)" }}
                          />
                        ) : null}
                        <span
                          className="mono-data text-sm font-medium"
                          style={{
                            color:
                              account.drawdown > 10
                                ? "var(--color-loss)"
                                : "var(--text-primary)",
                          }}
                        >
                          {account.drawdown}%
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="text-[10px] uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Win Rate
                      </span>
                      <div className="flex items-center gap-1">
                        {account.winRate >= 60 ? (
                          <TrendingUp
                            className="size-3"
                            style={{ color: "var(--color-profit)" }}
                          />
                        ) : (
                          <TrendingDown
                            className="size-3"
                            style={{ color: "var(--color-loss)" }}
                          />
                        )}
                        <span
                          className="mono-data text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {account.winRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* P&L bar */}
                  <div className="flex items-center justify-between rounded-md px-2.5 py-1.5" style={{ background: "var(--surface-raised)" }}>
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      P&L
                    </span>
                    <span
                      className="mono-data text-xs font-semibold"
                      style={{ color: pnl >= 0 ? "var(--color-profit)" : "var(--color-loss)" }}
                    >
                      {pnl >= 0 ? "+" : ""}{formatCurrency(pnl)} ({pnlPct}%)
                    </span>
                  </div>

                  <Separator style={{ backgroundColor: "var(--border-subtle)" }} />

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Activity className="size-3" style={{ color: "var(--text-muted)" }} />
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {account.trades.toLocaleString()} trades
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        · {account.lastActive}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-xs">
                        <BarChart3 className="size-3.5" style={{ color: "var(--text-muted)" }} />
                      </Button>
                      <Button variant="ghost" size="icon-xs">
                        <Archive className="size-3.5" style={{ color: "var(--text-muted)" }} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
