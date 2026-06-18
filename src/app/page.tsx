"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";
import {
  TrendingUp,
  BarChart3,
  Brain,
  BookOpen,
  Shield,
  Zap,
  Check,
  Star,
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  Settings,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { PricingPlan } from "@/types";

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  const delayClass = delay === 1 ? "reveal-delay-1" : delay === 2 ? "reveal-delay-2" : delay === 3 ? "reveal-delay-3" : delay === 4 ? "reveal-delay-4" : "";
  return (
    <div ref={ref} className={`reveal ${inView ? "in-view" : ""} ${delayClass} ${className}`}>
      {children}
    </div>
  );
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-current" style={{ color: "var(--primary)" }} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [pricingLoading, setPricingLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPricingPlans(data);
      })
      .catch(() => {})
      .finally(() => setPricingLoading(false));
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--surface-page)" }}>
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b" style={{ borderColor: "rgba(160, 135, 90, 0.15)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: "rgba(251, 191, 36, 0.12)" }}>
                <TrendingUp className="h-4 w-4" style={{ color: "var(--primary)" }} />
              </div>
              <span className="font-[var(--font-playfair)] text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                Insspy
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link href="#features" className="px-3 py-2 text-sm rounded-md hover:bg-white/5 transition-colors" style={{ color: "var(--text-secondary)" }}>Features</Link>
              <Link href="#how-it-works" className="px-3 py-2 text-sm rounded-md hover:bg-white/5 transition-colors" style={{ color: "var(--text-secondary)" }}>How It Works</Link>
              <Link href="#pricing" className="px-3 py-2 text-sm rounded-md hover:bg-white/5 transition-colors" style={{ color: "var(--text-secondary)" }}>Pricing</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="hidden md:block">
                <Button variant="ghost" className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="text-[11px] uppercase tracking-wider font-semibold">
                  Get Started Free
                </Button>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md"
                style={{ color: "var(--text-secondary)" }}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t px-4 py-3" style={{ borderColor: "rgba(160, 135, 90, 0.15)", background: "rgba(20, 18, 16, 0.98)" }}>
            <div className="flex flex-col gap-1">
              <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm rounded-md" style={{ color: "var(--text-secondary)" }}>Features</Link>
              <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm rounded-md" style={{ color: "var(--text-secondary)" }}>How It Works</Link>
              <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm rounded-md" style={{ color: "var(--text-secondary)" }}>Pricing</Link>
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm rounded-md" style={{ color: "var(--text-secondary)" }}>Sign In</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 ambient-glow overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border" style={{ borderColor: "rgba(251, 191, 36, 0.2)", background: "rgba(251, 191, 36, 0.06)", color: "var(--primary)" }}>
                  <Zap className="h-3 w-3" />
                  AI-Powered Trading Journal
                </div>
              </Reveal>

              <Reveal delay={1}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                  Trade Smarter with{" "}
                  <span className="gradient-text">AI-Powered</span> Insights
                </h1>
              </Reveal>

              <Reveal delay={2}>
                <p className="text-lg md:text-xl max-w-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Track every trade, analyze your performance, and discover patterns you never knew existed. Your personal trading coach, powered by artificial intelligence.
                </p>
              </Reveal>

              <Reveal delay={3}>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/auth/signup">
                    <Button size="lg" className="px-8 text-[11px] uppercase tracking-wider font-semibold h-10">
                      Start Journaling Free
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button size="lg" variant="outline" className="px-8 text-[11px] uppercase tracking-wider font-semibold h-10">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={4}>
                <div className="flex items-center gap-4 pt-2">
                  <Stars />
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Rated 4.9 by traders
                  </span>
                </div>
              </Reveal>
            </div>

            {/* Dashboard Mockup */}
            <Reveal delay={2}>
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl blur-3xl" />
                <div className="relative rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(160, 135, 90, 0.25)", background: "var(--surface-sidebar)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
                  {/* Browser bar */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(160, 135, 90, 0.15)", background: "rgba(20, 18, 16, 0.6)" }}>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: "#F87171" }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: "#FBBF24" }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: "#4ADE80" }} />
                    </div>
                    <div className="flex-1 mx-4 px-3 py-1 rounded-md text-xs text-center" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
                      app.insspy.io/dashboard
                    </div>
                  </div>

                  {/* Mockup body */}
                  <div className="flex" style={{ height: "320px" }}>
                    {/* Sidebar */}
                    <div className="w-16 md:w-20 border-r flex flex-col items-center py-4 gap-4 flex-shrink-0" style={{ borderColor: "rgba(160, 135, 90, 0.15)" }}>
                      {[LayoutDashboard, TrendingUp, BarChart3, Brain, Settings].map((Icon, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{
                            background: i === 0 ? "rgba(251, 191, 36, 0.12)" : "transparent",
                            color: i === 0 ? "var(--primary)" : "var(--text-muted)",
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
                          { label: "Win Rate", value: "68.2%", color: "var(--color-profit)" },
                          { label: "Profit Factor", value: "2.4x", color: "var(--primary)" },
                          { label: "Total P&L", value: "+$12,450", color: "var(--color-profit)" },
                        ].map((stat, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-lg px-3 py-2.5 border"
                            style={{ borderColor: "rgba(160, 135, 90, 0.15)", background: "rgba(28, 25, 23, 0.6)" }}
                          >
                            <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                              {stat.label}
                            </div>
                            <div className="text-sm font-bold font-[var(--font-playfair)] mt-0.5" style={{ color: stat.color }}>
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Mini chart */}
                      <div className="rounded-lg border p-3" style={{ borderColor: "rgba(160, 135, 90, 0.15)", background: "rgba(28, 25, 23, 0.6)" }}>
                        <div className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                          Equity Curve
                        </div>
                        <svg viewBox="0 0 200 50" className="w-full h-8">
                          <defs>
                            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M0,40 L20,35 L40,38 L60,28 L80,22 L100,18 L120,8 L140,12 L160,5 L180,3 L200,6"
                            fill="none"
                            stroke="#FBBF24"
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
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: trade.result === "Win" ? "var(--color-profit)" : "var(--color-loss)" }} />
                              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{trade.pair}</span>
                            </div>
                            <span className="text-xs font-medium font-[var(--font-jetbrains)]" style={{ color: trade.result === "Win" ? "var(--color-profit)" : "var(--color-loss)" }}>
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
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="py-16 px-4 border-t" style={{ borderColor: "rgba(160, 135, 90, 0.1)" }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center -space-x-2">
                {[
                  { initial: "JD", color: "#F87171" },
                  { initial: "AK", color: "#60A5FA" },
                  { initial: "ML", color: "#4ADE80" },
                  { initial: "CT", color: "#C084FC" },
                  { initial: "RS", color: "#FBBF24" },
                ].map((avatar, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-[10px] font-bold"
                    style={{
                      background: `${avatar.color}20`,
                      borderColor: "var(--surface-page)",
                      color: avatar.color,
                    }}
                  >
                    {avatar.initial}
                  </div>
                ))}
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Trusted by 500+ traders
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Join a growing community of serious traders
                </p>
              </div>
              <div className="h-8 w-px hidden md:block" style={{ background: "rgba(160, 135, 90, 0.2)" }} />
              <div className="flex gap-8">
                {[
                  { value: "50K+", label: "Trades Analyzed" },
                  { value: "98%", label: "Uptime" },
                  { value: "4.9", label: "Avg Rating" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-lg font-bold font-[var(--font-playfair)]" style={{ color: "var(--primary)" }}>{stat.value}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 md:py-28 px-4 border-t" style={{ borderColor: "rgba(160, 135, 90, 0.1)" }}>
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-4" style={{ borderColor: "rgba(251, 191, 36, 0.2)", background: "rgba(251, 191, 36, 0.06)", color: "var(--primary)" }}>
              Everything You Need
            </div>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
              Tools to Elevate Your Trading
            </h2>
            <p className="mt-3 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              From performance analytics to AI-powered coaching — everything you need to trade with confidence.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: BarChart3, title: "Performance Analytics", desc: "Win rate, profit factor, equity curves, and 20+ metrics to understand your trading performance at a glance.", color: "var(--primary)" },
              { icon: Brain, title: "AI-Powered Insights", desc: "Get personalized analysis of your trading patterns and actionable recommendations to improve your strategy.", color: "var(--color-ai)" },
              { icon: BookOpen, title: "Trade Journal", desc: "Record detailed notes, screenshots, and psychology for each trade. Build a comprehensive trading history.", color: "var(--color-info)" },
              { icon: TrendingUp, title: "Strategy Tracking", desc: "Tag trades by strategy and discover exactly which approaches work best for your unique trading style.", color: "var(--color-profit)" },
              { icon: Shield, title: "Risk Management", desc: "Track stop losses, risk-reward ratios, and drawdowns. Protect your capital with data-driven decisions.", color: "var(--color-loss)" },
              { icon: Zap, title: "Psychology Tracking", desc: "Log your emotional state and discover how confidence, fear, and greed impact your trading results.", color: "var(--color-warning)" },
            ].map((feature, i) => (
              <Reveal key={feature.title} delay={Math.min(i, 4)}>
                <div className="gradient-border-card p-6 glow-card h-full">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: `${feature.color}15` }}
                  >
                    <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-[15px] font-semibold mb-2" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {feature.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dashboard Preview ── */}
      <section className="py-20 md:py-28 px-4 border-t" style={{ borderColor: "rgba(160, 135, 90, 0.1)" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-4" style={{ borderColor: "rgba(251, 191, 36, 0.2)", background: "rgba(251, 191, 36, 0.06)", color: "var(--primary)" }}>
              Your Command Center
            </div>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
              Everything in One Place
            </h2>
            <p className="mt-3 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              A clean, intuitive dashboard that puts your trading data front and center.
            </p>
          </Reveal>

          <Reveal delay={1}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(160, 135, 90, 0.2)", background: "var(--surface-sidebar)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b" style={{ borderColor: "rgba(160, 135, 90, 0.15)", background: "rgba(20, 18, 16, 0.6)" }}>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: "#F87171" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#FBBF24" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#4ADE80" }} />
                  </div>
                  <div className="flex-1 mx-6 px-4 py-1.5 rounded-md text-xs text-center" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
                    app.insspy.io/dashboard
                  </div>
                </div>

                {/* Dashboard preview content */}
                <div className="p-6 space-y-6">
                  {/* Welcome row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>Dashboard</h3>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Your trading overview for June 2026</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse-dot" />
                      <span className="text-xs" style={{ color: "var(--color-profit)" }}>Live</span>
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Win Rate", value: "68.2%", sub: "+12.4% vs last month" },
                      { label: "Profit Factor", value: "2.41", sub: "Above target" },
                      { label: "Total Trades", value: "847", sub: "All-time" },
                      { label: "Net P&L", value: "+$18,240", sub: "Since inception" },
                    ].map((stat, i) => (
                      <div key={i} className="rounded-xl border p-4" style={{ borderColor: "rgba(160, 135, 90, 0.15)", background: "var(--surface-card)" }}>
                        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                          {stat.label}
                        </div>
                        <div className="text-xl font-bold mt-1 font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
                          {stat.value}
                        </div>
                        <div className="text-[10px] mt-1" style={{ color: "var(--primary)" }}>{stat.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart + Recent trades */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border p-4" style={{ borderColor: "rgba(160, 135, 90, 0.15)", background: "var(--surface-card)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Equity Curve</span>
                        <span className="text-[10px]" style={{ color: "var(--color-profit)" }}>+12.4%</span>
                      </div>
                      <svg viewBox="0 0 300 80" className="w-full h-16">
                        <defs>
                          <linearGradient id="preview-chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,65 Q20,60 40,55 Q60,50 80,45 Q100,40 120,35 Q140,30 160,20 Q180,15 200,10 Q220,8 240,12 Q260,5 280,8 Q300,3 300,3"
                          fill="none"
                          stroke="#FBBF24"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M0,65 Q20,60 40,55 Q60,50 80,45 Q100,40 120,35 Q140,30 160,20 Q180,15 200,10 Q220,8 240,12 Q260,5 280,8 Q300,3 300,80 L0,80 Z"
                          fill="url(#preview-chart-grad)"
                        />
                      </svg>
                      <div className="flex justify-between mt-2 text-[9px]" style={{ color: "var(--text-muted)" }}>
                        <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span>
                      </div>
                    </div>

                    <div className="rounded-xl border p-4" style={{ borderColor: "rgba(160, 135, 90, 0.15)", background: "var(--surface-card)" }}>
                      <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Recent Trades</div>
                      <div className="space-y-2">
                        {[
                          { pair: "EUR/USD", type: "Long", pnl: "+$342", result: "win" },
                          { pair: "GBP/JPY", type: "Short", pnl: "-$189", result: "loss" },
                          { pair: "USD/CAD", type: "Long", pnl: "+$521", result: "win" },
                          { pair: "AUD/USD", type: "Long", pnl: "+$98", result: "win" },
                        ].map((trade, i) => (
                          <div key={i} className="flex items-center justify-between py-1.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-2 h-2 rounded-full" style={{ background: trade.result === "win" ? "var(--color-profit)" : "var(--color-loss)" }} />
                              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{trade.pair}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>{trade.type}</span>
                            </div>
                            <span className="text-sm font-medium font-[var(--font-jetbrains)]" style={{ color: trade.result === "win" ? "var(--color-profit)" : "var(--color-loss)" }}>
                              {trade.pnl}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 md:py-28 px-4 border-t" style={{ borderColor: "rgba(160, 135, 90, 0.1)" }}>
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-4" style={{ borderColor: "rgba(251, 191, 36, 0.2)", background: "rgba(251, 191, 36, 0.06)", color: "var(--primary)" }}>
              Get Started in Minutes
            </div>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
              How It Works
            </h2>
          </Reveal>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: "linear-gradient(to bottom, rgba(251, 191, 36, 0.3), transparent 80%)" }} />

            <div className="space-y-16 md:space-y-20">
              {[
                { num: "01", title: "Log Your Trades", desc: "Manually enter trades or import from your broker. Add notes, screenshots, and psychology ratings to build a complete record.", align: "left" as const },
                { num: "02", title: "Analyze Performance", desc: "View your win rate, profit factor, equity curve, and strategy breakdowns — all calculated automatically from your trade data.", align: "right" as const },
                { num: "03", title: "Improve with AI", desc: "Get personalized AI-powered insights that identify patterns in your trading. Discover what works and what doesn't.", align: "left" as const },
              ].map((step, i) => (
                <Reveal key={step.num} delay={Math.min(i, 3)}>
                  <div className="relative flex flex-col md:flex-row items-start gap-6 md:gap-12">
                    {/* Number */}
                    <div className={`absolute md:relative left-0 top-0 flex items-center justify-center w-12 h-12 rounded-full border text-sm font-bold shrink-0`}
                      style={{
                        borderColor: "rgba(251, 191, 36, 0.3)",
                        background: "var(--surface-card)",
                        color: "var(--primary)",
                        fontFamily: "var(--font-playfair)",
                      }}
                    >
                      {step.num}
                    </div>

                    {/* Content */}
                    <div className={`pl-16 md:pl-0 md:w-1/2 ${step.align === "right" ? "md:ml-auto md:pl-8" : "md:pr-8"}`}>
                      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 md:py-28 px-4 border-t" style={{ borderColor: "rgba(160, 135, 90, 0.1)" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-4" style={{ borderColor: "rgba(251, 191, 36, 0.2)", background: "rgba(251, 191, 36, 0.06)", color: "var(--primary)" }}>
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
              What Traders Say
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { quote: "This journal completely changed how I approach trading. The AI insights helped me realize I was overtrading after 3 consecutive losses — a pattern I never noticed.", name: "James Mitchell", role: "Forex Trader, 6 years" },
              { quote: "I've tried dozens of trading journals. Insspy is the first one that actually made me want to log every trade. The analytics are beautiful and the insights are genuinely useful.", name: "Sarah Chen", role: "Swing Trader, 4 years" },
              { quote: "My win rate went from 52% to 68% in three months after following the AI recommendations. The psychology tracking feature alone was worth the switch.", name: "Marcus Rivera", role: "Day Trader, 8 years" },
            ].map((testimonial, i) => (
              <Reveal key={testimonial.name} delay={Math.min(i, 3)}>
                <div className="gradient-border-card p-6 glow-card h-full flex flex-col">
                  <Stars />
                  <blockquote className="mt-4 text-sm leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="mt-5 pt-4 border-t" style={{ borderColor: "rgba(160, 135, 90, 0.15)" }}>
                    <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{testimonial.name}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{testimonial.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 md:py-28 px-4 border-t" style={{ borderColor: "rgba(160, 135, 90, 0.1)" }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-4" style={{ borderColor: "rgba(251, 191, 36, 0.2)", background: "rgba(251, 191, 36, 0.06)", color: "var(--primary)" }}>
              Simple Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
              Start Free, Upgrade When Ready
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Reveal>
              <div
                className="rounded-xl border p-7"
                style={{
                  borderColor: "rgba(160, 135, 90, 0.2)",
                  background: "var(--surface-card)",
                }}
              >
                <div className="mb-6">
                  <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
                    Free
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
                      ₹0
                    </span>
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>forever</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-7">
                  {[
                    "Unlimited trade logging",
                    "Basic performance analytics",
                    "Trade journal with notes",
                    "Strategy tagging",
                    "7-day data history",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--primary)" }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/auth/signup" className="block">
                  <Button
                    className="w-full text-[11px] uppercase tracking-wider font-semibold"
                    variant="outline"
                    size="lg"
                  >
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </Reveal>

            {pricingLoading ? (
              <Reveal delay={1}>
                <div className="rounded-xl border p-7 flex items-center justify-center min-h-[300px]" style={{ borderColor: "rgba(160, 135, 90, 0.2)", background: "var(--surface-card)" }}>
                  <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--text-muted)" }} />
                </div>
              </Reveal>
            ) : (
              pricingPlans.filter((p) => p.is_active).map((plan, idx) => {
                const isHighlighted = plan.name === "premium_yearly" || (pricingPlans.length === 1 && plan.name === "premium_monthly");
                const priceDisplay = plan.price.toLocaleString("en-IN", { style: "currency", currency: plan.currency || "INR", maximumFractionDigits: 0 });
                const planLabel = plan.name === "premium_monthly" ? "Premium Monthly"
                  : plan.name === "premium_yearly" ? "Premium Yearly"
                  : "Premium Lifetime";

                return (
                  <Reveal key={plan.id} delay={1}>
                    <div
                      className={`rounded-xl border p-7 relative ${isHighlighted ? "animate-glow-pulse" : ""}`}
                      style={{
                        borderColor: isHighlighted ? "rgba(251, 191, 36, 0.3)" : "rgba(160, 135, 90, 0.2)",
                        background: isHighlighted ? "rgba(251, 191, 36, 0.03)" : "var(--surface-card)",
                      }}
                    >
                      {isHighlighted && (
                        <div
                          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                        >
                          Most Popular
                        </div>
                      )}

                      <div className="mb-6">
                        <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
                          {planLabel}
                        </h3>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className="text-3xl font-bold font-[var(--font-playfair)]" style={{ color: "var(--text-primary)" }}>
                            {priceDisplay}
                          </span>
                          {plan.interval && (
                            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                              /{plan.interval === "month" ? "month" : "year"}
                            </span>
                          )}
                        </div>
                        {plan.trial_days > 0 && (
                          <div className="text-xs mt-1" style={{ color: "var(--color-ai)" }}>
                            {plan.trial_days}-day free trial
                          </div>
                        )}
                      </div>

                      <ul className="space-y-3 mb-7">
                        {['AI-powered insights & coaching', 'Advanced analytics & charts', 'Psychology tracking', 'Unlimited data history', 'Priority support', 'MT5 auto-sync', 'Scorecard & Reports', 'Trade Replay', 'Setup Playbooks', 'Leaderboard'].map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                            <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--primary)" }} />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Link href="/auth/signup" className="block">
                        <Button
                          className="w-full text-[11px] uppercase tracking-wider font-semibold"
                          variant={isHighlighted ? "default" : "outline"}
                          size="lg"
                        >
                          Start {planLabel}
                        </Button>
                      </Link>
                    </div>
                  </Reveal>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 px-4" style={{
        background: "linear-gradient(180deg, var(--surface-page) 0%, rgba(251, 191, 36, 0.04) 50%, var(--surface-page) 100%)",
      }}>
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
              Ready to Trade Smarter?
            </h2>
            <p className="text-lg mb-8 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
              Start your free trading journal today. No credit card required. Join 500+ traders already improving their performance.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="px-10 text-[11px] uppercase tracking-wider font-semibold h-11 animate-glow-pulse">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-12 px-4" style={{ borderColor: "rgba(160, 135, 90, 0.1)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md" style={{ background: "rgba(251, 191, 36, 0.12)" }}>
                  <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />
                </div>
                <span className="font-[var(--font-playfair)] text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  Insspy
                </span>
              </Link>
              <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)" }}>
                The premium AI-powered trading journal for serious traders who want to track, analyze, and improve their performance.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Product</h4>
              <div className="flex flex-col gap-2">
                <Link href="#features" className="text-sm hover:opacity-80 transition-opacity" style={{ color: "var(--text-secondary)" }}>Features</Link>
                <Link href="#pricing" className="text-sm hover:opacity-80 transition-opacity" style={{ color: "var(--text-secondary)" }}>Pricing</Link>
                <Link href="/auth/signup" className="text-sm hover:opacity-80 transition-opacity" style={{ color: "var(--text-secondary)" }}>Sign Up</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Legal</h4>
              <div className="flex flex-col gap-2">
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>Privacy Policy</span>
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>Terms of Service</span>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t text-center text-sm" style={{ borderColor: "rgba(160, 135, 90, 0.1)", color: "var(--text-muted)" }}>
            &copy; 2026 Insspy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
