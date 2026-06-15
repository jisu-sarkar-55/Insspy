"use client";

import { useState, useEffect, useRef } from "react";
import {
  Link,
  Wallet,
  RefreshCw,
  Shield,
  Database,
  Activity,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const healthCards = [
  {
    label: "Connected Brokers",
    value: "4/5",
    icon: Link,
    status: "healthy" as const,
    accent: "var(--color-profit)",
    detail: "1 reconnection needed",
  },
  {
    label: "Active Accounts",
    value: "7",
    icon: Wallet,
    status: "healthy" as const,
    accent: "var(--color-profit)",
    detail: "Across all brokers",
  },
  {
    label: "Sync Success Rate",
    value: "98.2%",
    icon: RefreshCw,
    status: "healthy" as const,
    accent: "var(--color-profit)",
    detail: "Last 30 days",
  },
  {
    label: "Data Integrity",
    value: "99/100",
    icon: Shield,
    status: "healthy" as const,
    accent: "var(--color-profit)",
    detail: "Excellent quality",
  },
  {
    label: "Last Backup",
    value: "12m ago",
    icon: Database,
    status: "healthy" as const,
    accent: "var(--color-profit)",
    detail: "Auto-backup active",
  },
  {
    label: "API Status",
    value: "Operational",
    icon: Activity,
    status: "healthy" as const,
    accent: "var(--color-profit)",
    detail: "99.9% uptime",
  },
];

function CountUp({ target, duration = 1000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

export function HealthDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Health Score */}
      <Card
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--surface-card) 0%, var(--surface-raised) 100%)",
          border: "1px solid var(--border-medium)",
          boxShadow:
            "0 0 40px rgba(251, 191, 36, 0.08), 0 0 80px rgba(251, 191, 36, 0.04)",
        }}
      >
        {/* Gold glow overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(251, 191, 36, 0.12) 0%, transparent 60%)",
          }}
        />
        <CardContent className="relative z-10 flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:gap-8">
          {/* Score display */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--text-muted)" }}
            >
              System Health
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className="text-7xl font-bold leading-none tracking-tight"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "var(--primary)",
                }}
              >
                <CountUp target={96} duration={1200} />
              </span>
              <span
                className="text-3xl font-medium"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "var(--text-muted)",
                }}
              >
                /100
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            className="hidden h-20 w-px sm:block"
            style={{ background: "var(--border-subtle)" }}
          />

          {/* Status info */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Badge
              variant="default"
              className="text-xs gap-1"
              style={{
                background: "rgba(74, 222, 128, 0.15)",
                color: "var(--color-profit)",
                border: "1px solid rgba(74, 222, 128, 0.25)",
              }}
            >
              <CheckCircle2 className="h-3 w-3" />
              Excellent
            </Badge>
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              All systems operational
            </span>
            <div className="flex items-center gap-1.5">
              <Clock
                className="h-3 w-3"
                style={{ color: "var(--text-muted)" }}
              />
              <span
                className="text-[11px]"
                style={{ color: "var(--text-muted)" }}
              >
                Last checked 2 minutes ago
              </span>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden flex-1 sm:block" />

          {/* Quick stats */}
          <div className="flex gap-8">
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  color: "var(--text-primary)",
                }}
              >
                <CountUp target={6} duration={800} />
              </span>
              <span
                className="text-[10px] font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Services
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  color: "var(--color-profit)",
                }}
              >
                6/6
              </span>
              <span
                className="text-[10px] font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Healthy
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  color: "var(--text-primary)",
                }}
              >
                0
              </span>
              <span
                className="text-[10px] font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Alerts
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Status Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 stagger-children">
        {healthCards.map((card) => (
          <Card
            key={card.label}
            className="group relative overflow-hidden hover-lift"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderLeftWidth: "3px",
              borderLeftColor: card.accent,
            }}
          >
            <CardContent className="flex items-center gap-4 py-4">
              {/* Icon container */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: `${card.accent}15`,
                  border: `1px solid ${card.accent}25`,
                }}
              >
                <card.icon
                  className="h-5 w-5"
                  style={{ color: card.accent }}
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-1">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {card.label}
                </span>
                <span
                  className="text-lg font-bold leading-none mono-data"
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    color: "var(--text-primary)",
                  }}
                >
                  {card.value}
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {card.detail}
                </span>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    background: "var(--color-profit)",
                    boxShadow: "0 0 6px rgba(74, 222, 128, 0.5)",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div
        className="flex flex-wrap items-center gap-2"
        style={{
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: "1rem",
        }}
      >
        <span
          className="mr-2 text-[10px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: "var(--text-muted)" }}
        >
          Quick Actions
        </span>
        <Button
          variant="default"
          size="sm"
          className="btn-gold-glow"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Run Full Sync
        </Button>
        <Button
          variant="outline"
          size="sm"
          style={{
            borderColor: "var(--border-subtle)",
            color: "var(--text-secondary)",
          }}
        >
          <Shield className="h-3.5 w-3.5" />
          Validate Data
        </Button>
        <Button
          variant="outline"
          size="sm"
          style={{
            borderColor: "var(--border-subtle)",
            color: "var(--text-secondary)",
          }}
        >
          <Database className="h-3.5 w-3.5" />
          Create Backup
        </Button>
      </div>

    </div>
  );
}
