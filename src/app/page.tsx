import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  BarChart3,
  Brain,
  BookOpen,
  Shield,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      {/* Navigation */}
      <nav className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: "rgba(251, 191, 36, 0.12)" }}>
                <TrendingUp className="h-4 w-4" style={{ color: "var(--primary)" }} />
              </div>
              <span className="font-[var(--font-playfair)] text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                Insspy
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="text-[11px] uppercase tracking-wider font-semibold">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Trade Smarter with{" "}
            <span style={{ color: "var(--primary)" }}>AI-Powered</span> Insights
          </h1>
          <p
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Track every trade, analyze your performance, and discover patterns
            you never knew existed. Your personal trading coach powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="px-8 text-[11px] uppercase tracking-wider font-semibold"
              >
                Start Journaling Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-[11px] uppercase tracking-wider font-semibold"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-16"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Everything You Need to Improve
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {[
              { icon: BarChart3, title: "Performance Analytics", desc: "Win rate, profit factor, equity curves, and 20+ metrics to understand your trading performance.", color: "var(--primary)" },
              { icon: Brain, title: "AI-Powered Insights", desc: "Get personalized analysis of your trading patterns and actionable recommendations to improve.", color: "var(--color-ai)" },
              { icon: BookOpen, title: "Trade Journal", desc: "Record notes, screenshots, and psychology for each trade to build a comprehensive trading history.", color: "var(--color-info)" },
              { icon: TrendingUp, title: "Strategy Tracking", desc: "Tag trades by strategy and discover which approaches work best for your trading style.", color: "var(--color-profit)" },
              { icon: Shield, title: "Risk Management", desc: "Track stop losses, risk-reward ratios, and drawdown to protect your capital.", color: "var(--color-loss)" },
              { icon: Zap, title: "Psychology Tracking", desc: "Log your emotional state and discover how confidence, fear, and greed impact your results.", color: "var(--color-warning)" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg border hover-lift card-surface"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center mb-4"
                  style={{ background: `${feature.color}15` }}
                >
                  <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-16"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "I", title: "Log Your Trades", desc: "Manually enter trades or import from your broker. Add notes and screenshots." },
              { num: "II", title: "Analyze Performance", desc: "View your stats, equity curve, and strategy breakdowns automatically calculated." },
              { num: "III", title: "Improve with AI", desc: "Get AI-powered insights to identify patterns and become a consistently profitable trader." },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold"
                  style={{
                    background: "rgba(251, 191, 36, 0.12)",
                    color: "var(--primary)",
                    fontFamily: "var(--font-playfair)",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Ready to Trade Smarter?
          </h2>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
            Start your free trading journal today. No credit card required.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="px-8 text-[11px] uppercase tracking-wider font-semibold"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-7xl mx-auto text-center text-sm" style={{ color: "var(--text-muted)" }}>
          <p>&copy; 2026 Insspy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
