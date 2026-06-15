"use client";

import { useState, useEffect, useRef } from "react";
import {
  Brain,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InsightMetric {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "neutral" | "negative";
  icon: React.ReactNode;
}

const insights: InsightMetric[] = [
  {
    label: "Data Quality Score",
    value: "99%",
    change: "+5% from last month",
    changeType: "positive",
    icon: <CheckCircle2 className="h-4 w-4" style={{ color: "var(--color-profit)" }} />,
  },
  {
    label: "Failed Imports (30d)",
    value: "0",
    change: "Perfect record",
    changeType: "positive",
    icon: <Zap className="h-4 w-4" style={{ color: "var(--primary)" }} />,
  },
  {
    label: "Avg Sync Latency",
    value: "1.2s",
    change: "0.3s faster than avg",
    changeType: "positive",
    icon: <Clock className="h-4 w-4" style={{ color: "var(--color-info)" }} />,
  },
  {
    label: "Uptime (30d)",
    value: "99.9%",
    change: "Zero downtime",
    changeType: "positive",
    icon: <TrendingUp className="h-4 w-4" style={{ color: "var(--color-ai)" }} />,
  },
];

const aiInsights = [
  {
    title: "Data quality trending upward",
    body: "Your integrity score improved from 94% to 99% over the past 30 days. The auto-fix feature resolved 12 timestamp errors automatically.",
    severity: "positive" as const,
  },
  {
    title: "Sync optimization detected",
    body: "MT5 sync latency decreased by 20% after your last broker reconnection. Current average is 1.2 seconds per sync cycle.",
    severity: "positive" as const,
  },
  {
    title: "Backup coverage is optimal",
    body: "All 5 data categories are being backed up successfully. 14 recovery points available spanning 7 days of history.",
    severity: "positive" as const,
  },
];

function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
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

export function InfrastructureIntelligence() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background: "rgba(192, 132, 252, 0.1)",
                border: "1px solid rgba(192, 132, 252, 0.2)",
              }}
            >
              <Brain className="h-4 w-4" style={{ color: "var(--color-ai)" }} />
            </div>
            <h2
              className="text-xl font-semibold"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--text-primary)",
              }}
            >
              Infrastructure Intelligence
            </h2>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            AI-powered insights about your trading infrastructure health
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium"
          style={{
            background: "rgba(192, 132, 252, 0.1)",
            color: "var(--color-ai)",
            border: "1px solid rgba(192, 132, 252, 0.2)",
          }}
        >
          <Sparkles className="h-3 w-3" />
          AI-Powered
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 stagger-children">
        {insights.map((insight) => (
          <Card
            key={insight.label}
            className="relative overflow-hidden hover-lift"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  {insight.icon}
                </div>
                <ArrowUpRight
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--color-profit)" }}
                />
              </div>
              <div>
                <div
                  className="text-2xl font-bold leading-none"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    color: "var(--text-primary)",
                  }}
                >
                  {insight.label === "Data Quality Score" ? (
                    <>
                      <CountUp target={99} />%
                    </>
                  ) : insight.label === "Failed Imports (30d)" ? (
                    <CountUp target={0} />
                  ) : insight.label === "Avg Sync Latency" ? (
                    <>1.2s</>
                  ) : (
                    <>99.9%</>
                  )}
                </div>
                <div
                  className="mt-1 text-[11px] font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  {insight.label}
                </div>
              </div>
              <div
                className="text-[10px] font-medium"
                style={{
                  color:
                    insight.changeType === "positive"
                      ? "var(--color-profit)"
                      : "var(--text-muted)",
                }}
              >
                {insight.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insight Cards */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--text-muted)" }}
          >
            AI Analysis
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "var(--border-subtle)" }}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {aiInsights.map((insight, i) => (
            <Card
              key={i}
              className="relative overflow-hidden hover-lift"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderLeftWidth: "3px",
                borderLeftColor: "var(--color-ai)",
              }}
            >
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                  <Brain
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: "var(--color-ai)" }}
                  />
                  <span
                    className="text-[13px] font-semibold leading-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {insight.title}
                  </span>
                </div>
                <p
                  className="text-[12px] leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {insight.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
