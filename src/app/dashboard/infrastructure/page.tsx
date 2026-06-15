"use client";

import Link from "next/link";
import {
  Building2,
  Wallet,
  RefreshCw,
  Key,
  Database,
  ShieldCheck,
  Brain,
  ArrowRight,
  Activity,
} from "lucide-react";
import { HealthDashboard } from "@/components/infrastructure/health-dashboard";
import { ActivityTimeline } from "@/components/infrastructure/activity-timeline";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Broker Connections",
    description: "Manage and monitor your broker integrations",
    href: "/dashboard/infrastructure/brokers",
    icon: Building2,
    color: "var(--color-profit)",
    status: "4 connected",
  },
  {
    title: "Trading Accounts",
    description: "Manage all your trading accounts across brokers",
    href: "/dashboard/infrastructure/accounts",
    icon: Wallet,
    color: "var(--color-info)",
    status: "7 active",
  },
  {
    title: "Sync Center",
    description: "MT5 auto-sync, MT4 and CSV imports",
    href: "/dashboard/infrastructure/sync",
    icon: RefreshCw,
    color: "var(--primary)",
    status: "98% health",
  },
  {
    title: "API Integration Hub",
    description: "Professional automated integrations",
    href: "/dashboard/infrastructure/api",
    icon: Key,
    color: "var(--color-ai)",
    status: "2 active",
  },
  {
    title: "Backup System",
    description: "Protect your trading data with backups",
    href: "/dashboard/infrastructure/backup",
    icon: Database,
    color: "var(--color-profit)",
    status: "Protected",
  },
  {
    title: "Data Validation",
    description: "Ensure clean and accurate trading data",
    href: "/dashboard/infrastructure/validation",
    icon: ShieldCheck,
    color: "var(--primary)",
    status: "99/100",
  },
  {
    title: "Infrastructure Intelligence",
    description: "AI-powered infrastructure insights",
    href: "/dashboard/infrastructure/intelligence",
    icon: Brain,
    color: "var(--color-ai)",
    status: "3 insights",
  },
];

export default function InfrastructureOverviewPage() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{
              background: "rgba(251, 191, 36, 0.1)",
              border: "1px solid rgba(251, 191, 36, 0.2)",
            }}
          >
            <Activity className="h-5 w-5" style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--text-primary)",
              }}
            >
              Trading Infrastructure
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Manage broker connections, accounts, imports, backups, and data
              integrity from one secure workspace.
            </p>
          </div>
        </div>
      </div>

      {/* Health Dashboard */}
      <HealthDashboard />

      {/* Feature Cards */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--text-muted)" }}
          >
            Quick Access
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "var(--border-subtle)" }}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href} className="block">
              <Card
                className="group relative overflow-hidden transition-all duration-300 hover-lift h-full"
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${feature.color}0D 0%, transparent 70%)`,
                  }}
                />
                <CardContent className="relative z-10 flex items-center gap-4 p-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: `${feature.color}15`,
                      border: `1px solid ${feature.color}25`,
                    }}
                  >
                    <feature.icon
                      className="h-5 w-5"
                      style={{ color: feature.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {feature.title}
                    </div>
                    <div
                      className="text-[11px] mt-0.5 truncate"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {feature.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="mono-data text-[11px] font-medium"
                      style={{ color: feature.color }}
                    >
                      {feature.status}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <ActivityTimeline />
    </div>
  );
}
