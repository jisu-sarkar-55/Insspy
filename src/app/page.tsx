"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";
import {
  TrendingUp,
  BarChart3,
  Brain,
  BookOpen,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  Settings,
  ExternalLink,
  Mail,
  Play,
  Sparkles,
  Target,
} from "lucide-react";
import { useState } from "react";

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  const delayClass =
    delay === 1
      ? "reveal-delay-1"
      : delay === 2
        ? "reveal-delay-2"
        : delay === 3
          ? "reveal-delay-3"
          : delay === 4
            ? "reveal-delay-4"
            : "";
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in-view" : ""} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5 fill-current"
          style={{ color: "var(--primary)" }}
        />
      ))}
    </div>
  );
}

const tickerItems = [
  "EUR/USD",
  "GBP/JPY",
  "USD/JPY",
  "XAU/USD",
  "AUD/USD",
  "US30",
  "NAS100",
  "BTC/USD",
  "EUR/GBP",
  "USD/CAD",
  "NZD/USD",
  "SPX500",
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "var(--surface-page)" }}
    >
      {/* ── Navigation ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 glass-nav border-b"
        style={{ borderColor: "rgba(63, 63, 63, 0.4)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Image
                src="/Ilogo.png"
                alt="Insspy"
                width={160}
                height={24}
                priority
                className="h-8 w-auto"
              />
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link
                href="#features"
                className="px-3 py-2 text-sm rounded-md hover:bg-white/5 transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="px-3 py-2 text-sm rounded-md hover:bg-white/5 transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                How It Works
              </Link>
              <Link
                href="#cta"
                className="px-3 py-2 text-sm rounded-md hover:bg-white/5 transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                Free
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="hidden md:block">
                <Button
                  variant="ghost"
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="text-[11px] sm:text-xs uppercase tracking-wider h-11">
                  Get Started Free
                </Button>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                className="md:hidden p-3 rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center"
                style={{ color: "var(--text-secondary)" }}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="md:hidden border-t px-4 py-3"
            style={{
              borderColor: "rgba(63, 63, 63, 0.4)",
              background: "rgba(10, 10, 10, 0.98)",
            }}
          >
            <div className="flex flex-col gap-1">
              <Link
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 min-h-[44px] text-sm rounded-md"
                style={{ color: "var(--text-secondary)" }}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 min-h-[44px] text-sm rounded-md"
                style={{ color: "var(--text-secondary)" }}
              >
                How It Works
              </Link>
              <Link
                href="#cta"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 min-h-[44px] text-sm rounded-md"
                style={{ color: "var(--text-secondary)" }}
              >
                Free
              </Link>
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 min-h-[44px] text-sm rounded-md"
                style={{ color: "var(--text-secondary)" }}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* HUD counter strip (game-style) */}
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8">
              <span className="hud-chip">
                <span className="hud-label">Trades</span>
                <span className="hud-value">50,000+</span>
              </span>
              <span className="hud-chip">
                <span className="hud-label">Traders</span>
                <span className="hud-value">500+</span>
              </span>
              <span className="hud-chip">
                <span className="hud-label">Rating</span>
                <span className="hud-value" style={{ color: "var(--primary)" }}>
                  4.9
                </span>
              </span>
            </div>
          </Reveal>

          <div className="text-center max-w-4xl mx-auto">
            <Reveal>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-6"
                style={{
                  borderColor: "rgba(255, 61, 139, 0.25)",
                  background: "rgba(255, 61, 139, 0.08)",
                  color: "var(--primary)",
                }}
              >
                <Sparkles className="h-3 w-3" />
                AI-Powered Trading Journal
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h1
                className="text-[13vw] leading-[0.92] sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Trade <span className="gradient-text">Smarter</span>,<br />
                Not Harder
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p
                className="mt-6 text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Log every trade, watch your edge compound, and let AI surface
                the patterns you&apos;d never spot alone. Your personal trading
                coach.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="px-8 text-xs uppercase tracking-wider h-12"
                  >
                    Start Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 text-xs uppercase tracking-wider h-12"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </Reveal>

            <Reveal delay={4}>
              <div className="flex items-center justify-center gap-3 pt-6">
                <Stars />
                <span
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  Rated 4.9 by traders
                </span>
              </div>
            </Reveal>
          </div>

          {/* Dashboard Mockup */}
          <Reveal delay={2}>
            <div className="relative mt-16 max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent rounded-3xl blur-3xl" />
              <div
                className="relative rounded-2xl border overflow-hidden"
                style={{
                  borderColor: "rgba(63, 63, 63, 0.4)",
                  background: "var(--surface-sidebar)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
                }}
              >
                {/* Browser bar */}
                <div
                  className="flex items-center gap-2 px-4 py-3 border-b"
                  style={{
                    borderColor: "rgba(63, 63, 63, 0.4)",
                    background: "rgba(10, 10, 10, 0.6)",
                  }}
                >
                  <div className="flex gap-1.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#ff4d4d" }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#ff3d8b" }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#22c55e" }}
                    />
                  </div>
                  <div
                    className="flex-1 mx-4 px-3 py-1 rounded-md text-xs text-center"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "var(--text-muted)",
                    }}
                  >
                    app.insspy.io/dashboard
                  </div>
                </div>

                {/* Mockup body */}
                <div className="flex" style={{ height: "340px" }}>
                  {/* Sidebar */}
                  <div
                    className="w-16 md:w-20 border-r flex flex-col items-center py-4 gap-4 flex-shrink-0"
                    style={{ borderColor: "rgba(63, 63, 63, 0.4)" }}
                  >
                    {[
                      LayoutDashboard,
                      TrendingUp,
                      BarChart3,
                      Brain,
                      Settings,
                    ].map((Icon, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background:
                            i === 0
                              ? "rgba(255, 61, 139, 0.14)"
                              : "transparent",
                          color:
                            i === 0 ? "var(--primary)" : "var(--text-muted)",
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 p-4 space-y-4 overflow-hidden">
                    {/* Stat cards */}
                    <div className="flex gap-3">
                      {[
                        {
                          label: "Win Rate",
                          value: "68.2%",
                          color: "var(--color-profit)",
                        },
                        {
                          label: "Profit Factor",
                          value: "2.4x",
                          color: "var(--primary)",
                        },
                        {
                          label: "Total P&L",
                          value: "+$12,450",
                          color: "var(--color-profit)",
                        },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-xl px-3 py-2.5 border"
                          style={{
                            borderColor: "rgba(63, 63, 63, 0.4)",
                            background: "rgba(18, 18, 18, 0.6)",
                          }}
                        >
                          <div
                            className="text-[10px] font-medium uppercase tracking-wider"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {stat.label}
                          </div>
                          <div
                            className="text-sm font-bold font-[var(--font-playfair)] mt-0.5"
                            style={{ color: stat.color }}
                          >
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mini chart */}
                    <div
                      className="rounded-xl border p-3"
                      style={{
                        borderColor: "rgba(63, 63, 63, 0.4)",
                        background: "rgba(18, 18, 18, 0.6)",
                      }}
                    >
                      <div
                        className="text-[10px] font-medium uppercase tracking-wider mb-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Equity Curve
                      </div>
                      <svg viewBox="0 0 200 50" className="w-full h-8">
                        <defs>
                          <linearGradient
                            id="chart-gradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#ff3d8b"
                              stopOpacity="0.3"
                            />
                            <stop
                              offset="100%"
                              stopColor="#ff3d8b"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,40 L20,35 L40,38 L60,28 L80,22 L100,18 L120,8 L140,12 L160,5 L180,3 L200,6"
                          fill="none"
                          stroke="#ff3d8b"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M0,40 L20,35 L40,38 L60,28 L80,22 L100,18 L120,8 L140,12 L160,5 L180,3 L200,6 L200,50 L0,50 Z"
                          fill="url(#chart-gradient)"
                        />
                      </svg>
                    </div>

                    {/* Trade rows */}
                    <div className="space-y-1.5">
                      {[
                        { pair: "EUR/USD", pnl: "+$240", result: "Win" },
                        { pair: "GBP/JPY", pnl: "-$120", result: "Loss" },
                        { pair: "USD/JPY", pnl: "+$380", result: "Win" },
                      ].map((trade, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-3 py-1.5 rounded-md"
                          style={{ background: "rgba(255,255,255,0.02)" }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background:
                                  trade.result === "Win"
                                    ? "var(--color-profit)"
                                    : "var(--color-loss)",
                              }}
                            />
                            <span
                              className="text-xs font-medium"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {trade.pair}
                            </span>
                          </div>
                          <span
                            className="text-xs font-medium font-[var(--font-jetbrains)]"
                            style={{
                              color:
                                trade.result === "Win"
                                  ? "var(--color-profit)"
                                  : "var(--color-loss)",
                            }}
                          >
                            {trade.pnl}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Marquee Ticker ── */}
      <section
        className="py-6 border-y overflow-hidden"
        style={{
          borderColor: "rgba(63, 63, 63, 0.4)",
          background: "var(--surface-sidebar)",
        }}
      >
        <div className="marquee">
          <div className="marquee-track">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-2 text-sm font-medium font-[var(--font-jetbrains)]"
                style={{ color: "var(--text-muted)" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--primary)" }}
                />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Big Numbers Statement ── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-14">
            <div className="section-num mb-4">[ 01 ]</div>
            <h2
              className="text-4xl md:text-6xl font-bold uppercase tracking-tight"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--text-primary)",
              }}
            >
              The numbers
              <br />
              speak first
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: "50K+", label: "Trades Analyzed" },
              { value: "500+", label: "Active Traders" },
              { value: "20+", label: "Performance Metrics" },
              { value: "4.9", label: "Average Rating" },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={Math.min(i, 4)}>
                <div className="text-center">
                  <div
                    className="text-4xl md:text-6xl font-bold font-[var(--font-jetbrains)] tabular-nums"
                    style={{ color: "var(--primary)" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="mt-2 text-xs uppercase tracking-widest"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-t"
        style={{ borderColor: "rgba(63, 63, 63, 0.4)" }}
      >
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="section-num mb-4">[ 02 ]</div>
            <h2
              className="text-4xl md:text-6xl font-bold uppercase tracking-tight"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--text-primary)",
              }}
            >
              Everything you need
            </h2>
            <p
              className="mt-4 max-w-xl mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              From analytics to AI coaching — a complete toolkit to trade with
              confidence.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: BarChart3,
                title: "Performance Analytics",
                desc: "Win rate, profit factor, equity curves, and 20+ metrics to understand your trading at a glance.",
                color: "var(--primary)",
                badge: "Core",
              },
              {
                icon: Brain,
                title: "AI-Powered Insights",
                desc: "Personalized analysis of your patterns with actionable recommendations to improve your strategy.",
                color: "var(--color-ai)",
                badge: "AI",
              },
              {
                icon: BookOpen,
                title: "Trade Journal",
                desc: "Record detailed notes, screenshots, and psychology for each trade. Build a complete history.",
                color: "var(--color-info)",
              },
              {
                icon: TrendingUp,
                title: "Strategy Tracking",
                desc: "Tag trades by strategy and discover exactly which approaches work best for your style.",
                color: "var(--color-profit)",
              },
              {
                icon: Shield,
                title: "Risk Management",
                desc: "Track stop losses, risk-reward ratios, and drawdowns. Protect capital with data.",
                color: "var(--color-loss)",
              },
              {
                icon: Zap,
                title: "Psychology Tracking",
                desc: "Log your emotional state and see how confidence, fear, and greed impact your results.",
                color: "var(--color-warning)",
              },
            ].map((feature, i) => (
              <Reveal key={feature.title} delay={Math.min(i, 4)}>
                <div className="chunky-card p-6 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `${feature.color}18`,
                        border: `1px solid ${feature.color}30`,
                      }}
                    >
                      <feature.icon
                        className="h-5 w-5"
                        style={{ color: feature.color }}
                      />
                    </div>
                    {feature.badge && (
                      <span className="sticker-badge">{feature.badge}</span>
                    )}
                  </div>
                  <h3
                    className="text-lg font-bold mb-2 uppercase tracking-tight"
                    style={{
                      fontFamily: "var(--font-playfair)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {feature.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works (process dots) ── */}
      <section
        id="how-it-works"
        className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-t"
        style={{ borderColor: "rgba(63, 63, 63, 0.4)" }}
      >
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <div className="section-num mb-4">[ 03 ]</div>
            <h2
              className="text-4xl md:text-6xl font-bold uppercase tracking-tight"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--text-primary)",
              }}
            >
              How it works
            </h2>
          </Reveal>

          {/* Process dots */}
          <Reveal>
            <div className="dot-steps mb-16">
              {["Log", "Analyze", "Improve", "Repeat", "Evolve"].map(
                (label, i) => (
                  <div
                    key={label}
                    className={`dot-step ${i === 0 ? "active" : ""}`}
                  >
                    <div className="dot" />
                    <div className="dot-label">{label}</div>
                    {i < 4 && <div className="dot-line" />}
                  </div>
                ),
              )}
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Log Your Trades",
                desc: "Enter trades manually or import from your broker. Add notes, screenshots, and psychology to build a complete record.",
                icon: Target,
              },
              {
                num: "02",
                title: "Analyze Performance",
                desc: "Win rate, profit factor, equity curve, and strategy breakdowns — all calculated automatically.",
                icon: BarChart3,
              },
              {
                num: "03",
                title: "Improve with AI",
                desc: "Personalized AI insights identify your patterns. Discover what works and what doesn't.",
                icon: Brain,
              },
            ].map((step, i) => (
              <Reveal key={step.num} delay={Math.min(i, 3)}>
                <div className="chunky-card p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-xl"
                      style={{
                        background: "rgba(255, 61, 139, 0.12)",
                        border: "1px solid rgba(255, 61, 139, 0.25)",
                      }}
                    >
                      <step.icon
                        className="h-4 w-4"
                        style={{ color: "var(--primary)" }}
                      />
                    </div>
                    <span className="section-num">{step.num}</span>
                  </div>
                  <h3
                    className="text-lg font-bold mb-2 uppercase tracking-tight"
                    style={{
                      fontFamily: "var(--font-playfair)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Free Forever ── */}
      <section
        id="cta"
        className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-t"
        style={{ borderColor: "rgba(63, 63, 63, 0.4)" }}
      >
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="section-num mb-4">[ 04 ]</div>
            <h2
              className="text-4xl md:text-6xl font-bold uppercase tracking-tight"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--text-primary)",
              }}
            >
              Everything, free
            </h2>
            <p
              className="mt-4 max-w-lg mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              No credit card. No limits. Start journaling in minutes.
            </p>
          </Reveal>

          <Reveal>
            <div className="chunky-card p-7 md:p-10">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { label: "Trades", value: "Unlimited" },
                  { label: "AI Analyses", value: "Unlimited" },
                  { label: "CSV Imports", value: "Unlimited" },
                  { label: "Active Goals", value: "Unlimited" },
                  { label: "Setup Playbooks", value: "Unlimited" },
                  { label: "PDF Reports", value: "Unlimited" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 border-b"
                    style={{ borderColor: "rgba(63, 63, 63, 0.3)" }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: "var(--primary)" }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="px-10 text-xs uppercase tracking-wider h-12"
                  >
                    Start Journaling Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Big CTA ── */}
      <section
        className="py-24 md:py-32 px-4"
        style={{
          background:
            "linear-gradient(180deg, var(--surface-page) 0%, rgba(255, 61, 139, 0.06) 50%, var(--surface-page) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2
              className="text-5xl md:text-7xl font-bold uppercase tracking-tight leading-[0.95] mb-6"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "var(--text-primary)",
              }}
            >
              Ready to
              <br />
              <span className="gradient-text">trade smarter?</span>
            </h2>
            <p
              className="text-lg mb-8 max-w-md mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              Join 500+ traders already compounding their edge.
            </p>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="px-10 text-xs uppercase tracking-wider h-14 animate-glow-pulse"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="border-t py-12 px-4"
        style={{ borderColor: "rgba(63, 63, 63, 0.4)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="block mb-3">
                <img src="/Ilogo.png" alt="Insspy" className="h-9 w-auto" />
              </Link>
              <p
                className="text-sm max-w-xs"
                style={{ color: "var(--text-muted)" }}
              >
                The AI-powered trading journal for serious traders who want to
                track, analyze, and improve.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <Play className="h-3 w-3" style={{ color: "var(--primary)" }} />
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  We count runs, not luck.
                </span>
              </div>
            </div>
            <div>
              <h4
                className="text-[10px] font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Product
              </h4>
              <div className="flex flex-col gap-2">
                <Link
                  href="#features"
                  className="block py-2 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Features
                </Link>
                <Link
                  href="#cta"
                  className="block py-2 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Free
                </Link>
                <Link
                  href="/auth/signup"
                  className="block py-2 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Sign Up
                </Link>
              </div>
            </div>
            <div>
              <h4
                className="text-[10px] font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Connect
              </h4>
              <div className="flex flex-col gap-2">
                <a
                  href="https://www.instagram.com/insspy_official?=d3JvdGI2ZXFpZjc1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-2 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Instagram <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://x.com/Insspy_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-2 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  X (Twitter) <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://t.me/insspy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-2 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Telegram <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://youtube.com/@insspy_official?si=-Q3NqABzJ_px1opW"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-2 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  YouTube <ExternalLink className="h-3 w-3" />
                </a>
                <span
                  className="inline-flex items-center gap-1.5 py-2 text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Mail className="h-3 w-3" /> support@insspy.com
                </span>
              </div>
            </div>
            <div>
              <h4
                className="text-[10px] font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Legal
              </h4>
              <div className="flex flex-col gap-2">
                <Link
                  href="/privacy"
                  className="block py-2 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="block py-2 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
          <div
            className="mt-10 pt-6 border-t text-center text-sm"
            style={{
              borderColor: "rgba(63, 63, 63, 0.4)",
              color: "var(--text-muted)",
            }}
          >
            &copy; 2026 Insspy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
